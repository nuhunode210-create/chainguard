import React from 'react';
import './EntrySignalCard.css';

export default function EntrySignalCard({ data }) {
  if (!data) return null;

  const getSignalColor = (signal) => {
    if (signal.includes('Strong')) return '#388e3c';
    if (signal.includes('Buy') && !signal.includes('Strong')) return '#7cb342';
    if (signal.includes('Moderate')) return '#fbc02d';
    return '#d32f2f';
  };

  const getSignalEmoji = (signal) => {
    if (signal.includes('Strong')) return '🚀';
    if (signal.includes('Buy') && !signal.includes('Strong')) return '📈';
    if (signal.includes('Moderate')) return '⏸️';
    return '❌';
  };

  return (
    <div className="entry-signal-card card">
      <div className="card-header">
        <h3>Entry Signal</h3>
        <span className="signal-emoji">{getSignalEmoji(data.entry_signal)}</span>
      </div>

      <div className="signal-box" style={{ borderLeftColor: getSignalColor(data.entry_signal) }}>
        <div className="signal-text" style={{ color: getSignalColor(data.entry_signal) }}>
          {data.entry_signal}
        </div>
        <div className="confidence">Confidence: {Math.round(data.confidence * 100)}%</div>
      </div>

      <div className="score-display">
        <div className="score" style={{ color: getSignalColor(data.entry_signal) }}>
          {data.signal_score > 0 ? '+' : ''}{data.signal_score}
        </div>
      </div>

      <div className="signals-section">
        {data.positive_signals.length > 0 && (
          <div className="signal-group positive">
            <h4>✅ Positive Signals</h4>
            <ul>
              {data.positive_signals.map((signal, idx) => (
                <li key={idx}>{signal}</li>
              ))}
            </ul>
          </div>
        )}

        {data.negative_signals.length > 0 && (
          <div className="signal-group negative">
            <h4>⛔ Negative Signals</h4>
            <ul>
              {data.negative_signals.map((signal, idx) => (
                <li key={idx}>{signal}</li>
              ))}
            </ul>
          </div>
        )}

        {data.neutral_signals.length > 0 && (
          <div className="signal-group neutral">
            <h4>⚠️ Neutral Signals</h4>
            <ul>
              {data.neutral_signals.map((signal, idx) => (
                <li key={idx}>{signal}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}