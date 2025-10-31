# 🚀 Comandos Rápidos - Deploy

## 📦 Backend (Render - Automático após push)

```bash
# 1. Ir para raiz do projeto
cd C:\Users\Gusta\OneDrive\Desktop\par-de-patas

# 2. Adicionar alterações
git add .

# 3. Commit
git commit -m "feat: preparação para produção"

# 4. Push (Render fará deploy automático)
git push origin master
```

✅ Render detectará e fará deploy automaticamente em 2-5 minutos!

---

## 📱 Mobile (Expo EAS Build)

### Instalação e Configuração Inicial
```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login no Expo
eas login
# (Criar conta em: https://expo.dev/signup - grátis!)

# 3. Ir para pasta mobile
cd mobile

# 4. Configurar EAS (primeira vez)
eas build:configure
```

### Build de Teste (APK)
```bash
cd mobile
eas build --platform android --profile preview
```
⏱️ Tempo: 10-15 minutos  
📥 Resultado: Link para download do APK

### Build de Produção (AAB para Google Play)
```bash
cd mobile
eas build --platform android --profile production
```
⏱️ Tempo: 15-20 minutos  
📥 Resultado: AAB pronto para upload na Play Store

---

## 🧪 Teste Rápido

### 1. Verificar backend
Acesse no navegador:
```
https://dogmatch.onrender.com/ping
```
✅ Deve retornar: `pong`

### 2. Testar app
- Baixe o APK do build
- Instale no celular Android
- Teste todas as funcionalidades
- Verifique se conecta à API de produção

---

## 📊 Status do Deploy

### Backend ✅
- URL: https://dogmatch.onrender.com
- Deploy automático via git push

### Mobile ⏳
- Primeiro build pendente
- Após build: testar com API de produção

---

**Próximo comando:** Execute `git add . && git commit -m "feat: preparação para produção" && git push` 🚀

