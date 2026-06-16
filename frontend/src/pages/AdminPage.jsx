// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('churches');
  const [churches, setChurches] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Состояния для отзывов
  const [pendingReviews, setPendingReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsTab, setReviewsTab] = useState('pending');
  
  // Форма для храма
  const [churchForm, setChurchForm] = useState({
    name: '', name_full: '', address: '', description: '',
    history: '', architecture: '', shrines: '', abbot: '',
    phone: '', email: '', website: '', image_url: '', lat: '', lng: ''
    
  });

  // Форма для расписания
  const [scheduleForm, setScheduleForm] = useState({
    church_id: '', service_type: '', day_of_week: '', time: '', notes: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Загрузка данных в зависимости от активной вкладки
  const loadData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      if (activeTab === 'churches') {
        const response = await fetch('http://localhost:5000/api/churches?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setChurches(data.churches || []);
      } 
      else if (activeTab === 'schedule') {
        const churchesRes = await fetch('http://localhost:5000/api/churches?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const churchesData = await churchesRes.json();
        
        let allSchedule = [];
        for (const church of (churchesData.churches || [])) {
          const scheduleRes = await fetch(`http://localhost:5000/api/schedule/church/${church.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const scheduleData = await scheduleRes.json();
          allSchedule = [...allSchedule, ...scheduleData.map(s => ({ ...s, church_name: church.name }))];
        }
        setSchedule(allSchedule);
      }
      else if (activeTab === 'reviews') {
        await loadReviews();
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка отзывов
  const loadReviews = async () => {
    const token = localStorage.getItem('token');
    try {
      if (reviewsTab === 'pending') {
        const response = await fetch('http://localhost:5000/api/reviews/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setPendingReviews(Array.isArray(data) ? data : []);
      } else {
        const response = await fetch('http://localhost:5000/api/reviews/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAllReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  // CRUD операции для храмов
  const handleChurchSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = editingItem 
        ? `http://localhost:5000/api/churches/${editingItem.id}`
        : 'http://localhost:5000/api/churches';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(churchForm)
      });
      
      if (response.ok) {
        alert(editingItem ? 'Храм обновлён!' : 'Храм добавлен!');
        setShowForm(false);
        setEditingItem(null);
        setChurchForm({
          name: '', name_full: '', address: '', description: '',
          history: '', architecture: '', shrines: '', abbot: '',
          phone: '', email: '', website: '', image_url: '', lat: '', lng: ''
        });
        loadData();
      } else {
        const error = await response.json();
        alert('Ошибка: ' + JSON.stringify(error));
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleChurchDelete = async (id) => {
    if (!window.confirm('Удалить этот храм? Это также удалит расписание и отзывы.')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/churches/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Храм удалён');
        loadData();
      } else {
        alert('Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleChurchEdit = (church) => {
    setEditingItem(church);
    setChurchForm({
      name: church.name || '',
      name_full: church.name_full || '',
      address: church.address || '',
      description: church.description || '',
      history: church.history || '',
      architecture: church.architecture || '',
      shrines: church.shrines || '',
      abbot: church.abbot || '',
      phone: church.phone || '',
      email: church.email || '',
      website: church.website || '',
      image_url: church.image_url || '',
      lat: church.lat || '',
      lng: church.lng || ''
    });
    setShowForm(true);
  };

  // Управление расписанием
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scheduleForm)
      });
      
      if (response.ok) {
        alert('Расписание добавлено!');
        setScheduleForm({ church_id: '', service_type: '', day_of_week: '', time: '', notes: '' });
        loadData();
      } else {
        alert('Ошибка добавления');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleScheduleDelete = async (id) => {
    if (!window.confirm('Удалить расписание?')) return;
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Расписание удалено');
        loadData();
      } else {
        alert('Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при удалении');
    }
  };

  // Управление отзывами
  const handleApproveReview = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Отзыв одобрен');
        loadReviews();
        loadData();
      } else {
        alert('Ошибка при одобрении');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при одобрении');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Удалить отзыв?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Отзыв удалён');
        loadReviews();
        loadData();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>🙏 Админ-панель</h1>
        <p>Добро пожаловать, {user?.email}!</p>
      </div>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setActiveTab('churches'); setShowForm(false); }}
          style={{
            padding: '10px 20px',
            background: activeTab === 'churches' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'churches' ? 'white' : 'var(--text-color)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🏛️ Храмы
        </button>
        <button
          onClick={() => { setActiveTab('schedule'); setShowForm(false); }}
          style={{
            padding: '10px 20px',
            background: activeTab === 'schedule' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'schedule' ? 'white' : 'var(--text-color)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📅 Расписание
        </button>
        <button
          onClick={() => { setActiveTab('reviews'); loadReviews(); setShowForm(false); }}
          style={{
            padding: '10px 20px',
            background: activeTab === 'reviews' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'reviews' ? 'white' : 'var(--text-color)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          💬 Отзывы
        </button>
      </div>

      {/* Управление храмами */}
      {activeTab === 'churches' && (
        <>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(true); setEditingItem(null); }}
            style={{ marginBottom: '20px' }}
          >
            + Добавить храм
          </button>

          {showForm && (
            <>
              <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--bg-color)',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                zIndex: 1000
              }}>
                <h2>{editingItem ? 'Редактировать храм' : 'Добавить храм'}</h2>
                <form onSubmit={handleChurchSubmit}>
                  <input type="text" name="name" placeholder="Название *" value={churchForm.name} onChange={(e) => setChurchForm({...churchForm, name: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <input type="text" name="name_full" placeholder="Полное название" value={churchForm.name_full} onChange={(e) => setChurchForm({...churchForm, name_full: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <input type="text" name="address" placeholder="Адрес *" value={churchForm.address} onChange={(e) => setChurchForm({...churchForm, address: e.target.value})} required style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <textarea name="description" placeholder="Описание" value={churchForm.description} onChange={(e) => setChurchForm({...churchForm, description: e.target.value})} rows="3" style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <textarea name="history" placeholder="История" value={churchForm.history} onChange={(e) => setChurchForm({...churchForm, history: e.target.value})} rows="3" style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <input type="text" name="phone" placeholder="Телефон" value={churchForm.phone} onChange={(e) => setChurchForm({...churchForm, phone: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <input type="email" name="email" placeholder="Email" value={churchForm.email} onChange={(e) => setChurchForm({...churchForm, email: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  <input type="url" name="image_url" placeholder="URL изображения" value={churchForm.image_url} onChange={(e) => setChurchForm({...churchForm, image_url: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                  
                  {/* Поле для карты */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      🗺️ Карта (iframe код)
                    </label>
                    <textarea
                      name="map_iframe"
                      placeholder='<iframe src="https://www.google.com/maps/embed?pb=!1m18..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                      value={churchForm.map_iframe}
                      onChange={(e) => setChurchForm({...churchForm, map_iframe: e.target.value})}
                      rows="4"
                      style={{ width: '100%', marginBottom: '10px', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                      Вставьте iframe код карты с Google Maps или Яндекс.Карт
                    </small>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                    <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ background: '#ccc' }}>Отмена</button>
                  </div>
                </form>
              </div>
              <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 999
              }} onClick={() => setShowForm(false)} />
            </>
          )}

          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {churches.map(church => (
                <div key={church.id} style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <h3>{church.name}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>{church.address}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleChurchEdit(church)} className="btn" style={{ background: '#2196F3', color: 'white' }}>✏️</button>
                    <button onClick={() => handleChurchDelete(church.id)} className="btn" style={{ background: '#f44336', color: 'white' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Управление расписанием - ТОЛЬКО ОДНА ФОРМА */}
      {activeTab === 'schedule' && (
        <>
          <div style={{ marginBottom: '30px', padding: '20px', background: 'var(--bg-light)', borderRadius: '8px' }}>
            <h3>➕ Добавить расписание</h3>
            <form onSubmit={handleScheduleSubmit} style={{ display: 'grid', gap: '10px' }}>
              <select value={scheduleForm.church_id} onChange={(e) => setScheduleForm({...scheduleForm, church_id: e.target.value})} required style={{ padding: '10px' }}>
                <option value="">Выберите храм</option>
                {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Тип службы (Литургия, Всенощная...)" value={scheduleForm.service_type} onChange={(e) => setScheduleForm({...scheduleForm, service_type: e.target.value})} required style={{ padding: '10px' }} />
              <select value={scheduleForm.day_of_week} onChange={(e) => setScheduleForm({...scheduleForm, day_of_week: e.target.value})} style={{ padding: '10px' }}>
                <option value="">День недели</option>
                <option value="0">Воскресенье</option>
                <option value="1">Понедельник</option>
                <option value="2">Вторник</option>
                <option value="3">Среда</option>
                <option value="4">Четверг</option>
                <option value="5">Пятница</option>
                <option value="6">Суббота</option>
              </select>
              <input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} required style={{ padding: '10px' }} />
              <input type="text" placeholder="Примечания" value={scheduleForm.notes} onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})} style={{ padding: '10px' }} />
              <button type="submit" className="btn btn-primary">➕ Добавить расписание</button>
            </form>
          </div>

          <h3>📋 Существующее расписание</h3>
          {schedule.length === 0 ? (
            <p>Нет расписания</p>
          ) : (
            schedule.map(item => (
              <div key={item.id} style={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{item.church_name}</strong><br />
                  {item.service_type} - {item.time}
                  {item.notes && <span style={{ color: 'var(--text-light)', marginLeft: '10px' }}>({item.notes})</span>}
                </div>
                <button onClick={() => handleScheduleDelete(item.id)} className="btn" style={{ background: '#f44336', color: 'white' }}>🗑️ Удалить</button>
              </div>
            ))
          )}
        </>
      )}

      {/* Управление отзывами */}
      {activeTab === 'reviews' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={() => { setReviewsTab('pending'); loadReviews(); }} 
              className="btn" 
              style={{ 
                background: reviewsTab === 'pending' ? 'var(--primary-color)' : 'transparent', 
                color: reviewsTab === 'pending' ? 'white' : 'var(--text-color)' 
              }}
            >
              На модерации ({pendingReviews.length})
            </button>
            <button 
              onClick={() => { setReviewsTab('all'); loadReviews(); }} 
              className="btn" 
              style={{ 
                background: reviewsTab === 'all' ? 'var(--primary-color)' : 'transparent', 
                color: reviewsTab === 'all' ? 'white' : 'var(--text-color)' 
              }}
            >
              Все отзывы ({allReviews.length})
            </button>
          </div>

          {(reviewsTab === 'pending' ? pendingReviews : allReviews).length === 0 ? (
            <p>Нет отзывов</p>
          ) : (
            (reviewsTab === 'pending' ? pendingReviews : allReviews).map(review => (
              <div key={review.id} style={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong>{review.author_name}</strong>
                    <div>⭐ {review.rating}/5</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{review.church_name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {reviewsTab === 'pending' && (
                      <button onClick={() => handleApproveReview(review.id)} className="btn" style={{ background: '#4CAF50', color: 'white' }}>✅ Одобрить</button>
                    )}
                    <button onClick={() => handleDeleteReview(review.id)} className="btn" style={{ background: '#f44336', color: 'white' }}>🗑️ Удалить</button>
                  </div>
                </div>
                <p style={{ marginTop: '10px' }}>{review.text}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '10px' }}>
                  {new Date(review.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
