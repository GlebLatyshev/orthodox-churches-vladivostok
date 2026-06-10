// src/components/churches/ChurchFilter.jsx
import React from 'react';

export default function ChurchFilter({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Все храмы</option>
      <option value="собор">Соборы</option>
      <option value="церковь">Церкви</option>
      <option value="часовня">Часовни</option>
    </select>
  );
}