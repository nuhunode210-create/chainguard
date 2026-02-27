# TokenShield Architecture

## System Overview

TokenShield is a full-stack token security analysis platform with a React frontend and Node.js backend serving a SQLite database.

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Frontend (Vite)                  │   │
│  │  • Token Input Form (Scanner)                       │   │
│  │  • Real-time Results Display                        │   │
│  │  • Risk & Security Visualization                    │   │
│  │  • Entry Signal Charts                              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────────────────────────────┘
                         │ HTTP/JSON
                         │ Port 5173 ↔ 3000
┌────────────────────────▼──────────────────────────────────────┐
│            Express.js API Server (Backend)                    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Routes                                              │    │
│  │  • POST /api/scan          (Main analysis)           │    │
│  │  • GET /api/history        (Scan history)            │    │
│  │  • GET /api/token/:addr    (Token details)           │    │
│  │  • GET /api/health         (Health check)            │    │
│  └──────────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Core Modules                                        │    │
│  │  • solanaScanner.js     → Solana data fetching       │    │
│  │  • bscScanner.js        → BSC data fetching          │    │
│  │  • riskEngine.js        → Risk scoring & signals     │    │
│  │  • database.js          → SQLite ORM                 │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────┬───────────────┬────────────────────┬─────────────┘
             │               │                    │
    ┌────────▼┐    ┌────────▼──┐    ┌───────────▼────┐
    │ Solana  │    │ BSC/ETH   │    │  SQLite DB     │
    │  RPC    │    │  RPC      │    │  • tokens      │
    │         │    │  (ethers) │    │  • sec_checks  │
    │ Public  │    │  (web3)   │    │  • risk_scores │
    │Mainnet  │    │ Binance   │    └────────────────┘
    │         │    │ Dataseed  │
    └────────┬┘    └────────┬──┘
             │              │
    ┌────────▼──────────────▼─────────┐
    │   Blockchain Data Sources       │
    │  • Token metadata               │
    │  • Contract bytecode            │
    │  • Holder distribution          │
    │  • Liquidity pools              │
    │  • Transaction data             │
    └─────────────────────────────────┘
             │              │
    ┌────────▼──────────────▼─────────┐
    │   External APIs                 │
    │  • DexScreener (market data)     │
    │  • Solscan (Solana analytics)    │
    │  • BscScan (BSC analytics)       │
    └─────────────────────────────────┘
```

## Data Flow

### 1. Token Scan Request
```
User Input (address + chain)
    ↓
Frontend validates format
    ↓
POST /api/scan
    ↓
Backend receives request
```

### 2. Token Data Collection
```
Backend validation
    ↓
├─→ Solana Path                 ├─→ BSC Path
│   • Call Solana RPC           │   • Call BSC RPC
│   • Get token metadata         │   • Get contract info
│   • Fetch holders             │   • Fetch holders
│   • Get market data           │   • Get market data
│   (parallel API calls)        │   (parallel API calls)
│   ↓                           │   ↓
└──────────────────────────────────┘
        ↓
    All data collected
```

### 3. Risk Analysis
```
Token Data
Security Data
Market Data
Holder Data
    ↓
Risk Engine calculates:
├─ Risk Score (0-100)
├─ Entry Signal
├─ Risk Factors
└─ Confidence Level
    ↓
Database stores results
    ↓
Response sent to frontend
```

### 4. Frontend Display
```
Receive analysis data
    ↓
Update UI components
├─ RiskCard
├─ SecurityCard
├─ EntrySignalCard
├─ MarketDataCard
└─ HolderCard
    ↓
User reviews results
```

## Key Components

### Frontend Components

#### Scanner.jsx
- Input form for token address
- Chain selection dropdown
- Form validation
- Submit handler

#### Results.jsx
- Container for all result cards
- Displays token metadata
- Coordinates result display

#### RiskCard.jsx
- Displays risk score (0-100)
- Risk meter visualization
- Risk factor breakdown
- Summary interpretation

#### EntrySignalCard.jsx
- Entry signal (Strong Buy/Buy/Moderate/Avoid)
- Positive signals list
- Negative signals list
- Neutral/caution signals
- Confidence percentage

#### SecurityCard.jsx
- Chain-specific security checks
- Ownership status
- Mint function status
- Honeypot detection
- Rug risk level

#### MarketDataCard.jsx
- Real-time price
- Market capitalization
- Liquidity metrics
- 24h volume
- Price change percentage

#### HolderCard.jsx
- Total holder count
- Top 10 holder concentration
- Concentration meter
- Top 5 holders list
- Distribution analysis

### Backend Modules

#### solanaScanner.js
```javascript
Functions:
- isValidSolanaAddress()          → Address validation
- getSolanaTokenInfo()            → Token metadata
- getSolanaTokenHolders()         → Holder analysis
- getSolanaTokenMarketData()      → Price & volume
- performSolanaSecurityCheck()    → Authority checks
- getSolanaLiquidityData()        → Pool analysis
```

#### bscScanner.js
```javascript
Functions:
- isValidBscAddress()             → Address validation (ERC20)
- getBscTokenInfo()               → Token metadata
- getBscTokenHolders()            → Holder analysis
- getBscTokenMarketData()         → Price & volume
- performBscSecurityCheck()       → Authority checks
- detectHoneypotBsc()             → Honeypot detection
- getBscLiquidityData()           → Pool analysis
```

#### riskEngine.js
```javascript
Functions:
- calculateRiskScore()            → 0-100 score calculation
- generateEntrySignal()           → Signal generation
- detectVolumeSpike()             → Volume analysis
- detectLiquidityGrowth()         → Liquidity trends
- detectHolderGrowth()            → Holder trends
- calculateBuySellRatio()         → Trading direction
- generateDetailedReport()        → Complete report
```

#### database.js
```javascript
Functions:
- initializeDatabase()            → SQLite setup
- createTables()                  → Schema creation
- getDatabase()                   → DB instance
```

## Database Schema

### tokens table
```sql
id                      INTEGER PRIMARY KEY
address                 TEXT UNIQUE
name                    TEXT
symbol                  TEXT
chain                   TEXT (solana/bsc)
market_cap             REAL
liquidity              REAL
volume                 REAL
price                  REAL
holder_count           INTEGER
top_10_holder_percent  REAL
created_at             DATETIME
updated_at             DATETIME
```

### security_checks table
```sql
id                      INTEGER PRIMARY KEY
token_address           TEXT UNIQUE
chain                   TEXT
ownership_renounced     BOOLEAN
mint_enabled            BOOLEAN
tax_fee                 REAL
blacklist_enabled       BOOLEAN
honeypot_status         TEXT
liquidity_locked        BOOLEAN
mint_authority          TEXT
freeze_authority        TEXT
rug_risk                TEXT
check_timestamp         DATETIME
```

### risk_scores table
```sql
id                      INTEGER PRIMARY KEY
token_address           TEXT UNIQUE
risk_score              INTEGER
entry_signal            TEXT
volume_spike            BOOLEAN
liquidity_growth        BOOLEAN
holder_growth           BOOLEAN
price_momentum           REAL
buy_sell_ratio          REAL
score_timestamp         DATETIME
```

## API Response Structure

### POST /api/scan Success Response
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-02-27T20:30:00Z",
    "token_name": "Example Token",
    "token_symbol": "EXM",
    "chain": "solana",
    
    "risk_analysis": {
      "risk_score": 35,
      "summary": "Low Risk",
      "factors": {
        "ownership_risk": false,
        "mint_risk": false,
        "honeypot": false,
        "good_liquidity": true
      }
    },
    
    "entry_analysis": {
      "entry_signal": "Strong Buy",
      "signal_score": 65,
      "positive_signals": ["Low rug risk", "Ownership renounced"],
      "negative_signals": [],
      "neutral_signals": ["Possible pump - caution advised"],
      "confidence": 0.85
    },
    
    "security_summary": {
      "rug_risk": "Low",
      "honeypot": false,
      "mintable": false,
      "ownership_status": "Renounced"
    },
    
    "market_summary": {
      "price": 0.0245,
      "market_cap": 2450000,
      "liquidity": 245000,
      "volume_24h": 125000,
      "price_change_24h": 12.5
    },
    
    "holder_summary": {
      "total_holders": 1250,
      "top_10_concentration": 35.2,
      "top_holders": [
        {"address": "addr1...", "balance": 1000, "percent": 5.2},
        {"address": "addr2...", "balance": 800, "percent": 4.1}
      ]
    },
    
    "recommendation": "Strong Buy - Risk Score: 35/100 (Low Risk)"
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

## Risk Scoring Algorithm

### Formula Components

**1. Security Factors (40% weight)**
```
- Ownership active: +15 points
- Mint enabled: +20 points
- Honeypot detected: +30 points
- Rug risk high: +20 points
- Rug risk medium: +10 points
- Freeze authority active: +15 points
```

**2. Market Factors (40% weight)**
```
- Market cap >$1M: -8 points
- Market cap <$10K: +15 points
- Liquidity >$100K: -10 points
- Liquidity <$10K: +12 points
- Good volume: -5 points
- High price change: +5 points
- Negative momentum: +10 points
```

**3. Holder Distribution (20% weight)**
```
- Top 10 >80%: +18 points (high concentration)
- Top 10 <30%: -8 points (good distribution)
- Many holders (>1000): -5 points
- Few holders (<50): +12 points
```

### Score Interpretation
```
75-100:  Critical Risk    🔴 AVOID
60-74:   High Risk        🟠 CAUTION
45-59:   Medium Risk      🟡 MODERATE
30-44:   Low Risk         🟢 CONSIDER
1-29:    Very Low Risk    ✅ STRONG
```

## Entry Signal Scoring

### Signal Score Components
```
Rug Risk Low:               +25
Ownership Renounced:         +15
Mint Disabled:              +15
Not Honeypot:               +10
Strong Liquidity (>$50K):    +10
Good Volume:                 +8
Positive Momentum:            +5

Ownership Active:            -20
Mint Enabled:                -25
Honeypot Detected:           -35
High Rug Risk:               -40
Low Liquidity (<$5K):        -15
Low Volume:                   -5
Negative Momentum:           -10
Concentrated Holdings (>70%): -15
```

### Signal Interpretation
```
≥50:     Strong Buy  🚀 (excellent opportunity)
25-49:   Buy         📈 (good opportunity)
0-24:    Moderate    ⏸️  (neutral, caution)
<0:      Avoid       ❌ (high risk)
```

## Performance Considerations

### Data Fetching
- All data fetches run in parallel (Promise.all)
- Timeout: API calls default to 10 seconds
- Caching: Results stored in SQLite for history

### Frontend
- Lazy loading of result cards
- CSS animations for smooth UX
- Responsive grid layout (1-3 columns)

### Backend
- Stateless design (no session management)
- CORS enabled for development
- Error handling with proper HTTP status codes

## Security Considerations

1. **Input Validation**
   - Address format validation (base58 for Solana, ERC20 for BSC)
   - Chain parameter whitelist (solana/bsc only)

2. **Data Privacy**
   - No personal data stored
   - Only public blockchain data analyzed
   - No authentication required (public API)

3. **External Dependencies**
   - Reliant on public RPC endpoints
   - Third-party API availability
   - Network reliability

4. **Rate Limiting** (Recommended for production)
   - Add express-rate-limit middleware
   - Implement API key system
   - Set tier-based limits

## Deployment Considerations

### Environment Variables
```
Production:
- BSCSCAN_API_KEY=production_key
- VITE_API_URL=https://api.yourdomain.com
- NODE_ENV=production
```

### Database
- SQLite suitable for MVP/small scale
- For scale, migrate to PostgreSQL
- Regular backups recommended

### Hosting Options
- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Heroku, Railway, AWS EC2, DigitalOcean
- Database: Managed hosting or self-hosted

## Future Architecture Enhancements

1. **Caching Layer**
   - Redis for frequently accessed tokens
   - Reduce blockchain RPC calls

2. **Event System**
   - WebSocket real-time updates
   - Alert subscriptions

3. **Message Queue**
   - Bull/Queue for background jobs
   - Scheduled token monitoring

4. **Analytics Dashboard**
   - Aggregate user scanning data
   - Trending tokens analysis
   - Success rate tracking

5. **Multi-Chain Support**
   - Ethereum, Polygon, Arbitrum
   - Generic token scanner pattern

6. **Machine Learning**
   - Pattern recognition for rug pulls
   - Predictive entry signals
   - Risk model refinement

---

This architecture prioritizes simplicity, performance, and maintainability for rapid MVP deployment with clear paths for scaling.