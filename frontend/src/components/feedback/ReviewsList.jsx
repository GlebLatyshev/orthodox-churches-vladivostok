// src/components/feedback/ReviewsList.jsx
import React, { useState, useEffect } from 'react';
import { getReviews, addReview } from '../../services/api';

export default function ReviewsList({ churchId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ author_name: '', rating: 5, text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [churchId]);

  const loadReviews = async () => {
    try {
      const data = await getReviews(churchId);
      setReviews(data);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({ ...newReview, church_id: churchId });
      setNewReview({ author_name: '', rating: 5, text: '' });
      loadReviews();
      alert('Спасибо за отзыв! Он будет опубликован после модерации.');
    } catch (error) {
      alert('Ошибка при отправке отзыва');
    }
  };

  if (loading) return <p>Загрузка отзывов...</p>;

  return (
    <section>
      <h2>💬 Отзывы прихожан</h2>
      
      {reviews.length === 0 ? (
        <p>Пока нет отзывов. Будьте первым!</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={{
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{review.author_name}</strong>
              <span>⭐ {review.rating}/5</span>
            </div>
            <p>{review.text}</p>
            <small style={{ color: 'var(--text-light)' }}>
              {new Date(review.created_at).toLocaleDateString('ru-RU')}
            </small>
          </div>
        ))
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Оставить отзыв</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={newReview.author_name}
            onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
            required
            style={{ marginBottom: '0.5rem' }}
          />
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            style={{ marginBottom: '0.5rem' }}
          >
            <option value={5}>⭐⭐⭐⭐⭐ - Отлично</option>
            <option value={4}>⭐⭐⭐⭐ - Хорошо</option>
            <option value={3}>⭐⭐⭐ - Средне</option>
            <option value={2}>⭐⭐ - Плохо</option>
            <option value={1}>⭐ - Ужасно</option>
          </select>
          <textarea
            placeholder="Ваш отзыв..."
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            required
            rows="4"
            style={{ marginBottom: '0.5rem' }}
          />
          <button type="submit" className="btn btn-primary">
            Отправить отзыв
          </button>
        </form>
      </div>
    </section>
  );
}