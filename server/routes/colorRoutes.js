import express from 'express';
import { getColors } from '../controllers/colorController.js';

const router = express.Router();

router.get('/get-colors', getColors);

export default router;