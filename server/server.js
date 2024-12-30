import express from 'express';
import axios from 'axios';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js'
import promocodeRoutes from './routes/promocodeRoutes.js'


const API_KEY = '7c46eed5f071c18c84bfe93a11db0f0d';
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes);
app.use('/api/promocode', promocodeRoutes);


app.post('/api/novaposhta', async (req, res) => {
    const { modelName, calledMethod, methodProperties } = req.body;
  
    try {
      const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
        apiKey: API_KEY,
        modelName,
        calledMethod,
        methodProperties,
      });
      res.json(response.data);
    } catch (error) {
      console.error('Ошибка API Новой Почты:', error);
      res.status(500).json({ error: 'Ошибка API' });
    }
  });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});