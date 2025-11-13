import express from 'express';
import { getUserById, updateUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/me', authenticateToken, updateUser); // Atualizar próprio perfil
router.get('/me', authenticateToken, (req, res) => {
  // Retornar dados do usuário autenticado
  const userId = (req as any).userId;
  getUserById({ params: { id: userId } } as any, res);
});

export default router;