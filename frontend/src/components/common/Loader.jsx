// src/components/common/Loader.jsx
import React from 'react';

export default function Loader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid var(--border-color)',
        borderTopColor: 'var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}