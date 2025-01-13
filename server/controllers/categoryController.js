import Category from '../models/Category.js';

// Создание категории
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Получение всех категорий
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Обновление категории
export const updateCategory = async (req, res) => {
    try {
        console.log(req.params)
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Удаление категории
export const deleteCategory = async (req, res) => {
    try {
        
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Категорію видалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
