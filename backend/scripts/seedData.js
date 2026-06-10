const db = require('../config/database');

const churchesData = [
  {
    name: 'Покровский кафедральный собор',
    name_full: 'Собор Покрова Пресвятой Богородицы',
    address: 'г. Владивосток, ул. Пушкинская, 5',
    description: 'Главный православный храм Владивостока и Приморской митрополии. Кафедральный собор Владивостокской епархии.',
    history: 'Заложен в 1900 году в честь спасения императорской семьи во время покушения в Японии. Освящён в 1902 году. В советское время был закрыт, в здании располагался кинотеатр. Возвращён церкви в 1991 году, восстановлен.',
    architecture: 'Неорусский стиль с элементами древнерусского зодчества. Пятиглавый храм с шатровой колокольней.',
    shrines: 'Икона Божией Матери «Скоропослушница», икона святого благоверного князя Александра Невского с частицей мощей',
    abbot: 'Митрополит Владивостокский и Приморский Владимир',
    phone: '+7 (423) 222-33-44',
    email: 'pokrov@vladivostok-eparhia.ru',
    website: 'http://pokrov-sobor.ru',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Vladivostok_Pokrovsky_Cathedral.jpg/800px-Vladivostok_Pokrovsky_Cathedral.jpg',
    gallery: JSON.stringify([
      'https://example.com/pokrov1.jpg',
      'https://example.com/pokrov2.jpg'
    ]),
    lat: 43.115120,
    lng: 131.885320
  },
  {
    name: 'Храм Успения Божией Матери',
    name_full: 'Храм в честь Успения Пресвятой Богородицы',
    address: 'г. Владивосток, ул. Светланская, 65',
    description: 'Один из старейших сохранившихся храмов Владивостока, действовал даже в советское время.',
    history: 'Построен в 1898 году на средства прихожан. В 1935 году был закрыт, но в 1945 году вновь открыт и больше не закрывался. Является памятником архитектуры регионального значения.',
    architecture: 'Эклектика с преобладанием русско-византийского стиля',
    shrines: 'Икона Успения Божией Матери, икона святого Пантелеимона с частицей мощей',
    abbot: 'Протоиерей Александр Талько',
    phone: '+7 (423) 222-55-66',
    email: 'uspensky@mail.ru',
    image_url: 'https://example.com/uspensky.jpg',
    lat: 43.116500,
    lng: 131.886500
  },
  {
    name: 'Храм святого праведного Иоанна Кронштадтского',
    address: 'г. Владивосток, ул. Каплунова, 12',
    description: 'Современный храм на Корабельной набережной, визитная карточка Владивостока.',
    history: 'Построен в 2007 году в честь святого Иоанна Кронштадтского. Расположен в живописном месте на берегу Амурского залива.',
    architecture: 'Неорусский стиль, пятиглавый храм с шатровой колокольней',
    shrines: 'Икона святого Иоанна Кронштадтского с частицей его облачения',
    abbot: 'Иерей Димитрий Винокуров',
    phone: '+7 (423) 277-88-99',
    image_url: 'https://example.com/ioann.jpg',
    lat: 43.120000,
    lng: 131.890000
  }
];

function seedDatabase() {
  churchesData.forEach(church => {
    db.run(`
      INSERT OR IGNORE INTO churches (
        name, name_full, address, description, history, architecture,
        shrines, abbot, phone, email, website, image_url, gallery, lat, lng
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, Object.values(church), (err) => {
      if (err) console.error('Ошибка вставки:', err);
      else console.log(`✅ Добавлен храм: ${church.name}`);
    });
  });
  
  // Добавляем расписание для Покровского собора
  db.run(`
    INSERT OR IGNORE INTO schedule (church_id, service_type, day_of_week, time, notes)
    VALUES 
      (1, 'Всенощное бдение', 6, '17:00', 'Вечернее богослужение'),
      (1, 'Божественная литургия', 0, '09:30', 'Воскресное утреннее богослужение'),
      (1, 'Исповедь', 0, '08:30', 'Перед литургией')
  `);
  
  console.log('✅ База данных заполнена тестовыми данными');
}

seedDatabase();