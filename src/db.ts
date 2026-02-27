import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('database.sqlite');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    credits INTEGER DEFAULT 30,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

try {
  db.exec("ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free'");
} catch (e) {
  // Column might already exist
}

db.exec(`
  CREATE TABLE IF NOT EXISTS generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'voice', 'image', 'video', 'thumbnail'
    prompt TEXT,
    result_url TEXT,
    credits_used INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- Default settings
  INSERT OR IGNORE INTO site_settings (key, value) VALUES 
  ('primary_color', '#0f172a'),
  ('accent_color', '#f97316'),
  ('hero_headline', 'The All-in-One AI Creator Operating System'),
  ('hero_cta', 'Start Creating for Free'),
  ('theme', 'dark');
`);

export default db;
