import express from 'express';
import { 
  createPet, 
  getUserPets, 
  getPet, 
  updatePet, 
  deletePet,
  getPetsToSwipe,
  getBreeds
} from '../controllers/petController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Rota pública para buscar raças
router.get('/breeds', getBreeds);

router.post('/', authenticateToken, createPet);
router.get('/user/:userId', authenticateToken, getUserPets);
router.get('/swipe/:userId', authenticateToken, getPetsToSwipe);
router.get('/:id', authenticateToken, getPet);
router.put('/:id', authenticateToken, updatePet);
router.delete('/:id', authenticateToken, deletePet);

export default router;