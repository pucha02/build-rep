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
import liqpay from 'liqpay-sdk-nodejs';
const liqpays = new liqpay("sandbox_i38312250017", "sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY");


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

app.post('/api/payments/liqpay', (req, res) => {
  const { totalCost, orderNumber } = req.body;

  try {
      const paymentData = liqpays.cnb_object({
          action: 'pay',
          amount: totalCost,
          currency: 'UAH',
          description: `Оплата замовлення №${orderNumber}`,
          order_id: orderNumber,
          version: '3',
          sandbox: 1, // Удалить на продакшене
      });

      res.json({ paymentLink: `https://www.liqpay.ua/api/3/checkout?data=${paymentData.data}&signature=${paymentData.signature}` });
  } catch (error) {
      console.error("[ERROR] Помилка при створенні платежу LiqPay:", error);
      res.status(500).json({ message: "Помилка сервера." });
  }
});

app.post('/api/liqpay-webhook', (req, res) => {
  const { data, signature } = req.body;

  // Проверка подписи
  const expectedSignature = crypto
      .createHash('sha1')
      .update(privateKey + data + privateKey)
      .digest('base64');

  if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
  }

  const paymentData = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

  console.log('[DEBUG] Вебхук LiqPay:', paymentData);

  if (paymentData.status === 'success') {
      // Обновление статуса заказа в базе данных
      Order.findOneAndUpdate(
          { order_number: paymentData.order_id },
          { status: 'Оплачено' }
      ).then(() => {
          console.log(`[DEBUG] Статус заказа ${paymentData.order_id} обновлен на "Оплачено"`);
      }).catch((error) => {
          console.error('[ERROR] Ошибка обновления статуса заказа:', error);
      });
  }

  res.status(200).json({ message: 'Webhook processed' });
});



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