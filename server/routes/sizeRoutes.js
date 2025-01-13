import express from 'express';
import { createSize, getSizes, updateSize, deleteSize } from '../controllers/sizeController.js';

const router = express.Router();

router.post('/sizes', createSize);
router.get('/sizes', getSizes);
router.put('/sizes/:id', updateSize);
router.delete('/sizes/:id', deleteSize);

export default router;
