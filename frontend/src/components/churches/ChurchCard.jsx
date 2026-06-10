// src/components/churches/ChurchCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChurchCard({ church }) {
  const navigate = useNavigate();

  return (
    <div className="church-card" onClick={() => navigate(`/church/${church.id}`)}>
      <img
        src={church.image_url || 'https://via.placeholder.com/400x250?text=Храм'}
        alt={church.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
        }}
      />
      <div style={{ padding: '1rem' }}>
        <h3>{church.name}</h3>
        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
          📍 {church.address}
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          {church.description?.substring(0, 100)}...
        </p>
      </div>
    </div>
  );
}