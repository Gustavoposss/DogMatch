# 🚀 Preparar Deploy - Par de Patas

## ✅ Passo 1: Commit das Alterações no Git

### 1.1. Adicionar arquivos alterados
```bash
cd C:\Users\Gusta\OneDrive\Desktop\par-de-patas

# Adicionar todas as alterações
git add .

# OU adicionar arquivos específicos:
git add backend/
git add mobile/
git add DEPLOY.md
git add mobile/DEPLOY_MOBILE.md
```

### 1.2. Fazer commit
```bash
git commit -m "feat: preparação para produção - refatoração e deploy mobile

- Adiciona sistema de logging condicional
- Remove arquivos temporários de debug
- Restringe endpoints de teste em produção
- Configura ambiente para produção
- Adiciona documentação de deploy
- Configura mobile app para produção"
```

### 1.3. Enviar para repositório
```bash
git push origin master
```

**Render detectará automaticamente e fará deploy do backend!**

---

## 📱 Passo 2: Configurar Mobile para Produção

### 2.1. Instalar EAS CLI
```bash
npm install -g eas-cli
```

### 2.2. Login no Expo
```bash
eas login
```
*(Crie conta em: https://expo.dev/signup - é grátis!)*

### 2.3. Configurar EAS Build
```bash
cd mobile
eas build:configure
```

Isso criará o arquivo `eas.json` automaticamente.

### 2.4. Atualizar app.json para produção

**Edite `mobile/app.json`** e atualize:

```json
{
  "expo": {
    "name": "Par de Patas",
    "slug": "par-de-patas",
    "version": "1.0.0",
    "android": {
      "package": "com.pardepatas.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "ios": {
      "bundleIdentifier": "com.pardepatas.app",
      "buildNumber": "1.0.0"
    },
    "extra": {
      "apiUrl": "https://dogmatch.onrender.com",
      "environment": "production",
      "debug": "false"
    }
  }
}
```

---

## 🧪 Passo 3: Primeiro Build de Teste

### 3.1. Build APK (para testes)
```bash
cd mobile
eas build --platform android --profile preview
```

**Tempo estimado:** 10-15 minutos

### 3.2. Aguardar build

- Você verá um link no terminal
- Ou acompanhe em: https://expo.dev

### 3.3. Baixar e instalar APK

1. **Baixe o APK** no celular (link do build)
2. **Permita fontes desconhecidas** nas configurações Android
3. **Instale o APK**
4. **Teste o app** conectado à API de produção!

---

## 📦 Passo 4: Preparar para Google Play Store

### 4.1. Criar conta Google Play Developer
- Acesse: https://play.google.com/console
- Taxa única: R$ 25,00
- Complete cadastro

### 4.2. Build de produção (AAB)
```bash
cd mobile
eas build --platform android --profile production
```

### 4.3. Upload no Google Play Console

1. Acesse: https://play.google.com/console
2. Crie novo app: "Par de Patas"
3. Vá em **"Testes" > "Testes internos"**
4. Faça upload do AAB baixado
5. Adicione emails dos testadores
6. **Testadores receberão link direto!**

---

## 🔄 Próximos Passos

1. ✅ **Commit e push** para atualizar backend no Render
2. ✅ **Primeiro build de teste** (APK)
3. ✅ **Testar app** com API de produção
4. ✅ **Build de produção** quando estiver tudo OK
5. ✅ **Publicar no Google Play** (teste interno primeiro)

---

## 📋 Checklist Rápido

### Backend (Render)
- [ ] Commit feito: `git add . && git commit -m "..." && git push`
- [ ] Render detectou e fez deploy automaticamente
- [ ] API funcionando em: https://dogmatch.onrender.com/ping

### Mobile
- [ ] EAS CLI instalado: `npm install -g eas-cli`
- [ ] Login feito: `eas login`
- [ ] EAS configurado: `eas build:configure`
- [ ] `app.json` atualizado com URL de produção
- [ ] Primeiro build de teste (APK) criado
- [ ] App testado com API de produção
- [ ] Tudo funcionando? Build de produção!

---

## 🎯 Começar Agora

**1. Commit das alterações:**
```bash
git add .
git commit -m "feat: preparação para produção"
git push origin master
```

**2. Configure mobile:**
```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
```

**3. Primeiro build de teste:**
```bash
eas build --platform android --profile preview
```

**Pronto!** Em ~15 minutos você terá o APK para testar! 🚀

