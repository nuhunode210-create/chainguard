import React, { useState } from "react";

const Scan = () => {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("bsc"); // default BNB
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanToken = async () => {
    if (!address) {
      alert("Please enter a token address");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // DexScreener API works for BSC and Solana
      const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.pairs || data.pairs.length === 0) {
        alert("Token not found");
        setLoading(false);
        return;
      }

      const token = data.pairs[0];

      // Build a result object
      const scanResult = {
        name: token.baseToken.name,
        symbol: token.baseToken.symbol,
        price: token.priceUsd,
        liquidity: token.liquidity.usd,
        volume24h: token.volume.h24,
        dex: token.dexId,
      };

      setResult(scanResult);
    } catch (error) {
      console.error("Scan failed:", error);
      alert("Scan failed. Check the token address or try again later.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Token Scanner</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter token address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="bsc">BNB Smart Chain</option>
          <option value="solana">Solana</option>
        </select>
      </div>

      <button
        onClick={scanToken}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
        disabled={loading}
      >
        {loading ? "Scanning..." : "Scan Token"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>Scan Result</h3>
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Symbol:</strong> {result.symbol}</p>
          <p><strong>Price (USD):</strong> ${result.price}</p>
          <p><strong>Liquidity:</strong> ${result.liquidity}</p>
          <p><strong>24h Volume:</strong> ${result.volume24h}</p>
          <p><strong>DEX:</strong> {result.dex}</p>
        </div>
      )}
    </div>
  );
};

export default Scan;
