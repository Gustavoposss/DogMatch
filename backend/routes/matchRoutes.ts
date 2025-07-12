import express from 'express';
import { getUserMatches } from '../controllers/matchController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/user/:userId', getUserMatches);

export default router;