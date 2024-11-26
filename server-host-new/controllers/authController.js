import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = 'your_jwt_secret_key';

export const registerUser = async (req, res) => {
    const { number_phone, firstname, password, companyname } = req.body;
    if (!number_phone || !firstname || !password) {
        return res.status(400).json({ message: "Заповніть всі обов'язкові поля" });
    }

    try {
        const existingUser = await User.findOne({ number_phone });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким номером телефону вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ number_phone, firstname, companyname, password: hashedPassword });
        console.log(newUser)
        await newUser.save();
        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка реєстрації' });
    }
};

export const loginUser = async (req, res) => {
    const { number_phone, password } = req.body;

    try {
        const user = await User.findOne({ number_phone });
        if (!user) return res.status(400).json({ message: 'Користувача з таким номером телефону не знайдено' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Неправильний пароль' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, id: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при вході' });
    }
};
