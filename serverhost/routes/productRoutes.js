import express from 'express';
import Product from '../models/Product.js';
import { getProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/getProducts', getProducts)
router.put('/updateType/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const product = await Product.findByIdAndUpdate(id, { type }, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Товар не знайдено' });
        }

        res.json({ message: 'Тип товару успішно оновлено', product });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

router.post('/update-category-order', async (req, res) => {
    const { currentCategory, targetCategory, currentOrder, targetOrder } = req.body;

    // Лог входящих данных
    console.log('Request body:', req.body);

    try {
        // Проверка наличия всех необходимых данных
        if (!currentCategory || !targetCategory || currentOrder === undefined || targetOrder === undefined) {
            console.error('Missing required fields:', { currentCategory, targetCategory, currentOrder, targetOrder });
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Лог перед первым обновлением
        console.log(`Updating category "${currentCategory}" to order ${targetOrder}`);
        const currentUpdateResult = await Product.updateMany(
            { category: currentCategory },
            { $set: { categoryOrder: targetOrder } }
        );
        console.log(`Updated category "${currentCategory}" result:`, currentUpdateResult);

        // Лог перед вторым обновлением
        console.log(`Updating category "${targetCategory}" to order ${currentOrder}`);
        const targetUpdateResult = await Product.updateMany(
            { category: targetCategory },
            { $set: { categoryOrder: currentOrder } }
        );
        console.log(`Updated category "${targetCategory}" result:`, targetUpdateResult);

        // Успешный результат
        res.status(200).send({ message: 'Category order updated successfully' });
    } catch (error) {
        // Лог ошибок
        console.error('Error updating category order:', error);
        res.status(500).send({ message: 'Error updating category order', error });
    }
});



export default router;