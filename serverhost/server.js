import mongoose from 'mongoose';
import DeliveryPrice from './models/DeliveryPrice.js';

// Настройки подключения к MongoDB
const dbURI = 'mongodb+srv://kyivcakes1:yfmCfjFhGuNhwRJ9@cluster0.09vxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // Замените на имя вашей базы данных

// Функция для создания записи в коллекции
const createMarqueeContent = async () => {
  try {
    // Подключаемся к базе данных
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Проверяем, существует ли уже контент
    const existingContent = await DeliveryPrice.findOne();
    if (existingContent) {
      console.log('Контент уже существует в базе данных');
      return;
    }

    // Вставляем начальный контент в базу данных
    const content = 150
    const newMarquee = new DeliveryPrice({ content });

    await newMarquee.save();  // Сохраняем новый документ
    console.log('Контент для бегущей строки успешно добавлен');

  } catch (error) {
    console.error('Ошибка при создании контента:', error);
  } finally {
    mongoose.disconnect();  // Закрываем подключение к базе данных
  }
};

// Выполнение скрипта
createMarqueeContent();
