import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
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
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      'http://localhost:4173',
      'https://par-de-patas.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Configuração do CORS - Permitir frontend Vercel
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:4173',
      'https://par-de-patas.vercel.app',
      'http://localhost:8081'
    ];
    
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// Rotas existentes
app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.use('/auth', authRoutes);
app.use('/swipe', swipeRoutes);
app.use('/matches', matchRoutes);
app.use('/chats', chatRoutes);
app.use('/upload', uploadRoutes);

// NOVAS ROTAS DE MONETIZAÇÃO
app.use('/subscriptions', subscriptionRoutes);
app.use('/payments', paymentRoutes);

app.get('/ping', (req, res) => {
  res.send('pong');
});

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

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Socket.IO - Autenticação
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Token não fornecido'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_supersecreto') as { userId: string };
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
  console.log(`🌐 Acessível em: http://localhost:${PORT} e http://192.168.101.5:${PORT}`);
});