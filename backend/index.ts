import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import { logger } from './utils/logger';
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
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://dogmatch.onrender.com'])
      : true, // Em desenvolvimento, permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
  }
});

const PORT = process.env.PORT || 3000;

// Configuração do CORS - Restringir em produção, permissivo em desenvolvimento
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://dogmatch.onrender.com'])
  : true; // Em desenvolvimento, permite qualquer origem

app.use(cors({
  origin: allowedOrigins,
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
  socket.on('join_match', (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`📱 Usuário ${socket.userId} entrou no match ${matchId}`);
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
      
      // Emitir para todos na sala do match
      io.to(`match_${matchId}`).emit('new_message', {
        matchId,
        senderId: socket.userId,
        content,
        timestamp: new Date()
      });
      
      console.log(`💬 Mensagem enviada no match ${matchId} por ${socket.userId}`);
    } catch (error) {
      socket.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`❌ Usuário desconectado: ${socket.userId}`);
  });
});

// Exportar io para uso em outros arquivos
export { io };

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