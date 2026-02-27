# TokenShield - DeFi Token Security Scanner

A comprehensive token security scanner for Solana and BNB Smart Chain that helps traders avoid scams and identify safer entry opportunities.

## Features

- **Token Analysis**: Scan tokens on Solana and BSC with real-time data
- **Security Checks**: Automated detection of rug pulls, honeypots, mint functions, and ownership status
- **Risk Scoring**: Algorithmic risk analysis (0-100) based on security, market, and holder data
- **Entry Signals**: Data-driven buy/sell recommendations (Strong Buy, Buy, Moderate, Avoid)
- **Market Data**: Real-time price, liquidity, volume, and market cap information
- **Holder Analysis**: Distribution tracking and concentration risk assessment

## Project Structure

```
/workspace/
├── backend/                 # Node.js + Express API
│   ├── index.js            # Main server
│   ├── database.js         # SQLite setup
│   ├── solanaScanner.js    # Solana blockchain integration
│   ├── bscScanner.js       # BSC blockchain integration
│   ├── riskEngine.js       # Risk scoring & signal generation
│   └── package.json
├── src/                    # React frontend
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Scanner.jsx     # Token input form
│   │   ├── Results.jsx     # Results display
│   │   ├── RiskCard.jsx
│   │   ├── SecurityCard.jsx
│   │   ├── EntrySignalCard.jsx
│   │   ├── MarketDataCard.jsx
│   │   └── HolderCard.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Backend Setup

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Start the backend server:
```bash
npm start
```

The backend API will be available at `http://0.0.0.0:3000`

### Frontend Setup

1. Install frontend dependencies (from root directory):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### POST /api/scan
Scan a token for security and risk analysis

**Request:**
```json
{
  "token_address": "EPjFWaLb3odcccccccccccccccccccccccccccccccccccccccccccc",
  "chain": "solana"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token_name": "Serum",
    "token_symbol": "SRM",
    "chain": "solana",
    "risk_analysis": {
      "risk_score": 25,
      "summary": "Low Risk",
      "factors": { ... }
    },
    "entry_analysis": {
      "entry_signal": "Strong Buy",
      "signal_score": 65,
      "positive_signals": [...],
      "negative_signals": [],
      "confidence": 0.95
    },
    "security_summary": { ... },
    "market_summary": { ... },
    "holder_summary": { ... },
    "recommendation": "Strong Buy - Risk Score: 25/100 (Low Risk)"
  }
}
```

### GET /api/history
Retrieve scan history (max 50 results)

### GET /api/token/:address/:chain
Get stored token details and analysis

### GET /api/health
Health check endpoint

## How It Works

### 1. Token Scanning
- User submits token contract address
- System validates address format for respective chain
- Fetches token metadata from blockchain RPC

### 2. Security Analysis
**For Solana:**
- Mint authority status
- Freeze authority status
- Supply distribution
- Liquidity pool analysis

**For BSC:**
- Ownership renouncement status
- Mint function detection
- Burn function detection
- Honeypot detection
- Tax fee analysis

### 3. Risk Scoring (0-100)
Risk score is calculated based on:
- Security factors (40% weight)
- Market factors (40% weight)
- Holder distribution (20% weight)

**Score Interpretation:**
- 1-30: Very Low Risk ✅
- 30-45: Low Risk 🟢
- 45-60: Medium Risk 🟡
- 60-75: High Risk 🟠
- 75-100: Critical Risk 🔴

### 4. Entry Signal Generation
Based on security checks, market conditions, and holder distribution:
- **Strong Buy** (Signal Score 50+): Excellent entry opportunity
- **Buy** (Signal Score 25-49): Good entry opportunity
- **Moderate** (Signal Score 0-24): Neutral, caution advised
- **Avoid** (Signal Score <0): High risk, not recommended

## Data Sources

- **Solana RPC**: https://api.mainnet-beta.solana.com
- **BSC RPC**: https://bsc-dataseed1.binance.org
- **Market Data**: DexScreener API
- **Holder Data**: Solscan API, BscScan API

## Important Disclaimers

⚠️ **This is NOT financial advice.** This tool provides algorithmic analysis only and should not be used as the sole basis for trading decisions.

The platform analyzes:
- Historical and current blockchain data
- Publicly available contract information
- Market metrics from DEX data sources

It does NOT analyze:
- Social media sentiment
- Team credibility
- Long-term project viability
- Technical or fundamental analysis

**Always:**
- Do your own research (DYOR)
- Verify information on official blockchain explorers
- Use small positions for testing
- Never invest more than you can afford to lose

## Environment Variables

**Frontend:**
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

**Backend:**
- `BSCSCAN_API_KEY`: Optional for enhanced BSC data (get from https://bscscan.com)

## Common Issues

### Backend won't start
- Make sure port 3000 is available
- Check that Node.js is installed: `node --version`
- Check npm: `npm --version`

### Frontend won't connect to backend
- Verify backend is running on http://localhost:3000
- Check browser console for CORS errors
- Ensure VITE_API_URL is correctly set

### Token not found
- Verify the contract address is correct
- Ensure the token exists on the specified chain
- Check token is sufficiently established (not brand new)

## Future Enhancements

- Whale wallet tracking
- Smart money detection
- Early liquidity alerts
- Telegram bot integration
- Portfolio tracker
- Advanced technical analysis
- Multi-chain support (Ethereum, Polygon, etc.)
- API tier system for developers

## Support

For issues or feedback:
- Check GitHub issues: https://github.com/anomalyco/opencode
- Review the code documentation

## License

MIT License - Feel free to use and modify for your needs

---

**Remember:** Know the risk before you ape. 🛡️