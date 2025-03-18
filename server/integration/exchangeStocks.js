// routes/stock.js
import express from 'express';
import axios from 'axios';
import Product from '../models/Product.js'; // Проверьте корректность пути к модели

const router = express.Router();

const keycrmUrlStock = "https://openapi.keycrm.app/v1/offers/stocks?limit=50";
const keycrmToken = 'NDUyZTNjNjk0OGM5NTc2YWYxNGIyN2YxYTIyYzM3YTQwMzUwNzQxZg';

// Функция для задержки между запросами
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Функция получения данных с KeyCRM
async function getKeycrmStock() {
  let allProducts = [];
  let page = 1;

  try {
    while (true) {
      const response = await axios.get(`${keycrmUrlStock}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${keycrmToken}`,
          'Content-Type': 'application/json',
        },
      });

      const { data: products, next_page_url } = response.data;
      if (!products || products.length === 0) break;

      allProducts = allProducts.concat(products);
      console.log(`Получено товаров с KeyCRM на странице ${page}: ${products.length}`);

      if (!next_page_url) break;
      page++;
      await sleep(1100); // задержка 1.1 сек для предотвращения блокировки
    }
  } catch (error) {
    console.error('Ошибка при получении данных с KeyCRM:', error.response?.data || error.message);
  }

  return allProducts;
}

// Функция обновления остатков в MongoDB по полю sku
async function updateStockData() {
  const keycrmProducts = await getKeycrmStock();

  for (const keycrmProduct of keycrmProducts) {
    const { sku, quantity } = keycrmProduct;
    if (!sku) continue;

    // Находим товар по sku и обновляем количество
    const updated = await Product.findOneAndUpdate(
      { sku },
      { $set: { quantity: quantity } },
      { new: true }
    );
    if (updated) {
      console.log(`Обновлен товар с SKU: ${sku}, новое количество: ${quantity}`);
    } else {
      console.log(`Товар с SKU: ${sku} не найден в базе.`);
    }
  }
}

// Маршрут для обновления остатков товаров
router.get('/update-stock', async (req, res) => {
  try {
    await updateStockData();
    res.status(200).json({ success: true, message: 'Остатки успешно обновлены.' });
  } catch (error) {
    console.error('Ошибка обновления остатков:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
