import { useState } from 'react';

export default function Scan() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!tokenAddress) {
      alert("Please enter a token address");
      return;
    }

    setLoading(true);
    setError('');
    setTokenData(null);

    try {
      const res = await fetch("/api/dexscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: tokenAddress })
      });

      if (!res.ok) throw new Error("Failed to fetch token data");

      const data = await res.json();

      if (!data.pairs || data.pairs.length === 0) {
        setError("No data found for this token");
      } else {
        setTokenData(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching token data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'Arial' }}>
      <h2>Token Scanner</h2>
      <input
        type="text"
        placeholder="Enter token address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <button onClick={handleScan} style={{ padding: '8px 12px', cursor: 'pointer' }}>
        {loading ? "Scanning..." : "Scan Token"}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {tokenData && tokenData.pairs && tokenData.pairs.length > 0 && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Token Info</h3>
          <p><strong>Price:</strong> ${tokenData.pairs[0].priceUsd}</p>
          <p><strong>Liquidity:</strong> ${tokenData.pairs[0].liquidity.usd}</p>
          <p><strong>24h Volume:</strong> ${tokenData.pairs[0].volume.h24}</p>
          <p><strong>DEX:</strong> {tokenData.pairs[0].dexId}</p>
        </div>
      )}
    </div>
  );
                                         }
