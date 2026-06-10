// backend/routes/churches.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

// GET /api/churches - получение списка храмов с пагинацией и фильтрацией
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT id, name, address, description, image_url, created_at 
    FROM churches 
    WHERE name LIKE ? OR address LIKE ? OR description LIKE ?
    ORDER BY name
    LIMIT ? OFFSET ?
  `;
  
  const searchPattern = `%${search}%`;
  
  db.get(
    `SELECT COUNT(*) as total FROM churches WHERE name LIKE ? OR address LIKE ? OR description LIKE ?`,
    [searchPattern, searchPattern, searchPattern],
    (err, countResult) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.all(query, [searchPattern, searchPattern, searchPattern, limit, offset], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
          churches: rows,
          pagination: {
            page,
            limit,
            total: countResult.total,
            pages: Math.ceil(countResult.total / limit)
          }
        });
      });
    }
  );
});

// GET /api/churches/:id - получение одного храма
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM churches WHERE id = ?', [id], (err, church) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!church) return res.status(404).json({ error: 'Храм не найден' });
    
    // Получаем расписание
    db.all(
      `SELECT id, service_type, day_of_week, service_date, time, notes 
       FROM schedule WHERE church_id = ? 
       ORDER BY day_of_week, time`,
      [id],
      (err, schedule) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Получаем отзывы
        db.all(
          `SELECT id, author_name, rating, text, created_at 
           FROM reviews WHERE church_id = ? AND is_approved = 1 
           ORDER BY created_at DESC`,
          [id],
          (err, reviews) => {
            if (err) return res.status(500).json({ error: err.message });
            
            church.schedule = schedule || [];
            church.reviews = reviews || [];
            res.json(church);
          }
        );
      }
    );
  });
});

// POST /api/churches - создание храма (только админ)
router.post('/',
  authenticateToken,
  body('name').notEmpty().withMessage('Название обязательно'),
  body('address').notEmpty().withMessage('Адрес обязателен'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      name, name_full, address, description, history,
      architecture, shrines, abbot, phone, email,
      website, image_url, gallery, lat, lng, map_iframe
    } = req.body;
    
    db.run(`
      INSERT INTO churches (
        name, name_full, address, description, history,
        architecture, shrines, abbot, phone, email,
        website, image_url, gallery, lat, lng, map_iframe
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, name_full, address, description, history,
      architecture, shrines, abbot, phone, email,
      website, image_url, JSON.stringify(gallery || []), 
      lat, lng, map_iframe
    ], function(err) {
      if (err) {
        console.error('Ошибка создания храма:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        id: this.lastID, 
        message: 'Храм создан' 
      });
    });
  }
);

// PUT /api/churches/:id - обновление храма
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    name, name_full, address, description, history,
    architecture, shrines, abbot, phone, email,
    website, image_url, gallery, lat, lng, map_iframe
  } = req.body;
  
  db.run(`
    UPDATE churches 
    SET name = ?, name_full = ?, address = ?, description = ?, 
        history = ?, architecture = ?, shrines = ?, abbot = ?,
        phone = ?, email = ?, website = ?, image_url = ?, 
        gallery = ?, lat = ?, lng = ?, map_iframe = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    name, name_full, address, description, history,
    architecture, shrines, abbot, phone, email,
    website, image_url, JSON.stringify(gallery || []),
    lat, lng, map_iframe, id
  ], function(err) {
    if (err) {
      console.error('Ошибка обновления храма:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Храм не найден' });
    }
    res.json({ message: 'Храм обновлён' });
  });
});

// DELETE /api/churches/:id - удаление храма
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM churches WHERE id = ?', id, function(err) {
    if (err) {
      console.error('Ошибка удаления храма:', err);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Храм не найден' });
    }
    res.json({ message: 'Храм удалён' });
  });
});

module.exports = router;