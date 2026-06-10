// src/pages/ChurchDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReviewsSection from '../components/feedback/ReviewsSection';

export default function ChurchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetchChurchData();
  }, [id]);

  const fetchChurchData = async () => {
    try {
      setLoading(true);
      const churchResponse = await fetch(`http://localhost:5000/api/churches/${id}`);
      if (!churchResponse.ok) throw new Error('Храм не найден');
      const churchData = await churchResponse.json();
      setChurch(churchData);

      const scheduleResponse = await fetch(`http://localhost:5000/api/schedule/church/${id}`);
      let scheduleData = await scheduleResponse.json();
      setSchedule(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="loader"></div>
        <p>Загрузка информации о храме...</p>
      </div>
    );
  }

  if (error || !church) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>❌ Храм не найден</h2>
        <p>{error || 'Информация о храме временно недоступна'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          ← Вернуться на главную
        </button>
      </div>
    );
  }

  const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="church-detail-page"
    >
      {/* Hero секция */}
      <div className="church-hero">
        <img
          src={church.image_url || 'https://via.placeholder.com/1200x400?text=Храм'}
          alt={church.name}
          className="church-hero-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x400?text=Православный+храм';
          }}
        />
        <div className="church-hero-overlay">
          <div className="container">
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="church-title"
            >
              {church.name}
            </motion.h1>
            {church.name_full && (
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="church-fullname"
              >
                {church.name_full}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="church-content">
          {/* Основная информация */}
          <div className="info-card">
            <h2>📋 Общая информация</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">📍 Адрес:</span>
                <span className="info-value">{church.address}</span>
              </div>
              {church.phone && (
                <div className="info-item">
                  <span className="info-label">📞 Телефон:</span>
                  <span className="info-value">
                    <a href={`tel:${church.phone}`}>{church.phone}</a>
                  </span>
                </div>
              )}
              {church.email && (
                <div className="info-item">
                  <span className="info-label">✉️ Email:</span>
                  <span className="info-value">
                    <a href={`mailto:${church.email}`}>{church.email}</a>
                  </span>
                </div>
              )}
              {church.website && (
                <div className="info-item">
                  <span className="info-label">🌐 Сайт:</span>
                  <span className="info-value">
                    <a href={church.website} target="_blank" rel="noopener noreferrer">{church.website}</a>
                  </span>
                </div>
              )}
              {church.abbot && (
                <div className="info-item">
                  <span className="info-label">👨‍🦳 Настоятель:</span>
                  <span className="info-value">{church.abbot}</span>
                </div>
              )}
            </div>
          </div>

          {/* Описание */}
          {church.description && (
            <div className="info-card">
              <h2>📖 Описание</h2>
              <p className="description-text">{church.description}</p>
            </div>
          )}

          {/* История */}
          {church.history && (
            <div className="info-card">
              <h2>📜 История храма</h2>
              <div className="history-text">
                {church.history.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Архитектура */}
          {church.architecture && (
            <div className="info-card">
              <h2>🏛️ Архитектура</h2>
              <p>{church.architecture}</p>
            </div>
          )}

          {/* Святыни */}
          {church.shrines && (
            <div className="info-card">
              <h2>🕯️ Святыни</h2>
              <p>{church.shrines}</p>
            </div>
          )}

          {/* Расписание богослужений */}
          {schedule.length > 0 && (
            <div className="info-card">
              <h2>📅 Расписание богослужений</h2>
              <div className="schedule-table">
                <table>
                  <thead>
                    <tr>
                      <th>День недели</th>
                      <th>Служба</th>
                      <th>Время</th>
                      <th>Примечание</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item) => (
                      <tr key={item.id}>
                        <td>{item.day_of_week !== undefined && item.day_of_week !== null ? daysOfWeek[item.day_of_week] : item.service_date || '—'}</td>
                        <td>{item.service_type}</td>
                        <td>{item.time}</td>
                        <td>{item.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Карта из iframe (приоритет) */}
          {church.map_iframe && (
            <div className="info-card">
              <h2>🗺️ Карта храма</h2>
              <div className="map-container">
                <div 
                  dangerouslySetInnerHTML={{ __html: church.map_iframe }}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          )}
          
          {/* Карта по координатам (если нет iframe, но есть координаты) */}
          {!church.map_iframe && church.lat && church.lng && (
            <div className="info-card">
              <h2>🗺️ Расположение на карте</h2>
              <div className="map-container">
                <iframe
                  title="Карта храма"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '12px' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${church.lng - 0.01},${church.lat - 0.01},${church.lng + 0.01},${church.lat + 0.01}&layer=mapnik&marker=${church.lat},${church.lng}`}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* ========== ОТЗЫВЫ - ТОЛЬКО ОДИН РАЗ ========== */}
          <ReviewsSection churchId={id} />
          {/* ========================================== */}

          {/* Карта */}
          {church.lat && church.lng && (
            <div className="info-card">
              <h2>🗺️ Расположение на карте</h2>
              <div className="map-container">
                <iframe
                  title="Карта храма"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '12px' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${church.lng - 0.01},${church.lat - 0.01},${church.lng + 0.01},${church.lat + 0.01}&layer=mapnik&marker=${church.lat},${church.lng}`}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Кнопка возврата */}
          <button
            onClick={() => navigate('/')}
            className="btn back-button"
          >
            ← Вернуться к списку храмов
          </button>
        </div>
      </div>

      <style>{`
        .church-detail-page {
          background: var(--bg-color);
          min-height: 100vh;
        }

        .church-hero {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .church-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .church-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .church-title {
          font-size: 3rem;
          color: white;
          text-align: center;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .church-fullname {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          text-align: center;
        }

        .church-content {
          margin-top: -50px;
          position: relative;
          z-index: 1;
        }

        .info-card {
          background: var(--bg-color);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid var(--border-color);
        }

        .info-card h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: var(--primary-color);
          border-left: 4px solid var(--primary-color);
          padding-left: 15px;
        }

        .info-list {
          display: grid;
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .info-label {
          font-weight: bold;
          min-width: 120px;
          color: var(--text-color);
        }

        .info-value {
          color: var(--text-light);
          flex: 1;
        }

        .info-value a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .description-text, .history-text p {
          line-height: 1.8;
          color: var(--text-color);
          margin-bottom: 15px;
        }

        .schedule-table {
          overflow-x: auto;
        }

        .schedule-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .schedule-table th,
        .schedule-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .schedule-table th {
          background: var(--bg-light);
          font-weight: bold;
          color: var(--primary-color);
        }

        .map-container {
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
        }

        .back-button {
          width: 100%;
          margin: 20px 0;
          padding: 15px;
          font-size: 1.1rem;
        }

        .loader {
          border: 4px solid var(--border-color);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .church-hero {
            height: 300px;
          }
          .church-title {
            font-size: 2rem;
          }
          .info-card {
            padding: 20px;
          }
          .info-card h2 {
            font-size: 1.5rem;
          }
          .map-container {
            height: 300px;
          }
        }
      `}</style>
    </motion.div>
  );
}