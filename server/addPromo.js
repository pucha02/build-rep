import mongoose from 'mongoose';
import { User } from './MongooseModels/User.js'; // Путь к вашей модели User
import PromoCode from './MongooseModels/PromoCode.js'; // Путь к вашей модели PromoCode

const addPromoCodeToUser = async (phoneNumber, promoCode) => {
    try {
        // Найти пользователя по номеру телефона
        const user = await User.findOne({ number_phone: phoneNumber });
        if (!user) {
            console.log(`Пользователь с номером ${phoneNumber} не найден.`);
            return;
        }

        // Проверить существование промокода
        const promo = await PromoCode.findOne({ code: promoCode });
        if (!promo) {
            console.log(`Промокод "${promoCode}" не найден.`);
            return;
        }

        // Проверить, не был ли промокод уже добавлен
        const existingPromo = user.promoCodes.find((p) => p.code === promoCode);
        if (existingPromo) {
            console.log(`Промокод "${promoCode}" уже добавлен пользователю.`);
            return;
        }

        // Добавить промокод пользователю
        user.promoCodes.push({ code: promoCode, activatedAt: new Date(), isUsed: false });
        await user.save();

        console.log(`Промокод "${promoCode}" успешно добавлен пользователю с номером ${phoneNumber}.`);
    } catch (error) {
        console.error('Ошибка при добавлении промокода:', error);
    }
};

// Подключение к MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://wixi4598:gj2TIqB9qCzKUeeR@cluster0.zoliw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Подключение к базе данных успешно.');

        // Добавление промокода
        await addPromoCodeToUser('380991729177', 'xmf55472ss');
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Запуск скрипта
connectToDatabase();
