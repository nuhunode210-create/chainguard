import React from 'react';
import './SecurityCard.css';

export default function SecurityCard({ data, chain }) {
  if (!data) return null;

  const getCheckStatus = (value) => {
    if (value === true || value === 'yes') return { emoji: '✅', text: 'Yes', good: true };
    if (value === false || value === 'no') return { emoji: '✅', text: 'No', good: true };
    if (value === 'Renounced') return { emoji: '✅', text: 'Renounced', good: true };
    if (value === 'Active') return { emoji: '⚠️', text: 'Active', good: false };
    return { emoji: '❓', text: 'Unknown', good: null };
  };

  const rugRiskColor = {
    'Low': '#4caf50',
    'Medium': '#ff9800',
    'High': '#f44336'
  };

  return (
    <div className="security-card card">
      <div className="card-header">
        <h3>Security Checks</h3>
        <span className="security-badge">{chain.toUpperCase()}</span>
      </div>

      <div className="checks-list">
        {chain === 'solana' ? (
          <>
            <div className="check-item">
              <span className="check-label">Mint Authority</span>
              <span className="check-status">
                {getCheckStatus(data.mintable).emoji}
                {data.mintable ? 'Active' : 'Renounced'}
              </span>
            </div>

            <div className="check-item">
              <span className="check-label">Freeze Authority</span>
              <span className="check-status">
                {getCheckStatus(data.ownership_status).emoji}
                {data.ownership_status || 'Unknown'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="check-item">
              <span className="check-label">Ownership</span>
              <span className="check-status">
                {data.ownership_status === 'Renounced' ? '✅' : '⚠️'}
                {data.ownership_status}
              </span>
            </div>

            <div className="check-item">
              <span className="check-label">Mint Function</span>
              <span className="check-status">
                {!data.mintable ? '✅' : '⚠️'}
                {!data.mintable ? 'Disabled' : 'Enabled'}
              </span>
            </div>

            <div className="check-item">
              <span className="check-label">Honeypot</span>
              <span className="check-status">
                {!data.honeypot ? '✅' : '⚠️'}
                {!data.honeypot ? 'No' : 'Potential'}
              </span>
            </div>
          </>
        )}

        <div className="check-item">
          <span className="check-label">Rug Risk</span>
          <span
            className="check-status rug-risk"
            style={{ color: rugRiskColor[data.rug_risk] || '#999' }}
          >
            {data.rug_risk || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="security-note">
        <strong>Note:</strong> Security checks are based on publicly available blockchain data and automated analysis. Always verify contracts on official explorers and do thorough research before trading.
      </div>
    </div>
  );
}