import axios from 'axios';

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const SOLSCAN_API = 'https://api.solscan.io';

// Verify if address is valid Solana address
export function isValidSolanaAddress(address) {
  const base58Regex = /^[1-9A-HJ-NP-Z]{32,44}$/;
  return base58Regex.test(address);
}

// Fetch token metadata from Solana RPC
export async function getSolanaTokenInfo(mint) {
  try {
    // Get token metadata
    const response = await axios.post(SOLANA_RPC, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getParsedAccountInfo',
      params: [mint]
    });

    if (response.data.result?.value?.data?.parsed?.info) {
      const tokenInfo = response.data.result.value.data.parsed.info;
      return {
        name: 'Unknown',
        symbol: 'N/A',
        decimals: tokenInfo.decimals,
        supply: tokenInfo.supply,
        mint_authority: tokenInfo.mintAuthority,
        freeze_authority: tokenInfo.freezeAuthority
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching Solana token info:', error.message);
    return null;
  }
}

// Get Solana token holders information
export async function getSolanaTokenHolders(mint) {
  try {
    const response = await axios.get(`${SOLSCAN_API}/token/holders`, {
      params: {
        token: mint,
        offset: 0,
        limit: 10
      }
    });

    if (response.data?.data) {
      const holders = response.data.data;
      const totalHolders = response.data.total || holders.length;
      
      // Calculate top 10 holder percentage
      const topHolderPercent = (holders.slice(0, 10).reduce((sum, h) => 
        sum + parseFloat(h.tokenAmount?.uiAmount || 0), 0) / 
        parseFloat(holders[0]?.tokenAmount?.uiAmount || 1)) * 100;

      return {
        holder_count: totalHolders,
        top_10_holder_percent: Math.min(topHolderPercent, 100),
        top_holders: holders.slice(0, 5).map(h => ({
          address: h.owner,
          balance: h.tokenAmount?.uiAmount || 0,
          percent: ((h.tokenAmount?.uiAmount || 0) / (holders[0]?.tokenAmount?.uiAmount || 1)) * 100
        }))
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching Solana token holders:', error.message);
    return null;
  }
}

// Get Solana token price and market data
export async function getSolanaTokenMarketData(mint) {
  try {
    // Try using DexScreener API for market data
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
    
    if (response.data?.pairs?.length > 0) {
      const pair = response.data.pairs[0];
      return {
        price: parseFloat(pair.priceUsd) || 0,
        market_cap: parseFloat(pair.marketCap) || 0,
        liquidity: parseFloat(pair.liquidity?.usd) || 0,
        volume: parseFloat(pair.volume?.h24) || 0,
        price_change_24h: parseFloat(pair.priceChange?.h24) || 0
      };
    }

    return {
      price: 0,
      market_cap: 0,
      liquidity: 0,
      volume: 0,
      price_change_24h: 0
    };
  } catch (error) {
    console.error('Error fetching Solana market data:', error.message);
    return null;
  }
}

// Perform security checks for Solana token
export async function performSolanaSecurityCheck(mint) {
  try {
    const tokenInfo = await getSolanaTokenInfo(mint);
    
    if (!tokenInfo) {
      return null;
    }

    const checks = {
      mint_authority: tokenInfo.mint_authority !== null ? 'active' : 'renounced',
      freeze_authority: tokenInfo.freeze_authority !== null ? 'active' : 'renounced',
      supply: tokenInfo.supply
    };

    // Determine rug risk based on authorities
    let rugRisk = 'Low';
    if (checks.mint_authority === 'active') {
      rugRisk = 'High';
    } else if (checks.freeze_authority === 'active') {
      rugRisk = 'Medium';
    }

    return {
      mint_authority: checks.mint_authority,
      freeze_authority: checks.freeze_authority,
      rug_risk: rugRisk,
      mintable: checks.mint_authority === 'active',
      supply: tokenInfo.supply,
      decimals: tokenInfo.decimals
    };
  } catch (error) {
    console.error('Error performing Solana security check:', error.message);
    return null;
  }
}

// Get liquidity pools for Solana token
export async function getSolanaLiquidityData(mint) {
  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
    
    if (response.data?.pairs?.length > 0) {
      const pair = response.data.pairs[0];
      return {
        liquidity_usd: parseFloat(pair.liquidity?.usd) || 0,
        liquidity_base: parseFloat(pair.liquidity?.base) || 0,
        liquidity_quote: parseFloat(pair.liquidity?.quote) || 0,
        dex: pair.dexId
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching Solana liquidity data:', error.message);
    return null;
  }
}