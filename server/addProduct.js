import mongoose from 'mongoose';
import fetch from 'node-fetch';
import connectDB from './config/db.js'; // Убедитесь, что путь к файлу подключения к БД указан верно
import Product from './MongooseModels/Product.js';// Путь к модели товара

const apiUrl = "https://crm.sitniks.com/open-api/products?limit=1";
const token = "nGB8rpzNAT1nOAuSQqyV1nXBBmwGgXTTNHSYW8hjF17";

// Функция для получения данных с API с пагинацией
const fetchProducts = async (skip) => {
    try {
        const response = await fetch(`${apiUrl}&skip=${skip}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
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

// Функция для сохранения товара в базу данных
const saveProductsToDB = async (products) => {
    try {
        await connectDB();

        for (const product of products) {
            const formattedProduct = {

                title: product.title,
                category: product.category.title,
                description: product.description,
                cost: product.variations[0]?.price.toString(),
                discount: {
                    percentage: 0,
                    startDate: null,
                    endDate: null
                },
                color: product.variations.reduce((acc, variation) => {
                    const color = variation.properties.find(p => p.name === "Колір")?.value;
                    const size = variation.properties.find(p => p.name === "Розмір")?.value;
                    const availableQuantity = variation.availableQuantity;
                    const id = variation.id;
                    const sku = variation.sku; // Получаем SKU из текущей вариации
                    const img = variation.attachments.map(a => ({ img_link: a.url }));

                    let colorEntry = acc.find(c => c.color_name === color);
                    if (!colorEntry) {
                        colorEntry = { color_name: color, sizes: [], img };
                        acc.push(colorEntry);
                    }

                    if (size) {
                        colorEntry.sizes.push({ id, size_name: size, availableQuantity, sku });
                    }
                    return acc;
                }, [])

            };

            // Сохраняем продукт в базу данных
            const productDocument = new Product(formattedProduct);
            await productDocument.save();
            console.log(`Product "${product.title}" added to DB.`);
        }

    } catch (error) {
        console.error("Failed to save products:", error);
    } finally {
        await mongoose.connection.close();
    }
};

const main = async () => {
    let skip = 0;
    let moreProducts = true;

    while (moreProducts) {
        const products = await fetchProducts(skip);

        if (products && products.length > 0) {
            await saveProductsToDB(products);
            skip += 1;
        } else {
            moreProducts = false;
        }
    }
    const products = await fetchProducts(0);
    console.log(JSON.stringify(products))
};

// Запуск процесса
main();