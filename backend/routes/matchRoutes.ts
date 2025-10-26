import express from 'express';
import { getUserMatches, getMatchById } from '../controllers/matchController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/user/:userId', getUserMatches);
router.get('/:matchId', authenticateToken, getMatchById);

export default router;