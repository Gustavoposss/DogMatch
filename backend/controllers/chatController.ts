import { Request, Response } from 'express';
import prisma from '../prismaClient';

interface AuthRequest extends Request {
  userId?: string;
}

// Enviar mensagem em um chat de match
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, content } = req.body;
    const userId = req.userId;

    if (!matchId || !content) {
      return res.status(400).json({ error: 'matchId e content são obrigatórios.' });
    }

    // Verifica se o usuário faz parte do match
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match || (match.userAId !== userId && match.userBId !== userId)) {
      return res.status(403).json({ error: 'Você não tem permissão para enviar mensagem neste chat.' });
    }

    // Busca ou cria o chat
    let chat = await prisma.chat.findUnique({ where: { matchId } });
    if (!chat) {
      chat = await prisma.chat.create({ data: { matchId } });
    }

    // Cria a mensagem
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: userId!,
        content
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Listar mensagens de um chat
export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId;

    // Verifica se o usuário faz parte do match
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match || (match.userAId !== userId && match.userBId !== userId)) {
      return res.status(403).json({ error: 'Você não tem permissão para ver este chat.' });
    }

    // Busca o chat
    const chat = await prisma.chat.findUnique({
      where: { matchId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};