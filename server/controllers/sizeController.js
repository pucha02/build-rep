import Size from '../models/Size.js';

// Создание категории
export const createSize = async (req, res) => {
    try {
        const size = new Size(req.body);
        await size.save();
        res.status(201).json(size);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Получение всех категорий
export const getSizes = async (req, res) => {
    try {
        const sizes = await Size.find();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Обновление категории
export const updateSize = async (req, res) => {
    try {
        const size = await Size.findByIdAndUpdate(req.params._id, req.body, { new: true });
        res.status(200).json(size);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Удаление категории
export const deleteSize = async (req, res) => {
    try {
        await Size.findByIdAndDelete(req.params._id);
        res.status(200).json({ message: 'Розмір видалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
