# TokenShield - Quick Start Guide

Get the token scanner up and running in minutes!

## 1-Minute Setup

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm start
```

You'll see:
```
Connected to SQLite database
Database tables initialized
Token Scanner API running on http://0.0.0.0:3000
```

### Terminal 2: Start Frontend
```bash
npm install
npm run dev
```

Open your browser to **http://localhost:5173**

## Usage

1. **Enter Token Address**
   - Paste a Solana mint address or BSC contract address
   - Select the blockchain (Solana or BSC)

2. **Click "Scan Token"**
   - The system analyzes the token in real-time
   - Checks security parameters on the blockchain

3. **Review Results**
   - **Risk Score**: 0-100 (lower is better)
   - **Entry Signal**: Strong Buy / Buy / Moderate / Avoid
   - **Security Checks**: Ownership, mint function, honeypot status
   - **Market Data**: Price, liquidity, volume, market cap
   - **Holder Distribution**: Concentration analysis

## Example Tokens to Try

### Solana
- **Magic Eden (MAGIC)**: `MK1tL9t2GCM8kCnBKjvbQMXPmtAL3PVnG9hvXB3hEYK`
- **Serum (SRM)**: `SRMuApVgqbCG5rChSrWrwDkUpncM57SVCNc2gWcvQ44`

### BSC (BNB Chain)
- **PancakeSwap (CAKE)**: `0x0E09FaBB73Bd3Ade0a17ECC321fD13a50a0EDD42`
- **BUSD**: `0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`

## What Gets Analyzed

### Security Parameters
- **Solana**: Mint authority, freeze authority, supply distribution
- **BSC**: Ownership status, mint function, honeypot detection

### Risk Factors
- Holder concentration
- Market cap relative to liquidity
- Trading volume
- Price volatility
- Recent price movements

### Entry Signals Based On
- Rug pull risk assessment
- Honeypot detection
- Liquidity health
- Holder distribution
- Market momentum

## Important Notes

⚠️ **NOT Financial Advice**
- This tool analyzes blockchain data algorithmically
- Always do your own research (DYOR)
- Never risk more than you can afford to lose
- Check official explorers before trading

## API Endpoints Quick Reference

```bash
# Scan a token
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"token_address":"YOUR_ADDRESS","chain":"solana"}'

# View scan history
curl http://localhost:3000/api/history

# Get specific token
curl http://localhost:3000/api/token/ADDRESS/solana

# Health check
curl http://localhost:3000/api/health
```

## Troubleshooting

**Backend won't start on port 3000**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Try again
npm start
```

**Frontend can't reach backend**
- Make sure backend is running: `curl http://localhost:3000/api/health`
- Check browser console for errors (F12 → Console)
- Verify firewall isn't blocking port 3000

**Token not found**
- Double-check the contract address
- Try a well-known token first
- Some brand new tokens may not have enough data

## Next Steps

- ✅ Try scanning a few tokens
- ✅ Understand how the risk scoring works
- ✅ Review security parameters for your watchlist
- ✅ Compare results with other tools

## Support

Need help? Check `/workspace/SETUP.md` for detailed documentation.

---

**Know the risk before you ape.** 🛡️