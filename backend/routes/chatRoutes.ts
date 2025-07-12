import express from 'express';
import { sendMessage, getChatMessages } from '../controllers/chatController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/send', authenticateToken, sendMessage);
router.get('/:matchId', authenticateToken, getChatMessages);

export default router;