import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import { logger } from './utils/logger';
import prisma from './prismaClient';
import './types/socket';
import userRoutes from './routes/userRoutes';
import petRoutes from './routes/petRoutes';
import authRoutes from './routes/authRoutes';
import swipeRoutes from './routes/swipeRoutes';
import matchRoutes from './routes/matchRoutes';
import chatRoutes from './routes/chatRoutes';
import uploadRoutes from './routes/uploadRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import paymentRoutes from './routes/paymentRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const server = createServer(app);

// Helmet para segurança HTTP headers (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: false, // Desabilitar CSP para permitir Socket.IO
    crossOriginEmbedderPolicy: false
  }));
}

const io = new Server(server, {
  cors: {
    origin: true, // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
  }
});

const PORT = process.env.PORT || 3000;

// Configuração do CORS - Permitir qualquer origem
app.use(cors({
  origin: true, // Permite qualquer origem
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-auth-token',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // Cache preflight por 24 horas
  optionsSuccessStatus: 200 // Para compatibilidade com navegadores antigos
}));

// Limite de tamanho do body (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para tratar requisições OPTIONS (preflight)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
});

// Rotas existentes
app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.use('/auth', authRoutes);
app.use('/swipe', swipeRoutes);
app.use('/matches', matchRoutes);
app.use('/chat', chatRoutes);
app.use('/upload', uploadRoutes);

// NOVAS ROTAS DE MONETIZAÇÃO
app.use('/subscriptions', subscriptionRoutes);
app.use('/payments', paymentRoutes);

// Endpoint de health check (disponível em todos os ambientes)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Endpoint para testar CORS (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.get('/cors-test', (req, res) => {
    res.json({
      message: 'CORS funcionando!',
      origin: req.headers.origin || 'N/A',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  });
}

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Par de Patas API',
      version: '1.0.0',
      description: 'Documentação da API do Par de Patas - Conexões Caninas'
    }
  },
  apis: ['./routes/*.ts', './controllers/*.ts'],
};

// Documentação Swagger (apenas em desenvolvimento e staging)
if (process.env.NODE_ENV !== 'production') {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Socket.IO - Autenticação
io.use((socket, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    return next(new Error('JWT_SECRET não configurado'));
  }
  
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token não fornecido'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

// Socket.IO - Eventos
io.on('connection', (socket) => {
  console.log(`✅ Usuário conectado: ${socket.userId}`);
  
  // Entrar na sala do próprio usuário para receber notificações
  socket.join(`user_${socket.userId}`);
  console.log(`📱 Usuário ${socket.userId} entrou na sala de notificações`);
  
  // Entrar na sala do match para receber mensagens
  socket.on('join_match', async (matchId) => {
    const roomName = `match_${matchId}`;
    await socket.join(roomName);
    console.log(`📱 Usuário ${socket.userId} (Socket ${socket.id}) entrou no match ${matchId} (sala: ${roomName})`);
    
    // Verificar se realmente entrou na sala
    const socketsInRoom = await io.in(roomName).fetchSockets();
    console.log(`📊 Total de sockets na sala ${roomName} agora:`, socketsInRoom.length);
  });
  
  // Sair da sala do match
  socket.on('leave_match', (matchId) => {
    socket.leave(`match_${matchId}`);
    console.log(`📱 Usuário ${socket.userId} saiu do match ${matchId}`);
  });
  
  // Enviar mensagem
  socket.on('send_message', async (data) => {
    try {
      const { matchId, content } = data;
      
      if (!matchId || !content) {
        socket.emit('error', { message: 'matchId e content são obrigatórios' });
        return;
      }

      // Verificar se o usuário faz parte do match
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match || (match.userAId !== socket.userId && match.userBId !== socket.userId)) {
        socket.emit('error', { message: 'Você não tem permissão para enviar mensagem neste chat' });
        return;
      }

      // Buscar ou criar o chat
      let chat = await prisma.chat.findUnique({ where: { matchId } });
      if (!chat) {
        chat = await prisma.chat.create({ data: { matchId } });
      }

      // Salvar mensagem no banco de dados
      const message = await prisma.message.create({
        data: {
          chatId: chat.id,
          senderId: socket.userId,
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

      // Preparar dados da mensagem
      const messageData = {
        id: message.id,
        matchId,
        senderId: socket.userId,
        content: message.content,
        chatId: chat.id,
        createdAt: message.createdAt.toISOString(),
        timestamp: message.createdAt
      };
      
      // Verificar quantos sockets estão na sala
      const roomName = `match_${matchId}`;
      const socketsInRoom = await io.in(roomName).fetchSockets();
      console.log(`📊 Sockets na sala ${roomName}:`, socketsInRoom.length);
      socketsInRoom.forEach((s) => {
        console.log(`  - Socket ID: ${s.id}, User ID: ${(s as any).userId}`);
      });
      
      // Emitir para todos na sala do match (incluindo o remetente)
      io.to(roomName).emit('new_message', messageData);
      
      console.log(`💬 Mensagem salva e enviada no match ${matchId} por ${socket.userId}`);
      console.log(`💬 Dados da mensagem emitida:`, JSON.stringify(messageData, null, 2));
    } catch (error: any) {
      console.error('Erro ao enviar mensagem via Socket.IO:', error);
      socket.emit('error', { message: 'Erro ao enviar mensagem: ' + (error.message || 'Erro desconhecido') });
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`❌ Usuário desconectado: ${socket.userId}`);
  });
});

// Exportar io para uso em outros arquivos
export { io };

if (process.env.NODE_ENV !== 'test') {
  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Socket.IO ativo para chat em tempo real`);
    console.log(`🌐 Acessível em:`);
    console.log(`   - http://localhost:${PORT} (local)`);
    console.log(`   - http://192.168.101.5:${PORT} (rede local - use este IP no celular)`);
    console.log(`\n💡 Para conectar o celular:`);
    console.log(`   1. Certifique-se de que o celular está na mesma rede Wi-Fi`);
    console.log(`   2. No app mobile, o IP 192.168.101.5 já está configurado no app.json`);
    console.log(`   3. Reinicie o app mobile após alterar a configuração`);
  });
}