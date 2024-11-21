import express from 'express';
import Marquee from '../models/Marquee.js';

const router = express.Router();

// Получение контента для бегущей строки
router.get('/getContent', async (req, res) => {
    try {
        const foundMarquee = await Marquee.findOne(); // Получаем первый (единственный) документ
        if (!foundMarquee) {
            return res.status(404).json({ message: "Content not found" });
        }
        res.json(foundMarquee); // Отправляем контент
    } catch (error) {
        res.status(500).json({ message: "Error retrieving content", error });
    }
});

// Обновление контента бегущей строки
router.post('/updateContent', async (req, res) => {
    const { content } = req.body;
    if (content) {
        try {
            const updatedMarquee = await Marquee.findOneAndUpdate(
                {}, // Обновляем первый (единственный) документ
                { content }, // Новое значение контента
                { new: true, upsert: true } // Возвращаем обновленный документ и создаем его, если не найден
            );
            res.status(200).json({ message: 'Content successfully updated', updatedMarquee });
        } catch (error) {
            res.status(500).json({ message: 'Error updating content', error });
        }
    } else {
        res.status(400).json({ message: 'Invalid request' });
    }
});

export default router;
