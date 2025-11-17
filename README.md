# 🐾 Par de Patas - Plataforma Web

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4+-lightgrey.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6+-purple.svg)](https://www.prisma.io/)

> **Par de Patas** é uma plataforma web que conecta tutores e seus cães para amizade, socialização e encontros guiados. O MVP atual engloba frontend em Next.js + backend Express/Prisma com pagamentos via Asaas.

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [🚀 Como rodar](#-como-rodar)
- [📁 Estrutura do repositório](#-estrutura-do-repositório)
- [⚙️ Variáveis de ambiente](#️-variáveis-de-ambiente)
- [📖 Endpoints principais](#-endpoints-principais)
- [🧪 Fluxo recomendado de testes](#-fluxo-recomendado-de-testes)
- [📝 Status do MVP](#-status-do-mvp)
- [🤝 Contribuindo](#-contribuindo)

## ✨ Funcionalidades

- Autenticação completa (registro, login, recuperação de senha via OTP)
- Dashboard web com:
  - Home com resumo do plano
  - Swipe de pets, matches e chat em tempo real
  - Gestão de pets e configurações
  - Planos/assinaturas com limites por tier
  - Página de suporte e landing page pública
- Pagamentos:
  - Integração com Asaas (PIX) com tela dedicada para QR Code
  - Monitoramento de status e redirecionamento após pagamento
- Validação de cidade via catálogo oficial (IBGE)
- Upload seguro de fotos no Supabase Storage

## 🛠️ Tecnologias

| Camada     | Principais libs |
|------------|-----------------|
| Frontend   | Next.js 15, React 19, TypeScript, Tailwind 4, TanStack Query, React Hook Form + Zod |
| Backend    | Node 20, Express, Prisma, PostgreSQL, Socket.IO, Multer, Brevo (SMTP/API), Asaas |
| Infra      | Render (frontend + backend), Supabase Storage |

## 🚀 Como rodar

### 1. Clonar o repositório
```bash
git clone https://github.com/Gustavoposss/par-de-patas.git
cd par-de-patas
```

### 2. Backend
```bash
cd backend
npm install
# crie um arquivo .env com suas chaves (ver seção abaixo)
npx prisma migrate dev
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
# crie um arquivo .env.local apontando para o backend
npm run dev
```

O frontend roda em `http://localhost:3001` (ou porta livre) consumindo a API em `http://localhost:3000`.

## 📁 Estrutura do repositório

```
par-de-patas/
├── backend/        # API Express + Prisma
├── frontend/       # Next.js (App Router)
├── docs/           # Documentação de apoio
├── CHECKLIST_LANCAMENTO.md
├── README.md
└── ...
```

## ⚙️ Variáveis de ambiente

### Backend
Principais chaves:
- `DATABASE_URL`, `DIRECT_URL`
- `JWT_SECRET`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `ASAAS_API_KEY`, `ASAAS_ENVIRONMENT`
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`

### Frontend
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

Use este README como referência para montar os arquivos `.env` (backend) e `.env.local` (frontend).

## 📖 Endpoints principais

- `POST /auth/login`, `POST /auth/register`
- `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /users/me`, `PUT /users/me`
- `GET /pets/user/:userId`, `POST /pets`, `PUT /pets/:id`, `DELETE /pets/:id`
- `GET /pets/swipe/:userId`, `POST /swipe/like`
- `GET /matches/user/:userId`, `GET /chat/:matchId`, `POST /chat/send`
- `GET /subscriptions/my-subscription`, `GET /subscriptions/usage`
- `POST /payments/create-plan-payment`, `GET /payments/status/:id`, `POST /payments/webhook`

## 🧪 Fluxo recomendado de testes

1. Registro de usuário
2. Cadastro de pet (com upload)
3. Swipe/match + chat
4. Atualização de perfil e cidade
5. Upgrade de plano (inicia pagamento PIX)
6. Acesso à tela de suporte e logout

> Pagamentos reais via Asaas permanecem pendentes até haver saldo para testes. O fluxo já está pronto e pode ser validado via sandbox/simulação quando possível.

## 📝 Status do MVP

- ✅ Todos os fluxos web foram testados manualmente
- ✅ Landing page pronta para divulgar o app
- ⏳ Pagamento real no Asaas aguardando saldo (risco conhecido)
- 🔍 Acompanhamento diário de logs/monitoramento recomendado durante o soft launch

Detalhes completos em `docs/MVP_STATUS.md` e `CHECKLIST_LANCAMENTO.md`.

## 🤝 Contribuindo

1. Crie uma branch (`git checkout -b feature/nome-da-feature`)
2. Faça commits descritivos
3. Abra um PR explicando a motivação/escopo

Siga os padrões de lint e mantenha os arquivos `.md` atualizados após mudanças relevantes.

---

**🐾 Par de Patas — Conectando cães e tutores com segurança.**