// src/pages/ContactsPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTelegram, 
  FaVk, 
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
  FaChurch,
  FaUserFriends,
  FaQuestionCircle,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import emailjs from '@emailjs/browser';

// Конфигурация EmailJS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'JdqkxWLJ7QUo-rsHL',    
  SERVICE_ID: 'service_ynbzp9j',     
  TEMPLATE_ID: 'template_3pc6akn'   
};

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Введите ваше имя';
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    if (!formData.message.trim()) newErrors.message = 'Введите сообщение';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setStatus('loading');
    
    try {
      // Инициализация EmailJS
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      
      // Подготовка данных для отправки
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Не указан',
        subject: formData.subject || 'Без темы',
        message: formData.message,
        to_name: 'Администратор храма',
        reply_to: formData.email,
      };

      // Отправка через EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      console.log('Email отправлен:', response);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
      
    } catch (error) {
      console.error('Ошибка EmailJS:', error);
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const contactInfo = [
    { icon: <FaPhoneAlt />, title: 'Телефон', value: '+7 (939) 778-69-49', link: 'tel:+79397786949', details: 'Пн-Пт: 9:00 - 18:00' },
    { icon: <FaEnvelope />, title: 'Email', value: 'info@churches-vl.ru', link: 'mailto:info@churches-vl.ru', details: 'Ответ в течение 24 часов' },
    { icon: <FaMapMarkerAlt />, title: 'Адрес', value: 'ул. Шепеткова, 60, Владивосток', link: 'https://www.google.com/maps/place/%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BA%D1%81%D0%BA%D0%B8%D0%B9+%D1%81%D1%83%D0%B4%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9+%D0%BA%D0%BE%D0%BB%D0%BB%D0%B5%D0%B4%D0%B6/@43.1183378,131.936413,17z/data=!3m2!4b1!5s0x5fb3925e44283ead:0x5aec7bec8dc03cb9!4m6!3m5!1s0x5fb3925e3a91479f:0x73964df3eec213aa!8m2!3d43.118334!4d131.9412839!16s%2Fg%2F1q5d618qk?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D', details: 'Владивостокский судостроительный колледж' },
    { icon: <FaClock />, title: 'Режим работы', value: 'Ежедневно', details: '09:00 - 20:00' }
  ];

  const socialNetworks = [
    { icon: <FaTelegram />, name: 'Telegram', url: 'https://t.me/churches_vl', color: '#0088cc' },
    { icon: <FaVk />, name: 'VKontakte', url: 'https://vk.com/club239482480', color: '#4c75a3' },
    { icon: <FaWhatsapp />, name: 'WhatsApp', url: 'https://wa.me/74232223344', color: '#25D366' },
    { icon: <FaYoutube />, name: 'YouTube', url: 'https://youtube.com/@churches_vl', color: '#FF0000' },
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com/churches_vl', color: '#E4405F' }
  ];

  const faqs = [
    {
      question: 'Как узнать расписание богослужений?',
      answer: 'Расписание богослужений доступно на странице каждого храма. Выберите интересующий вас храм из списка на главной странице.'
    },
    {
      question: 'Можно ли заказать требы онлайн?',
      answer: 'Да, вы можете оставить заявку через форму обратной связи или позвонить по указанным телефонам. Укажите храм и вид требы.'
    },
    {
      question: 'Как добраться до храмов?',
      answer: 'На странице каждого храма есть карта с местоположением. Вы можете построить маршрут, нажав на карту.'
    },
    {
      question: 'Можно ли оставить отзыв о храме?',
      answer: 'Да, на странице каждого храма есть форма для отзывов. Ваш отзыв будет опубликован после модерации.'
    }
  ];

  const churchesList = [
    { name: 'Покровский кафедральный собор', address: 'Океанский пр., 44', phone: '+7 (423) 243-59-25' },
    { name: 'Храм Успения Божией Матери', address: 'ул. Светланская, 65', phone: '+7 (423) 226-97-55' },
    { name: 'Храм Иоанна Кронштадтского', address: 'Океанский пр., 44', phone: '+7 (914) 704-48-14' }
  ];

  return (
    <div className="contacts-page">
      {/* Hero секция */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="contacts-hero"
      >
        <div className="contacts-hero-overlay">
          <div className="container">
            <motion.h1 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="contacts-title"
            >
              📞 Контакты
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="contacts-subtitle"
            >
              Свяжитесь с нами любым удобным способом
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="container">
        {/* Контактная информация - карточки */}
        <div className="contact-cards">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="contact-card"
            >
              <div className="contact-card-icon">{info.icon}</div>
              <h3>{info.title}</h3>
              {info.link ? (
                <a href={info.link} className="contact-card-value">{info.value}</a>
              ) : (
                <p className="contact-card-value">{info.value}</p>
              )}
              <p className="contact-card-details">{info.details}</p>
            </motion.div>
          ))}
        </div>

        <div className="contacts-grid">
          {/* Форма обратной связи с EmailJS */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="contact-form-section"
          >
            <h2 className="section-title">
              <FaPaperPlane className="section-icon" />
              Написать нам
            </h2>
            <p className="section-subtitle">
              Заполните форму и мы свяжемся с вами в ближайшее время
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <select name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="">Выберите тему обращения</option>
                  <option value="Вопрос о храме">Вопрос о храме</option>
                  <option value="Расписание богослужений">Расписание богослужений</option>
                  <option value="Заказ треб">Заказ треб</option>
                  <option value="Сотрудничество">Сотрудничество</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Ваше сообщение *"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Отправка...' : 'Отправить сообщение'}
              </button>

              {status === 'success' && (
                <div className="success-message">
                  <FaCheckCircle /> Сообщение успешно отправлено! Мы свяжемся с вами.
                </div>
              )}
              
              {status === 'error' && (
                <div className="error-message-box">
                  <FaExclamationCircle /> Ошибка при отправке. Попробуйте позже.
                </div>
              )}
            </form>
          </motion.div>

          {/* Социальные сети */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="social-section"
          >
            <h2 className="section-title">
              <FaUserFriends className="section-icon" />
              Мы в соцсетях
            </h2>
            <p className="section-subtitle">
              Подписывайтесь, чтобы быть в курсе новостей
            </p>

            <div className="social-grid">
              {socialNetworks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{ '--social-color': social.color }}
                >
                  <div className="social-icon" style={{ color: social.color }}>{social.icon}</div>
                  <span className="social-name">{social.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="emergency-contact">
              <h3>🚨 Экстренная помощь</h3>
              <p>Для срочных вопросов обращайтесь по телефону:</p>
              <a href="tel:+74232223344" className="emergency-phone">+7 (939) 778-69-49</a>
            </div>
          </motion.div>
        </div>

        {/* Карта */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="map-section"
        >
          <h2 className="section-title">
            <FaMapMarkerAlt className="section-icon" />
            Мы на карте. Владивостокский судостроительный колледж на карте
          </h2>
          <div className="map-container">
            <iframe
              title="Владивостокский судостроительный колледж"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9795.61095233708!2d131.94117969930937!3d43.12021783439848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb3925e3a91479f%3A0x73964df3eec213aa!2z0JLQu9Cw0LTQuNCy0L7RgdGC0L7QutGB0LrQuNC5INGB0YPQtNC-0YHRgtGA0L7QuNGC0LXQu9GM0L3Ri9C5INC60L7Qu9C70LXQtNC2!5e0!3m2!1sru!2sjp!4v1780549695982!5m2!1sru!2sjp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="map-caption">
            📍 Владивостокский судостроительный колледж - место проведения мероприятий
          </p>
        </motion.div>

        {/* Часто задаваемые вопросы */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="faq-section"
        >
          <h2 className="section-title">
            <FaQuestionCircle className="section-icon" />
            Часто задаваемые вопросы
          </h2>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Список храмов */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="churches-contact-section"
        >
          <h2 className="section-title">
            <FaChurch className="section-icon" />
            Контакты храмов
          </h2>
          
          <div className="churches-contact-grid">
            {churchesList.map((church, index) => (
              <div key={index} className="church-contact-card">
                <h3>{church.name}</h3>
                <p><FaMapMarkerAlt /> {church.address}</p>
                <p><FaPhoneAlt /> {church.phone}</p>
              </div>
            ))}
          </div>
          
          <p className="more-churches-link">
            <a href="/">Все храмы →</a>
          </p>
        </motion.div>
      </div>

      {/* Стили */}
      <style>{`
        .contacts-page {
          background: var(--bg-color);
          min-height: 100vh;
        }

        .contacts-hero {
          position: relative;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .contacts-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contacts-title {
          font-size: 3rem;
          color: white;
          text-align: center;
          margin-bottom: 1rem;
        }

        .contacts-subtitle {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          text-align: center;
        }

        .contact-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-top: -50px;
          margin-bottom: 50px;
          position: relative;
          z-index: 1;
        }

        .contact-card {
          background: var(--bg-color);
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid var(--border-color);
          transition: transform 0.3s;
        }

        .contact-card:hover {
          transform: translateY(-5px);
        }

        .contact-card-icon {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .contact-card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: var(--text-color);
        }

        .contact-card-value {
          font-size: 1.1rem;
          font-weight: bold;
          color: var(--primary-color);
          text-decoration: none;
          display: inline-block;
          margin-bottom: 5px;
        }

        .contact-card-details {
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .contacts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .section-title {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-icon {
          color: var(--primary-color);
        }

        .section-subtitle {
          color: var(--text-light);
          margin-bottom: 25px;
        }

        .contact-form {
          background: var(--bg-light);
          padding: 30px;
          border-radius: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-color);
          color: var(--text-color);
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #f44336;
        }

        .error-message {
          color: #f44336;
          font-size: 0.85rem;
          margin-top: 5px;
          display: block;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

        .error-message-box {
          margin-top: 15px;
          padding: 12px;
          background: #ffebee;
          color: #c62828;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .social-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px;
          background: var(--bg-light);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s;
          border: 1px solid var(--border-color);
        }

        .social-icon {
          font-size: 2rem;
        }

        .social-name {
          color: var(--text-color);
          font-size: 0.9rem;
        }

        .emergency-contact {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          color: white;
        }

        .emergency-contact h3 {
          margin-bottom: 10px;
        }

        .emergency-phone {
          display: inline-block;
          margin-top: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }

        .map-section {
          margin-bottom: 50px;
        }

        .map-container {
          height: 450px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .map-caption {
          text-align: center;
          margin-top: 10px;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .faq-section {
          margin-bottom: 50px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .faq-item {
          padding: 20px;
          background: var(--bg-light);
          border-radius: 12px;
          border-left: 4px solid var(--primary-color);
        }

        .faq-item h3 {
          margin-bottom: 10px;
          color: var(--text-color);
        }

        .faq-item p {
          color: var(--text-light);
          line-height: 1.6;
        }

        .churches-contact-section {
          margin-bottom: 50px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
          border-radius: 20px;
        }

        .churches-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .church-contact-card {
          padding: 20px;
          background: var(--bg-color);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .church-contact-card h3 {
          margin-bottom: 10px;
          color: var(--primary-color);
        }

        .church-contact-card p {
          margin: 8px 0;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .more-churches-link {
          text-align: center;
          margin-top: 20px;
        }

        .more-churches-link a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .contacts-title {
            font-size: 2rem;
          }
          
          .contacts-grid {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .contact-cards {
            margin-top: -30px;
          }
          
          .faq-grid {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
          
          .map-container {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}