const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Безопасность
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ваш-домен.ru']
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});
app.use('/api/', limiter);

// Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Подключение БД - ВАЖНО: db подключается, но не используется напрямую в этом файле
const db = require('./config/database');

// Маршруты - проверяем существование каждого файла
const fs = require('fs');
const routesDir = './routes';



// Функция для безопасного подключения маршрутов
const mountRoute = (routePath, routeName) => {
  const fullPath = path.join(__dirname, routePath);
  if (fs.existsSync(fullPath)) {
    try {
      const route = require(fullPath);
      if (typeof route === 'function') {
        app.use(`/api/${routeName}`, route);
        console.log(`✅ Маршрут /api/${routeName} подключен`);
      } else {
        console.warn(`⚠️ Маршрут ${routeName} экспортирует не функцию`);
      }
    } catch (err) {
      console.error(`❌ Ошибка загрузки маршрута ${routeName}:`, err.message);
    }
  } else {
    console.warn(`⚠️ Файл маршрута ${routePath} не найден`);
    // Создаем временный маршрут-заглушку
    const dummyRouter = express.Router();
    dummyRouter.get('/', (req, res) => {
      res.json({ message: `Маршрут ${routeName} временно недоступен` });
    });
    app.use(`/api/${routeName}`, dummyRouter);
    console.log(`🔄 Создан временный маршрут для /api/${routeName}`);
  }
};

// Подключаем маршруты
mountRoute('./routes/churches.js', 'churches');
mountRoute('./routes/feedback.js', 'feedback');
mountRoute('./routes/reviews.js', 'reviews');
mountRoute('./routes/schedule.js', 'schedule');
mountRoute('./routes/auth.js', 'auth');

// Тестовый маршрут для проверки работы сервера
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Сервер успешно запущен на порту ${PORT}`);
  console.log(`📝 Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Адрес: http://localhost:${PORT}`);
  console.log(`✅ Готов к работе!\n`);
});
