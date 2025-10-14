import express from 'express';
import cors from 'cors';
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
const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: [
    '*'
  ],
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
      title: 'DogMatch API',
      version: '1.0.0',
      description: 'Documentação da API do DogMatch'
    }
  },
  apis: ['./routes/*.ts', './controllers/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});