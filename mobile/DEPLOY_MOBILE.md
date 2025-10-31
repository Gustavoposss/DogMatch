# 📱 Guia Completo - Deploy do App Mobile para Produção

## 🎯 Objetivo

Publicar o app Par de Patas nas lojas oficiais (Google Play Store e Apple App Store) e permitir testes em produção.

## 📋 Pré-requisitos

### 1. Contas Necessárias
- ✅ **Conta Expo** (gratuita): https://expo.dev
- ✅ **Conta Google Play** (R$ 25,00 uma vez): https://play.google.com/console
- ✅ **Conta Apple Developer** (US$ 99,00/ano): https://developer.apple.com

### 2. Ferramentas
- ✅ **Expo CLI**: `npm install -g eas-cli`
- ✅ **Node.js 18+**
- ✅ **Git configurado**

## 🚀 Passo a Passo

### ETAPA 1: Configurar Expo EAS (Expo Application Services)

#### 1.1. Instalar EAS CLI
```bash
npm install -g eas-cli
```

#### 1.2. Login no Expo
```bash
eas login
```
*(Crie uma conta se não tiver: https://expo.dev/signup)*

#### 1.3. Inicializar Projeto EAS
```bash
cd mobile
eas build:configure
```

Isso criará o arquivo `eas.json` com configurações de build.

---

### ETAPA 2: Configurar app.json para Produção

#### 2.1. Atualizar informações do app

**Importante:** Atualize o `app.json` com:
- Nome do app (Par de Patas)
- Slug único (par-de-patas)
- Versão (1.0.0)
- Bundle identifier (com.par-de-patas.app)
- URL da API em produção

#### 2.2. Configurar variáveis de ambiente

No `app.json`, configure:
```json
{
  "expo": {
    "extra": {
      "environment": "production",
      "debug": "false",
      "apiUrl": "https://dogmatch.onrender.com"
    }
  }
}
```

---

### ETAPA 3: Build do App (APK/AAB para Android)

#### 3.1. Build de teste (APK)
```bash
cd mobile
eas build --platform android --profile preview
```

**Tempo estimado:** 10-15 minutos

Este comando:
- ✅ Cria um APK instalável
- ✅ Pode ser compartilhado para teste
- ✅ Não requer Google Play Store
- ✅ Perfeito para testes internos

#### 3.2. Instalar APK no celular

1. **Receba o link do build** (aparece no terminal ou Expo Dashboard)
2. **Baixe o APK** no celular
3. **Permita instalação de fontes desconhecidas** (configurações Android)
4. **Instale e teste!**

#### 3.3. Build para produção (AAB)
```bash
eas build --platform android --profile production
```

**Tempo estimado:** 15-20 minutos

Este comando:
- ✅ Cria um AAB (Android App Bundle)
- ✅ Formato necessário para Google Play
- ✅ Assinado com certificado de produção

---

### ETAPA 4: Publicar no Google Play Store (Android)

#### 4.1. Configurar conta Google Play Console

1. Acesse: https://play.google.com/console
2. Pague a taxa única de R$ 25,00
3. Crie sua conta de desenvolvedor

#### 4.2. Criar novo app

1. Clique em **"Criar app"**
2. Preencha:
   - **Nome do app:** Par de Patas
   - **Idioma padrão:** Português (Brasil)
   - **App ou jogo:** App
   - **Gratuito ou pago:** Gratuito
3. Aceite os termos

#### 4.3. Configurar dados do app

1. **Destaques do app**
   - Ícone (1024x1024px)
   - Screenshots (mínimo 2)
   - Descrição curta (80 caracteres)
   - Descrição completa

2. **Categoria e conteúdo**
   - Categoria: Social, Comunidade, ou Pets
   - Classificação etária

3. **Preços e distribuição**
   - Países disponíveis
   - Gratuito ou pago

#### 4.4. Upload do AAB

1. Vá para **"Produção" > "Criar versão"**
2. Faça upload do AAB baixado do EAS
3. Preencha as notas de versão

#### 4.5. Teste interno (Recomendado primeiro!)

1. Vá para **"Testes" > "Testes internos"**
2. Crie um grupo de teste
3. Adicione emails dos testadores
4. Faça upload do AAB
5. **Testadores recebem link direto!**

#### 4.6. Enviar para revisão

1. Complete todos os passos acima
2. Clique em **"Enviar para revisão"**
3. Aguarde 1-7 dias para aprovação
4. App será publicado automaticamente quando aprovado

---

### ETAPA 5: Build do App (iOS - App Store)

#### 5.1. Configurar conta Apple Developer

1. Acesse: https://developer.apple.com
2. Inscreva-se no programa (US$ 99,00/ano)
3. Configure seu perfil de desenvolvedor

#### 5.2. Build para iOS
```bash
eas build --platform ios --profile production
```

**Importante:** Requer Mac ou EAS Build (cloud build)

#### 5.3. Publicar no App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Crie novo app
3. Configure informações
4. Upload do IPA via Transporter
5. Envie para revisão (1-7 dias)

---

### ETAPA 6: Teste em Produção (Beta Testing)

#### Opção A: TestFlight (iOS)
- ✅ Até 10.000 testadores
- ✅ Distribuição via App Store Connect
- ✅ Testadores recebem email

#### Opção B: Google Play Internal Testing (Android)
- ✅ Até 100 testadores
- ✅ Distribuição via link direto
- ✅ Mais rápido que produção

#### Opção C: Teste com APK (Android)
- ✅ Compartilhamento direto
- ✅ Não requer Play Store
- ✅ Limitado a 100 instalações

---

### ETAPA 7: Configurar API de Produção

#### 7.1. Atualizar URL da API

No `mobile/app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://dogmatch.onrender.com"
    }
  }
}
```

#### 7.2. Verificar CORS no backend

No Render, verifique se o CORS está configurado para aceitar requisições do app.

---

## 🔧 Arquivos de Configuração

### eas.json (criado automaticamente)
```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📊 Checklist Completo

### Antes do Build
- [ ] EAS CLI instalado e login feito
- [ ] `app.json` configurado para produção
- [ ] URL da API atualizada para `https://dogmatch.onrender.com`
- [ ] Versão do app incrementada
- [ ] Ícones e splash screens prontos
- [ ] `eas.json` configurado

### Build
- [ ] Build de teste (APK) criado e testado
- [ ] Build de produção (AAB) criado
- [ ] App testado localmente

### Google Play Store
- [ ] Conta Google Play configurada
- [ ] App criado no console
- [ ] Dados do app preenchidos
- [ ] Screenshots adicionados
- [ ] AAB enviado
- [ ] Teste interno configurado
- [ ] Enviado para revisão

### Teste em Produção
- [ ] Link de teste compartilhado
- [ ] Testadores convidados
- [ ] Feedback coletado
- [ ] Problemas corrigidos

---

## 🐛 Troubleshooting

### Build falha
- Verifique logs no terminal
- Verifique `eas.json` está correto
- Tente `eas build --clear-cache`

### App não conecta à API
- Verifique URL no `app.json`
- Verifique CORS no backend
- Teste API diretamente no navegador

### Erro de certificado
- Execute `eas credentials` para configurar
- Siga as instruções no terminal

---

## 📚 Recursos

- **Expo EAS Build:** https://docs.expo.dev/build/introduction/
- **Google Play Console:** https://support.google.com/googleplay/android-developer
- **Apple App Store Connect:** https://developer.apple.com/app-store-connect/
- **Expo Deployment:** https://docs.expo.dev/distribution/introduction/

---

## 💡 Dicas Importantes

1. **Sempre teste com APK primeiro** antes de publicar
2. **Use teste interno** no Google Play antes de produção
3. **Incremente a versão** a cada build
4. **Monitore os logs** do backend em produção
5. **Tenha um plano de rollback** se algo der errado

---

## 🎯 Próximos Passos Imediatos

1. ✅ Instalar EAS CLI: `npm install -g eas-cli`
2. ✅ Login: `eas login`
3. ✅ Configurar: `eas build:configure`
4. ✅ Atualizar `app.json` com URL de produção
5. ✅ Primeiro build de teste: `eas build --platform android --profile preview`

---

**Pronto para começar?** Execute os próximos passos no terminal! 🚀

