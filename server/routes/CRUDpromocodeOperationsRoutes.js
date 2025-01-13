import express from 'express'; 
import { getAllPromoCodes, getPromoCodeById, createPromoCode, updatePromoCode, deletePromoCode } from '../controllers/promocodeController.js';

const router = express.Router();

router.get('/promocodes', getAllPromoCodes);       
router.get('/promocodes/:id', getPromoCodeById);    
router.post('/promocodes', createPromoCode);       
router.put('/promocodes/:id', updatePromoCode);     
router.delete('/promocodes/:id', deletePromoCode); 

export default router;
