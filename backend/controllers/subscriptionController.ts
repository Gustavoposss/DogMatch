import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { UsageLimitService } from '../services/usageLimitService';
import { PLANS } from '../config/plans';
import { PlanType } from '@prisma/client';

interface AuthRequest extends Request {
  userId?: string;
}

// Listar todos os planos disponíveis
export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = Object.entries(PLANS).map(([key, value]) => ({
      type: key,
      ...value
    }));

    res.json({ plans });
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ error: 'Erro ao buscar planos' });
  }
};

// Buscar assinatura do usuário
export const getUserSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const subscription = await SubscriptionService.getUserSubscription(userId);
    const usageStats = await UsageLimitService.getUsageStats(userId);

    res.json({ 
      subscription,
      usage: usageStats
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({ error: 'Erro ao buscar assinatura' });
  }
};

// Cancelar assinatura
export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const subscription = await SubscriptionService.cancelSubscription(userId);

    res.json({ 
      message: 'Assinatura cancelada com sucesso',
      subscription 
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  }
};

// Verificar limites de uso
export const checkLimits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const canCreatePet = await UsageLimitService.canCreatePet(userId);
    const canSwipe = await UsageLimitService.canSwipe(userId);
    const canBoost = await UsageLimitService.canUseBoost(userId);

    res.json({
      pets: canCreatePet,
      swipes: canSwipe,
      boost: canBoost
    });
  } catch (error) {
    console.error('Erro ao verificar limites:', error);
    res.status(500).json({ error: 'Erro ao verificar limites' });
  }
};

// Obter estatísticas de uso
export const getUsageStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Garantir que o usuário tem uma subscription antes de buscar stats
    const subscription = await SubscriptionService.getUserSubscription(userId);
    
    const stats = await UsageLimitService.getUsageStats(userId);

    if (!stats) {
      // Se não retornou stats, criar uma subscription gratuita e tentar novamente
      await SubscriptionService.createFreeSubscription(userId);
      const newStats = await UsageLimitService.getUsageStats(userId);
      return res.json({ stats: newStats });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};