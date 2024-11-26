import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import BannerModel from '../models/BannerModel.js';// Убедитесь, что путь к модели корректен

const router = express.Router();

// Создаем директорию для загрузок, если ее нет
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${safeFilename}`);
    },
});

const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Неверный формат файла. Разрешены только JPEG, PNG, и GIF.'));
        }
    }
});

// Маршрут для обновления контента
router.post('/updateContent', upload.single('bannerImage'), async (req, res) => {
    try {
        const content = req.body.content;
        const bannerImagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Обновление или создание документа в базе данных
        const updatedBanner = await BannerModel.findOneAndUpdate(
            {}, // Условие: обновляем первый документ
            { content, bannerImagePath },
            { new: true, upsert: true } // Создаем, если запись не существует
        );

        res.json({ 
            message: 'Контент успешно обновлен', 
            banner: updatedBanner 
        });
    } catch (error) {
        console.error('Ошибка обновления контента:', error);
        res.status(500).json({ message: 'Ошибка обновления контента', error: error.message });
    }
});

// Маршрут для получения контента
router.get('/getContent', async (req, res) => {
    try {
        const banner = await BannerModel.findOne({});
        if (!banner) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        res.json(banner);
    } catch (error) {
        console.error('Ошибка получения контента:', error);
        res.status(500).json({ message: 'Ошибка получения контента', error: error.message });
    }
});

// Экспорт роутера
export default router;
