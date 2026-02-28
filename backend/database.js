// backend/dexscan.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/dexscan
// Body: { address: "0xTokenAddress" }
router.post('/api/dexscan', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing token address' });
    }

    // Fetch token info from DexScreener
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const data = response.data;

    if (!data || !data.pairs || data.pairs.length === 0) {
      return res.status(404).json({ error: 'No data found for this token' });
    }

    // Return the full pair data
    res.json(data);
  } catch (error) {
    console.error('Dexscan error:', error.message);
    res.status(500).json({ error: 'Failed to fetch token data', details: error.message });
  }
});

export default router;
