import express from 'express';
import connectDB from './config/db.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors'

const app = express();

// Подключение к MongoDB
connectDB();

// Мидлвары
app.use(cors())
app.use(express.json());

// Роуты
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// Старт сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
