import Product from '../MongooseModels/Product.js';
import Category from '../MongooseModels/Category.js';

// Получение продуктов по категории
export const getProductsByCategory = async (req, res) => {
    const { category } = req.query;
    try {
        const foundCategory = await Category.findOne({ title: category });

        if (!foundCategory) {
            return res.status(404).json({ message: 'Категорія не знайдена' });
        }

        const products = await Product.find({ category: foundCategory.title }).populate('relatedProducts');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання даних', error });
    }
};

// Получение всех продуктов с поиском по названию
export const getAllProducts = async (req, res) => {
    try {
        const { search = '' } = req.query;

        // Поиск по названию с помощью регулярного выражения
        const query = search ? { title: { $regex: `(^|\\s)${search}`, $options: 'i' } } : {};

        const products = await Product.find(query).populate('relatedProducts');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання даних', error });
    }
};

// Получение продуктов по названию
export const getProductByName = async (req, res) => {
    const { title } = req.query;
    try {
        if (!title) {
            return res.status(400).json({ message: 'Назва продукту є обовʼязковою' });
        }

        const products = await Product.find({ title }).populate('relatedProducts');
        if (products.length === 0) {
            return res.status(404).json({ message: 'Продукт не знайдено' });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання даних', error });
    }
};

// Получение продуктов по типу
export const getProductByType = async (req, res) => {
    const { type } = req.query;
    try {
        if (!type) {
            return res.status(400).json({ message: 'Тип продукту є обовʼязковим' });
        }

        const products = await Product.find({ type }).populate('relatedProducts');
        if (products.length === 0) {
            return res.status(404).json({ message: 'Продукти не знайдено' });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання даних', error });
    }
};

export const getAllProductsWithPag = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;

        // Вычисление пропускаемых документов
        const skip = (Number(page) - 1) * Number(limit);

        // Получение товаров с учетом пагинации
        const products = await Product.find()
            .populate('relatedProducts')
            .skip(skip)
            .limit(Number(limit));

        // Подсчет общего количества документов
        const total = await Product.countDocuments();

        res.json({  
            products,  
            total,  
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання даних', error });
    }
};