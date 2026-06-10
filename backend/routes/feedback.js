// backend/routes/feedback.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// POST /api/feedback - отправка сообщения
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }
  
  db.run(
    `INSERT INTO feedback (name, email, phone, subject, message, status, created_at) 
     VALUES (?, ?, ?, ?, ?, 'new', datetime('now'))`,
    [name, email, phone || null, subject || null, message],
    function(err) {
      if (err) {
        console.error('Ошибка БД:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.status(201).json({ message: 'Сообщение отправлено', id: this.lastID });
    }
  );
});

// GET /api/feedback - получить все сообщения (только админ)
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM feedback ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// PUT /api/feedback/:id/read - отметить как прочитанное
router.put('/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run("UPDATE feedback SET status = 'read' WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Статус обновлён' });
  });
});

// DELETE /api/feedback/:id - удалить сообщение
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM feedback WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Сообщение удалено' });
  });
});

module.exports = router;