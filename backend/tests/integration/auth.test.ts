import request from 'supertest';
import express from 'express';
import { createTestUser, cleanupTestData } from '../helpers/testHelpers';
import { prisma } from '../setup';

// Importar rotas
import authRoutes from '../../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('🔐 Autenticação - Testes de Integração', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'novo@test.com',
          password: '123456',
          name: 'Novo Usuário',
          city: 'São Paulo',
        cpf: '52998224725',
          phone: '11999999999',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('novo@test.com');
    });

    it('deve retornar erro se email já existe', async () => {
      await createTestUser({ email: 'existente@test.com' });

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'existente@test.com',
          password: '123456',
          name: 'Usuário',
          city: 'São Paulo',
          cpf: '52998224725',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar erro se CPF inválido', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: '123456',
          name: 'Usuário',
          city: 'São Paulo',
          cpf: '123', // CPF inválido
        });

      expect(response.status).toBe(400);
    });

    it('deve retornar erro se campos obrigatórios faltando', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          // Faltando outros campos
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const testUser = await createTestUser({
        email: 'login@test.com',
        password: '123456',
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@test.com',
          password: '123456',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('login@test.com');
    });

    it('deve retornar erro com senha incorreta', async () => {
      await createTestUser({
        email: 'login@test.com',
        password: '123456',
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@test.com',
          password: 'senhaerrada',
        });

      expect(response.status).toBe(401);
    });

    it('deve retornar erro com email não encontrado', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'naoexiste@test.com',
          password: '123456',
        });

      expect(response.status).toBe(401);
    });
  });
});

