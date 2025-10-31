import { Request, Response } from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SubscriptionService } from '../services/subscriptionService';
import { isValidCPF, cleanCPF, isValidEmail } from '../utils/validators';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_supersecreto';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, city: user.city } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, city, cpf, phone } = req.body;

    console.log('=== REGISTRO DE USUÁRIO ===');
    console.log('📍 IP do cliente:', req.ip || req.socket.remoteAddress);
    console.log('📦 Body recebido:', { 
      name, 
      email, 
      city,
      cpf: cpf ? `${cpf.substring(0, 3)}***` : 'não informado',
      phone: phone || 'não informado',
      hasPassword: !!password
    });

    // Validações básicas
    if (!name || !email || !password || !city) {
      console.log('❌ Validação falhou: campos obrigatórios ausentes');
      return res.status(400).json({ error: 'Nome, e-mail, senha e cidade são obrigatórios.' });
    }

    // Valida email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    // Valida CPF se fornecido (obrigatório para pagamentos futuros)
    if (cpf) {
      if (!isValidCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido.' });
      }
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        city,
        cpf: cpf ? cleanCPF(cpf) : null,
        phone: phone || null,
      },
    });

    // CRIAR ASSINATURA GRATUITA AUTOMATICAMENTE
    console.log('📦 Criando assinatura gratuita para usuário:', user.id);
    await SubscriptionService.createFreeSubscription(user.id);
    console.log('✅ Assinatura gratuita criada');

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Token JWT gerado');

    console.log('✅ Usuário registrado com sucesso:', user.email);
    res.status(201).json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city
      }
    });
  } catch (error: any) {
    console.error('❌ Erro ao cadastrar usuário:', error);
    console.error('📦 Detalhes:', error.message);
    console.error('🔍 Stack:', error.stack);
    
    // Se for erro de banco de dados (ex: email duplicado)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }
    
    res.status(500).json({ 
      error: error.message || 'Erro ao cadastrar usuário.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};