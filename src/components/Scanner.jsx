import React, { useState } from 'react';
import './Scanner.css';

export default function Scanner({ onScan, loading }) {
  const [tokenAddress, setTokenAddress] = useState('');
  const [chain, setChain] = useState('solana');
  const [dexInfo, setDexInfo] = useState(null); // <-- DexScreener state inside component

  // Function to fetch DexScreener data
  const fetchDexData = async (tokenAddress) => {
    try {
      const res = await fetch("/api/dexscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: tokenAddress })
      });
      if (!res.ok) throw new Error("Failed to fetch token data");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Handle scanning form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenAddress.trim()) return;

    // Original scan call
    if (onScan) onScan(tokenAddress.trim(), chain);

    // Fetch DexScreener data
    const dexData = await fetchDexData(tokenAddress.trim());
    if (dexData && dexData.pairs && dexData.pairs.length > 0) {
      setDexInfo(dexData.pairs[0]); // save first pair
    } else {
      setDexInfo(null);
    }
  };

  return (
    <div className="scanner-card">
      <h2>Token Scanner</h2>
      <p className="scanner-subtitle">Enter a contract address to analyze token security</p>

      <form onSubmit={handleSubmit} className="scanner-form">
        <div className="form-group">
          <label htmlFor="chain">Select Blockchain</label>
          <select
            id="chain"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            disabled={loading}
            className="chain-select"
          >
            <option value="solana">Solana</option>
            <option value="bsc">BNB Smart Chain (BSC)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="address">Token Contract Address</label>
          <input
            id="address"
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder={chain === 'solana' ? 'Enter Solana mint address...' : 'Enter contract address (0x...)'}
            disabled={loading}
            className="address-input"
          />
          <p className="helper-text">
            {chain === 'solana' 
              ? 'Paste a Solana token mint address' 
              : 'Paste an Ethereum-format contract address'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !tokenAddress.trim()}
          className="scan-button"
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Scanning...
            </>
          ) : (
            <>🔍 Scan Token</>
          )}
        </button>
      </form>

      {/* Show DexScreener info here */}
      {dexInfo && (
        <div className="dex-info">
          <h3>DEX Info</h3>
          <p><strong>Price:</strong> ${dexInfo.priceUsd}</p>
          <p><strong>Liquidity:</strong> ${dexInfo.liquidity.usd}</p>
          <p><strong>24h Volume:</strong> ${dexInfo.volume.h24}</p>
          <p><strong>DEX:</strong> {dexInfo.dexId}</p>
        </div>
      )}

      <div className="scanner-info">
        <h3>How it works</h3>
        <ul>
          <li>Enter your token contract address</li>
          <li>Our engine analyzes security parameters</li>
          <li>Get a risk score and entry signal instantly</li>
          <li>Make informed trading decisions</li>
        </ul>
      </div>
    </div>
  );
}
