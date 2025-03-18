import axios from 'axios';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
const keycrmUrl = "http://openapi.keycrm.app/v1/offers?limit=50";
const keycrmToken = "NDUyZTNjNjk0OGM5NTc2YWYxNGIyN2YxYTIyYzM3YTQwMzUwNzQxZg";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAllProductsFromKeyCRM() {
  await connectDB();
  let page = 1;

  try {
    // Обработка 1 страницы (при необходимости увеличьте количество страниц)
    while (page <= 10) {
      const response = await axios.get(keycrmUrl, {
        headers: {
          Authorization: `Bearer ${keycrmToken}`,
          "Content-Type": "application/json",
        },
        params: { page, per_page: 50, include: "product" },
      });

      const pageData = response.data.data;
      console.log(
        `Получено товаров с KeyCRM на странице ${page}: ${JSON.stringify(pageData[0].properties)} ${JSON.stringify(pageData[0].sku)}`
      );

      for (const item of pageData) {
        const properties = item.properties || [];

        // Проверяем наличие свойства "site" со значением "yes" (без учета регистра)
        const siteProperty = properties.find(
          prop => prop.name.toLowerCase() === "site" && prop.value.toLowerCase() === "yes"
        );

        if (siteProperty) {
          console.log(item);
          // Получаем название товара: сначала пытаемся взять из item.product.name, иначе из item.title
          const productTitle = (item.product && item.product.name) ? item.product.name : item.title;

          if (!productTitle) {
            console.log(`Пропущен товар с SKU "${item.sku}" – отсутствует название.`);
            continue;
          }

          // Извлекаем значения для category, categoryLink, subcategory, subcategoryLink из properties (если они есть)
          const categoryProp = properties.find(prop => prop.name.toLowerCase() === "category");
          const categoryLinkProp = properties.find(prop => prop.name.toLowerCase() === "categorylink");
          const subcategoryProp = properties.find(prop => prop.name.toLowerCase() === "subcategory");
          const subcategoryLinkProp = properties.find(prop => prop.name.toLowerCase() === "subcategorylink");
          const brand = properties.find(prop => prop.name.toLowerCase() === "brand");

          // Проверяем, существует ли уже продукт с данным SKU
          const exists = await Product.findOne({ sku: item.sku });
          if (!exists) {
            const newProduct = new Product({
              id: item.id,
              title: productTitle,
              category: categoryProp ? categoryProp.value : item.category,
              categoryLink: categoryLinkProp ? categoryLinkProp.value : item.categoryLink,
              subcategory: subcategoryProp ? subcategoryProp.value : item.subcategory,
              subcategoryLink: subcategoryLinkProp ? subcategoryLinkProp.value : item.subcategoryLink,
              type: item.type,
              brand: brand ? brand.value : item.brand,
              imageURL: item.thumbnail_url,
              description: item.description,
              features: item.features,
              application: item.application,
              cost: item.price,
              sku: item.sku,
              quantity: item.quantity,
              discount: item.discount,
            });

            await newProduct.save();
            console.log(`Продукт "${productTitle}" успешно сохранён.`);
          } else {
            console.log(`Продукт с SKU "${item.sku}" уже существует.`);
          }
        }
      }

      page++;
      await sleep(1100);
    }
  } catch (error) {
    console.error("Ошибка при получении товаров из KeyCRM:", error.message);
    throw error;
  }
}

// Запуск функции и закрытие соединения после завершения работы
// getAllProductsFromKeyCRM()
//   .then(() => {
//     console.log("Все продукты обработаны, закрытие соединения...");
//     mongoose.disconnect().then(() => {
//       console.log("Соединение закрыто. Скрипт завершён.");
//       process.exit(0);
//     });
//   })
//   .catch((err) => {
//     console.error("Ошибка выполнения скрипта:", err);
//     mongoose.disconnect().then(() => process.exit(1));
//   });
  router.get('/create-prod', async (req, res) => {
    try {
      // Вызываем функцию для получения и сохранения продуктов из KeyCRM.
      await getAllProductsFromKeyCRM();
      res.json({ message: 'Товары успешно обновлены из CRM.' });
    } catch (error) {
      console.error('Ошибка при обновлении товаров из CRM:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router;