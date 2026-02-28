import express from 'express';
import cors from 'cors';
import { initializeDatabase, getDatabase } from './database.js';
import { isValidSolanaAddress, performSolanaSecurityCheck, getSolanaTokenInfo, getSolanaTokenHolders, getSolanaTokenMarketData } from './solanaScanner.js';
import { isValidBscAddress, performBscSecurityCheck, getBscTokenInfo, getBscTokenHolders, getBscTokenMarketData } from './bscScanner.js';
import { calculateRiskScore, generateEntrySignal, generateDetailedReport } from './riskEngine.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
await initializeDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main token scanner endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { token_address, chain } = req.body;

    if (!token_address || !chain) {
      return res.status(400).json({ error: 'Missing token_address or chain parameter' });
    }

    if (!['solana', 'bsc'].includes(chain.toLowerCase())) {
      return res.status(400).json({ error: 'Chain must be "solana" or "bsc"' });
    }

    const chainLower = chain.toLowerCase();
    let tokenInfo, securityChecks, marketData, holderData;

    if (chainLower === 'solana') {
      if (!isValidSolanaAddress(token_address)) {
        return res.status(400).json({ error: 'Invalid Solana address' });
      }

      // Fetch all data in parallel
      [tokenInfo, securityChecks, marketData, holderData] = await Promise.all([
        getSolanaTokenInfo(token_address),
        performSolanaSecurityCheck(token_address),
        getSolanaTokenMarketData(token_address),
        getSolanaTokenHolders(token_address)
      ]);
    } else if (chainLower === 'bsc') {
      if (!isValidBscAddress(token_address)) {
        return res.status(400).json({ error: 'Invalid BSC address' });
      }

      // Fetch all data in parallel
      [tokenInfo, securityChecks, marketData, holderData] = await Promise.all([
        getBscTokenInfo(token_address),
        performBscSecurityCheck(token_address),
        getBscTokenMarketData(token_address),
        getBscTokenHolders(token_address)
      ]);
    }

    if (!tokenInfo) {
      return res.status(404).json({ error: 'Token not found or unable to fetch token data' });
    }

    // Combine all data
    const combinedTokenData = {
      address: token_address,
      chain: chainLower,
      name: tokenInfo.name || 'Unknown',
      symbol: tokenInfo.symbol || 'N/A',
      holder_count: holderData?.holder_count || 0,
      top_10_holder_percent: holderData?.top_10_holder_percent || 0,
      top_holders: holderData?.top_holders || []
    };

    const combinedMarketData = {
      price: marketData?.price || 0,
      market_cap: marketData?.market_cap || 0,
      liquidity: marketData?.liquidity || 0,
      volume: marketData?.volume || 0,
      price_change_24h: marketData?.price_change_24h || 0
    };

    // Generate risk analysis and entry signal
    const riskAnalysis = calculateRiskScore(combinedTokenData, securityChecks, combinedMarketData);
    const entryAnalysis = generateEntrySignal(combinedTokenData, securityChecks, combinedMarketData);

    // Generate detailed report
    const report = generateDetailedReport(combinedTokenData, securityChecks, combinedMarketData);

    // Save to database
    const db = getDatabase();
    db.run(`
      INSERT OR REPLACE INTO tokens (address, name, symbol, chain, market_cap, liquidity, volume, holder_count, top_10_holder_percent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [token_address, combinedTokenData.name, combinedTokenData.symbol, chainLower, 
        combinedMarketData.market_cap, combinedMarketData.liquidity, combinedMarketData.volume,
        combinedTokenData.holder_count, combinedTokenData.top_10_holder_percent]);

    db.run(`
      INSERT OR REPLACE INTO security_checks 
      (token_address, chain, ownership_renounced, mint_enabled, honeypot_status, rug_risk, freeze_authority, mint_authority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [token_address, chainLower, securityChecks?.ownership_renounced, securityChecks?.mintable,
        securityChecks?.honeypot ? 'yes' : 'no', securityChecks?.rug_risk || 'Unknown',
        securityChecks?.freeze_authority || 'N/A', securityChecks?.mint_authority || 'N/A']);

    db.run(`
      INSERT OR REPLACE INTO risk_scores (token_address, risk_score, entry_signal)
      VALUES (?, ?, ?)
    `, [token_address, riskAnalysis.risk_score, entryAnalysis.entry_signal]);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'An error occurred during token scan', details: error.message });
  }
});

// Get scan history
app.get('/api/history', (req, res) => {
  try {
    const db = getDatabase();
    db.all(`
      SELECT t.address, t.name, t.symbol, t.chain, t.market_cap, t.liquidity, 
             rs.risk_score, rs.entry_signal, t.updated_at
      FROM tokens t
      LEFT JOIN risk_scores rs ON t.address = rs.token_address
      ORDER BY t.updated_at DESC
      LIMIT 50
    `, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, data: rows || [] });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

// Get token details
app.get('/api/token/:address/:chain', (req, res) => {
  try {
    const { address, chain } = req.params;
    const db = getDatabase();

    db.get(`
      SELECT t.*, rs.risk_score, rs.entry_signal, sc.ownership_renounced, sc.mint_enabled, 
             sc.honeypot_status, sc.rug_risk
      FROM tokens t
      LEFT JOIN risk_scores rs ON t.address = rs.token_address
      LEFT JOIN security_checks sc ON t.address = sc.token_address
      WHERE t.address = ? AND t.chain = ?
    `, [address, chain], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Token not found' });
      }
      res.json({ success: true, data: row });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Token Scanner API running on http://0.0.0.0:${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/scan - Scan a token');
  console.log('- GET /api/history - Get scan history');
  console.log('- GET /api/token/:address/:chain - Get token details');
  console.log('- GET /api/health - Health check');
});import dexScanRouter from './dexscan.js';
app.use(dexScanRouter);
// At the top with other imports
import dexScanRouter from './dexscan.js';

// After your middleware (app.use(cors(), app.use(express.json())))
app.use(dexScanRouter);
