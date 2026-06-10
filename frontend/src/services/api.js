// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Получение списка храмов
export const getChurches = async (params = {}) => {
  const response = await api.get('/churches', { params });
  return response.data;
};

// Получение одного храма
export const getChurch = async (id) => {
  const response = await api.get(`/churches/${id}`);
  return response.data;
};

// Отправка обратной связи
export const sendFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

// Получение отзывов
export const getReviews = async (churchId) => {
  const response = await api.get(`/reviews/church/${churchId}`);
  return response.data;
};

// Добавление отзыва
export const addReview = async (data) => {
  const response = await api.post('/reviews', data);
  return response.data;
};

// Авторизация
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Выход
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;