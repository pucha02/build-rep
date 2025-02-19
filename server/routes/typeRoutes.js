import express from 'express';
import { createType, getTypes, updateType, deleteType } from '../controllers/typeController.js';

const router = express.Router();

router.post('/types', createType);
router.get('/types', getTypes);
router.put('/types/:id', updateType);
router.delete('/types/:id', deleteType);

export default router;
