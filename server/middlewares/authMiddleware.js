import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your_jwt_secret_key';

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Немає доступу' });

    try {
        const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Неправильний токен' });
    }
};
