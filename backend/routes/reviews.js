// backend/routes/reviews.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

// GET /api/reviews/church/:churchId - получить отзывы для храма
router.get('/church/:churchId', (req, res) => {
  const { churchId } = req.params;
  
  db.all(
    `SELECT id, author_name, rating, text, created_at 
     FROM reviews 
     WHERE church_id = ? AND is_approved = 1 
     ORDER BY created_at DESC`,
    [churchId],
    (err, rows) => {
      if (err) {
        console.error('Ошибка БД:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    }
  );
});

// GET /api/reviews/pending - получить отзывы на модерации (только админ)
router.get('/pending', authenticateToken, (req, res) => {
  db.all(`
    SELECT r.*, c.name as church_name 
    FROM reviews r 
    JOIN churches c ON r.church_id = c.id 
    WHERE r.is_approved = 0 
    ORDER BY r.created_at DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// GET /api/reviews/all - получить все отзывы (только админ)
router.get('/all', authenticateToken, (req, res) => {
  db.all(`
    SELECT r.*, c.name as church_name 
    FROM reviews r 
    JOIN churches c ON r.church_id = c.id 
    ORDER BY r.created_at DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// POST /api/reviews - добавить отзыв
router.post('/',
  body('church_id').isInt().withMessage('ID храма обязателен'),
  body('author_name').notEmpty().withMessage('Имя обязательно'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг от 1 до 5'),
  body('text').notEmpty().withMessage('Текст отзыва обязателен'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { church_id, author_name, rating, text } = req.body;
    
    db.run(
      'INSERT INTO reviews (church_id, author_name, rating, text, is_approved) VALUES (?, ?, ?, ?, 0)',
      [church_id, author_name, rating, text],
      function(err) {
        if (err) {
          console.error('Ошибка:', err);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
          id: this.lastID, 
          message: 'Отзыв отправлен на модерацию' 
        });
      }
    );
  }
);

// PUT /api/reviews/:id/approve - одобрить отзыв (только админ)
router.put('/:id/approve', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE reviews SET is_approved = 1 WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Отзыв не найден' });
    res.json({ message: 'Отзыв одобрен' });
  });
});

// DELETE /api/reviews/:id - удалить отзыв (только админ)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM reviews WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Отзыв не найден' });
    res.json({ message: 'Отзыв удалён' });
  });
});

module.exports = router;