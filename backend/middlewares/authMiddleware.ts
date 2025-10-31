import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// JWT_SECRET é obrigatório em produção
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  const error = '❌ JWT_SECRET não configurado nas variáveis de ambiente!';
  logger.error(error);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(error);
  }
}

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!JWT_SECRET) {
    logger.error('JWT_SECRET não configurado');
    return res.status(500).json({ error: 'Erro de configuração do servidor.' });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    logger.warn('Token inválido ou expirado');
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};