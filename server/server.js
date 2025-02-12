import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { Order } from './MongooseModels/User.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js'
import promocodeRoutes from './routes/promocodeRoutes.js'
import sizeChartRoutes from './routes/sizeChartRoutes.js'
import colorsRoutes from './routes/colorRoutes.js'
import typesRoutes from './routes/typeRoutes.js'
import liqpay from 'liqpay-sdk-nodejs';
const liqpays = new liqpay("sandbox_i38312250017", "sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY");
const apiUrl = "https://crm.sitniks.com/open-api/orders";
const token = "nGB8rpzNAT1nOAuSQqyV1nXBBmwGgXTTNHSYW8hjF17";

const API_KEY = '7c46eed5f071c18c84bfe93a11db0f0d';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes);
app.use('/api/promocode', promocodeRoutes);
app.use('/api/sizechart', sizeChartRoutes)
app.use('/api/colors', colorsRoutes)
app.use('/api/type', typesRoutes);

function formatPhoneNumber(phone) {
  // Удаляем все нечисловые символы
  const digits = phone.replace(/\D/g, '');
  // Приводим к формату 380xxxxxxxxx
  if (digits.startsWith('0')) {
    return '38' + digits;
  } else if (digits.startsWith('380')) {
    return digits;
  } else {
    return '380' + digits;
  }
}

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

app.post('/api/liqpay-webhook', async (req, res) => {
  const { data, signature } = req.body;

  console.log('[DEBUG] Вебхук LiqPay:', req.body);

  const decodedData = Buffer.from(data, 'base64').toString('utf8');
  console.log('[DEBUG] Раскодированные данные:', decodedData);

  try {
    const parsedData = JSON.parse(decodedData);
    console.log('[DEBUG] Парсинг данных:', parsedData);

    if (parsedData.status === 'sandbox') {
      // Найти заказ по order_number
      const order = await Order.findOne({ order_number: parsedData.order_id });

      if (order && order.status === "Ожидание оплаты") {
        // Обновить статус заказа
        order.status = "Оплачено";
        await order.save();

        // Отправка заказа в CRM
        const crmOrderData = {
          delivery: {
            volumeGeneral: 0.0004,
            serviceType: "DoorsDoors",
            payerType: "Sender",
            cargoType: "Parcel",
            paymentMethod: "NonCash",
            price: order.totalCost,
            weight: 0.1,
            seatsAmount: order.products.length,
            city: order.city,
            department: order.warehouse,
            type: "newpost",
            integrationDeliveryId: 2013
          },
          products: order.products.map(item => ({
            productVariationId: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.cost,
            isUpsale: false,
            warehouse: { id: 1 },
          })),
          externalId: order.order_number,
          payment: {
            settlementAccountId: 2936,
            amount: order.totalCost,
          },
          client: {
            fullname: `${order.firstname}`,
            phone: `+${formatPhoneNumber(order.number_phone)}`,
            email: order.email,
          },
          statusId: 1492,
          responsibleId: 515,
          salesChannelId: 1071,
        };

        const crmResponse = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(crmOrderData),
        });

        const responseText = await crmResponse.text();
        console.log("[DEBUG] Статус відповіді CRM:", crmResponse.status);
        console.log("[DEBUG] Тіло відповіді CRM:", responseText);

        if (!crmResponse.ok) {
          console.error(`[ERROR] Не вдалося відправити замовлення у CRM. Статус: ${crmResponse.status},, Відповідь: ${responseText}`);
        } else {
          console.log('[DEBUG] Замовлення успішно відправлено у CRM:', JSON.parse(responseText));
        }
      }
    }

    res.status(200).json({ message: 'Webhook processed', parsedData });
  } catch (error) {
    console.error('[ERROR] Ошибка парсинга данных:', error);
    res.status(400).json({ message: 'Invalid data format' });
  }
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