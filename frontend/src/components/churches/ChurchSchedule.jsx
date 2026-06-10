// src/components/churches/ChurchSchedule.jsx
import React from 'react';

export default function ChurchSchedule({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return <p>Расписание временно отсутствует</p>;
  }

  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  return (
    <section>
      <h2>📅 Расписание богослужений</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>День</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Служба</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Время</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Примечание</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem' }}>{days[item.day_of_week] || item.service_date}</td>
                <td style={{ padding: '0.5rem' }}>{item.service_type}</td>
                <td style={{ padding: '0.5rem' }}>{item.time}</td>
                <td style={{ padding: '0.5rem' }}>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}