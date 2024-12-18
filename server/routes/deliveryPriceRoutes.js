import express from 'express';
import { getDeliveryPrice, putDeliveryPrice } from '../controllers/deliveryPrice.js';

const router = express.Router();

router.get('/getDeliveryPrice', getDeliveryPrice)
router.put('/putDeliveryPrice', putDeliveryPrice)

export default router;