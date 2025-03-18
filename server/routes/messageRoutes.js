import express from 'express';
import { getMessages } from '../controllers/messageController.js';

const router = express.Router();

router.get('/get-messages', getMessages);

export default router;