import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Limpar TODAS as tabelas do banco de dados
 * Ordem é importante por causa das foreign keys
 */
async function cleanupAllTables() {
  try {
    // Limpar na ordem inversa das dependências (filhos primeiro, pais depois)
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.match.deleteMany();
    await prisma.like.deleteMany();
    await prisma.boost.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.usageLimit.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.pet.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error('Erro ao limpar banco de dados:', error);
    throw error;
  }
}

// Limpar banco de dados antes de cada suite de testes
beforeAll(async () => {
  await cleanupAllTables();
}, 30000); // Timeout de 30 segundos

// Limpar banco de dados após todos os testes (garantir que fica limpo)
afterAll(async () => {
  await cleanupAllTables();
  await prisma.$disconnect();
}, 30000); // Timeout de 30 segundos

export { prisma, cleanupAllTables };

