import mongoose from 'mongoose';
import DeliveryPrice from './models/DeliveryPrice.js';

// Настройки подключения к MongoDB
const dbURI = 'mongodb+srv://kyivcakes1:yfmCfjFhGuNhwRJ9@cluster0.09vxu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // Замените на имя вашей базы данных

// Функция для создания записи в коллекции
const createMarqueeContent = async () => {
  try {
    // Подключаемся к базе данных
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Проверяем, существует ли уже контент
    const existingContent = await DeliveryPrice.findOne();
    if (existingContent) {
      console.log('Контент уже существует в базе данных');
      return;
    }

    // Вставляем начальный контент в базу данных
    const content = 150
    const newMarquee = new DeliveryPrice({ content });

    await newMarquee.save();  // Сохраняем новый документ
    console.log('Контент для бегущей строки успешно добавлен');

  } catch (error) {
    console.error('Ошибка при создании контента:', error);
  } finally {
    mongoose.disconnect();  // Закрываем подключение к базе данных
  }
};

// Выполнение скрипта
createMarqueeContent();


app.post('/api/getProductsFromCrm', async (req, res) => {
  try {
      // Получить существующие продукты из базы данных
      const existingProducts = await Product.find({});
      const existingProductMap = new Map(
          existingProducts.map((product) => [product.id, product])
      );

      let hasNextPage = true;
      let after = null;
      const newProducts = []; // Массив для временного хранения новых продуктов
      const categoryOrderMap = {}; // Объект для хранения номера категории

      // Сохраняем старые значения categoryOrder и productOrder
      const oldCategoryOrders = new Map();
      const oldProductOrders = new Map();
      existingProducts.forEach((product) => {
          oldCategoryOrders.set(product.category, product.categoryOrder);
          oldProductOrders.set(product.id, product.productOrder);
      });

      while (hasNextPage) {
          const response = await fetch("https://api.keruj.com/api/graphql", {
              method: "POST",
              headers: headers,
              body: JSON.stringify(graphqlGetProducts(after)),
          });

          const data = await response.json();
          const products = data.data.listItems.edges;

          // Обрабатываем новые продукты
          products.forEach((el) => {
              const existingProduct = existingProductMap.get(el.node.id);
              const existingType = existingProduct ? existingProduct.type : null;
              const category = el.node.category ? el.node.category.title : null;

              // Присваиваем уникальный номер категории, если это новая категория
              if (category && !categoryOrderMap[category]) {
                  categoryOrderMap[category] = Object.keys(categoryOrderMap).length + 1;
              }

              // Присваиваем старое значение categoryOrder, если оно существует
              const categoryOrder = oldCategoryOrders.get(category) || categoryOrderMap[category];

              // Присваиваем старое значение productOrder, если оно существует, иначе генерируем новое
              const productOrder =
                  oldProductOrders.get(el.node.id) ||
                  (category
                      ? existingProducts.filter((p) => p.category === category).length + 1
                      : newProducts.length + 1);

              newProducts.push({
                  id: el.node.id,
                  name: el.node.name,
                  description: el.node.notes,
                  basePrice: el.node.basePrice,
                  category: category,
                  coverImage: el.node.coverImage ? el.node.coverImage.publicUrl : null,
                  type: existingType, // Сохраняем старое значение type, если оно было
                  categoryOrder: categoryOrder, // Присваиваем значение categoryOrder
                  productOrder: productOrder, // Сохраняем или присваиваем значение productOrder
              });
          });

          // Проверяем, есть ли следующая страница
          after = data.data.listItems.pageInfo.endCursor;
          hasNextPage = !!after;
      }

      // Прежде чем удалять старые продукты, сохраняем их значения categoryOrder и productOrder
      console.log('Deleting old products with categoryOrder and productOrder assignment...');
      await Product.deleteMany({});
      console.log('Old products deleted.');

      // Сохраняем новые продукты в MongoDB
      await Promise.all(
          newProducts.map(async (productData) => {
              const product = new Product(productData);
              await product.save();
              console.log('Product saved:', product);
          })
      );

      res.status(200).json({ message: 'Products successfully updated' });
  } catch (error) {
      console.error("Error processing products:", error);
      res.status(500).json({ error: 'Failed to update products' });
  }
});