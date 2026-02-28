import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post('/api/dexscan', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Token address required' });

  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    res.json(response.data);
  } catch (error) {
    console.error('DexScreener fetch failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch token data' });
  }
});

export default router;
