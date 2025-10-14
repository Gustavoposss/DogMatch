import prisma from '../prismaClient';

export class UsageLimitService {
  
  // Verificar se pode criar mais pets
  static async canCreatePet(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        usageLimits: true,
        user: {
          include: {
            pets: true
          }
        }
      }
    });

    if (!subscription || !subscription.usageLimits) {
      return { canCreate: false, reason: 'Assinatura não encontrada' };
    }

    const { maxPets } = subscription.usageLimits;
    const currentPets = subscription.user.pets.length;

    // -1 significa ilimitado
    if (maxPets === -1) {
      return { canCreate: true };
    }

    if (currentPets >= maxPets) {
      return { 
        canCreate: false, 
        reason: `Você atingiu o limite de ${maxPets} pet(s). Faça upgrade para adicionar mais!` 
      };
    }

    return { canCreate: true };
  }

  // Verificar se pode dar swipe
  static async canSwipe(userId: string): Promise<{ canSwipe: boolean; reason?: string; remaining?: number }> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        usageLimits: true
      }
    });

    if (!subscription || !subscription.usageLimits) {
      return { canSwipe: false, reason: 'Assinatura não encontrada' };
    }

    const limits = subscription.usageLimits;

    // Resetar contador diário se necessário
    const now = new Date();
    const lastReset = new Date(limits.lastSwipeReset);
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      await prisma.usageLimit.update({
        where: { id: limits.id },
        data: {
          swipesToday: 0,
          lastSwipeReset: now
        }
      });
      limits.swipesToday = 0;
    }

    // -1 significa ilimitado
    if (limits.maxSwipesPerDay === -1) {
      return { canSwipe: true, remaining: -1 };
    }

    if (limits.swipesToday >= limits.maxSwipesPerDay) {
      return { 
        canSwipe: false, 
        reason: 'Você atingiu o limite de swipes diários. Volte amanhã ou faça upgrade!',
        remaining: 0
      };
    }

    const remaining = limits.maxSwipesPerDay - limits.swipesToday;

    return { canSwipe: true, remaining };
  }

  // Incrementar contador de swipes
  static async incrementSwipeCount(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { usageLimits: true }
    });

    if (!subscription || !subscription.usageLimits) {
      throw new Error('Assinatura não encontrada');
    }

    // Só incrementa se não for ilimitado
    if (subscription.usageLimits.maxSwipesPerDay !== -1) {
      await prisma.usageLimit.update({
        where: { id: subscription.usageLimits.id },
        data: {
          swipesToday: {
            increment: 1
          }
        }
      });
    }
  }

  // Verificar se pode usar boost
  static async canUseBoost(userId: string): Promise<{ canUse: boolean; reason?: string; remaining?: number }> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { usageLimits: true }
    });

    if (!subscription || !subscription.usageLimits) {
      return { canUse: false, reason: 'Assinatura não encontrada' };
    }

    if (!subscription.usageLimits.canBoost) {
      return { canUse: false, reason: 'Boost disponível apenas para planos Premium e VIP' };
    }

    if (subscription.usageLimits.boostsRemaining <= 0) {
      return { canUse: false, reason: 'Você não tem mais boosts disponíveis este mês' };
    }

    return { canUse: true, remaining: subscription.usageLimits.boostsRemaining };
  }

  // Decrementar boosts
  static async useBoost(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { usageLimits: true }
    });

    if (!subscription || !subscription.usageLimits) {
      throw new Error('Assinatura não encontrada');
    }

    await prisma.usageLimit.update({
      where: { id: subscription.usageLimits.id },
      data: {
        boostsRemaining: {
          decrement: 1
        }
      }
    });
  }

  // Obter estatísticas de uso
  static async getUsageStats(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        usageLimits: true,
        user: {
          include: {
            pets: true
          }
        }
      }
    });

    if (!subscription || !subscription.usageLimits) {
      return null;
    }

    const limits = subscription.usageLimits;
    const currentPets = subscription.user.pets.length;

    return {
      planType: subscription.planType,
      pets: {
        current: currentPets,
        max: limits.maxPets,
        unlimited: limits.maxPets === -1
      },
      swipes: {
        today: limits.swipesToday,
        max: limits.maxSwipesPerDay,
        unlimited: limits.maxSwipesPerDay === -1,
        remaining: limits.maxSwipesPerDay === -1 ? -1 : limits.maxSwipesPerDay - limits.swipesToday
      },
      boosts: {
        remaining: limits.boostsRemaining,
        enabled: limits.canBoost
      },
      features: {
        canSeeWhoLiked: limits.canSeeWhoLiked,
        canUndoSwipe: limits.canUndoSwipe
      }
    };
  }
}