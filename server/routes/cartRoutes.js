import express from 'express';
import { addToCart, removeFromCart, updateCartQuantity } from '../controllers/cartController.js';

const router = express.Router();

router.post('/add-to-cart', addToCart);
router.post('/remove-from-cart', removeFromCart);
router.post('/update-cart', updateCartQuantity);


export default router;