# 🐾 Par de Patas - Conexões Caninas Mobile

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.75+-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51+-purple.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.1-purple.svg)](https://www.prisma.io/)

> **Par de Patas** é uma plataforma mobile de conexões para pets que une tutores e seus cães de forma leve, moderna e divertida. Mais que encontros, conexões caninas. Focado em conectar cachorros para amizade, cruzamento ou adoção. Desenvolvido com React Native + Expo e uma API robusta.

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🚀 Instalação](#-instalação)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔧 Configuração](#-configuração)
- [📖 API Documentation](#-api-documentation)
- [🎯 Como Usar](#-como-usar)
- [📱 Mobile App](#-mobile-app)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Registro e login de usuários
- ✅ Autenticação JWT
- ✅ Rotas protegidas
- ✅ Context API para gerenciamento de estado

### 🐕 Gestão de Pets
- ✅ Cadastro de pets com fotos
- ✅ Upload de imagens via Supabase Storage
- ✅ Perfis detalhados (raça, idade, tamanho, etc.)
- ✅ Gestão de múltiplos pets por usuário
- ✅ Edição e exclusão de pets

### 💕 Sistema de Matches
- ✅ Swipe like/dislike com animações
- ✅ Sistema de matches automático
- ✅ Visualização de matches realizados
- ✅ Histórico de interações
- ✅ Chat em tempo real

### 🔍 Filtros Avançados
- ✅ Filtro por cidade/localização
- ✅ Filtro por raça (busca parcial)
- ✅ Filtro por tamanho (pequeno, médio, grande)
- ✅ Filtro por gênero (macho/fêmea)
- ✅ Filtro por idade (faixa etária)
- ✅ Filtro por objetivo (amizade, cruzamento, adoção)
- ✅ Filtro por castração
- ✅ Filtros combináveis e removíveis

### 💳 Sistema de Pagamentos
- ✅ Planos de assinatura (FREE, PREMIUM, VIP)
- ✅ Pagamento via PIX com QR Code
- ✅ Gateway de pagamentos (Asaas)
- ✅ Assinaturas recorrentes
- ✅ Gestão de limites por plano

### 📱 Interface Mobile
- ✅ Design responsivo e moderno
- ✅ Navegação por tabs
- ✅ Componentes reutilizáveis
- ✅ Loading states e feedback visual
- ✅ Animações suaves
- ✅ Identidade visual consistente

## 🛠️ Tecnologias

### Mobile App
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Linguagem tipada
- **React Navigation** - Navegação
- **Context API** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **Expo Linear Gradient** - Gradientes
- **React Native SVG** - Ícones vetoriais

### Backend API
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM moderno
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Socket.IO** - Chat em tempo real
- **Asaas** - Gateway de pagamentos
- **Supabase Storage** - Armazenamento de imagens

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app no seu dispositivo móvel

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

### 3. Configure o Mobile App
```bash
cd mobile
npm install
```

### 4. Configure as Variáveis de Ambiente

**Backend** - Crie um arquivo `.env` na pasta `backend`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/par_de_patas"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/par_de_patas"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3000
ASAAS_API_KEY="sua-api-key-do-asaas"
ASAAS_ENVIRONMENT="sandbox"
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_KEY="sua-service-role-key-do-supabase"
# OU
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-do-supabase"
# ⚠️ IMPORTANTE: Use a Service Role Key (não a Anon Key) para ter acesso completo ao Storage
```

**Mobile** - Crie um arquivo `.env` na pasta `mobile`:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
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

**Mobile (em outro terminal):**
```bash
cd mobile
npx expo start
```

## 📁 Estrutura do Projeto

```
ParDePatas/
├── backend/                    # API Backend
│   ├── controllers/           # Controladores da API
│   ├── middlewares/          # Middlewares (auth, etc.)
│   ├── routes/               # Rotas da API
│   ├── services/             # Lógica de negócio
│   ├── prisma/               # Schema e migrações
│   ├── index.ts              # Servidor principal
│   └── package.json
├── mobile/                    # App Mobile React Native
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── screens/          # Telas da aplicação
│   │   ├── services/         # Serviços de API
│   │   ├── contexts/         # Context API
│   │   ├── styles/           # Estilos e temas
│   │   └── types/            # Tipos TypeScript
│   ├── App.tsx               # Componente principal
│   └── package.json
├── docs/                     # Documentação
└── README.md
```

## 🔧 Configuração

### Banco de Dados
O projeto usa PostgreSQL com Prisma. Certifique-se de:
1. Ter PostgreSQL instalado e rodando
2. Criar um banco de dados chamado `par_de_patas`
3. Configurar as variáveis de ambiente corretamente

### Upload de Imagens
O sistema utiliza **Supabase Storage** para upload de imagens dos pets.

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

### CORS
O backend está configurado para aceitar requisições dos seguintes domínios:
- `http://localhost:3000`
- `http://192.168.1.100:3000` (IP local para mobile)
- `exp://192.168.1.100:8081` (Expo development)

## 📖 API Documentation

A documentação da API está disponível em:
```
http://localhost:3000/api-docs
```

### Principais Endpoints

#### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

#### Pets
- `GET /pets/user/:userId` - Pets do usuário
- `POST /pets` - Criar pet
- `PUT /pets/:id` - Atualizar pet
- `DELETE /pets/:id` - Deletar pet

#### Swipe
- `GET /pets/swipe/:userId` - Pets disponíveis para swipe
- `GET /swipe/filters` - Opções de filtros
- `POST /swipe/like` - Curtir pet

#### Matches
- `GET /matches/user/:userId` - Matches do usuário

#### Chat
- `GET /chat/conversations/:userId` - Conversas do usuário
- `GET /chat/messages/:matchId` - Mensagens de um match
- `POST /chat/send` - Enviar mensagem

#### Pagamentos (Asaas)
- `GET /payments/test` - Testar conexão com Asaas
- `POST /payments/create-plan-payment` - Criar pagamento de plano
- `POST /payments/webhook` - Receber webhooks do Asaas

## 📱 Mobile App

### Funcionalidades Mobile
- **Swipe Interface** - Interface intuitiva de swipe
- **Chat em Tempo Real** - Chat com Socket.IO
- **Upload de Fotos** - Upload direto para Supabase
- **Notificações** - Notificações push (futuro)
- **Geolocalização** - Filtros por proximidade (futuro)

### Desenvolvimento
```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Executar no dispositivo físico
npx expo start --tunnel

# Executar no emulador Android
npx expo start --android

# Executar no simulador iOS
npx expo start --ios
```

### Build para Produção
```bash
# Build para Android
npx expo build:android

# Build para iOS
npx expo build:ios
```

## 🎯 Como Usar

### 1. Registro e Login
- Abra o app no seu dispositivo
- Registre-se com email, senha e dados pessoais
- Faça login com suas credenciais

### 2. Cadastro de Pets
- Vá para a aba "Pets"
- Adicione fotos e informações do seu pet
- Configure objetivo (amizade, cruzamento, adoção)

### 3. Encontrar Matches
- Vá para a aba "Swipe"
- Selecione qual pet seu vai fazer o swipe
- Use os filtros para refinar a busca
- Faça swipe right (❤️) ou left (❌)

### 4. Gerenciar Matches
- Vá para a aba "Matches"
- Veja todos os seus matches
- Inicie conversas com outros usuários

### 5. Assinaturas
- Vá para a aba "Planos"
- Escolha seu plano (FREE, PREMIUM, VIP)
- Faça o pagamento via PIX

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
- Use componentes reutilizáveis no mobile

## 🚧 Próximas Funcionalidades

- [x] Sistema de monetização (FREE, PREMIUM, VIP)
- [x] Gateway de pagamentos (Asaas)
- [x] Pagamento via PIX com QR Code
- [x] App mobile (React Native + Expo)
- [x] Chat em tempo real
- [ ] Notificações push
- [ ] Geolocalização avançada
- [ ] Sistema de denúncias
- [ ] Verificação de perfis
- [ ] Analytics e métricas
- [ ] Assinaturas recorrentes automáticas
- [ ] Modo offline

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Gustavo de Sousa Possidonio - *Desenvolvimento inicial* - [Gustavoposss](https://github.com/Gustavoposss)

## 🙏 Agradecimentos

- Comunidade React Native
- Comunidade Expo
- Comunidade Node.js
- Prisma team
- Todos os contribuidores

---

**🐾 Feito com ❤️ para conectar pets e seus tutores!**