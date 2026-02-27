import React from 'react';
import './MarketDataCard.css';

export default function MarketDataCard({ data }) {
  if (!data) return null;

  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (num) => {
    if (num === 0) return '$0';
    if (num < 0.0001) return `$${num.toExponential(2)}`;
    if (num < 1) return `$${num.toFixed(4)}`;
    return `$${num.toFixed(2)}`;
  };

  const getPriceChangeColor = (change) => {
    if (change > 0) return '#4caf50';
    if (change < 0) return '#f44336';
    return '#999';
  };

  const getPriceChangeEmoji = (change) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '↔️';
  };

  return (
    <div className="market-data-card card">
      <div className="card-header">
        <h3>Market Data</h3>
      </div>

      <div className="market-metrics">
        <div className="metric">
          <span className="metric-label">Price</span>
          <span className="metric-value">{formatPrice(data.price)}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Market Cap</span>
          <span className="metric-value">{formatNumber(data.market_cap)}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Liquidity</span>
          <span className="metric-value">{formatNumber(data.liquidity)}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Volume 24h</span>
          <span className="metric-value">{formatNumber(data.volume_24h)}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Price Change (24h)</span>
          <span
            className="metric-value price-change"
            style={{ color: getPriceChangeColor(data.price_change_24h) }}
          >
            {getPriceChangeEmoji(data.price_change_24h)}
            {data.price_change_24h > 0 ? '+' : ''}{data.price_change_24h.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="market-summary">
        <div className="summary-stat">
          <span className="label">MC/Liquidity Ratio</span>
          <span className="value">
            {data.liquidity > 0
              ? ((data.market_cap / data.liquidity) * 100).toFixed(1)
              : 'N/A'}%
          </span>
        </div>
      </div>
    </div>
  );
}