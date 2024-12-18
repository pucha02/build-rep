import express from 'express';
import { getMinPrice, putMinPrice } from '../controllers/minPriceController.js';

const router = express.Router();

router.get('/getMinPrice', getMinPrice)
router.put('/putMinPrice', putMinPrice)

export default router;