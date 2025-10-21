import express from 'express';
import { likePet, getAvailablePets, getFilterOptions } from '../controllers/swipeController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';
import prisma from '../prismaClient';

const router = express.Router();

router.post('/like', authenticateToken, likePet);
router.get('/available', authenticateToken, getAvailablePets);
router.get('/filters', getFilterOptions);

export default router;