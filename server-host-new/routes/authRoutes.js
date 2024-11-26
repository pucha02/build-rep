import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Регистрация пользователя
router.post('/register-user', registerUser);

// Вход в систему
router.post('/login-user', loginUser);

// Выход из системы
router.post('/logout-user', authenticateToken, (req, res) => {
    res.json({ message: 'Ви вийшли з акаунту' });
});

// Получение информации для аккаунта пользователя
router.get('/get-information-for-user-account', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних користувача' });
    }
});

// Получение всех пользователей
router.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) return res.status(404).json({ message: 'Користувачі не знайдені' });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних користувачів' });
    }
});

// Удаление пользователя
router.delete('/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        res.json({ message: 'Користувача успішно видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні користувача' });
    }
});

// Обновление данных пользователя
router.put('/update-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstname, lastname, number_phone, companyname } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.number_phone = number_phone || user.number_phone;
        user.companyname = companyname || user.companyname;

        await user.save();

        res.json({ message: 'Дані користувача успішно оновлені', user });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні даних користувача' });
    }
});


export default router;
