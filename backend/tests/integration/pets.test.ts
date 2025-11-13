import request from 'supertest';
import express from 'express';
import { createTestUser, createTestPet, cleanupTestData } from '../helpers/testHelpers';
import { authenticateToken } from '../../middlewares/authMiddleware';
import petRoutes from '../../routes/petRoutes';

const app = express();
app.use(express.json());
app.use('/pets', authenticateToken, petRoutes);

describe('🐕 Pets - Testes de Integração', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser();
    authToken = testUser.token;
  }, 30000); // Timeout de 30 segundos

  describe('POST /pets', () => {
    it('deve criar um pet com sucesso', async () => {
      const response = await request(app)
        .post('/pets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Rex',
          breed: 'Golden Retriever',
          age: 3,
          gender: 'M',
          size: 'grande',
          isNeutered: false,
          objective: 'amizade',
          description: 'Um cão muito amigável',
          photoUrl: 'https://via.placeholder.com/400',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('pet');
      expect(response.body.pet.name).toBe('Rex');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .post('/pets')
        .send({
          name: 'Rex',
          breed: 'Golden Retriever',
          age: 3,
          gender: 'M',
          size: 'grande',
          isNeutered: false,
          objective: 'amizade',
        });

      expect(response.status).toBe(401);
    });

    it('deve retornar erro com campos obrigatórios faltando', async () => {
      const response = await request(app)
        .post('/pets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Rex',
          // Faltando outros campos
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /pets/user/:userId', () => {
    it('deve listar pets do usuário', async () => {
      await createTestPet(testUser.id);
      await createTestPet(testUser.id, { name: 'Bella' });

      const response = await request(app)
        .get(`/pets/user/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pets');
      expect(response.body.pets.length).toBe(2);
    });
  });

  describe('PUT /pets/:id', () => {
    it('deve atualizar um pet com sucesso', async () => {
      const pet = await createTestPet(testUser.id);

      const response = await request(app)
        .put(`/pets/${pet.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Rex Atualizado',
          age: 4,
        });

      expect(response.status).toBe(200);
      expect(response.body.pet.name).toBe('Rex Atualizado');
      expect(response.body.pet.age).toBe(4);
    });
  });

  describe('DELETE /pets/:id', () => {
    it('deve deletar um pet com sucesso', async () => {
      const pet = await createTestPet(testUser.id);

      const response = await request(app)
        .delete(`/pets/${pet.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verificar se foi deletado
      const checkResponse = await request(app)
        .get(`/pets/user/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(checkResponse.body.pets.length).toBe(0);
    });
  });
});

