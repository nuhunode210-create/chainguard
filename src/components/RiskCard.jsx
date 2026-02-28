import React from 'react';
import './RiskCard.css';

export default function RiskCard({ data }) {
  if (!data) return null;

  const getScoreColor = (score) => {
    if (score >= 75) return '#d32f2f';
    if (score >= 60) return '#f57c00';
    if (score >= 45) return '#fbc02d';
    if (score >= 30) return '#7cb342';
    return '#388e3c';
  };

  const getSummaryEmoji = (summary) => {
    if (summary.includes('Critical')) return '🔴';
    if (summary.includes('High')) return '🟠';
    if (summary.includes('Medium')) return '🟡';
    if (summary.includes('Low')) return '🟢';
    return '✅';
  };

  return (
    <div className="risk-card card">
      <div className="card-header">
        <h3>Risk Analysis</h3>
        <span className="risk-score-badge" style={{ color: getScoreColor(data.risk_score) }}>
          {data.risk_score}/100
        </span>
      </div>

      <div className="risk-meter">
        <div className="meter-bar">
          <div
            className="meter-fill"
            style={{
              width: `${data.risk_score}%`,
              backgroundColor: getScoreColor(data.risk_score)
            }}
          ></div>
        </div>
      </div>

      <div className="summary">
        <span className="summary-emoji">{getSummaryEmoji(data.summary)}</span>
        <span className="summary-text">{data.summary}</span>
      </div>

      <div className="factors">
        <h4>Risk Factors</h4>
        <ul>
          {data.factors.ownership_risk && <li>⚠️ Ownership still active</li>}
          {data.factors.mint_risk && <li>⚠️ Mint function enabled</li>}
          {data.factors.honeypot && <li>⚠️ Potential honeypot</li>}
          {data.factors.rug_risk_high && <li>⚠️ High rug pull risk</li>}
          {data.factors.rug_risk_medium && <li>⚠️ Medium rug pull risk</li>}
          {data.factors.freeze_authority && <li>⚠️ Freeze authority active</li>}
          {data.factors.low_market_cap && <li>⚠️ Very low market cap</li>}
          {data.factors.low_liquidity && <li>⚠️ Low liquidity</li>}
          {data.factors.low_volume && <li>⚠️ Low trading volume</li>}
          {data.factors.high_concentration && <li>⚠️ Concentrated holdings</li>}
          {data.factors.high_price_change && <li>📈 Extreme price movement</li>}
          {data.factors.negative_momentum && <li>📉 Negative momentum</li>}
          {data.factors.few_holders && <li>⚠️ Few holders</li>}
        </ul>
      </div>

      {Object.keys(data.factors).length === 0 && (
        <div className="positive-factors">
          ✅ No major risk factors detected
        </div>
      )}
    </div>
  );
}
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
