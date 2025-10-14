import { Request, Response, NextFunction } from 'express';
import { UsageLimitService } from '../services/usageLimitService';

interface AuthRequest extends Request {
  userId?: string;
}

// Middleware para verificar se pode criar pet
export const checkPetCreationLimit = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const result = await UsageLimitService.canCreatePet(userId);

    if (!result.canCreate) {
      return res.status(403).json({ 
        error: result.reason,
        limitReached: true,
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar limite de pets:', error);
    res.status(500).json({ error: 'Erro ao verificar limite' });
  }
};

// Middleware para verificar se pode dar swipe
export const checkSwipeLimit = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const result = await UsageLimitService.canSwipe(userId);

    if (!result.canSwipe) {
      return res.status(403).json({ 
        error: result.reason,
        limitReached: true,
        upgradeRequired: true,
        remaining: 0
      });
    }

    // Adicionar informação de swipes restantes na request
    (req as any).swipesRemaining = result.remaining;

    next();
  } catch (error) {
    console.error('Erro ao verificar limite de swipes:', error);
    res.status(500).json({ error: 'Erro ao verificar limite' });
  }
};

// Middleware para verificar se pode usar boost
export const checkBoostLimit = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const result = await UsageLimitService.canUseBoost(userId);

    if (!result.canUse) {
      return res.status(403).json({ 
        error: result.reason,
        limitReached: true,
        upgradeRequired: !result.reason?.includes('Premium')
      });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar limite de boost:', error);
    res.status(500).json({ error: 'Erro ao verificar limite' });
  }
};