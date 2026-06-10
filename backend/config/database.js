// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../db/churches.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err);
  } else {
    console.log('✅ Подключено к SQLite базе данных');
    initDatabase();
  }
});

function initDatabase() {
  const initSQL = `
    CREATE TABLE IF NOT EXISTS churches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_full TEXT,
      address TEXT NOT NULL,
      description TEXT,
      history TEXT,
      architecture TEXT,
      shrines TEXT,
      abbot TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      image_url TEXT,
      gallery TEXT,
      lat REAL,
      lng REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      church_id INTEGER,
      service_type TEXT NOT NULL,
      day_of_week INTEGER,
      service_date DATE,
      time TIME NOT NULL,
      notes TEXT,
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      church_id INTEGER,
      author_name TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      text TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (church_id) REFERENCES churches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_churches_name ON churches(name);
    CREATE INDEX IF NOT EXISTS idx_schedule_church_id ON schedule(church_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_church_id ON reviews(church_id);
  `;

  db.exec(initSQL, (err) => {
    if (err) {
      console.error('Ошибка инициализации БД:', err);
    } else {
      console.log('✅ База данных инициализирована');
    }
  });
}

module.exports = db;