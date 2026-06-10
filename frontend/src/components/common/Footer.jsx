// src/components/common/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-light)',
      padding: '2rem 0',
      marginTop: '4rem',
      borderTop: '1px solid var(--border-color)',
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p>© 2026 Православные храмы Владивостока</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
          Все права защищены. Информация о храмах регулярно обновляется.
        </p>
      </div>
    </footer>
  );
}