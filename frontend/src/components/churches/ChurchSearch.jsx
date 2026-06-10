// src/components/churches/ChurchSearch.jsx
import React from 'react';

export default function ChurchSearch({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="🔍 Поиск храмов..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ flex: 1, minWidth: '200px' }}
    />
  );
}