# 🐾 Par de Patas - Frontend Web

Frontend web do Par de Patas desenvolvido com Next.js 15, React 19 e TypeScript.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **TanStack Query** - Gerenciamento de estado servidor
- **Zustand** - Estado global
- **Socket.IO Client** - Chat em tempo real
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # App Router do Next.js
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── home/              # Página inicial
│   └── layout.tsx         # Layout raiz
├── components/             # Componentes React
│   ├── providers/         # Providers (React Query, etc)
│   └── Layout.tsx         # Layout principal
├── contexts/               # Context API
│   └── AuthContext.tsx    # Context de autenticação
├── hooks/                  # Custom hooks
│   └── useSocket.ts       # Hook para Socket.IO
├── lib/                    # Utilitários e serviços
│   ├── api.ts             # Cliente HTTP (Axios)
│   ├── socket.ts          # Cliente Socket.IO
│   ├── auth.ts            # Serviço de autenticação
│   └── services/          # Serviços da API
├── types/                  # Tipos TypeScript
│   └── index.ts           # Tipos principais
└── middleware.ts          # Middleware do Next.js
```

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na pasta `frontend` apontando para a API de produção:

```env
NEXT_PUBLIC_API_URL=https://dogmatch.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://dogmatch.onrender.com
```

> ⚠️ Caso queira usar o backend local em desenvolvimento, troque as URLs para `http://localhost:3000`.

### 3. Executar em desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3001` (ou próxima porta disponível).

## 📡 Integração com Backend

O frontend está totalmente integrado com o backend existente:

- ✅ Autenticação JWT
- ✅ Socket.IO para chat em tempo real
- ✅ Todas as rotas da API mapeadas
- ✅ Tipos TypeScript compatíveis
- ✅ Upload de imagens
- ✅ Sistema de pagamentos

## 🎨 Estilização

O projeto usa Tailwind CSS 4 com cores personalizadas da marca Par de Patas:

- **Primary**: `#B952EB` (Roxo)
- **Secondary**: `#FDED11` (Amarelo)
- **Accent**: `#BC7299` (Rosa-roxo)

## 📱 Responsividade

O layout é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🔐 Autenticação

A autenticação é gerenciada através do `AuthContext` e usa:
- JWT tokens armazenados no `localStorage`
- Interceptors do Axios para adicionar token automaticamente
- Proteção de rotas no lado do cliente

## 🚀 Deploy

Para fazer deploy:

```bash
npm run build
npm start
```

Ou use plataformas como Vercel, Netlify, etc.
