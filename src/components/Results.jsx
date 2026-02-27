import React from 'react';
import RiskCard from './RiskCard';
import SecurityCard from './SecurityCard';
import EntrySignalCard from './EntrySignalCard';
import MarketDataCard from './MarketDataCard';
import HolderCard from './HolderCard';
import './Results.css';

export default function Results({ data }) {
  if (!data) return null;

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Scan Results</h2>
        <div className="token-info">
          <span className="token-name">{data.token_name} ({data.token_symbol})</span>
          <span className="token-chain">{data.chain.toUpperCase()}</span>
          <span className="timestamp">{new Date(data.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <div className="results-grid">
        <RiskCard data={data.risk_analysis} />
        <EntrySignalCard data={data.entry_analysis} />
        <SecurityCard data={data.security_summary} chain={data.chain} />
        <MarketDataCard data={data.market_summary} />
        <HolderCard data={data.holder_summary} />
      </div>

      <div className="recommendation-box">
        <h3>Recommendation</h3>
        <p>{data.recommendation}</p>
        <p className="disclaimer">
          ⚠️ Disclaimer: This is algorithmic analysis only, not financial advice. Always do your own research before trading.
        </p>
      </div>
    </div>
  );
}