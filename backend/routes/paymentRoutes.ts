import { Router } from 'express';
import { 
  createPlanPayment,
  createRecurringSubscription,
  asaasWebhook,
  checkPaymentStatus,
  getUserPayments,
  createExtraProductPayment,
  cancelPayment,
  testAsaas
} from '../controllers/paymentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Teste de conexão (público)
router.get('/test', testAsaas);

// Webhook (rota pública - Asaas vai chamar)
router.post('/webhook', asaasWebhook);

// Rotas protegidas
router.post('/create-plan-payment', authenticateToken, createPlanPayment);
router.post('/create-recurring-subscription', authenticateToken, createRecurringSubscription);
router.post('/create-extra-payment', authenticateToken, createExtraProductPayment);
router.get('/status/:paymentId', authenticateToken, checkPaymentStatus);
router.get('/my-payments', authenticateToken, getUserPayments);
router.delete('/cancel/:paymentId', authenticateToken, cancelPayment);

export default router;