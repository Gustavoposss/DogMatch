# 🐾 Par de Patas - Conexões Caninas

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.1-purple.svg)](https://www.prisma.io/)

> **Par de Patas** é uma plataforma de conexões para pets que une tutores e seus cães de forma leve, moderna e divertida. Mais que encontros, conexões caninas. Focado em conectar cachorros para amizade, cruzamento ou adoção. Desenvolvido com tecnologias modernas e uma arquitetura robusta.

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🚀 Instalação](#-instalação)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔧 Configuração](#-configuração)
- [📖 API Documentation](#-api-documentation)
- [🎯 Como Usar](#-como-usar)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Registro e login de usuários
- ✅ Autenticação JWT
- ✅ Rotas protegidas
- ✅ Middleware de autenticação

### 🐕 Gestão de Pets
- ✅ Cadastro de pets com fotos
- ✅ Upload de imagens
- ✅ Perfis detalhados (raça, idade, tamanho, etc.)
- ✅ Gestão de múltiplos pets por usuário

### 💕 Sistema de Matches
- ✅ Swipe like/dislike
- ✅ Sistema de matches automático
- ✅ Visualização de matches realizados
- ✅ Histórico de interações

### 🔍 Filtros Avançados
- ✅ Filtro por cidade/localização
- ✅ Filtro por raça (busca parcial)
- ✅ Filtro por tamanho (pequeno, médio, grande)
- ✅ Filtro por gênero (macho/fêmea)
- ✅ Filtro por idade (faixa etária)
- ✅ Filtro por objetivo (amizade, cruzamento, adoção)
- ✅ Filtro por castração
- ✅ Filtros combináveis e removíveis

### 📱 Interface Moderna
- ✅ Design responsivo
- ✅ Componentes reutilizáveis
- ✅ Loading states
- ✅ Feedback visual
- ✅ Navegação intuitiva

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM moderno
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Swagger** - Documentação da API
- **bcryptjs** - Hash de senhas
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Linguagem tipada
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações
- **CSS-in-JS** - Estilização

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/par-de-patas.git
cd par-de-patas
```

### 2. Configure o Backend
```bash
cd backend
npm install
```

### 3. Configure o Frontend
```bash
cd frontend
npm install
```

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/par_de_patas"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/par_de_patas"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3000
```

### 5. Configure o Banco de Dados
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 6. Execute o Projeto

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (em outro terminal):**
```bash
cd frontend
npm run dev
```

## 📁 Estrutura do Projeto

```
ParDePatas/
├── backend/
│   ├── controllers/          # Controladores da API
│   ├── middlewares/          # Middlewares (auth, etc.)
│   ├── routes/              # Rotas da API
│   ├── services/            # Lógica de negócio
│   ├── prisma/              # Schema e migrações
│   ├── index.ts             # Servidor principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Entry point
│   └── package.json
└── README.md
```

## 🔧 Configuração

### Banco de Dados
O projeto usa PostgreSQL com Prisma. Certifique-se de:
1. Ter PostgreSQL instalado e rodando
2. Criar um banco de dados chamado `par_de_patas`
3. Configurar as variáveis de ambiente corretamente

### Upload de Imagens
O sistema suporta upload de imagens para os pets via Supabase Storage.

### Sistema de Pagamentos
O projeto utiliza **Asaas** como gateway de pagamentos, suportando:
- **PIX** - Pagamento instantâneo com QR Code
- **Boleto Bancário** - Pagamento tradicional
- **Cartão de Crédito** - Pagamento parcelado

**Configuração do Asaas:**
1. Crie uma conta em [https://www.asaas.com/](https://www.asaas.com/)
2. Para testes, use [https://sandbox.asaas.com/](https://sandbox.asaas.com/)
3. Obtenha sua API Key em: **Integrações → API Key**
4. Configure no `.env`: `ASAAS_API_KEY` e `ASAAS_ENVIRONMENT`
5. Configure webhooks em: **Integrações → Webhooks**
   - URL: `https://dogmatch.onrender.com/payments/webhook`
   - Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_DELETED

### CORS
O backend está configurado para aceitar requisições dos seguintes domínios:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`
- `http://localhost:4173`
- `https://par-de-patas.vercel.app` (Frontend em produção)
- `https://dogmatch.onrender.com` (Backend em produção)

## 📖 API Documentation

A documentação da API está disponível em:
```
http://localhost:3000/api-docs
```

### Principais Endpoints

#### Autenticação
- `POST /auth/register` - Registrar usuário (agora aceita CPF e telefone)
- `POST /auth/login` - Login

#### Pets
- `GET /pets/user/:userId` - Pets do usuário
- `POST /pets` - Criar pet
- `PUT /pets/:id` - Atualizar pet
- `DELETE /pets/:id` - Deletar pet

#### Swipe
- `GET /swipe/available` - Pets disponíveis para swipe
- `GET /swipe/filters` - Opções de filtros
- `POST /swipe/like` - Curtir pet

#### Matches
- `GET /matches/user/:userId` - Matches do usuário

#### Pagamentos (Asaas)
- `GET /payments/test` - Testar conexão com Asaas
- `POST /payments/create-plan-payment` - Criar pagamento de plano
- `POST /payments/create-recurring-subscription` - Criar assinatura recorrente
- `POST /payments/webhook` - Receber webhooks do Asaas
- `GET /payments/status/:paymentId` - Verificar status de pagamento
- `DELETE /payments/cancel/:paymentId` - Cancelar pagamento

#### Assinaturas
- `GET /subscriptions/plans` - Listar planos disponíveis
- `GET /subscriptions/my-subscription` - Minha assinatura
- `POST /subscriptions/cancel` - Cancelar assinatura

## 🎯 Como Usar

### 1. Registro e Login
- Acesse a aplicação
- Registre-se com email, senha e dados pessoais
- Faça login com suas credenciais

### 2. Cadastro de Pets
- Vá para a página "Meus Pets"
- Adicione fotos e informações do seu pet
- Configure objetivo (amizade, cruzamento, adoção)

### 3. Encontrar Matches
- Vá para a página "Swipe"
- Selecione qual pet seu vai fazer o swipe
- Use os filtros para refinar a busca
- Faça swipe right (❤️) ou left (❌)

### 4. Gerenciar Matches
- Vá para a página "Matches"
- Veja todos os seus matches
- Interaja com outros usuários

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript em todo o projeto
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente APIs com Swagger

## 🚧 Próximas Funcionalidades

- [x] Sistema de monetização (FREE, PREMIUM, VIP)
- [x] Gateway de pagamentos (Asaas)
- [x] Pagamento via PIX com QR Code
- [x] Validação de CPF
- [ ] Sistema de chat em tempo real
- [ ] Notificações push
- [ ] Geolocalização avançada
- [ ] Sistema de denúncias
- [ ] Verificação de perfis
- [ ] App mobile (React Native)
- [ ] Analytics e métricas
- [ ] Assinaturas recorrentes automáticas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Gustavo de Sousa Possidonio - *Desenvolvimento inicial* - [Gustavoposss](https://github.com/Gustavoposss)

## 🙏 Agradecimentos

- Comunidade React
- Comunidade Node.js
- Prisma team
- Todos os contribuidores

---

**🐾 Feito com ❤️ para conectar pets e seus tutores!** 