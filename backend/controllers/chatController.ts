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
      },
      include: {
        chat: {
          include: {
            match: true
          }
        }
      }
    });

    // Buscar informações do remetente
    const sender = await prisma.user.findUnique({
      where: { id: userId! },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    const messageWithSender = {
      ...message,
      sender: sender || null,
      createdAt: message.createdAt.toISOString(),
    };

    res.status(201).json({ message: messageWithSender });
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

    // Busca o chat com mensagens
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

    // Buscar todos os remetentes de uma vez (otimização)
    const senderIds = [...new Set(chat.messages.map(msg => msg.senderId))];
    const senders = await prisma.user.findMany({
      where: { id: { in: senderIds } },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    // Criar mapa de remetentes para acesso rápido
    const senderMap = new Map(senders.map(s => [s.id, s]));

    // Transformar mensagens para incluir informações do remetente
    const messagesWithSender = chat.messages.map((message) => ({
      ...message,
      sender: senderMap.get(message.senderId) || null,
      createdAt: message.createdAt.toISOString(),
    }));

    res.json({ messages: messagesWithSender });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};