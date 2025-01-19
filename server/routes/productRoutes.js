import express from 'express';
import { getProductsByCategory } from '../controllers/productController.js';
import { getAllProducts } from '../controllers/productController.js';
import { getProductByName } from '../controllers/productController.js';
import { getProductByType } from '../controllers/productController.js';
import { getAllProductsWithPag } from '../controllers/productController.js';

const router = express.Router();

router.get('/get-products-by-category', getProductsByCategory);
router.get('/get-products-by-title', getProductByName);
router.get('/get-all-products', getAllProducts)
router.get('/get-all-products-with-pag', getAllProductsWithPag)
router.get('/get-products-by-type', getProductByType)

export default router;
