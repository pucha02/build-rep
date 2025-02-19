import express from 'express';
import { getSizeChart } from '../controllers/sizeChartController.js';

const router = express.Router();

router.get('/size-chart/:id', getSizeChart);

export default router;