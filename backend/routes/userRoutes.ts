import express from 'express';
import { getCurrentUser, getUserById, updateUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', authenticateToken, getCurrentUser);
router.put('/me', authenticateToken, updateUser);
router.get('/:id', getUserById);

export default router;