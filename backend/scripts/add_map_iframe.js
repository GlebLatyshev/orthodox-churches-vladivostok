// backend/scripts/add_map_iframe.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/churches.db');
const db = new sqlite3.Database(dbPath);

db.run(`ALTER TABLE churches ADD COLUMN map_iframe TEXT`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('✅ Колонка map_iframe уже существует');
    } else {
      console.error('Ошибка:', err);
    }
  } else {
    console.log('✅ Колонка map_iframe добавлена');
  }
  db.close();
});