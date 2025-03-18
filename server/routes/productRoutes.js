import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Получить список всех товаров
router.get('/', getAllProducts);

// Получить товар по id
router.get('/:id', getProductById);

// Создать новый товар
router.post('/', createProduct);

// Обновить товар по id
router.put('/:id', updateProduct);

// Удалить товар по id
router.delete('/:id', deleteProduct);

export default router;
