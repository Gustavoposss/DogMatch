# 🐾 Par de Patas - Backend API

> **Par de Patas** é uma plataforma de conexões para pets que une tutores e seus cães de forma leve, moderna e divertida. Mais que encontros, conexões caninas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Linguagem tipada
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM moderno
- **JWT** - Autenticação
- **Asaas** - Gateway de pagamentos
- **Supabase** - Storage de imagens

## 📋 Funcionalidades

### 🔐 Autenticação
- ✅ Registro e login de usuários
- ✅ Autenticação JWT
- ✅ Validação de CPF e telefone
- ✅ Rotas protegidas

### 🐕 Gestão de Pets
- ✅ Cadastro de pets com fotos
- ✅ Upload de imagens via Supabase
- ✅ Perfis detalhados (raça, idade, tamanho, etc.)
- ✅ Gestão de múltiplos pets por usuário
- ✅ Validação de raças pré-definidas

### 💕 Sistema de Matches
- ✅ Swipe like/dislike
- ✅ Sistema de matches automático
- ✅ Visualização de matches realizados
- ✅ Histórico de interações

### 🔍 Filtros Avançados
- ✅ Filtro por cidade/localização
- ✅ Filtro por raça (26 raças pré-definidas)
- ✅ Filtro por tamanho (pequeno, médio, grande)
- ✅ Filtro por gênero (macho/fêmea)
- ✅ Filtro por idade (faixa etária)
- ✅ Filtro por objetivo (amizade, cruzamento, adoção)
- ✅ Filtro por castração

### 💰 Sistema de Monetização
- ✅ Planos FREE, PREMIUM, VIP
- ✅ Gateway de pagamentos (Asaas)
- ✅ Pagamento via PIX com QR Code
- ✅ Pagamento via Boleto
- ✅ Pagamento via Cartão de Crédito
- ✅ Webhooks de confirmação
- ✅ Controle de limites por plano

### 📱 API RESTful
- ✅ Documentação Swagger
- ✅ Middleware de autenticação
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ CORS configurado

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Conta no Asaas
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/par-de-patas.git
cd par-de-patas/backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env`:
```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/par_de_patas"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/par_de_patas"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"

# Server
PORT=3000

# Asaas Payment Gateway
ASAAS_API_KEY="sua-api-key-do-asaas"
ASAAS_ENVIRONMENT="sandbox" # ou "production"

# Supabase Storage
SUPABASE_URL="sua-url-do-supabase"
SUPABASE_ANON_KEY="sua-chave-anonima-do-supabase"
SUPABASE_SERVICE_KEY="sua-chave-de-servico-do-supabase"
```

### 4. Configure o banco de dados
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Execute o servidor
```bash
npm run dev
```

## 📖 Documentação da API

A documentação completa está disponível em:
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
- `GET /swipe/available` - Pets disponíveis para swipe
- `GET /swipe/filters` - Opções de filtros
- `POST /swipe/like` - Curtir pet

#### Pagamentos (Asaas)
- `GET /payments/test` - Testar conexão com Asaas
- `POST /payments/create-plan-payment` - Criar pagamento de plano
- `POST /payments/webhook` - Receber webhooks do Asaas
- `GET /payments/status/:paymentId` - Verificar status de pagamento

#### Assinaturas
- `GET /subscriptions/plans` - Listar planos disponíveis
- `GET /subscriptions/my-subscription` - Minha assinatura
- `POST /subscriptions/cancel` - Cancelar assinatura

## 🔧 Configuração do Asaas

### 1. Criar conta no Asaas
- Acesse: [https://www.asaas.com/](https://www.asaas.com/)
- Para testes: [https://sandbox.asaas.com/](https://sandbox.asaas.com/)

### 2. Obter API Key
- Vá para: **Integrações → API Key**
- Copie sua chave de API

### 3. Configurar Webhooks
- Vá para: **Integrações → Webhooks**
- URL: `https://dogmatch.onrender.com/payments/webhook`
- Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_DELETED

## 🌐 CORS

O backend está configurado para aceitar requisições dos seguintes domínios:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`
- `http://localhost:4173`
- `https://par-de-patas.vercel.app` (Frontend em produção)

## 📊 Planos Disponíveis

### 🆓 FREE
- 1 pet cadastrado
- 5 swipes por dia
- Ver matches
- Chat básico

### ⭐ PREMIUM (R$ 19,90/mês)
- Até 2 pets cadastrados
- Swipes ilimitados
- Ver quem curtiu seu pet
- 1 Boost por mês
- Filtros avançados
- Chat sem limitações
- Selo Premium
- Suporte prioritário

### 👑 VIP (R$ 39,90/mês)
- Até 2 pets cadastrados
- Swipes ilimitados
- Ver quem curtiu seu pet
- 3 Boosts por mês
- Filtros avançados
- Aparecer primeiro nos resultados
- Desfazer swipes
- Modo viagem
- Analytics do perfil
- Selo VIP exclusivo
- Suporte VIP prioritário

## 🐕 Raças Disponíveis

O sistema possui 26 raças pré-definidas:
1. Sem Raça Definida
2. Shih Tzu
3. Yorkshire Terrier
4. Spitz Alemão
5. Lhasa Apso
6. Golden Retriever
7. Pinscher
8. Dachshund
9. Pug
10. Maltês
11. Poodle
12. Labrador Retriever
13. Pastor Alemão
14. Bulldog Francês
15. Beagle
16. Rottweiler
17. Chihuahua
18. Husky Siberiano
19. Border Collie
20. Jack Russell Terrier
21. Cocker Spaniel
22. Bulldog Inglês
23. Akita
24. Doberman
25. Boxer
26. Pitbull

## 🚀 Deploy

### Render (Recomendado)
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
- Railway
- Heroku
- DigitalOcean
- AWS

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**🐾 Feito com ❤️ para conectar pets e seus tutores!**
