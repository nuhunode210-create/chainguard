# Configuration Guide

## Environment Setup

### 1. Frontend Configuration

#### Vite Config (`vite.config.js`)
```javascript
// Already configured for development
// Port: 5173
// Hot Module Reload: Enabled
// React Support: Enabled
```

#### Environment Variables (Frontend)
Create a `.env.local` file in root directory:
```env
VITE_API_URL=http://localhost:3000
```

For production:
```env
VITE_API_URL=https://api.yourdomin.com
```

### 2. Backend Configuration

#### Express Server (`backend/index.js`)
```javascript
PORT: 3000
HOST: 0.0.0.0
CORS: Enabled (allow all origins in dev)
```

#### Environment Variables (Backend)
Create `backend/.env` file:
```env
# Optional: BscScan API for enhanced data
BSCSCAN_API_KEY=your_api_key_here

# RPC endpoints (using public ones by default)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BSC_RPC_URL=https://bsc-dataseed1.binance.org

# Environment
NODE_ENV=development
```

#### Database Configuration (`backend/database.js`)
```javascript
// SQLite database location: ./backend/database.db
// Auto-creates tables on startup
// No configuration needed
```

### 3. Blockchain RPC Configuration

#### Solana RPC
**Default:** https://api.mainnet-beta.solana.com (Public)

**Alternative Public RPCs:**
- https://solana-api.projectserum.com
- https://api.wen.rpc.helius.xyz/solana
- https://rpc.ankr.com/solana

**Custom RPC:**
Edit `backend/solanaScanner.js`:
```javascript
const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
```

#### BSC RPC
**Default:** https://bsc-dataseed1.binance.org (Public)

**Alternative Public RPCs:**
- https://bsc-dataseed2.binance.org
- https://bsc-dataseed3.binance.org
- https://bsc-dataseed4.binance.org

**Custom RPC:**
Edit `backend/bscScanner.js`:
```javascript
const BSC_RPC = process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org';
```

### 4. External API Configuration

#### DexScreener API
- **Endpoint:** https://api.dexscreener.com
- **Status:** Public API (free, no key required)
- **Rate Limit:** Generous for automated queries
- **Used for:** Market data, liquidity, volume, price changes

#### Solscan API
- **Endpoint:** https://api.solscan.io
- **Status:** Public API (free, no key required)
- **Used for:** Solana token holders, analytics

#### BscScan API
- **Endpoint:** https://api.bscscan.com/api
- **Status:** Public API (requires free API key for high volume)
- **Setup:**
  1. Visit https://bscscan.com/apis
  2. Create free account
  3. Generate API key
  4. Add to `.env`: `BSCSCAN_API_KEY=your_key`
- **Used for:** BSC token holders, contract verification

## Feature Toggles

### Enable/Disable Security Checks

Edit `backend/riskEngine.js` to adjust weights:

```javascript
// Current weights (can be customized)
const SECURITY_WEIGHT = 0.4;  // 40%
const MARKET_WEIGHT = 0.4;    // 40%
const HOLDER_WEIGHT = 0.2;    // 20%
```

### Risk Score Thresholds

Edit `backend/riskEngine.js`:

```javascript
function getRiskSummary(score) {
  if (score >= 75) return 'Critical Risk';      // Customize
  if (score >= 60) return 'High Risk';
  if (score >= 45) return 'Medium Risk';
  if (score >= 30) return 'Low Risk';
  return 'Very Low Risk';
}
```

### Entry Signal Thresholds

Edit `backend/riskEngine.js`:

```javascript
// Customize entry signal scoring
if (signalScore >= 50) entrySignal = 'Strong Buy';
else if (signalScore >= 25) entrySignal = 'Buy';
else if (signalScore >= 0) entrySignal = 'Moderate';
else entrySignal = 'Avoid';
```

## Development Configuration

### Hot Reload (Frontend)
Vite automatically watches files. Changes appear instantly.

### API Testing
Use curl, Postman, or the Thunder Client VS Code extension:

```bash
# Test backend
curl http://localhost:3000/api/health

# Scan a token
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"token_address":"","chain":"solana"}'
```

### Debug Mode

**Backend Debug:**
Add to `backend/index.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend Debug:**
Open browser DevTools (F12):
- Console: See logs and errors
- Network: See API calls
- React DevTools: Inspect components

## Performance Tuning

### Frontend Optimization

**Reduce bundle size:**
```javascript
// Use Code Splitting
const Results = React.lazy(() => import('./components/Results'));
```

**Optimize re-renders:**
```javascript
// Use React.memo for expensive components
export default React.memo(RiskCard);
```

### Backend Optimization

**Enable caching:**
```javascript
// Add Redis caching layer (future enhancement)
const redis = require('redis');
const client = redis.createClient();
```

**Connection pooling:**
```javascript
// For PostgreSQL (when scaling)
const pool = new Pool({ max: 20 });
```

**Request compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

## Production Deployment

### Environment Variables

Set these before deploying:

```env
# Backend
NODE_ENV=production
BSCSCAN_API_KEY=your_production_key
CORS_ORIGIN=https://yourdomain.com

# Frontend (build time)
VITE_API_URL=https://api.yourdomain.com
```

### Security Headers

Add to `backend/index.js`:

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting

Add to `backend/index.js`:

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### CORS Configuration

Edit `backend/index.js`:

```javascript
// Development (current)
app.use(cors());

// Production (strict)
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

## Database Backup & Maintenance

### SQLite Backup

```bash
# Backup database
cp backend/database.db backend/database.db.backup

# Restore database
cp backend/database.db.backup backend/database.db
```

### Database Cleanup

Remove old entries:

```sql
DELETE FROM tokens WHERE updated_at < datetime('now', '-30 days');
DELETE FROM risk_scores WHERE score_timestamp < datetime('now', '-30 days');
```

### Migration to PostgreSQL

When scaling:

```sql
-- Create PostgreSQL database
psql -c "CREATE DATABASE tokenscanner;"

-- Update connection string
postgresql://user:password@localhost:5432/tokenscanner
```

## Monitoring & Logging

### Application Logs

Add Winston logger to `backend/index.js`:

```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking

Integration with Sentry:

```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your_sentry_dsn" });
```

### Performance Monitoring

Add APM instrumentation:

```javascript
const apm = require('elastic-apm-node');
apm.start({
  serviceName: 'tokenscanner-backend'
});
```

## Testing Configuration

### Unit Tests

```bash
npm install --save-dev jest
npm install --save-dev @testing-library/react
```

Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup.js']
};
```

### API Testing

Use Postman collection (to be created):
- Import API endpoints
- Create test scenarios
- Set up automated tests

## Customization

### Change Brand Name

1. Header: `src/components/Header.jsx`
   ```jsx
   <h1>Your Brand Name</h1>
   ```

2. Title: `index.html`
   ```html
   <title>Your Brand - Token Scanner</title>
   ```

3. Favicon: Replace `public/favicon.ico`

### Change Colors

Edit `src/App.css` and component CSS files:

```css
/* Main color scheme */
--primary-color: #302b63;
--secondary-color: #24243e;
--accent-color: #f44336;
```

### Add New Security Checks

1. Edit `backend/solanaScanner.js` or `backend/bscScanner.js`
2. Add new check function
3. Update risk scoring in `backend/riskEngine.js`
4. Update frontend display cards

### Add New Risk Factors

Edit `backend/riskEngine.js`:

```javascript
// Add new factor to scoring
if (newCondition) {
  riskScore += 10; // or -= for positive
  factors.new_factor = true;
}
```

## Troubleshooting Configuration Issues

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
kill -9 <PID>
```

### CORS Errors
Check `backend/index.js` CORS configuration matches frontend URL.

### API Key Rate Limits
- Increase API key quota on service provider
- Implement caching layer
- Reduce API call frequency

### RPC Endpoint Failures
- Switch to alternative RPC
- Implement endpoint fallback system
- Add retry logic with exponential backoff

## Quick Configuration Checklist

- [ ] Frontend `.env.local` created
- [ ] Backend `.env` created  
- [ ] BscScan API key obtained (optional)
- [ ] Blockchain RPC endpoints verified
- [ ] CORS configured for environment
- [ ] Database location confirmed
- [ ] Risk scoring weights verified
- [ ] Entry signal thresholds reviewed
- [ ] Security checks enabled
- [ ] Logging configured (production)
- [ ] Rate limiting enabled (production)
- [ ] SSL/TLS configured (production)
- [ ] Monitoring/alerting set up (production)

---

**Need help?** Check SETUP.md or ARCHITECTURE.md for more details.