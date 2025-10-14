import { Router } from 'express';
import { 
  getPlans,
  getUserSubscription,
  cancelSubscription,
  checkLimits,
  getUsageStats
} from '../controllers/subscriptionController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Rotas públicas
router.get('/plans', getPlans);

// Rotas protegidas
router.get('/my-subscription', authenticateToken, getUserSubscription);
router.post('/cancel', authenticateToken, cancelSubscription);
router.get('/limits', authenticateToken, checkLimits);
router.get('/usage', authenticateToken, getUsageStats);

export default router;