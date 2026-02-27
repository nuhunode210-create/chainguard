import React, { useState } from 'react';
import Scanner from './components/Scanner';
import Results from './components/Results';
import Header from './components/Header';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (tokenAddress, chain) => {
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token_address: tokenAddress,
          chain: chain
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Scan failed');
      }

      const data = await response.json();
      setScanResult(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <div className="container">
          <div className="scanner-section">
            <Scanner onScan={handleScan} loading={loading} />
          </div>

          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>Scanning token...</p>
            </div>
          )}

          {scanResult && !loading && (
            <Results data={scanResult} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;