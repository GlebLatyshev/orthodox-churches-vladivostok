const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: 'Неверные учётные данные' });
      
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) return res.status(401).json({ error: 'Неверные учётные данные' });
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    });
  }
);

// POST /api/auth/register (для создания первого админа, защищено)
router.post('/register', (req, res) => {
  // Только для первого запуска, можно отключить
  const { email, password, secret } = req.body;
  
  if (secret !== process.env.REGISTER_SECRET && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existing) => {
    if (existing) return res.status(400).json({ error: 'Пользователь уже существует' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', 
      [email, hashedPassword],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Администратор создан' });
      }
    );
  });
});

module.exports = router;