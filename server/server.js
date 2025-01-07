const express = require('express');
const mongoose = require('mongoose');

// Подключение к MongoDB
mongoose.connect('mongodb+srv://yellowkitchenproject:XqL8mV5Tcy4nKu59@cluster0.h3dug.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Определение схемы
const dishSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
});

// Создание модели
const Dish = mongoose.model('Dish', dishSchema);

// Создание приложения Express
const app = express();

// Маршрут для получения всех товаров
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ error: 'Не удалось получить список товаров.' });
  }
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});