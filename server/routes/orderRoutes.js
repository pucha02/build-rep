import express from 'express';
import { registerOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/register-order', registerOrder);

export default router;