import request from 'supertest';
import express from 'express';
import { createTestUser, createTestPet, cleanupTestData } from '../helpers/testHelpers';
import { authenticateToken } from '../../middlewares/authMiddleware';
import chatRoutes from '../../routes/chatRoutes';
import { prisma } from '../setup';

const app = express();
app.use(express.json());
app.use('/chat', authenticateToken, chatRoutes);

describe('💬 Chat - Testes de Integração', () => {
  let user1: any;
  let user2: any;
  let pet1: any;
  let pet2: any;
  let match: any;
  let token1: string;
  let token2: string;

  beforeEach(async () => {
    await cleanupTestData();
    
    user1 = await createTestUser({ email: 'user1@test.com' });
    user2 = await createTestUser({ email: 'user2@test.com' });
    token1 = user1.token;
    token2 = user2.token;

    pet1 = await createTestPet(user1.id);
    pet2 = await createTestPet(user2.id);

    // Criar match entre os pets
    match = await prisma.match.create({
      data: {
        petAId: pet1.id,
        petBId: pet2.id,
        userAId: user1.id,
        userBId: user2.id,
      },
    });
  }, 30000); // Timeout de 30 segundos

  describe('POST /chat/send', () => {
    it('deve enviar uma mensagem com sucesso', async () => {
      const response = await request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          matchId: match.id,
          content: 'Olá! Como vai?',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message.content).toBe('Olá! Como vai?');
    });

    it('deve criar chat automaticamente se não existir', async () => {
      const response = await request(app)
        .post('/chat/send')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          matchId: match.id,
          content: 'Primeira mensagem',
        });

      expect(response.status).toBe(201);
      
      // Verificar se chat foi criado
      const chat = await prisma.chat.findUnique({
        where: { matchId: match.id },
      });
      expect(chat).not.toBeNull();
    });
  });

  describe('GET /chat/:matchId', () => {
    it('deve retornar mensagens do chat', async () => {
      // Criar algumas mensagens
      const chat = await prisma.chat.create({
        data: { matchId: match.id },
      });

      await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: user1.id,
          content: 'Mensagem 1',
        },
      });

      await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: user2.id,
          content: 'Mensagem 2',
        },
      });

      const response = await request(app)
        .get(`/chat/${match.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('messages');
      expect(response.body.messages.length).toBe(2);
    });

    it('não deve permitir acesso a chat de outro match', async () => {
      // Criar outro match
      const user3 = await createTestUser({ email: 'user3@test.com' });
      const pet3 = await createTestPet(user3.id);
      
      const otherMatch = await prisma.match.create({
        data: {
          petAId: pet2.id,
          petBId: pet3.id,
          userAId: user2.id,
          userBId: user3.id,
        },
      });

      const response = await request(app)
        .get(`/chat/${otherMatch.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(403);
    });
  });
});

