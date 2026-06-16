// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaChurch,
  FaHistory,
  FaMapMarkerAlt,
  FaUsers,
  FaHeart,
  FaCross,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGithub,
  FaTelegram,
  FaVk
} from 'react-icons/fa';
import { GiCrossFlare } from 'react-icons/gi';

export default function AboutPage() {
  const teamMembers = [
    { name: 'Захар Мякинко', role: 'Разработчик', icon: '👨‍💻' },
    
  ];

  const features = [
    { icon: <FaChurch />, title: 'Все храмы города', desc: 'Полный каталог православных храмов Владивостока с подробным описанием' },
    { icon: <FaHistory />, title: 'Исторические сведения', desc: 'Узнайте об истории создания и развития каждого храма' },
    { icon: <FaCalendarAlt />, title: 'Расписание служб', desc: 'Актуальное расписание богослужений и треб' },
    { icon: <FaMapMarkerAlt />, title: 'Интерактивная карта', desc: 'Удобная навигация и расположение храмов на карте города' },
    { icon: <FaUsers />, title: 'Отзывы прихожан', desc: 'Реальные отзывы и впечатления посетителей' },
    { icon: <FaHeart />, title: 'Духовная помощь', desc: 'Контакты настоятелей и информация о духовной поддержке' }
  ];

  const stats = [
    { number: '12+', label: 'Храмов', icon: '🏛️' },
    { number: '150+', label: 'Богослужений в неделю', icon: '📅' },
    { number: '1000+', label: 'Прихожан', icon: '👥' },
    { number: '1891', label: 'Год основания первой церкви', icon: '📜' }
  ];

  return (
    <div className="about-page">
      {/* Hero секция */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="about-hero"
      >
        <div className="about-hero-overlay">
          <div className="container">
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="about-title"
            >
              <GiCrossFlare className="title-icon" />
              О проекте
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="about-subtitle"
            >
              Православные храмы Владивостока — духовное сердце города
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Статистика */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="stat-card"
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* О проекте */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="about-content"
        >
          <div className="about-section">
            <h2 className="section-title">
              <FaCross className="section-icon" />
              Наша миссия
            </h2>
            <div className="mission-text">
              <p>
                Проект <strong>«Православные храмы Владивостока»</strong> создан с целью
                объединить информацию о всех православных храмах города в одном месте,
                сделать её доступной и понятной для каждого.
              </p>
              <p>
                Мы стремимся помочь жителям и гостям Владивостока найти ближайший храм,
                узнать расписание богослужений, познакомиться с историей и святынями,
                а также получить духовную поддержку.
              </p>
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">
              <FaHistory className="section-icon" />
              История создания
            </h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2026</div>
                <div className="timeline-content">
                  <h3>Запуск проекта</h3>
                  <p>Инициатива создания единого информационного портала о православных храмах Владивостока</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2026</div>
                <div className="timeline-content">
                  <h3>Сбор информации</h3>
                  <p>Начало систематизации данных о храмах: история, архитектура, контакты</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2026</div>
                <div className="timeline-content">
                  <h3>Разработка сайта</h3>
                  <p>Создание современного, удобного и информативного веб-ресурса</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">
              <FaChurch className="section-icon" />
              Что мы предлагаем
            </h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="feature-card"
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">
              <FaUsers className="section-icon" />
              Наша команда
            </h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="team-card"
                >
                  <div className="team-avatar">{member.icon}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">
              <FaHeart className="section-icon" />
              Наши ценности
            </h2>
            <div className="values-list">
              <div className="value-item">
                <div className="value-icon">📖</div>
                <div className="value-content">
                  <h3>Достоверность</h3>
                  <p>Вся информация проверяется и подтверждается официальными источниками</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">🕊️</div>
                <div className="value-content">
                  <h3>Духовность</h3>
                  <p>Уважение к православным традициям и ценностям</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">🌍</div>
                <div className="value-content">
                  <h3>Доступность</h3>
                  <p>Информация должна быть понятной и доступной каждому</p>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">🤝</div>
                <div className="value-content">
                  <h3>Открытость</h3>
                  <p>Мы открыты к сотрудничеству и обратной связи</p>
                </div>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="contact-section">
            <h2 className="section-title">
              <FaPhoneAlt className="section-icon" />
              Свяжитесь с нами
            </h2>
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <strong>Email</strong>
                    <p>info@churches-vl.ru</p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaPhoneAlt className="contact-icon" />
                  <div>
                    <strong>Телефон</strong>
                    <p>+7 (939) 778-69-49</p>
                  </div>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <strong>Адрес</strong>
                    <p>ул. Шепеткова, 60, Владивосток, Приморский край, Россия</p>
                  </div>
                </div>
              </div>
              <div className="social-links">
                <h3>Мы в соцсетях</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon"><FaTelegram /></a>
                  <a href="https://vk.com/club239482480" className="social-icon"><FaVk /></a>
                  <a href="#" className="social-icon"><FaGithub /></a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Стили */}
      <style jsx>{`
        .about-page {
          background-color: var(--bg-light);
          min-height: 100vh;
        }

        /* Убрали background-attachment: fixed для устранения лагов. 
           Добавили легкий параллакс через Framer Motion, если потребуется, 
           но чистый CSS лучше оставить простым */
        .about-hero {
          position: relative;
          height: 60vh;
          min-height: 400px;
          background: url('https://images.unsplash.com/photo-1582727657635-c771002bdada?ixlib=rb-4.0.3') center/cover no-repeat;
        }

        .about-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: white;
          text-align: center;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .title-icon {
          color: var(--secondary-color);
        }

        .about-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          color: rgba(255,255,255,0.9);
          text-align: center;
          font-weight: 300;
        }

        .stats-section {
          background: transparent;
          margin-top: -60px;
          position: relative;
          z-index: 10;
          padding-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          text-align: center;
        }

        .stat-card {
          padding: 2rem 1.5rem;
          background: var(--bg-color);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.2rem;
          line-height: 1.2;
        }

        .stat-label {
          color: var(--text-light);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .about-content {
          padding: 2rem 0 4rem;
        }

        .about-section {
          margin-bottom: 5rem;
        }

        .section-title {
          font-size: 2rem;
          color: var(--text-color);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-icon {
          color: var(--primary-color);
          font-size: 1.8rem;
        }

        .mission-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-light);
          max-width: 800px;
        }

        .mission-text p {
          margin-bottom: 1.5rem;
        }

        .mission-text strong {
          color: var(--text-color);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2rem;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .feature-icon {
          font-size: 2rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          display: inline-block;
          padding: 1rem;
          background: rgba(56, 142, 60, 0.1);
          border-radius: 12px;
        }

        .feature-title {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--text-color);
        }

        .feature-desc {
          color: var(--text-light);
          line-height: 1.6;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
        }

        .team-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .team-avatar {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }

        .team-name {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: var(--text-color);
        }

        .team-role {
          font-size: 0.9rem;
          color: var(--primary-color);
          font-weight: 500;
        }

        .values-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .value-item {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .value-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .value-content h3 {
          margin-bottom: 0.5rem;
          color: var(--text-color);
          font-size: 1.1rem;
        }

        .value-content p {
          color: var(--text-light);
          font-size: 0.95rem;
          margin: 0;
        }

        .contact-section {
          background: var(--primary-color);
          padding: 3.5rem;
          border-radius: 24px;
          color: white;
          box-shadow: var(--shadow-md);
        }

        .contact-section .section-title {
          color: white;
        }
        
        .contact-section .section-icon {
          color: rgba(255,255,255,0.9);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          margin-top: 2.5rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-item {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .contact-icon {
          font-size: 1.5rem;
          color: var(--secondary-color);
          flex-shrink: 0;
        }

        .contact-item p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .contact-item strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
        }

        .social-links {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .social-links h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icon {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          transition: background-color 0.2s, transform 0.2s;
        }

        .social-icon:hover {
          background: white;
          color: var(--primary-color);
          transform: translateY(-3px);
        }

        .timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 0;
          width: 2px;
          background: var(--border-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 2.5rem;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: -2.35rem;
          top: 0.3rem;
          width: 14px;
          height: 14px;
          background: var(--primary-color);
          border: 4px solid var(--bg-light);
          border-radius: 50%;
        }

        .timeline-year {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .timeline-content h3 {
          margin-bottom: 0.5rem;
          color: var(--text-color);
          font-size: 1.2rem;
        }

        .timeline-content p {
          color: var(--text-light);
        }

        .about-footer {
          background: #1e293b;
          color: rgba(255,255,255,0.8);
          text-align: center;
          padding: 3rem 0;
          margin-top: auto;
        }

        .blessing {
          margin-top: 1rem;
          font-style: italic;
          color: var(--secondary-color);
        }

        @media (max-width: 768px) {
          .contact-section {
            padding: 2rem;
            border-radius: 16px;
          }
          
          .stats-section {
            margin-top: -30px;
          }
          
          .section-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
