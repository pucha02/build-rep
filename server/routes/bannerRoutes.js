import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import BannerModel from '../models/BannerModel.js'; // Убедитесь, что путь к модели корректен

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
        cb(null, `${safeFilename}`);
    },
});

const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/x-rar-compressed', 'audio/mpeg', 'audio/wav', 'video/mp4', 'video/x-msvideo', 'text/plain', 'application/json', 'application/xml'];
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
        const bannerImagePath = req.file ? `${req.file.filename}` : null;
        const isActive = req.body.isActive === 'true'; // Получаем значение флага активности

        // Получаем текущий баннер из базы данных
        const banner = await BannerModel.findOne({});

        // Если у баннера есть старое изображение, удаляем его
        if (banner && banner.bannerImagePath) {
            const oldImagePath = path.join(uploadDir, banner.bannerImagePath);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Удаляем старое изображение
            }
        }

        // Обновление или создание документа в базе данных
        const updatedBanner = await BannerModel.findOneAndUpdate(
            {}, // Условие: обновляем первый документ
            { content, bannerImagePath, isActive },
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

router.post('/updateStatus', async (req, res) => {
    try {
        const { isActive } = req.body; // Получаем новый статус активности

        // Обновляем только поле isActive в базе данных
        const updatedBanner = await BannerModel.findOneAndUpdate(
            {}, // Обновляем первый найденный документ
            { isActive }, // Обновляем только статус активности
            { new: true } // Возвращаем обновленный документ
        );

        res.json({
            message: 'Статус активности успешно обновлен',
            banner: updatedBanner
        });
    } catch (error) {
        console.error('Ошибка обновления статуса активности:', error);
        res.status(500).json({ message: 'Ошибка обновления статуса активности', error: error.message });
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
