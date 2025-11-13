# 📁 Estrutura do Frontend - Par de Patas

## ✅ O que foi criado

### 🎯 Configuração Base
- ✅ Next.js 16 (compatível com 15+) configurado
- ✅ TypeScript configurado
- ✅ Tailwind CSS 4 configurado com cores da marca
- ✅ Variáveis de ambiente (.env.local)
- ✅ Integração completa com backend

### 📦 Serviços da API
- ✅ `lib/api.ts` - Cliente HTTP (Axios) com interceptors
- ✅ `lib/socket.ts` - Cliente Socket.IO
- ✅ `lib/auth.ts` - Serviço de autenticação
- ✅ `lib/services/petService.ts` - CRUD de pets
- ✅ `lib/services/swipeService.ts` - Sistema de swipe
- ✅ `lib/services/matchService.ts` - Matches
- ✅ `lib/services/chatService.ts` - Chat
- ✅ `lib/services/userService.ts` - Perfil do usuário
- ✅ `lib/services/uploadService.ts` - Upload de imagens
- ✅ `lib/services/subscriptionService.ts` - Assinaturas
- ✅ `lib/services/paymentService.ts` - Pagamentos

### 🎨 Componentes e Contextos
- ✅ `contexts/AuthContext.tsx` - Gerenciamento de autenticação
- ✅ `components/Layout.tsx` - Layout principal com navegação
- ✅ `components/ProtectedRoute.tsx` - Proteção de rotas
- ✅ `components/providers/ReactQueryProvider.tsx` - Provider do React Query

### 🪝 Hooks
- ✅ `hooks/useSocket.ts` - Hook para Socket.IO

### 📄 Páginas
- ✅ `/` - Redirecionamento automático
- ✅ `/login` - Página de login
- ✅ `/register` - Página de registro
- ✅ `/home` - Página inicial (dashboard)

### 🎨 Estilos
- ✅ `app/globals.css` - Estilos globais com cores da marca
- ✅ Tailwind configurado com tema personalizado

### 🔒 Segurança
- ✅ Middleware do Next.js
- ✅ Proteção de rotas no cliente
- ✅ Interceptors para adicionar token automaticamente
- ✅ Tratamento de erros 401 (logout automático)

## 🚀 Próximos Passos

### Páginas criadas:
1. `/pets` - Lista e gerenciamento de pets
2. `/pets/new` - Cadastro de pet
3. `/pets/[id]/edit` - Edição de pet
4. `/swipe` - Interface de swipe
5. `/matches` - Lista de matches
6. `/matches/[id]` - Chat com o match
7. `/plans` - Planos e assinatura
8. `/settings` - Configurações de perfil

### Componentes criados:
- `PetCard` - Card de pet com ações
- `PetForm` - Formulário de pet
- `SwipeDeck` - Stack para swipe
- `MatchCard` - Card de match
- `ChatWindow` - Janela de chat
- `PlanCard` - Card de plano
- `SettingsForm` - Formulário de configurações

## 🔗 Integração com Backend

Todas as rotas do backend estão mapeadas:

- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/register` - Registro
- ✅ `GET /users/me` - Perfil do usuário
- ✅ `PUT /users/me` - Atualizar perfil
- ✅ `GET /pets/user/:userId` - Pets do usuário
- ✅ `POST /pets` - Criar pet
- ✅ `PUT /pets/:id` - Atualizar pet
- ✅ `DELETE /pets/:id` - Deletar pet
- ✅ `GET /pets/swipe/:userId` - Pets para swipe
- ✅ `POST /swipe/like` - Dar like
- ✅ `GET /matches/user/:userId` - Matches
- ✅ `POST /chat/send` - Enviar mensagem
- ✅ `GET /chat/:matchId` - Mensagens do chat
- ✅ `POST /upload/pet-photo` - Upload de foto
- ✅ `GET /subscriptions/plans` - Planos
- ✅ `POST /payments/create-plan-payment` - Criar pagamento

## 🎯 Como usar

1. **Iniciar o backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar o frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Acessar:**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

## 📝 Notas

- O frontend usa `localStorage` para armazenar token e dados do usuário
- Socket.IO se conecta automaticamente quando há token
- Todas as requisições incluem o token automaticamente via interceptor
- O layout é totalmente responsivo

