import mongoose from 'mongoose';
import fetch from 'node-fetch';
import connectDB from './config/db.js';  // Убедитесь, что путь к файлу подключения к БД указан верно
import Category from './MongooseModels/Category.js';  // Путь к модели категорий

const apiUrl = "https://crm.sitniks.com/open-api/products/categories";
const token = "nGB8rpzNAT1nOAuSQqyV1nXBBmwGgXTTNHSYW8hjF17";

// Функция для получения данных о категориях с API
const fetchCategories = async () => {
    try {
        const response = await fetch(apiUrl, {
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
        return data.data; // возвращаем массив категорий
    } catch (error) {
        console.error("Error fetching categories:", error.message);
    }
};

// Функция для сохранения категорий в базу данных
const saveCategoriesToDB = async (categories) => {
    try {
        await connectDB();

        for (const category of categories) {
            const formattedCategory = {
                title: category.title,
                description: category.description || null
            };

            // Сохраняем категорию в базу данных
            const categoryDocument = new Category(formattedCategory);
            await categoryDocument.save();
            console.log(`Category "${category.title}" added to DB.`);
        }

    } catch (error) {
        console.error("Failed to save categories:", error);
    } finally {
        await mongoose.connection.close();
    }
};

// Основная функция для выполнения всего процесса
const main = async () => {
    const categories = await fetchCategories();
    if (categories) {
        await saveCategoriesToDB(categories);
    }
};

main();
