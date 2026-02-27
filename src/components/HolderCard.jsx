import React from 'react';
import './HolderCard.css';

export default function HolderCard({ data }) {
  if (!data) return null;

  const concentrationLevel = data.top_10_concentration;
  let concentrationStatus = 'Unknown';
  let concentrationColor = '#999';

  if (concentrationLevel > 80) {
    concentrationStatus = 'Very High ⚠️';
    concentrationColor = '#f44336';
  } else if (concentrationLevel > 60) {
    concentrationStatus = 'High ⚠️';
    concentrationColor = '#ff9800';
  } else if (concentrationLevel > 40) {
    concentrationStatus = 'Medium 📊';
    concentrationColor = '#fbc02d';
  } else if (concentrationLevel > 20) {
    concentrationStatus = 'Low 📈';
    concentrationColor = '#4caf50';
  } else {
    concentrationStatus = 'Very Low ✅';
    concentrationColor = '#2e7d32';
  }

  return (
    <div className="holder-card card">
      <div className="card-header">
        <h3>Holder Distribution</h3>
      </div>

      <div className="holder-stats">
        <div className="stat">
          <span className="stat-label">Total Holders</span>
          <span className="stat-value">{data.total_holders.toLocaleString()}</span>
        </div>

        <div className="stat">
          <span className="stat-label">Top 10 Concentration</span>
          <span className="stat-value" style={{ color: concentrationColor }}>
            {data.top_10_concentration.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="concentration-meter">
        <div className="meter-bar">
          <div
            className="meter-fill"
            style={{
              width: `${Math.min(data.top_10_concentration, 100)}%`,
              backgroundColor: concentrationColor
            }}
          ></div>
        </div>
        <span className="concentration-status" style={{ color: concentrationColor }}>
          {concentrationStatus}
        </span>
      </div>

      <div className="top-holders">
        <h4>Top Holders</h4>
        {data.top_holders && data.top_holders.length > 0 ? (
          <ul className="holders-list">
            {data.top_holders.map((holder, idx) => (
              <li key={idx} className="holder-item">
                <span className="holder-rank">#{idx + 1}</span>
                <span className="holder-address">{holder.address.slice(0, 8)}...{holder.address.slice(-6)}</span>
                <span className="holder-percent">{holder.percent.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-holders">No holder data available</p>
        )}
      </div>

      <div className="distribution-note">
        <strong>Note:</strong> {concentrationLevel > 50
          ? 'Holdings are concentrated. Watch for potential dump risks.'
          : 'Distribution looks relatively healthy.'}
      </div>
    </div>
  );
}