# TokenShield - DeFi Token Security Scanner

**Know the risk before you ape.** 🛡️

A production-ready full-stack application that helps traders identify safe tokens and avoid scams on Solana and BNB Smart Chain through comprehensive security analysis, risk scoring, and entry signal generation.

## 🎯 Quick Start

### 1-Minute Setup

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Start Frontend:**
```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[SETUP.md](./SETUP.md)** - Detailed setup & configuration
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design & technical details
- **[CONFIG.md](./CONFIG.md)** - Configuration & customization
- **[PROJECT_SUMMARY.txt](./PROJECT_SUMMARY.txt)** - Complete project overview
- **[BUILD_COMPLETE.txt](./BUILD_COMPLETE.txt)** - Build status & checklist

## ✨ Features

### 🔍 Token Scanner
- Input contract address or token name
- Support for Solana and BSC
- Real-time blockchain data fetching
- Multi-chain analysis

### 🛡️ Security Analysis
**Solana:**
- Mint authority detection
- Freeze authority status
- Supply distribution analysis
- Liquidity pool evaluation

**BSC/Ethereum:**
- Ownership renunciation status
- Mint function detection
- Honeypot detection
- Burn function detection
- Tax fee analysis

### 📊 Risk Scoring (0-100)
Multi-factor algorithmic analysis:
- **Security (40%)** - Authority status, mint functions, honeypot detection
- **Market (40%)** - Liquidity, volume, market cap, price momentum
- **Holders (20%)** - Distribution health, concentration analysis

### 🚀 Entry Signals
Data-driven recommendations:
- **Strong Buy** 🚀 - Excellent entry opportunity
- **Buy** 📈 - Good opportunity
- **Moderate** ⏸️ - Neutral, caution advised
- **Avoid** ❌ - High risk, not recommended

### 💰 Market Data
- Real-time price information
- Market capitalization tracking
- Liquidity metrics
- 24-hour trading volume
- Price momentum analysis

### 👥 Holder Distribution
- Total holder count
- Top 10 concentration percentage
- Top 5 holder breakdown
- Distribution health assessment

## 🏗️ Project Structure

```
/workspace/
├── backend/                    # Node.js + Express API
│   ├── index.js              # Main server & routes
│   ├── database.js           # SQLite setup
│   ├── solanaScanner.js      # Solana integration
│   ├── bscScanner.js         # BSC integration
│   └── riskEngine.js         # Risk scoring
│
├── src/                       # React Frontend
│   ├── components/           # 8 React components
│   ├── App.jsx
│   └── main.jsx
│
├── Documentation
│   ├── SETUP.md
│   ├── QUICKSTART.md
│   ├── ARCHITECTURE.md
│   └── CONFIG.md
│
└── Configuration
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── .gitignore
```

## 🚀 Core API Endpoints

```
POST /api/scan
  Analyze token security and generate risk score
  Request: {"token_address":"...", "chain":"solana/bsc"}
  Response: Complete analysis report

GET /api/history
  Retrieve recent scan history (max 50)

GET /api/token/:address/:chain
  Get specific token analysis details

GET /api/health
  Health check
```

## 🔧 Technology Stack

**Frontend:**
- React 18.2
- Vite 5.0 (build tool)
- CSS3 with animations
- Axios (HTTP client)

**Backend:**
- Node.js + Express.js
- SQLite3 (database)
- Web3.js & Ethers.js (blockchain)
- @solana/web3.js (Solana)
- CORS (cross-origin)

**External APIs:**
- Solana RPC (token data)
- BSC RPC (contract data)
- DexScreener (market data)
- Solscan (Solana analytics)
- BscScan (BSC analytics)

## 📈 Risk Scoring System

### Score Interpretation
| Score | Level | Action |
|-------|-------|--------|
| 1-29 | Very Low Risk | ✅ Strong Entry |
| 30-44 | Low Risk | 🟢 Good Opportunity |
| 45-59 | Medium Risk | 🟡 Moderate Caution |
| 60-74 | High Risk | 🟠 Caution Advised |
| 75-100 | Critical Risk | 🔴 Avoid |

### Analysis Factors
**Security (40%)**
- Ownership status
- Mint function status
- Honeypot detection
- Rug pull risk

**Market (40%)**
- Market capitalization
- Liquidity availability
- Trading volume
- Price momentum

**Holders (20%)**
- Holder distribution
- Top holder concentration
- Holder count
- Whale presence

## 💡 Example Usage

### Scan a Solana Token
```javascript
{
  "token_address": "MK1tL9t2GCM8kCnBKjvbQMXPmtAL3PVnG9hvXB3hEYK",
  "chain": "solana"
}
```

### Scan a BSC Token
```javascript
{
  "token_address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a50a0EDD42",
  "chain": "bsc"
}
```

## ⚠️ Important Disclaimers

**NOT Financial Advice** - This tool provides algorithmic analysis of blockchain data only and should not be used as the sole basis for trading decisions.

**Analysis Limitations:**
- Based on publicly available blockchain data
- Does not analyze team credibility
- Market conditions change rapidly
- Some scams may evade automated detection

**Always:**
- Do your own research (DYOR)
- Verify on official blockchain explorers
- Use small positions for testing
- Never invest more than you can afford to lose

## 🔐 Security Features

- Input validation for all addresses
- API error handling and logging
- Database error protection
- CORS security configuration
- No sensitive data exposure
- Environment variable protection

## 🚀 Deployment Options

**Frontend:**
- Vercel, Netlify, GitHub Pages, AWS S3

**Backend:**
- Railway, Render, AWS EC2, DigitalOcean

**Database:**
- SQLite (MVP), PostgreSQL (production)

## 📖 Getting Help

### Documentation
- Check [SETUP.md](./SETUP.md) for detailed instructions
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [CONFIG.md](./CONFIG.md) for configuration options

### Troubleshooting
Common issues and solutions are in [SETUP.md](./SETUP.md) under "Common Issues"

### Support
- GitHub Issues: https://github.com/anomalyco/opencode
- Check existing issues before reporting

## 📊 What's Included

- ✅ Complete production-ready full-stack application
- ✅ 8 React components with responsive design
- ✅ Express.js REST API with all endpoints
- ✅ Solana & BSC blockchain integration
- ✅ Advanced risk scoring engine
- ✅ SQLite database with persistence
- ✅ Comprehensive documentation
- ✅ Configuration templates
- ✅ Error handling throughout
- ✅ Input validation on all endpoints

## 🎯 Next Steps

1. Follow [QUICKSTART.md](./QUICKSTART.md) to get running
2. Scan example tokens to verify functionality
3. Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
4. Customize and deploy to production

## 📈 Future Enhancements

- Whale wallet tracking
- Smart money alerts
- Early liquidity detection
- Telegram bot integration
- Portfolio tracker
- Advanced technical analysis
- Multi-chain support
- Machine learning predictions

## 📜 License

MIT - Feel free to use and modify for your needs

---

**TokenShield - DeFi Risk Radar**

*Know the risk before you ape.* 🛡️

Built with ❤️ for the DeFi community