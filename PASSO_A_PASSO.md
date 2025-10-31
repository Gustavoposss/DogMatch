# 🎯 Passo a Passo - Deploy Mobile para Produção

## 📋 Resumo

Seguindo estes passos, você terá:
1. ✅ Backend atualizado no Render (automático via git push)
2. ✅ App mobile pronto para testar em produção (APK)
3. ✅ App pronto para publicar no Google Play (AAB)

---

## 🚀 ETAPA 1: Atualizar Backend no Render (2 minutos)

### 1.1. Commit e Push
```bash
cd C:\Users\Gusta\OneDrive\Desktop\par-de-patas
git add .
git commit -m "feat: preparação para produção"
git push origin master
```

**✅ Render detectará e fará deploy automaticamente em 2-5 minutos!**

### 1.2. Verificar deploy
Acesse: https://dogmatch.onrender.com/ping  
✅ Deve retornar: `pong`

---

## 📱 ETAPA 2: Configurar Expo EAS (5 minutos)

### 2.1. Instalar EAS CLI
```bash
npm install -g eas-cli
```

### 2.2. Criar conta Expo (se não tiver)
1. Acesse: https://expo.dev/signup
2. Crie conta (grátis!)
3. Confirme email

### 2.3. Login no Expo
```bash
eas login
```
*(Use email e senha da conta Expo)*

### 2.4. Configurar EAS Build
```bash
cd mobile
eas build:configure
```

**Perguntas que aparecerão:**
- ✅ Escolha: Android, iOS ou ambos (comece com Android)
- ✅ Profile: development, preview, production (escolha o padrão)
- ✅ Permissões: Aceite criar arquivo `eas.json`

**✅ Arquivo `eas.json` será criado automaticamente!**

---

## 🔧 ETAPA 3: Atualizar app.json (2 minutos)

### 3.1. Editar `mobile/app.json`

Atualize com estas informações:

```json
{
  "expo": {
    "name": "Par de Patas",
    "slug": "par-de-patas",
    "version": "1.0.0",
    "android": {
      "package": "com.pardepatas.app",
      "versionCode": 1
    },
    "extra": {
      "apiUrl": "https://dogmatch.onrender.com",
      "environment": "production",
      "debug": "false",
      "localIp": "192.168.101.5"
    }
  }
}
```

**✅ App configurado para produção!**

---

## 🧪 ETAPA 4: Primeiro Build de Teste (15 minutos)

### 4.1. Build APK
```bash
cd mobile
eas build --platform android --profile preview
```

### 4.2. O que acontece:
1. ✅ Expo compila seu app na nuvem
2. ✅ Cria APK instalável
3. ✅ Assina com certificado temporário
4. ✅ Disponibiliza link para download

### 4.3. Aguardar build (10-15 minutos)

**Você verá:**
- Link no terminal
- Ou acompanhe em: https://expo.dev

### 4.4. Baixar APK
1. **Copie o link** que aparece no terminal
2. **Abra no celular** (navegador)
3. **Baixe o APK**

### 4.5. Instalar APK no celular
1. **Permita fontes desconhecidas:**
   - Configurações → Segurança → Fontes desconhecidas ✅
2. **Abra o APK** baixado
3. **Instale**

### 4.6. Testar app
- ✅ Abra o app
- ✅ Faça login/cadastro
- ✅ Teste todas as funcionalidades
- ✅ Verifique se conecta à API de produção

**✅ App testado em produção!**

---

## 📦 ETAPA 5: Build de Produção para Google Play (20 minutos)

### 5.1. Build AAB
```bash
cd mobile
eas build --platform android --profile production
```

**⏱️ Tempo:** 15-20 minutos  
**📥 Resultado:** AAB (Android App Bundle) pronto para Play Store

### 5.2. Baixar AAB
1. Link aparecerá no terminal
2. Baixe o arquivo `.aab`

**✅ AAB pronto para upload!**

---

## 🏪 ETAPA 6: Publicar no Google Play Store (30 minutos)

### 6.1. Criar conta Google Play Developer
1. Acesse: https://play.google.com/console
2. Clique em **"Começar"**
3. Pague taxa única: **R$ 25,00**
4. Complete cadastro

### 6.2. Criar novo app
1. Clique em **"Criar app"**
2. Preencha:
   - **Nome do app:** Par de Patas
   - **Idioma:** Português (Brasil)
   - **Tipo:** App
   - **Gratuito ou pago:** Gratuito
3. Clique em **"Criar"**

### 6.3. Configurar dados do app
1. **Destaques do app**
   - Ícone (512x512px)
   - Screenshots (mínimo 2, máximo 8)
   - Descrição curta (80 caracteres)
   - Descrição completa

2. **Categoria e conteúdo**
   - Categoria: Social, Comunidade, ou Pets
   - Classificação etária: Livre para todos

3. **Preços e distribuição**
   - Distribuir como: Gratuito
   - Países: Selecione (Brasil obrigatório)

### 6.4. Teste interno (Recomendado primeiro!)

1. Vá para **"Testes" > "Testes internos"**
2. Clique em **"Criar grupo de teste"**
3. Nome: "Beta Testers"
4. Adicione emails dos testadores
5. Clique em **"Criar versão"**
6. Faça upload do **AAB** baixado
7. Preencha **Notas de versão**
8. Clique em **"Revisar versão"**
9. Clique em **"Iniciar rollout para teste interno"**

**✅ Testadores receberão email com link direto!**

### 6.5. Enviar para produção

**Após testes bem-sucedidos:**

1. Vá para **"Produção" > "Criar versão"**
2. Faça upload do **AAB**
3. Preencha notas de versão
4. Clique em **"Revisar versão"**
5. Clique em **"Iniciar rollout para produção"**

**⏱️ Revisão:** 1-7 dias  
**✅ App publicado automaticamente após aprovação!**

---

## ✅ Checklist Final

### Backend
- [x] Commit e push feito
- [x] Render fez deploy automaticamente
- [x] API funcionando: https://dogmatch.onrender.com/ping

### Mobile
- [ ] EAS CLI instalado
- [ ] Login no Expo feito
- [ ] EAS configurado (`eas.json` criado)
- [ ] `app.json` atualizado
- [ ] Build de teste (APK) criado
- [ ] App testado com API de produção
- [ ] Build de produção (AAB) criado
- [ ] Conta Google Play criada
- [ ] App publicado (teste interno ou produção)

---

## 🎯 Começar Agora!

**Comandos rápidos:**

```bash
# 1. Atualizar backend
cd C:\Users\Gusta\OneDrive\Desktop\par-de-patas
git add . && git commit -m "feat: preparação para produção" && git push

# 2. Configurar mobile (primeira vez)
npm install -g eas-cli
eas login
cd mobile
eas build:configure

# 3. Primeiro build de teste
eas build --platform android --profile preview
```

**Próximo passo:** Execute os comandos acima! 🚀

