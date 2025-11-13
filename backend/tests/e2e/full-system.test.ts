import request from 'supertest';
import express from 'express';
import { createTestUser, createTestPet, cleanupTestData } from '../helpers/testHelpers';
import { authenticateToken } from '../../middlewares/authMiddleware';
import authRoutes from '../../routes/authRoutes';
import petRoutes from '../../routes/petRoutes';
import swipeRoutes from '../../routes/swipeRoutes';
import matchRoutes from '../../routes/matchRoutes';
import chatRoutes from '../../routes/chatRoutes';
import { prisma } from '../setup';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/pets', authenticateToken, petRoutes);
app.use('/swipe', authenticateToken, swipeRoutes);
app.use('/matches', authenticateToken, matchRoutes);
app.use('/chat', authenticateToken, chatRoutes);

/**
 * 🧪 TESTE END-TO-END COMPLETO DO SISTEMA
 * 
 * Este teste simula um fluxo completo de uso da aplicação:
 * 1. Registro de usuários
 * 2. Cadastro de pets
 * 3. Sistema de swipe e matches
 * 4. Chat entre matches
 */
describe('🚀 TESTE COMPLETO DO SISTEMA - End-to-End', () => {
  beforeEach(async () => {
    await cleanupTestData();
  }, 30000);

  it('deve executar fluxo completo: registro → pets → swipe → match → chat', async () => {
    console.log('\n📋 Iniciando teste end-to-end completo...\n');

    // ========== ETAPA 1: REGISTRO DE USUÁRIOS ==========
    console.log('1️⃣ Registrando usuários...');
    
    const user1Response = await request(app)
      .post('/auth/register')
      .send({
        email: 'usuario1@test.com',
        password: '123456',
        name: 'Usuário 1',
        city: 'São Paulo',
        cpf: '52998224725',
        phone: '11999999999',
      });

    expect(user1Response.status).toBe(201);
    const user1Token = user1Response.body.token;
    const user1Id = user1Response.body.user.id;
    console.log('✅ Usuário 1 registrado');

    const user2Response = await request(app)
      .post('/auth/register')
      .send({
        email: 'usuario2@test.com',
        password: '123456',
        name: 'Usuário 2',
        city: 'Rio de Janeiro',
        cpf: '86288366757',
        phone: '21999999999',
      });

    expect(user2Response.status).toBe(201);
    const user2Token = user2Response.body.token;
    const user2Id = user2Response.body.user.id;
    console.log('✅ Usuário 2 registrado');

    // ========== ETAPA 2: CADASTRO DE PETS ==========
    console.log('\n2️⃣ Cadastrando pets...');

    const pet1Response = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Rex',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'M',
        size: 'grande',
        isNeutered: false,
        objective: 'amizade',
        description: 'Cão muito amigável',
        photoUrl: 'https://via.placeholder.com/400',
      });

    expect(pet1Response.status).toBe(201);
    const pet1Id = pet1Response.body.pet.id;

    const pet2Response = await request(app)
      .post('/pets')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        name: 'Bella',
        breed: 'Labrador Retriever',
        age: 2,
        gender: 'F',
        size: 'grande',
        isNeutered: true,
        objective: 'amizade',
        description: 'Cadelinha brincalhona',
        photoUrl: 'https://via.placeholder.com/400',
      });

    expect(pet2Response.status).toBe(201);
    const pet2Id = pet2Response.body.pet.id;

    // ========== ETAPA 3: BUSCAR PETS PARA SWIPE ==========
    console.log('\n3️⃣ Buscando pets disponíveis para swipe...');

    const availablePetsResponse = await request(app)
      .get('/swipe/available')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(availablePetsResponse.status).toBe(200);
    expect(availablePetsResponse.body.pets.length).toBeGreaterThan(0);
    console.log(`✅ ${availablePetsResponse.body.pets.length} pets disponíveis encontrados`);

    // ========== ETAPA 4: SISTEMA DE SWIPE ==========
    console.log('\n4️⃣ Realizando swipes...');

    // User1 dá like em Pet2
    const like1Response = await request(app)
      .post('/swipe/like')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ toPetId: pet2Id });

    expect(like1Response.status).toBe(201);
    expect(like1Response.body.isMatch).toBe(false); // Ainda não é match
    console.log('✅ User1 deu like em Pet2');

    // User2 dá like em Pet1 (deve criar match!)
    const like2Response = await request(app)
      .post('/swipe/like')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ toPetId: pet1Id });

    expect(like2Response.status).toBe(201);
    expect(like2Response.body.isMatch).toBe(true); // Agora é match!
    console.log('✅ User2 deu like em Pet1 - MATCH CRIADO! 🎉');

    // ========== ETAPA 5: VERIFICAR MATCHES ==========
    console.log('\n5️⃣ Verificando matches...');

    const matchesResponse = await request(app)
      .get(`/matches/user/${user1Id}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(matchesResponse.status).toBe(200);
    expect(Array.isArray(matchesResponse.body)).toBe(true);
    expect(matchesResponse.body.length).toBeGreaterThan(0);
    const match = matchesResponse.body[0];
    console.log(`✅ ${matchesResponse.body.length} match(es) encontrado(s)`);

    // ========== ETAPA 6: CHAT ENTRE MATCHES ==========
    console.log('\n6️⃣ Testando chat...');

    // User1 envia mensagem
    const message1Response = await request(app)
      .post('/chat/send')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        matchId: match.id,
        content: 'Olá! Que bom que deu match! 🐾',
      });

    expect(message1Response.status).toBe(201);
    console.log('✅ Mensagem 1 enviada');

    // User2 envia mensagem
    const message2Response = await request(app)
      .post('/chat/send')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        matchId: match.id,
        content: 'Oi! Também fiquei feliz! 🎉',
      });

    expect(message2Response.status).toBe(201);
    console.log('✅ Mensagem 2 enviada');

    // Buscar mensagens do chat
    const chatResponse = await request(app)
      .get(`/chat/${match.id}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(chatResponse.status).toBe(200);
    expect(chatResponse.body.messages.length).toBe(2);
    console.log(`✅ ${chatResponse.body.messages.length} mensagens no chat`);

    // ========== ETAPA 7: VERIFICAR QUE PETS JÁ CURTIDOS NÃO APARECEM ==========
    console.log('\n7️⃣ Verificando filtro de pets já curtidos...');

    const availableAfterLike = await request(app)
      .get('/swipe/available')
      .set('Authorization', `Bearer ${user1Token}`);

    const petIds = availableAfterLike.body.pets.map((p: any) => p.id);
    expect(petIds).not.toContain(pet2Id); // Pet2 não deve aparecer mais
    console.log('✅ Pets já curtidos não aparecem na lista');

    console.log('\n✅✅✅ TESTE END-TO-END COMPLETO: TODOS OS TESTES PASSARAM! 🎉\n');
  }, 60000); // Timeout de 60 segundos para o teste completo
});

