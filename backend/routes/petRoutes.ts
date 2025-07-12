import express from 'express';
import { 
  createPet, 
  getUserPets, 
  getPet, 
  updatePet, 
  deletePet,
  getPetsToSwipe
} from '../controllers/petController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createPet);
router.get('/user/:userId', authenticateToken, getUserPets);
router.get('/swipe/:userId', authenticateToken, getPetsToSwipe);
router.get('/:id', authenticateToken, getPet);
router.put('/:id', authenticateToken, updatePet);
router.delete('/:id', authenticateToken, deletePet);

export default router;