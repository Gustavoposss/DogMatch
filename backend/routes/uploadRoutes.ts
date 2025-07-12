import express from 'express';
import { uploadPetPhoto } from '../controllers/uploadController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/pet-photo', authenticateToken, ...uploadPetPhoto);

export default router;