import request from 'supertest';
import express from 'express';
import { createTestUser, createTestPet, cleanupTestData } from '../helpers/testHelpers';
import { authenticateToken } from '../../middlewares/authMiddleware';
import swipeRoutes from '../../routes/swipeRoutes';

const app = express();
app.use(express.json());
app.use('/swipe', authenticateToken, swipeRoutes);

describe('💕 Swipe - Testes de Integração', () => {
  let user1: any;
  let user2: any;
  let pet1: any;
  let pet2: any;
  let token1: string;
  let token2: string;

  beforeEach(async () => {
    await cleanupTestData();
    
    user1 = await createTestUser({ email: 'user1@test.com' });
    user2 = await createTestUser({ email: 'user2@test.com' });
    token1 = user1.token;
    token2 = user2.token;

    pet1 = await createTestPet(user1.id, {
      name: 'Pet 1',
      gender: 'M',
      objective: 'amizade',
    });

    pet2 = await createTestPet(user2.id, {
      name: 'Pet 2',
      gender: 'F',
      objective: 'amizade',
    });
  }, 30000); // Timeout de 30 segundos

  describe('GET /swipe/available', () => {
    it('deve retornar pets disponíveis para swipe', async () => {
      const response = await request(app)
        .get('/swipe/available')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pets');
      expect(response.body.pets.length).toBeGreaterThan(0);
    });

    it('não deve retornar pets do próprio usuário', async () => {
      const response = await request(app)
        .get('/swipe/available')
        .set('Authorization', `Bearer ${token1}`);

      const petIds = response.body.pets.map((p: any) => p.id);
      expect(petIds).not.toContain(pet1.id);
    });
  });

  describe('POST /swipe/like', () => {
    it('deve dar like em um pet com sucesso', async () => {
      const response = await request(app)
        .post('/swipe/like')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          toPetId: pet2.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('isMatch');
    });

    it('não deve permitir like no próprio pet', async () => {
      const response = await request(app)
        .post('/swipe/like')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          toPetId: pet1.id,
        });

      expect(response.status).toBe(400);
    });

    it('não deve permitir like duplicado', async () => {
      // Primeiro like
      await request(app)
        .post('/swipe/like')
        .set('Authorization', `Bearer ${token1}`)
        .send({ toPetId: pet2.id });

      // Segundo like (deve falhar)
      const response = await request(app)
        .post('/swipe/like')
        .set('Authorization', `Bearer ${token1}`)
        .send({ toPetId: pet2.id });

      expect(response.status).toBe(409);
    });

    it('deve criar match quando há like recíproco', async () => {
      // User1 dá like em Pet2
      await request(app)
        .post('/swipe/like')
        .set('Authorization', `Bearer ${token1}`)
        .send({ toPetId: pet2.id });

      // User2 dá like em Pet1 (match!)
      const response = await request(app)
        .post('/swipe/like')
        .set('Authorization', `Bearer ${token2}`)
        .send({ toPetId: pet1.id });

      expect(response.status).toBe(201);
      expect(response.body.isMatch).toBe(true);
    });
  });
});

