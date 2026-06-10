// src/components/feedback/ReviewsSection.jsx
import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUser, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function ReviewsSection({ churchId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 5,
    text: ''
  });

  useEffect(() => {
    loadReviews();
  }, [churchId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/reviews/church/${churchId}`);
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          church_id: parseInt(churchId)
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ author_name: '', rating: 5, text: '' });
        setShowForm(false);
        loadReviews(); // Обновляем список отзывов
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        const error = await response.json();
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const StarRating = ({ rating, interactive = false, onRatingClick }) => {
    return (
      <div style={{ display: 'flex', gap: '5px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRatingClick(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '1.5rem',
              color: star <= rating ? '#FFD700' : '#ddd',
              transition: 'transform 0.2s',
              transform: interactive && star <= rating ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="spinner"></div>
        <p>Загрузка отзывов...</p>
      </div>
    );
  }

  const avgRating = getAverageRating();
  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>💬 Отзывы прихожан</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖️ Отмена' : '✍️ Оставить отзыв'}
        </button>
      </div>

      {/* Форма добавления отзыва */}
      {showForm && (
        <div className="review-form-container">
          <h3>Оставить отзыв о храме</h3>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Ваше имя *</label>
              <input
                type="text"
                placeholder="Как к вам обращаться?"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Ваша оценка *</label>
              <StarRating rating={formData.rating} interactive={true} onRatingClick={handleRatingClick} />
              <div className="rating-labels">
                <span>Ужасно</span>
                <span>Плохо</span>
                <span>Средне</span>
                <span>Хорошо</span>
                <span>Отлично</span>
              </div>
            </div>

            <div className="form-group">
              <label>Ваш отзыв *</label>
              <textarea
                placeholder="Поделитесь впечатлениями о храме..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows="5"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить отзыв'}
            </button>

            {submitStatus === 'success' && (
              <div className="success-message">
                <FaCheckCircle /> Спасибо за отзыв! Он будет опубликован после модерации.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="error-message">
                Ошибка при отправке отзыва. Попробуйте позже.
              </div>
            )}
          </form>
        </div>
      )}

      {/* Статистика отзывов */}
      {totalReviews > 0 && (
        <div className="reviews-stats">
          <div className="stats-summary">
            <div className="average-rating">
              <span className="rating-number">{avgRating}</span>
              <div className="rating-stars">
                <StarRating rating={Math.round(avgRating)} />
              </div>
              <span className="total-reviews">на основе {totalReviews} {totalReviews === 1 ? 'отзыва' : totalReviews < 5 ? 'отзывов' : 'отзывов'}</span>
            </div>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = distribution[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="distribution-bar">
                  <span className="rating-label">{rating} ★</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Список отзывов */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>📝 Пока нет отзывов. Будьте первым, кто поделится впечатлениями!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <h4>{review.author_name}</h4>
                    <div className="review-meta">
                      <StarRating rating={review.rating} />
                      <span className="review-date">
                        <FaCalendarAlt /> {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-content">
                <p>{review.text}</p>
              </div>
              <div className="review-footer">
                <span className="review-badge">✓ Проверенный отзыв</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .reviews-section {
          margin: 40px 0;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .reviews-header h2 {
          font-size: 1.8rem;
          color: var(--text-color);
        }

        .review-form-container {
          background: var(--bg-light);
          padding: 25px;
          border-radius: 16px;
          margin-bottom: 30px;
          border: 1px solid var(--border-color);
        }

        .review-form-container h3 {
          margin-bottom: 20px;
          color: var(--text-color);
        }

        .review-form .form-group {
          margin-bottom: 20px;
        }

        .review-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
        }

        .review-form input,
        .review-form textarea {
          width: 100%;
          max-width: 1108px;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-color);
          font-size: 1rem;
        }

        .review-form input:focus,
        .review-form textarea:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .rating-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .reviews-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          background: var(--bg-light);
          padding: 25px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .stats-summary {
          text-align: center;
        }

        .average-rating .rating-number {
          font-size: 3rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        .average-rating .rating-stars {
          margin: 10px 0;
        }

        .total-reviews {
          display: block;
          font-size: 0.9rem;
          color: var(--text-light);
          margin-top: 5px;
        }

        .distribution-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .rating-label {
          width: 50px;
          font-size: 0.9rem;
        }

        .bar-container {
          flex: 1;
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: var(--primary-color);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .rating-count {
          width: 40px;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .reviews-list {
          display: grid;
          gap: 20px;
        }

        .review-card {
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .review-header {
          margin-bottom: 15px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .reviewer-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .reviewer-info h4 {
          margin: 0 0 5px 0;
          color: var(--text-color);
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .review-date {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .review-content {
          margin: 15px 0;
          line-height: 1.6;
          color: var(--text-color);
        }

        .review-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 15px;
        }

        .review-badge {
          font-size: 0.85rem;
          color: var(--primary-color);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .no-reviews {
          text-align: center;
          padding: 40px;
          background: var(--bg-light);
          border-radius: 16px;
          color: var(--text-light);
        }

        .reviews-loading {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border-color);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-message {
          margin-top: 15px;
          padding: 12px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .error-message {
          margin-top: 15px;
          padding: 12px;
          background: #ffebee;
          color: #c62828;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .reviews-stats {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .reviews-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .reviewer-info {
            flex-wrap: wrap;
          }
          
          .review-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}