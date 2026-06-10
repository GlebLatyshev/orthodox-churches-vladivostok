// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/churches');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setChurches(data.churches || []);
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
      // Тестовые данные на случай ошибки
      setChurches([
        {
          id: 1,
          name: 'Покровский кафедральный собор',
          address: 'ул. Пушкинская, 5',
          description: 'Главный православный храм Владивостока',
          image_url: 'https://via.placeholder.com/400x250?text=Покровский+собор'
        },
        {
          id: 2,
          name: 'Храм Успения Божией Матери',
          address: 'ул. Светланская, 65',
          description: 'Один из старейших храмов города',
          image_url: 'https://via.placeholder.com/400x250?text=Успенский+храм'
        },
        {
          id: 3,
          name: 'Храм Иоанна Кронштадтского',
          address: 'ул. Каплунова, 12',
          description: 'Храм на Корабельной набережной',
          image_url: 'https://via.placeholder.com/400x250?text=Иоанна+Кронштадтского'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loader"></div>
        <p>Загрузка храмов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>Ошибка: {error}</p>
        <button onClick={fetchChurches} className="btn btn-primary">
          Повторить загрузку
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
          🕊️ Православные храмы Владивостока
        </h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-light)' }}>
          Владивосток — город с богатой православной историей. 
          Здесь вы найдёте информацию о всех храмах города, их историю, 
          расписание богослужений и контакты.
        </p>
      </div>

      {churches.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Нет данных о храмах</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {churches.map((church) => (
            <Link 
              key={church.id} 
              to={`/church/${church.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="church-card" style={{
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                height: '100%'
              }}>
                <img
                  src={church.image_url || 'https://via.placeholder.com/400x250?text=Храм'}
                  alt={church.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250?text=Храм';
                  }}
                />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ marginBottom: '8px', color: 'var(--text-color)' }}>{church.name}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '8px' }}>
                    📍 {church.address}
                  </p>
                  <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
                    {church.description?.substring(0, 100)}...
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .church-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
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
      `}</style>
    </div>
  );
}