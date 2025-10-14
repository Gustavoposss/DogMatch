import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { PlanType } from '@prisma/client';
import asaasClient from '../asaasClient';

interface AuthRequest extends Request {
  userId?: string;
}

// ==================== TESTE DE CONEXÃO ====================

/**
 * Testar conexão com Asaas
 */
export const testAsaas = async (req: Request, res: Response) => {
  try {
    const healthCheck = await asaasClient.healthCheck();
    
    res.json({
      success: healthCheck.status === 'ok',
      message: healthCheck.status === 'ok' 
        ? 'Conexão com Asaas OK' 
        : 'Erro na conexão com Asaas',
      ...healthCheck
    });
  } catch (error: any) {
    console.error('Erro ao testar Asaas:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'Detalhes não disponíveis'
    });
  }
};

// ==================== CRIAR PAGAMENTOS ====================

/**
 * Criar pagamento para upgrade de plano
 */
export const createPlanPayment = async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== CONTROLLER createPlanPayment ===');
    console.log('Body:', req.body);
    console.log('UserId:', req.userId);

    const userId = req.userId;
    const { planType, billingType = 'PIX' } = req.body;

    if (!userId) {
      console.log('Erro: Usuário não autenticado');
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!planType || !['FREE', 'PREMIUM', 'VIP'].includes(planType)) {
      console.log('Erro: Tipo de plano inválido:', planType);
      return res.status(400).json({ error: 'Tipo de plano inválido' });
    }

    if (!['BOLETO', 'CREDIT_CARD', 'PIX'].includes(billingType)) {
      return res.status(400).json({ error: 'Tipo de cobrança inválido. Use: BOLETO, CREDIT_CARD ou PIX' });
    }

    console.log('Chamando PaymentService.createPlanPayment...');
    const payment = await PaymentService.createPlanPayment(
      userId, 
      planType as PlanType,
      billingType
    );
    
    console.log('PaymentService retornou:', payment);

    res.json(payment);
  } catch (error: any) {
    console.error('=== ERRO NO CONTROLLER ===');
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Erro ao criar pagamento',
      details: error.response?.data
    });
  }
};

/**
 * Criar assinatura recorrente
 */
export const createRecurringSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { planType, billingType = 'CREDIT_CARD' } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!planType || !['PREMIUM', 'VIP'].includes(planType)) {
      return res.status(400).json({ error: 'Tipo de plano inválido para assinatura recorrente' });
    }

    if (!['BOLETO', 'CREDIT_CARD', 'PIX'].includes(billingType)) {
      return res.status(400).json({ error: 'Tipo de cobrança inválido' });
    }

    const subscription = await PaymentService.createRecurringSubscription(
      userId,
      planType as PlanType,
      billingType
    );

    res.json(subscription);
  } catch (error: any) {
    console.error('Erro ao criar assinatura recorrente:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao criar assinatura recorrente',
      details: error.response?.data
    });
  }
};

/**
 * Criar pagamento para produto extra
 */
export const createExtraProductPayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { productType, amount, billingType = 'PIX' } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!productType || !amount) {
      return res.status(400).json({ error: 'Dados inválidos. Envie productType e amount' });
    }

    if (!['BOLETO', 'CREDIT_CARD', 'PIX'].includes(billingType)) {
      return res.status(400).json({ error: 'Tipo de cobrança inválido' });
    }

    const payment = await PaymentService.createExtraProductPayment(
      userId, 
      productType, 
      amount,
      billingType
    );

    res.json(payment);
  } catch (error: any) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao criar pagamento',
      details: error.response?.data
    });
  }
};

// ==================== WEBHOOKS ====================

/**
 * Webhook do Asaas
 */
export const asaasWebhook = async (req: Request, res: Response) => {
  try {
    console.log('=== Webhook Asaas Recebido ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Processar webhook em background
    PaymentService.processWebhook(req.body)
      .catch(error => console.error('Erro ao processar webhook:', error));

    // Responder imediatamente para o Asaas
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

// ==================== CONSULTAS ====================

/**
 * Verificar status de pagamento
 */
export const checkPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'ID do pagamento não fornecido' });
    }

    const payment = await PaymentService.checkPaymentStatus(paymentId);

    res.json({ payment });
  } catch (error: any) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao verificar status do pagamento',
      details: error.response?.data
    });
  }
};

/**
 * Listar pagamentos do usuário
 */
export const getUserPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const payments = await PaymentService.getUserPayments(userId);

    res.json({ payments });
  } catch (error: any) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao buscar pagamentos',
      details: error.response?.data
    });
  }
};

// ==================== CANCELAMENTOS ====================

/**
 * Cancelar pagamento pendente
 */
export const cancelPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'ID do pagamento não fornecido' });
    }

    const result = await PaymentService.cancelPayment(paymentId);

    res.json(result);
  } catch (error: any) {
    console.error('Erro ao cancelar pagamento:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao cancelar pagamento',
      details: error.response?.data
    });
  }
};
