import mongoose from 'mongoose';
import fetch from 'node-fetch';
import connectDB from './config/db.js'; // Убедитесь, что путь к файлу подключения к БД указан верно
import Product from './MongooseModels/Product.js';// Путь к модели товара

const apiUrl = "https://crm.sitniks.com/open-api/products/variations?limit=10";
const token = "nGB8rpzNAT1nOAuSQqyV1nXBBmwGgXTTNHSYW8hjF17";

// Функция для получения статусов
// async function fetchStatuses() {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Ответ от API:", data);  // Печатаем полный ответ

//       // Пример, если данные находятся в другом месте
//       if (Array.isArray(data.data)) {
//         data.data.forEach(order => {
//           console.log("Delivery for order:", order.delivery);
//         });
//       } else {
//         console.log("Ответ не содержит нужный массив.");
//       }

//       return data;
//     } catch (error) {
//       console.error("Ошибка при получении статусов:", error);
//       return null;
//     }
//   }

//   fetchStatuses();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchProducts = async (skip) => {
  try {
    const response = await fetch(`${apiUrl}&skip=${skip}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // возвращаем массив товаров
  } catch (error) {
    console.error("Error fetching products:", error.message);
  }
};

const updateProductStockInDB = async (productFromCRM) => {
  try {
    // Поиск товара в базе данных по SKU
    const existingProduct = await Product.findOne({ "color.sizes.sku": productFromCRM.sku });

    if (existingProduct) {
      console.log(`Found product with SKU: ${productFromCRM.sku}. Updating stock quantities.`);

      const updatedColors = existingProduct.color.map(color => {
        const updatedSizes = color.sizes.map(size => {
          if (size.sku === productFromCRM.sku) {
            return {
              ...size,
              availableQuantity: productFromCRM.availableQuantity,
            };
          }
          return size;
        });
        return { ...color, sizes: updatedSizes };
      });

      existingProduct.color = updatedColors;
      await existingProduct.save();

      console.log(`Product with SKU: ${productFromCRM.sku} updated successfully.`);
    } else {
      console.warn(`Product with SKU: ${productFromCRM.sku} not found in database.`);
    }
  } catch (error) {
    console.error(`Error updating product with SKU: ${productFromCRM.sku}`, error.message);
  }
};

const main = async () => {
  await connectDB(); // Подключение к базе данных

  console.log("Fetching products from API...");
  let skip = 0;
  let moreProducts = true;

  while (moreProducts) {
    const products = await fetchProducts(skip);

    if (products && products.length > 0) {
      // Обработка каждого товара из CRM
      for (const product of products) {
        await updateProductStockInDB(product);
      }

      skip += 10;
      await sleep(1100);
    } else {
      moreProducts = false;
    }
  }

  console.log("All products processed.");
};

main();