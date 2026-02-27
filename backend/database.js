import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.db');

let db;

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        createTables();
        resolve(db);
      }
    });
  });
}

function createTables() {
  db.serialize(() => {
    // Tokens table
    db.run(`
      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT UNIQUE NOT NULL,
        name TEXT,
        symbol TEXT,
        chain TEXT NOT NULL,
        market_cap REAL,
        liquidity REAL,
        volume REAL,
        price REAL,
        holder_count INTEGER,
        top_10_holder_percent REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Security checks table
    db.run(`
      CREATE TABLE IF NOT EXISTS security_checks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_address TEXT UNIQUE NOT NULL,
        chain TEXT NOT NULL,
        ownership_renounced BOOLEAN,
        mint_enabled BOOLEAN,
        tax_fee REAL,
        blacklist_enabled BOOLEAN,
        honeypot_status TEXT,
        liquidity_locked BOOLEAN,
        mint_authority TEXT,
        freeze_authority TEXT,
        rug_risk TEXT,
        check_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (token_address) REFERENCES tokens(address)
      )
    `);

    // Risk scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS risk_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_address TEXT UNIQUE NOT NULL,
        risk_score INTEGER,
        entry_signal TEXT,
        volume_spike BOOLEAN,
        liquidity_growth BOOLEAN,
        holder_growth BOOLEAN,
        price_momentum REAL,
        buy_sell_ratio REAL,
        score_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (token_address) REFERENCES tokens(address)
      )
    `);

    console.log('Database tables initialized');
  });
}

export function getDatabase() {
  return db;
}