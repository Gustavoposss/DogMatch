import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cleanCPF } from '../../utils/validators';
import { SubscriptionService } from '../../services/subscriptionService';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

const VALID_CPFS = [
  '52998224725',
  '86288366757',
  '12345678909', // conhecido válido
  '98765432100', // válido
];

let cpfIndex = 0;
function getValidCPF() {
  const cpf = VALID_CPFS[cpfIndex % VALID_CPFS.length];
  cpfIndex += 1;
  return cpf;
}

export interface TestUser {
  id: string;
  email: string;
  name: string;
  city: string;
  token: string;
}

export interface TestPet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  isNeutered: boolean;
  objective: string;
  description?: string | null;
  photoUrl: string;
  ownerId: string;
  createdAt?: Date;
}

/**
 * Cria um usuário de teste no banco de dados
 */
export async function createTestUser(data?: {
  email?: string;
  name?: string;
  password?: string;
  city?: string;
  cpf?: string;
  phone?: string;
}): Promise<TestUser> {
  const email = data?.email || `test_${Date.now()}@test.com`;
  const password = data?.password || '123456';
  const hashedPassword = await bcrypt.hash(password, 10);
  const cpf = cleanCPF(data?.cpf || getValidCPF());

  const user = await prisma.user.create({
    data: {
      email,
      name: data?.name || 'Test User',
      password: hashedPassword,
      city: data?.city || 'São Paulo',
      cpf,
      phone: data?.phone || '11999999999',
    },
  });

  // Criar assinatura gratuita para garantir limites configurados
  await SubscriptionService.createFreeSubscription(user.id);

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    city: user.city,
    token,
  };
}

/**
 * Cria um pet de teste no banco de dados
 */
export async function createTestPet(
  ownerId: string,
  data?: {
    name?: string;
    breed?: string;
    age?: number;
    gender?: string;
    size?: string;
    isNeutered?: boolean;
    objective?: string;
    description?: string;
    photoUrl?: string;
  }
): Promise<TestPet> {
  const pet = await prisma.pet.create({
    data: {
      name: data?.name || 'Test Pet',
      breed: data?.breed || 'Golden Retriever',
      age: data?.age || 3,
      gender: data?.gender || 'M',
      size: data?.size || 'grande',
      isNeutered: data?.isNeutered || false,
      objective: data?.objective || 'amizade',
      description: data?.description || 'Um pet de teste',
      photoUrl: data?.photoUrl || 'https://via.placeholder.com/400',
      ownerId,
    },
  });

  return pet;
}

/**
 * Limpa todos os dados de teste
 * Ordem é importante por causa das foreign keys
 */
export async function cleanupTestData() {
  try {
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
    console.error('Erro ao limpar dados de teste:', error);
    throw error;
  }
}

/**
 * Gera um token JWT para um usuário
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

