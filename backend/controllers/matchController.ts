import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getUserMatches = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      },
      include: {
        petA: true,
        petB: true
      }
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar matches.' });
  }
};