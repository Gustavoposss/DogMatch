import prisma from '../prismaClient';
import asaasClient from '../asaasClient';
import { PLANS } from '../config/plans';
import { PlanType } from '@prisma/client';
import { SubscriptionService } from './subscriptionService';

export class PaymentService {

  // ==================== CRIAR CLIENTE NO ASAAS ====================

  /**
   * Criar ou obter cliente no Asaas
   */
  static async getOrCreateAsaasCustomer(userId: string) {
    console.log('🔍 Buscando usuário:', userId);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    console.log('✅ Usuário encontrado:', {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf ? `${user.cpf.substring(0, 3)}***` : 'NÃO CADASTRADO',
      phone: user.phone || 'NÃO CADASTRADO',
      asaasCustomerId: user.asaasCustomerId || 'NÃO CRIADO'
    });

    // Se já tem ID do Asaas, verificar e atualizar se necessário
    if (user.asaasCustomerId) {
      try {
        const customer = await asaasClient.getCustomer(user.asaasCustomerId);
        
        // Verificar se o cliente tem CPF, se não tiver, atualizar com o CPF do usuário
        if (!customer.cpfCnpj && user.cpf) {
          console.log('Cliente sem CPF no Asaas, atualizando com CPF do usuário...');
          const updatedCustomer = await asaasClient.updateCustomer(customer.id, {
            cpfCnpj: user.cpf
          });
          return updatedCustomer;
        }
        
        return customer;
      } catch (error) {
        console.log('Cliente não encontrado no Asaas, criando novo...');
      }
    }

    // Criar novo cliente no Asaas
    // CPF é obrigatório para criar cobranças
    let cpfToUse = user.cpf;
    
    // CPF é obrigatório para criar cobranças
    if (!cpfToUse) {
      console.error('❌ CPF não encontrado no usuário!');
      throw new Error('CPF do usuário é obrigatório para criar pagamentos. Por favor, atualize seu cadastro com um CPF válido.');
    }
    
    console.log('✅ CPF configurado para o cliente');
    console.log('📤 Criando cliente no Asaas com os dados:', {
      name: user.name,
      email: user.email,
      cpfCnpj: `${cpfToUse.substring(0, 3)}***`,
      phone: user.phone || 'não informado'
    });
    
    let asaasCustomer;
    try {
      asaasCustomer = await asaasClient.createCustomer({
        name: user.name,
        email: user.email,
        cpfCnpj: cpfToUse,
        phone: user.phone || undefined,
        // Adicionar mais campos conforme necessário (endereço, etc)
      });
      
      console.log('✅ Cliente criado no Asaas:', asaasCustomer.id);
    } catch (error: any) {
      console.error('❌ Erro ao criar cliente no Asaas:', error.message);
      console.error('Detalhes do erro:', error.response?.data || error);
      throw error;
    }

    // Salvar ID do Asaas no banco
    await prisma.user.update({
      where: { id: userId },
      data: { asaasCustomerId: asaasCustomer.id }
    });

    return asaasCustomer;
  }

  // ==================== PAGAMENTOS DE PLANOS ====================

  /**
   * Criar cobrança para upgrade de plano
   */
  static async createPlanPayment(userId: string, planType: PlanType, billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'PIX') {
    console.log('=== INÍCIO createPlanPayment ===');
    console.log('userId:', userId);
    console.log('planType:', planType);
    console.log('billingType:', billingType);

    const plan = PLANS[planType];
    if (!plan) {
      throw new Error('Plano inválido');
    }

    if (plan.price === 0) {
      throw new Error('Não é necessário pagamento para o plano gratuito');
    }

    // Criar ou obter cliente no Asaas
    let asaasCustomer;
    try {
      asaasCustomer = await this.getOrCreateAsaasCustomer(userId);
      console.log('Cliente Asaas criado/obtido:', asaasCustomer.id);
    } catch (error: any) {
      console.error('❌ Erro ao criar/obter cliente Asaas:', error.message);
      console.error('Stack:', error.stack);
      throw new Error(`Erro ao processar cliente: ${error.message}`);
    }

    // Criar ou buscar assinatura
    let subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      console.log('Criando assinatura gratuita...');
      subscription = await SubscriptionService.createFreeSubscription(userId);
    }

    // Calcular data de vencimento (7 dias a partir de hoje)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateString = dueDate.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log('Criando cobrança no Asaas...');

    // Criar cobrança no Asaas
    const asaasPayment = await asaasClient.createPayment({
      customer: asaasCustomer.id,
      billingType: billingType,
      value: plan.price,
      dueDate: dueDateString,
      description: `Assinatura ${plan.name} - DogMatch (Mensal)`,
      externalReference: subscription.id
    });

    console.log('Cobrança Asaas criada:', asaasPayment.id);

    // Registrar pagamento no banco
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: plan.price,
        currency: 'BRL',
        status: 'PENDING',
        paymentMethod: billingType.toLowerCase(),
        asaasPaymentId: asaasPayment.id,
        transactionId: asaasPayment.id,
        invoiceUrl: asaasPayment.invoiceUrl || asaasPayment.bankSlipUrl || null
      }
    });

    console.log('Pagamento registrado no banco:', payment.id);

    // Obter QR Code se for PIX
    let pixQrCode = null;
    if (billingType === 'PIX') {
      try {
        const pixData = await asaasClient.getPixQrCode(asaasPayment.id);
        pixQrCode = {
          encodedImage: pixData.encodedImage,
          payload: pixData.payload,
          expirationDate: pixData.expirationDate
        };
      } catch (error) {
        console.error('Erro ao obter QR Code PIX:', error);
      }
    }

    return {
      paymentId: payment.id,
      asaasPaymentId: asaasPayment.id,
      invoiceUrl: asaasPayment.invoiceUrl,
      bankSlipUrl: asaasPayment.bankSlipUrl,
      pixQrCode: pixQrCode,
      dueDate: asaasPayment.dueDate,
      value: asaasPayment.value,
      status: asaasPayment.status
    };
  }

  // ==================== ASSINATURAS RECORRENTES ====================

  /**
   * Criar assinatura recorrente no Asaas
   */
  static async createRecurringSubscription(userId: string, planType: PlanType, billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'CREDIT_CARD') {
    const plan = PLANS[planType];
    if (!plan || plan.price === 0) {
      throw new Error('Plano inválido para assinatura recorrente');
    }

    // Criar ou obter cliente no Asaas
    const asaasCustomer = await this.getOrCreateAsaasCustomer(userId);

    // Criar ou buscar assinatura no banco
    let subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      subscription = await SubscriptionService.createFreeSubscription(userId);
    }

    // Calcular próxima data de cobrança
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 7);
    const nextDueDateString = nextDueDate.toISOString().split('T')[0];

    // Criar assinatura recorrente no Asaas
    const asaasSubscription = await asaasClient.createSubscription({
      customer: asaasCustomer.id,
      billingType: billingType,
      value: plan.price,
      nextDueDate: nextDueDateString,
      cycle: 'MONTHLY',
      description: `Plano ${plan.name} - DogMatch`,
      externalReference: subscription.id
    });

    // Atualizar assinatura no banco
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        asaasSubscriptionId: asaasSubscription.id,
        autoRenew: true
      }
    });

    return {
      subscriptionId: subscription.id,
      asaasSubscriptionId: asaasSubscription.id,
      status: asaasSubscription.status,
      nextDueDate: asaasSubscription.nextDueDate,
      value: asaasSubscription.value
    };
  }

  // ==================== WEBHOOK ====================

  /**
   * Processar webhook do Asaas
   */
  static async processWebhook(webhookData: any) {
    try {
      console.log('=== Webhook Asaas Recebido ===');
      console.log('Event:', webhookData.event);
      console.log('Payment ID:', webhookData.payment?.id);

      const eventType = webhookData.event;
      const paymentData = webhookData.payment;

      if (!paymentData) {
        console.log('Webhook sem dados de pagamento, ignorando...');
        return;
      }

      // Buscar pagamento no banco pelo asaasPaymentId
      const payment = await prisma.payment.findFirst({
        where: {
          asaasPaymentId: paymentData.id
        },
        include: {
          subscription: {
            include: {
              user: true
            }
          }
        }
      });

      if (!payment) {
        console.log('Pagamento não encontrado no banco:', paymentData.id);
        return;
      }

      // Mapear status do Asaas para nosso enum
      let newStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' = 'PENDING';

      switch (eventType) {
        case 'PAYMENT_RECEIVED':
        case 'PAYMENT_CONFIRMED':
          newStatus = 'COMPLETED';
          break;
        
        case 'PAYMENT_OVERDUE':
        case 'PAYMENT_DELETED':
          newStatus = 'FAILED';
          break;
        
        case 'PAYMENT_REFUNDED':
        case 'PAYMENT_CHARGEBACK_REQUESTED':
        case 'PAYMENT_CHARGEBACK_DISPUTE':
          newStatus = 'REFUNDED';
          break;
        
        case 'PAYMENT_AWAITING_RISK_ANALYSIS':
        case 'PAYMENT_APPROVED_BY_RISK_ANALYSIS':
        case 'PAYMENT_REPROVED_BY_RISK_ANALYSIS':
          newStatus = 'PENDING';
          break;

        default:
          console.log('Evento não tratado:', eventType);
          return;
      }

      // Atualizar status do pagamento
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          invoiceUrl: paymentData.invoiceUrl || payment.invoiceUrl
        }
      });

      console.log(`Pagamento ${payment.id} atualizado para ${newStatus}`);

      // Se pagamento foi confirmado, fazer upgrade do plano
      if (newStatus === 'COMPLETED') {
        const subscriptionId = payment.subscription.id;
        const subscription = await prisma.subscription.findUnique({
          where: { id: subscriptionId }
        });

        if (subscription && subscription.planType === 'FREE') {
          // Descobrir qual plano foi pago baseado no valor
          let planType: PlanType = 'FREE';
          
          if (payment.amount === PLANS.PREMIUM.price) {
            planType = 'PREMIUM';
          } else if (payment.amount === PLANS.VIP.price) {
            planType = 'VIP';
          }

          if (planType !== 'FREE') {
            await SubscriptionService.upgradePlan(
              payment.subscription.userId,
              planType,
              paymentData.id
            );
            console.log(`Plano ${planType} ativado para usuário ${payment.subscription.userId}`);
          }
        }
      }

      // Se pagamento falhou ou foi estornado, fazer downgrade se necessário
      if (newStatus === 'FAILED' || newStatus === 'REFUNDED') {
        console.log('Pagamento falhou/estornado. Considerar downgrade...');
        // Implementar lógica de downgrade se necessário
      }

    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }

  // ==================== CONSULTAS ====================

  /**
   * Verificar status de um pagamento
   */
  static async checkPaymentStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        subscription: {
          include: {
            user: true
          }
        }
      }
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    // Se tem asaasPaymentId, buscar status atualizado no Asaas
    if (payment.asaasPaymentId) {
      try {
        const asaasPayment = await asaasClient.getPayment(payment.asaasPaymentId);
        
        // Mapear status
        let status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' = 'PENDING';
        
        switch (asaasPayment.status) {
          case 'RECEIVED':
          case 'CONFIRMED':
            status = 'COMPLETED';
            break;
          case 'OVERDUE':
          case 'REFUND_REQUESTED':
          case 'REFUNDED':
            status = 'FAILED';
            break;
          case 'CHARGEBACK_REQUESTED':
          case 'CHARGEBACK_DISPUTE':
          case 'AWAITING_CHARGEBACK_REVERSAL':
            status = 'REFUNDED';
            break;
          default:
            status = 'PENDING';
        }

        // Atualizar se mudou
        if (status !== payment.status) {
          await prisma.payment.update({
            where: { id: paymentId },
            data: { status }
          });
        }

        return { ...payment, status, asaasStatus: asaasPayment.status };
      } catch (error) {
        console.error('Erro ao buscar pagamento no Asaas:', error);
      }
    }

    return payment;
  }

  /**
   * Listar pagamentos do usuário
   */
  static async getUserPayments(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      return [];
    }

    const payments = await prisma.payment.findMany({
      where: {
        subscriptionId: subscription.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return payments;
  }

  // ==================== CANCELAMENTOS ====================

  /**
   * Cancelar pagamento pendente
   */
  static async cancelPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    if (payment.status === 'COMPLETED') {
      throw new Error('Não é possível cancelar um pagamento já confirmado');
    }

    // Deletar no Asaas se existir
    if (payment.asaasPaymentId) {
      try {
        await asaasClient.deletePayment(payment.asaasPaymentId);
      } catch (error) {
        console.error('Erro ao cancelar no Asaas:', error);
      }
    }

    // Atualizar status no banco
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'FAILED' }
    });

    return { message: 'Pagamento cancelado com sucesso' };
  }

  // ==================== PRODUTOS EXTRAS ====================

  /**
   * Criar pagamento para produto avulso (boost, swipes extras, etc)
   */
  static async createExtraProductPayment(userId: string, productType: string, amount: number, billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'PIX') {
    const asaasCustomer = await this.getOrCreateAsaasCustomer(userId);

    let subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      subscription = await SubscriptionService.createFreeSubscription(userId);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateString = dueDate.toISOString().split('T')[0];

    const asaasPayment = await asaasClient.createPayment({
      customer: asaasCustomer.id,
      billingType: billingType,
      value: amount,
      dueDate: dueDateString,
      description: `${productType} - DogMatch`,
      externalReference: `${subscription.id}_${productType}`
    });

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount,
        currency: 'BRL',
        status: 'PENDING',
        paymentMethod: billingType.toLowerCase(),
        asaasPaymentId: asaasPayment.id,
        transactionId: asaasPayment.id,
        invoiceUrl: asaasPayment.invoiceUrl || asaasPayment.bankSlipUrl || null
      }
    });

    let pixQrCode = null;
    if (billingType === 'PIX') {
      try {
        const pixData = await asaasClient.getPixQrCode(asaasPayment.id);
        pixQrCode = {
          encodedImage: pixData.encodedImage,
          payload: pixData.payload,
          expirationDate: pixData.expirationDate
        };
      } catch (error) {
        console.error('Erro ao obter QR Code PIX:', error);
      }
    }

    return {
      paymentId: payment.id,
      asaasPaymentId: asaasPayment.id,
      invoiceUrl: asaasPayment.invoiceUrl,
      bankSlipUrl: asaasPayment.bankSlipUrl,
      pixQrCode: pixQrCode,
      dueDate: asaasPayment.dueDate,
      value: asaasPayment.value
    };
  }
}
