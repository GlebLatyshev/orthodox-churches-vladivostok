// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Вход в админ-панель</h1>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '1rem' }}
        />
        
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Войти
        </button>
      </form>
    </div>
  );
}