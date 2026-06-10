// backend/routes/schedule.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/schedule/church/:churchId - получить расписание для храма
router.get('/church/:churchId', (req, res) => {
  const { churchId } = req.params;
  
  db.all(
    `SELECT id, service_type, day_of_week, service_date, time, notes 
     FROM schedule 
     WHERE church_id = ? 
     ORDER BY 
       CASE 
         WHEN day_of_week IS NOT NULL THEN 
           CASE day_of_week 
             WHEN 0 THEN 7 
             ELSE day_of_week 
           END
         ELSE 8
       END, time`,
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

// GET /api/schedule - получить всё расписание
router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT s.*, c.name as church_name 
     FROM schedule s 
     JOIN churches c ON s.church_id = c.id 
     ORDER BY s.church_id, s.day_of_week, s.time`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    }
  );
});

// POST /api/schedule - добавить расписание
router.post('/',
  authenticateToken,
  body('church_id').isInt().withMessage('ID храма обязателен'),
  body('service_type').notEmpty().withMessage('Тип службы обязателен'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Неверный формат времени'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { church_id, service_type, day_of_week, service_date, time, notes } = req.body;
    
    db.run(
      `INSERT INTO schedule (church_id, service_type, day_of_week, service_date, time, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [church_id, service_type, day_of_week || null, service_date || null, time, notes || null],
      function(err) {
        if (err) {
          console.error('Ошибка вставки:', err);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
          id: this.lastID, 
          message: 'Расписание добавлено' 
        });
      }
    );
  }
);

// PUT /api/schedule/:id - обновить расписание
router.put('/:id',
  authenticateToken,
  (req, res) => {
    const { id } = req.params;
    const { service_type, day_of_week, service_date, time, notes } = req.body;
    
    db.run(
      `UPDATE schedule 
       SET service_type = ?, day_of_week = ?, service_date = ?, time = ?, notes = ?
       WHERE id = ?`,
      [service_type, day_of_week || null, service_date || null, time, notes || null, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Расписание не найдено' });
        }
        res.json({ message: 'Расписание обновлено' });
      }
    );
  }
);

// DELETE /api/schedule/:id - удалить расписание
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM schedule WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Расписание не найдено' });
    }
    res.json({ message: 'Расписание удалено' });
  });
});

module.exports = router;