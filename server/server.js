import express from 'express';
import connectDB from './config/db.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import sizeRoutes from './routes/sizeRoutes.js'
import promocodeRoutes from './routes/CRUDpromocodeOperationsRoutes.js';
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
app.use('/api', sizeRoutes);
app.use('/api', promocodeRoutes);

// Старт сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
