
import React, { useState, useEffect } from 'react';

export default function ScheduleManager({ churches }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    church_id: '',
    service_type: '',
    day_of_week: '',
    service_date: '',
    time: '',
    notes: ''
  });

  const daysOfWeek = [
    { value: 0, label: 'Воскресенье' },
    { value: 1, label: 'Понедельник' },
    { value: 2, label: 'Вторник' },
    { value: 3, label: 'Среда' },
    { value: 4, label: 'Четверг' },
    { value: 5, label: 'Пятница' },
    { value: 6, label: 'Суббота' }
  ];

  const serviceTypes = [
    'Божественная литургия',
    'Всенощное бдение',
    'Утреня',
    'Вечерня',
    'Часы',
    'Молебен',
    'Панихида',
    'Крещение',
    'Венчание',
    'Исповедь',
    'Соборование',
    'Акафист'
  ];

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/schedule', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSchedule(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = editingItem 
        ? `http://localhost:5000/api/schedule/${editingItem.id}`
        : 'http://localhost:5000/api/schedule';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert(editingItem ? 'Расписание обновлено!' : 'Расписание добавлено!');
        setShowForm(false);
        setEditingItem(null);
        setFormData({
          church_id: '', service_type: '', day_of_week: '',
          service_date: '', time: '', notes: ''
        });
        loadSchedule();
      } else {
        const error = await response.json();
        alert('Ошибка: ' + (error.error || 'Не удалось сохранить'));
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить расписание?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Расписание удалено');
        loadSchedule();
      } else {
        alert('Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      church_id: item.church_id,
      service_type: item.service_type,
      day_of_week: item.day_of_week !== null ? item.day_of_week : '',
      service_date: item.service_date || '',
      time: item.time,
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const getChurchName = (churchId) => {
    const church = churches.find(c => c.id === churchId);
    return church ? church.name : 'Неизвестный храм';
  };

  const getDayName = (dayOfWeek) => {
    const day = daysOfWeek.find(d => d.value === dayOfWeek);
    return day ? day.label : 'По дате';
  };

  if (loading) return <p>Загрузка расписания...</p>;

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          setEditingItem(null);
          setFormData({
            church_id: '', service_type: '', day_of_week: '',
            service_date: '', time: '', notes: ''
          });
          setShowForm(true);
        }}
        style={{ marginBottom: '20px' }}
      >
        + Добавить расписание
      </button>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-color)',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          zIndex: 1000,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginBottom: '20px' }}>
            {editingItem ? '✏️ Редактировать расписание' : '➕ Добавить расписание'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <select
              value={formData.church_id}
              onChange={(e) => setFormData({ ...formData, church_id: parseInt(e.target.value) })}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            >
              <option value="">Выберите храм</option>
              {churches.map(church => (
                <option key={church.id} value={church.id}>{church.name}</option>
              ))}
            </select>

            <select
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              required
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            >
              <option value="">Выберите тип службы</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>День недели:</label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value ? parseInt(e.target.value) : '' })}
                style={{ width: '100%', padding: '10px' }}
              >
                <option value="">Выберите день недели</option>
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Или конкретная дата:</label>
              <input
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                style={{ width: '100%', padding: '10px' }}
              />
            </div>

            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              placeholder="Время"
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Примечания (например: 'Каждую субботу')"
              style={{ width: '100%', marginBottom: '20px', padding: '10px' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Сохранить' : 'Добавить'}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                style={{ background: '#ccc' }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Список расписания */}
      {schedule.length === 0 ? (
        <p>Нет добавленного расписания</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {schedule.map(item => (
            <div
              key={item.id}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '1.1rem' }}>{getChurchName(item.church_id)}</strong>
                <div style={{ marginTop: '5px' }}>
                  <span style={{ color: 'var(--primary-color)' }}>{item.service_type}</span>
                  <span style={{ margin: '0 10px' }}>•</span>
                  <span>{getDayName(item.day_of_week)}</span>
                  {item.service_date && <span> ({item.service_date})</span>}
                  <span style={{ margin: '0 10px' }}>•</span>
                  <strong>{item.time}</strong>
                  {item.notes && <span style={{ color: 'var(--text-light)', marginLeft: '10px' }}>({item.notes})</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(item)}
                  className="btn"
                  style={{ background: '#2196F3', color: 'white' }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn"
                  style={{ background: '#f44336', color: 'white' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}