# 🧪 Guia de Testes - Par de Patas

Este documento explica como executar os testes automatizados do sistema antes de fazer o build.

## 📋 Índice

- [Por que testar?](#por-que-testar)
- [Pré-requisitos](#pré-requisitos)
- [Executando os Testes](#executando-os-testes)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Interpretando os Resultados](#interpretando-os-resultados)
- [Troubleshooting](#troubleshooting)

## 🎯 Por que testar?

Os testes automatizados permitem:
- ✅ Validar todas as funcionalidades antes do build (economiza 40 minutos!)
- ✅ Detectar bugs antes de chegar ao usuário final
- ✅ Garantir que mudanças não quebraram funcionalidades existentes
- ✅ Documentar como o sistema deve funcionar
- ✅ Facilitar refatorações futuras

## 📦 Pré-requisitos

1. **Node.js 18+** instalado
2. **PostgreSQL** rodando e configurado
3. **Variáveis de ambiente** configuradas no `.env` do backend
4. **Banco de dados** criado e migrado

## 🚀 Executando os Testes

### 1. Instalar Dependências de Teste

```bash
cd backend
npm install
```

Isso instalará:
- `jest` - Framework de testes
- `supertest` - Testes de API HTTP
- `ts-jest` - Suporte TypeScript para Jest
- `@types/jest` e `@types/supertest` - Tipos TypeScript

### 2. Configurar Banco de Dados para Testes

Os testes usam o mesmo banco de dados, mas limpam os dados antes de cada teste.

**⚠️ IMPORTANTE:** Os testes vão **DELETAR TODOS OS DADOS** do banco de dados!

Certifique-se de estar usando um banco de teste ou tenha backup dos dados.

### 3. Executar Todos os Testes

```bash
cd backend
npm test
```

Ou para ver mais detalhes:

```bash
npm test -- --verbose
```

### 4. Executar Teste Específico

```bash
# Testes de autenticação
npm test -- auth.test

# Testes de pets
npm test -- pets.test

# Testes de swipe
npm test -- swipe.test

# Testes de chat
npm test -- chat.test

# Teste end-to-end completo
npm test -- full-system.test
```

### 5. Executar com Cobertura

```bash
npm run test:coverage
```

Isso gera um relatório de cobertura mostrando quais partes do código foram testadas.

## 📁 Estrutura dos Testes

```
backend/
├── tests/
│   ├── setup.ts                    # Configuração global dos testes
│   ├── helpers/
│   │   └── testHelpers.ts          # Funções auxiliares para criar dados de teste
│   ├── integration/
│   │   ├── auth.test.ts            # Testes de autenticação
│   │   ├── pets.test.ts            # Testes de pets
│   │   ├── swipe.test.ts           # Testes de swipe e matches
│   │   └── chat.test.ts            # Testes de chat
│   ├── e2e/
│   │   └── full-system.test.ts     # Teste end-to-end completo
│   └── run-all-tests.ts            # Script master para executar tudo
```

## 📊 Interpretando os Resultados

### ✅ Teste Passou

```
✓ deve registrar um novo usuário com sucesso (123ms)
```

### ❌ Teste Falhou

```
✗ deve registrar um novo usuário com sucesso (45ms)
  Expected: 201
  Received: 400
```

### 📈 Relatório de Cobertura

Após executar `npm run test:coverage`, você verá:

```
----------|---------|----------|---------|---------|-------------------|
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
----------|---------|----------|---------|---------|-------------------|
All files |   85.23 |    78.45 |   82.10 |   85.23 |                   |
```

## 🔍 O que é Testado?

### ✅ Autenticação (`auth.test.ts`)
- Registro de novos usuários
- Login com credenciais válidas
- Validação de CPF
- Validação de email
- Tratamento de erros

### ✅ Pets (`pets.test.ts`)
- Criação de pets
- Listagem de pets do usuário
- Atualização de pets
- Exclusão de pets
- Validação de campos obrigatórios
- Autenticação necessária

### ✅ Swipe (`swipe.test.ts`)
- Buscar pets disponíveis para swipe
- Dar like em pets
- Prevenir likes duplicados
- Criar matches quando há like recíproco
- Filtrar pets já curtidos

### ✅ Chat (`chat.test.ts`)
- Enviar mensagens
- Buscar mensagens do chat
- Criar chat automaticamente
- Validar permissões de acesso

### ✅ Teste End-to-End (`full-system.test.ts`)
Simula um fluxo completo:
1. Registro de 2 usuários
2. Cadastro de pets para cada usuário
3. Buscar pets disponíveis
4. Sistema de swipe e criação de match
5. Chat entre os matches
6. Verificação de filtros

## 🐛 Troubleshooting

### Erro: "Cannot find module 'jest'"

```bash
cd backend
npm install
```

### Erro: "Database connection failed"

Verifique:
1. PostgreSQL está rodando
2. `DATABASE_URL` no `.env` está correto
3. Banco de dados existe

### Erro: "JWT_SECRET não configurado"

Adicione no `.env`:
```env
JWT_SECRET=test-secret-key
```

### Testes muito lentos

Os testes podem ser lentos se:
- Banco de dados está em servidor remoto
- Muitos dados no banco
- Conexão de rede lenta

**Solução:** Use um banco de dados local para testes.

### Erro: "Port already in use"

Se o servidor já estiver rodando, pare-o antes de executar os testes:

```bash
# Encontrar processo na porta 3000
lsof -i :3000

# Matar processo
kill -9 <PID>
```

## 📝 Adicionando Novos Testes

Para adicionar novos testes:

1. Crie um arquivo `*.test.ts` em `backend/tests/integration/`
2. Importe as funções auxiliares de `testHelpers.ts`
3. Use `beforeEach` para limpar dados
4. Use `supertest` para testar rotas HTTP

Exemplo:

```typescript
import request from 'supertest';
import { createTestUser } from '../helpers/testHelpers';

describe('Minha Funcionalidade', () => {
  it('deve fazer algo', async () => {
    const user = await createTestUser();
    const response = await request(app)
      .get('/minha-rota')
      .set('Authorization', `Bearer ${user.token}`);
    
    expect(response.status).toBe(200);
  });
});
```

## 🎯 Checklist Antes do Build

Antes de fazer o build para produção, certifique-se:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura de código acima de 70% (`npm run test:coverage`)
- [ ] Teste end-to-end completo passa (`npm test -- full-system`)
- [ ] Nenhum erro no console
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado

## 💡 Dicas

1. **Execute os testes sempre antes de commitar:**
   ```bash
   npm test
   ```

2. **Use modo watch durante desenvolvimento:**
   ```bash
   npm run test:watch
   ```

3. **Foque em testar funcionalidades críticas:**
   - Autenticação
   - Criação de matches
   - Sistema de pagamentos
   - Chat

4. **Mantenha os testes atualizados:**
   - Quando adicionar nova funcionalidade, adicione testes
   - Quando corrigir bug, adicione teste para prevenir regressão

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de erro
2. Confira se todas as dependências estão instaladas
3. Verifique a configuração do banco de dados
4. Consulte a documentação do Jest: https://jestjs.io/

---

**🎉 Agora você pode testar tudo antes de fazer o build e economizar 40 minutos!**

