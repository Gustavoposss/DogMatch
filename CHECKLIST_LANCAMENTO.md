# ✅ Checklist de Lançamento - Par de Patas

## 🌐 Plataforma Web

### Configuração e Ambiente
- [x] API de produção configurada: `https://dogmatch.onrender.com`
- [x] Variáveis de ambiente revisadas (frontend + backend)
- [x] Deploy contínuo habilitado no Render
- [ ] Validar build local com `npm run build && npm start`
- [ ] Revisar assets/páginas após cada deploy

### Funcionalidades Core
- [x] Autenticação (Login/Registro) funcionando
- [x] Cadastro de pets funcionando
- [x] Sistema de swipe funcionando
- [x] Sistema de matches funcionando
- [x] Chat em tempo real (Socket.IO) implementado
- [x] Sistema de planos e assinaturas
- [x] Upload de fotos de pets
- [x] Tela de suporte implementada
- [x] Configurações integradas com backend

### UI/UX
- [x] Modal de match corrigido (não sobrepõe mais)
- [x] Navegação e estados de carregamento validados
- [x] Textos revisados em português
- [x] Feedback visual para ações do usuário
- [x] Inputs de cidade com autocomplete/validação IBGE
- [ ] Responsividade revisada em múltiplas resoluções

### Performance
- [x] Otimistic updates implementados
- [x] Loading states em todas as operações assíncronas
- [x] Tratamento de erros implementado
- [ ] Testar performance com muitos pets
- [ ] Verificar uso de memória

## 🔧 Backend

### API
- [x] API rodando em produção: `https://dogmatch.onrender.com`
- [x] Endpoint de atualização de perfil implementado (`PUT /users/me`)
- [x] Endpoint de busca de perfil implementado (`GET /users/me`)
- [x] Fluxo `/users/me` validado em produção (17/11/2025)
- [x] Socket.IO configurado para chat em tempo real
- [x] CORS configurado para produção
- [x] Helmet configurado para segurança
- [ ] Testar todos os endpoints em produção
- [ ] Verificar logs de erro

### Segurança
- [x] JWT_SECRET configurado
- [x] Senhas não são retornadas nas respostas
- [x] CPF não é retornado nas respostas
- [x] Autenticação obrigatória em rotas protegidas
- [ ] Verificar rate limiting (se necessário)
- [ ] Verificar validação de inputs

### Banco de Dados
- [x] Migrations aplicadas
- [x] Schema atualizado
- [ ] Backup configurado
- [ ] Verificar índices para performance

### Integrações
- [x] Supabase Storage configurado
- [x] Asaas Payment Gateway configurado
- [ ] Testar webhook do Asaas em produção *(aguardando saldo para pagamento real)*
- [ ] Verificar credenciais de produção

## 📧 Suporte

- [x] Tela de suporte criada
- [x] E-mail de suporte configurado: `pardepatasapp@gmail.com`
- [x] Link para suporte na tela de configurações
- [ ] Configurar resposta automática de e-mail (opcional)
- [ ] Documentar processo de atendimento

## 📋 Documentação

- [x] README atualizado
- [x] Checklist de lançamento criado
- [ ] Documentar processo de deploy
- [ ] Documentar troubleshooting comum

## 🧪 Testes

### Testes Manuais
- [x] Testar fluxo completo de registro
- [x] Testar cadastro de pet
- [x] Testar sistema de swipe
- [x] Testar chat em tempo real
- [ ] Testar compra de plano *(aguardando saldo para concluir pagamento Asaas)*
- [x] Testar atualização de perfil
- [x] Testar tela de suporte
- [x] Testar logout

### Testes de Integração
- [ ] Testar comunicação frontend-backend
- [ ] Testar Socket.IO em produção
- [ ] Testar upload de imagens
- [ ] Testar pagamentos *(webhook Asaas)*

## 🚀 Deploy

### Backend
- [x] Backend rodando em produção
- [ ] Verificar variáveis de ambiente em produção
- [ ] Verificar logs de produção
- [ ] Configurar monitoramento (opcional)

> **Nota:** o app mobile foi adiado e não faz parte deste lançamento.

## 📊 Monitoramento

- [ ] Configurar analytics (opcional)
- [ ] Configurar crash reporting (opcional)
- [ ] Monitorar uso da API
- [ ] Monitorar erros

## ✅ Pré-Lançamento

- [ ] Revisar todos os textos e traduções
- [ ] Verificar todos os links e URLs
- [ ] Testar em diferentes dispositivos
- [ ] Verificar performance geral
- [ ] Revisar políticas de privacidade e termos (se necessário)
- [ ] Preparar comunicado de lançamento (opcional)

---

## 📝 Notas

- API de produção: `https://dogmatch.onrender.com`
- E-mail de suporte: `pardepatasapp@gmail.com`
- Versão do app: 1.0.0
- Banco de dados limpo para lançamento em 13/11/2025
- Testes automatizados removidos do repositório para build final (executar checklist manual antes do deploy)

---

**Última atualização:** 17/11/2025

