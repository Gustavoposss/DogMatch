# 🐾 Checklist de Deploy - Rebranding Par de Patas

## ✅ **ETAPA 1: ATUALIZAÇÕES LOCAIS (Código)**

### **Frontend**
- [x] Atualizar `package.json` com novo nome
- [x] Atualizar `index.html` (título e favicon)
- [x] Criar logo `par-de-patas-logo.svg`
- [x] Criar CSS da marca `styles/brand.css`
- [x] Atualizar componente `Navbar.tsx`
- [x] Atualizar página `Home.tsx`
- [x] Atualizar página `Login.tsx`
- [x] Atualizar página `Register.tsx`
- [x] Atualizar página `Plans.tsx`
- [x] Atualizar página `PaymentFailure.tsx`
- [x] Build testado e funcionando

### **Backend**
- [x] Atualizar `package.json` com novo nome
- [x] Atualizar `index.ts` (CORS, Swagger)
- [x] Criar `README.md` do backend
- [x] Build testado e funcionando

### **Documentação**
- [x] Atualizar `README.md` principal
- [x] Criar `GUIA_REBRANDING.md`
- [x] Criar `CHECKLIST_DEPLOY_REBRANDING.md`

---

## 🔧 **ETAPA 2: CONFIGURAÇÕES DE DEPLOY**

### **2.1 GitHub**
- [ ] Renomear repositório para `par-de-patas`
  - Ir em: Settings → Repository name
  - Novo nome: `par-de-patas`
  - Clicar em "Rename"
  
- [ ] Atualizar descrição do repositório
  - Nova descrição: "🐾 Par de Patas - Plataforma de conexões caninas. Mais que encontros, conexões para tutores e seus pets."

- [ ] Atualizar remote local
  ```bash
  git remote set-url origin https://github.com/Gustavoposss/par-de-patas.git
  ```

### **2.2 Vercel (Frontend)**
- [ ] Criar novo projeto ou renomear existente
  - Nome do projeto: `par-de-patas`
  - URL desejada: `https://par-de-patas.vercel.app`

- [ ] Configurar variáveis de ambiente
  ```
  VITE_API_URL=https://par-de-patas.onrender.com
  VITE_ENVIRONMENT=production
  ```

- [ ] Configurar domínio customizado (opcional)
  - Se tiver: `www.pardepatas.com.br`

### **2.3 Render (Backend)**
- [ ] Criar novo serviço ou renomear existente
  - Nome: `par-de-patas-api`
  - URL: `https://par-de-patas.onrender.com`

- [ ] Configurar variáveis de ambiente
  ```
  DATABASE_URL=sua-url-supabase-pooling
  DIRECT_URL=sua-url-supabase-direct
  JWT_SECRET=sua-chave-secreta
  PORT=3000
  ASAAS_API_KEY=sua-chave-asaas
  ASAAS_ENVIRONMENT=production
  SUPABASE_URL=sua-url-supabase
  SUPABASE_ANON_KEY=sua-chave-anon
  SUPABASE_SERVICE_KEY=sua-chave-service
  ```

### **2.4 Asaas (Gateway de Pagamentos)**
- [ ] Atualizar URL do Webhook
  - URL antiga: `https://dogmatch.onrender.com/payments/webhook`
  - URL nova: `https://par-de-patas.onrender.com/payments/webhook`
  - Ir em: Integrações → Webhooks
  - Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, PAYMENT_DELETED

### **2.5 Supabase (Storage)**
- [ ] Verificar configurações de Storage
  - Bucket: `pet-photos` (manter o mesmo)
  - Políticas de acesso: verificar se estão corretas

---

## 📝 **ETAPA 3: ATUALIZAR URLs NO CÓDIGO**

### **Arquivos que precisam ser revisados:**

#### **Frontend**
- [x] `frontend/src/services/authService.ts`
  - Já usa `import.meta.env.VITE_API_URL`
  
- [x] `frontend/src/services/petService.ts`
  - Já usa `import.meta.env.VITE_API_URL`
  
- [x] `frontend/src/services/paymentService.ts`
  - Já usa `import.meta.env.VITE_API_URL`
  
- [x] `frontend/src/services/subscriptionService.ts`
  - Já usa `import.meta.env.VITE_API_URL`
  
- [x] `frontend/src/services/swipeService.ts`
  - Já usa `import.meta.env.VITE_API_URL`

#### **Backend**
- [x] `backend/index.ts`
  - CORS já atualizado para `https://par-de-patas.vercel.app`

#### **Documentação**
- [x] `README.md`
  - URLs já atualizadas
  
- [x] `backend/README.md`
  - URLs já atualizadas

---

## 🚀 **ETAPA 4: TESTE LOCAL**

- [ ] Testar frontend localmente
  ```bash
  cd frontend
  npm run dev
  ```
  - Verificar logo aparecendo
  - Verificar cores aplicadas
  - Verificar fontes carregando
  - Verificar páginas (Home, Login, Register, Plans)

- [ ] Testar backend localmente
  ```bash
  cd backend
  npm run dev
  ```
  - Verificar API funcionando
  - Verificar Swagger em `/api-docs`
  - Verificar conexão com banco de dados

- [ ] Testar integração local
  - Frontend conectando no backend local
  - Login funcionando
  - Cadastro funcionando
  - Upload de imagens funcionando

---

## 📦 **ETAPA 5: COMMIT E PUSH**

- [ ] Fazer commit das alterações
  ```bash
  git add .
  git status  # verificar arquivos
  git commit -m "feat: Rebranding completo para Par de Patas

  🐾 Nova identidade visual:
  - Logo roxo e amarelo redesenhado
  - Paleta de cores: Roxo (#8B5CF6) + Amarelo (#FCD34D)
  - Tipografia: Fredoka (títulos) + Montserrat (corpo)
  - Slogan: Mais que encontros, conexões caninas
  
  ✨ Atualizações:
  - Nome alterado de DogMatch para Par de Patas
  - Frontend: componentes, páginas e estilos atualizados
  - Backend: API, CORS e documentação atualizados
  - URLs: preparado para novos domínios
  - README e documentação completos
  
  📝 Arquivos principais:
  - GUIA_REBRANDING.md - Guia completo da identidade
  - CHECKLIST_DEPLOY_REBRANDING.md - Checklist de deploy
  - frontend/src/styles/brand.css - Estilos da marca
  - frontend/public/par-de-patas-logo.svg - Logo oficial"
  ```

- [ ] Verificar se não há erros
  ```bash
  git log -1  # verificar commit
  ```

- [ ] Push para GitHub
  ```bash
  git push origin master
  ```

---

## 🌐 **ETAPA 6: DEPLOY PRODUÇÃO**

### **6.1 Deploy Frontend (Vercel)**
- [ ] Aguardar deploy automático ou fazer deploy manual
- [ ] Verificar logs de build
- [ ] Verificar se variáveis de ambiente estão corretas
- [ ] Acessar URL: `https://par-de-patas.vercel.app`
- [ ] Testar:
  - Logo aparecendo
  - Cores aplicadas
  - Páginas funcionando
  - Responsividade

### **6.2 Deploy Backend (Render)**
- [ ] Aguardar deploy automático ou fazer deploy manual
- [ ] Verificar logs de build
- [ ] Verificar se variáveis de ambiente estão corretas
- [ ] Verificar migrações do Prisma
- [ ] Testar endpoint: `https://par-de-patas.onrender.com/ping`
- [ ] Testar Swagger: `https://par-de-patas.onrender.com/api-docs`

### **6.3 Teste de Integração Produção**
- [ ] Frontend se conecta ao backend
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Upload de imagens funciona
- [ ] Sistema de pagamentos funciona
- [ ] Webhooks do Asaas funcionam

---

## 🧪 **ETAPA 7: TESTES FINAIS**

### **Funcionalidades Críticas**
- [ ] Cadastro de usuário com CPF
- [ ] Login de usuário
- [ ] Cadastro de pet com foto
- [ ] Sistema de swipe
- [ ] Filtros funcionando
- [ ] Sistema de matches
- [ ] Planos exibindo corretamente
- [ ] Pagamento via PIX
- [ ] Pagamento via Boleto
- [ ] Webhook de confirmação

### **Visual e UX**
- [ ] Logo aparece em todos os lugares
- [ ] Cores consistentes em todas as páginas
- [ ] Fontes carregando corretamente
- [ ] Animações funcionando (paw-animation)
- [ ] Responsividade mobile
- [ ] Menu hambúrguer no mobile
- [ ] Botões com hover correto
- [ ] Cards com efeito hover

---

## 📧 **ETAPA 8: COMUNICAÇÃO**

### **Usuários Existentes (se houver)**
- [ ] Enviar email comunicando rebranding
- [ ] Explicar que nada muda na conta deles
- [ ] Destacar melhorias visuais

### **Redes Sociais**
- [ ] Atualizar nome do perfil
- [ ] Atualizar foto de perfil (logo)
- [ ] Atualizar capa com nova identidade
- [ ] Post de lançamento do rebranding

---

## 📊 **ETAPA 9: MONITORAMENTO PÓS-DEPLOY**

### **Primeiras 24h**
- [ ] Monitorar logs de erro no frontend
- [ ] Monitorar logs de erro no backend
- [ ] Verificar webhooks funcionando
- [ ] Verificar se pagamentos estão sendo processados
- [ ] Responder feedbacks de usuários

### **Primeira Semana**
- [ ] Coletar feedback dos usuários
- [ ] Ajustar se necessário
- [ ] Documentar problemas encontrados

---

## ✅ **RESUMO DAS URLs**

### **Antes (DogMatch)**
- Frontend: `https://dog-match-five.vercel.app`
- Backend: `https://dogmatch.onrender.com`
- Email: `suporte@dogmatch.com`
- GitHub: `github.com/Gustavoposss/DogMatch`

### **Depois (Par de Patas)**
- Frontend: `https://par-de-patas.vercel.app`
- Backend: `https://dogmatch.onrender.com` (mantido)
- Email: `suporte@pardepatas.com.br`
- GitHub: `github.com/Gustavoposss/par-de-patas`

---

## 🎯 **ORDEM DE EXECUÇÃO RECOMENDADA**

1. ✅ Código local atualizado
2. 🔄 **GitHub: Renomear repositório** ← FAZER AGORA
3. 🔄 **Vercel: Configurar projeto** ← FAZER AGORA
4. 🔄 **Render: Configurar serviço** ← FAZER AGORA
5. 🔄 **Asaas: Atualizar webhook** ← FAZER DEPOIS DO DEPLOY
6. ✅ Testar local
7. 🔄 Commit e push
8. 🔄 Deploy automático
9. 🔄 Testes em produção
10. 🔄 Comunicação

---

## 📞 **SUPORTE**

Se algo der errado:
1. Verificar logs no Vercel/Render
2. Verificar variáveis de ambiente
3. Verificar CORS no backend
4. Verificar webhooks no Asaas
5. Rollback se necessário

---

**🐾 Pronto para o lançamento!**
