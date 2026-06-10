// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-color)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--primary-color)',
          textDecoration: 'none',
        }}>
          🕊️ Храмы Владивостока
        </Link>

        <nav style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <Link to="/" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Главная</Link>
          <Link to="/about" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>О проекте</Link>
          <Link to="/contacts" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Контакты</Link>
          
          {isAuthenticated && (
            <Link to="/admin" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Админ-панель</Link>
          )}
          
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-primary">
              Выйти
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}