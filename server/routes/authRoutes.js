import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { User } from '../MongooseModels/User.js';

const router = express.Router();

router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/logout-user', authenticateToken, (req, res) => {
    res.json({ message: 'Ви вийшли з акаунту' });
});
router.get('/get-information-for-user-account', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('orders');
        
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        res.json({
            number_phone: user.number_phone,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            orders: user.orders,
            area: user.deliveryInfo.area,
            city: user.deliveryInfo.city,
            warehouse: user.deliveryInfo.warehouse
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних користувача' });
    }
});

router.get('/get-information-for-user-cart', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
        res.json({
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні даних користувача' });
    }
});

router.put('/update-user-information', authenticateToken, async (req, res) => {
    try {
        const { firstname, lastname, email, number_phone, city, coment, number_section_NP } = req.body;
        const userId = req.user.id;

        // Найти и обновить пользователя
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstname,
                lastname,
                email,
                number_phone,
                city,
                coment,
                number_section_NP,
            },
            { new: true } // Возвращать обновленный объект
        );

        if (!updatedUser) return res.status(404).json({ message: 'Користувача не знайдено' });

        res.json({ message: 'Дані оновлено успішно', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при оновленні даних користувача' });
    }
});

router.put('/update-delivery-information', authenticateToken, async (req, res) => {
    const { area, city, warehouse } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        user.deliveryInfo = { area, city, warehouse };
        await user.save();

        res.status(200).json({ message: 'Дані доставки успішно оновлено', user });
    } catch (error) {
        console.error('Помилка при оновленні даних доставки:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});


export default router;
