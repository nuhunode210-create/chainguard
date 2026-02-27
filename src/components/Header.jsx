import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">🛡️</div>
          <h1>TokenShield</h1>
        </div>
        <p className="tagline">Know the risk before you ape.</p>
      </div>
    </header>
  );
}