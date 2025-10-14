import prisma from '../prismaClient';
import { PlanType, SubscriptionStatus } from '@prisma/client';
import { PLANS } from '../config/plans';

export class SubscriptionService {
  
  // Criar assinatura gratuita para novo usuário
  static async createFreeSubscription(userId: string) {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planType: 'FREE',
        status: 'ACTIVE',
        usageLimits: {
          create: {
            maxPets: PLANS.FREE.maxPets,
            maxSwipesPerDay: PLANS.FREE.maxSwipesPerDay,
            canSeeWhoLiked: PLANS.FREE.canSeeWhoLiked,
            canBoost: PLANS.FREE.canBoost,
            canUndoSwipe: PLANS.FREE.canUndoSwipe,
            boostsRemaining: PLANS.FREE.boostsPerMonth,
            swipesToday: 0
          }
        }
      },
      include: {
        usageLimits: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    return subscription;
  }

  // Buscar assinatura do usuário
  static async getUserSubscription(userId: string) {
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        usageLimits: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    // Se não existe, criar uma gratuita
    if (!subscription) {
      subscription = await this.createFreeSubscription(userId);
    }

    return subscription;
  }

  // Atualizar plano
  static async upgradePlan(userId: string, planType: PlanType, asaasSubscriptionId?: string) {
    const planConfig = PLANS[planType];
    
    if (!planConfig) {
      throw new Error('Plano inválido');
    }

    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        planType,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        asaasSubscriptionId,
        usageLimits: {
          update: {
            maxPets: planConfig.maxPets,
            maxSwipesPerDay: planConfig.maxSwipesPerDay,
            canSeeWhoLiked: planConfig.canSeeWhoLiked,
            canBoost: planConfig.canBoost,
            canUndoSwipe: planConfig.canUndoSwipe,
            boostsRemaining: planConfig.boostsPerMonth
          }
        }
      },
      include: {
        usageLimits: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    return subscription;
  }

  // Cancelar assinatura
  static async cancelSubscription(userId: string) {
    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELED',
        autoRenew: false
      }
    });

    return subscription;
  }

  // Verificar se assinatura expirou
  static async checkExpiredSubscriptions() {
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        endDate: {
          lte: new Date()
        },
        status: 'ACTIVE',
        planType: {
          not: 'FREE'
        }
      }
    });

    for (const sub of expiredSubscriptions) {
      if (!sub.autoRenew) {
        // Voltar para plano gratuito
        await this.downgradeToPlan(sub.userId, 'FREE');
      }
    }

    return expiredSubscriptions.length;
  }

  // Downgrade para plano gratuito
  static async downgradeToPlan(userId: string, planType: PlanType) {
    const planConfig = PLANS[planType];

    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        planType,
        status: 'ACTIVE',
        usageLimits: {
          update: {
            maxPets: planConfig.maxPets,
            maxSwipesPerDay: planConfig.maxSwipesPerDay,
            canSeeWhoLiked: planConfig.canSeeWhoLiked,
            canBoost: planConfig.canBoost,
            canUndoSwipe: planConfig.canUndoSwipe,
            boostsRemaining: planConfig.boostsPerMonth
          }
        }
      }
    });

    return subscription;
  }

  // Resetar contadores mensais (boosts)
  static async resetMonthlyLimits() {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        planType: {
          in: ['PREMIUM', 'VIP']
        }
      },
      include: {
        usageLimits: true
      }
    });

    for (const sub of subscriptions) {
      const planConfig = PLANS[sub.planType];
      
      await prisma.usageLimit.update({
        where: { id: sub.usageLimits!.id },
        data: {
          boostsRemaining: planConfig.boostsPerMonth
        }
      });
    }

    return subscriptions.length;
  }
}