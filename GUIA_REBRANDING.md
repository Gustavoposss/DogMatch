# 🐾 Guia de Rebranding - Par de Patas

## 🎨 **IDENTIDADE VISUAL**

### **Nova Marca**
- **Nome Antigo:** DogMatch
- **Nome Novo:** Par de Patas
- **Slogan:** "Mais que encontros, conexões caninas"

---

## 🎨 **PALETA DE CORES**

### **Cores Principais**

#### **Roxo (Moderna e criativa)**
- **Primary:** `#8B5CF6` - Roxo vibrante
- **Dark:** `#7C3AED` - Roxo escuro
- **Light:** `#A78BFA` - Roxo claro

#### **Amarelo Neon (Vibrante e acolhedora)**
- **Primary:** `#FCD34D` - Amarelo dourado
- **Dark:** `#F59E0B` - Amarelo laranja
- **Light:** `#FDE68A` - Amarelo claro

#### **Branco (Clara e tecnológica)**
- **Primary:** `#FFFFFF` - Branco puro
- **Gray Light:** `#F8FAFC` - Cinza clarinho
- **Gray:** `#E2E8F0` - Cinza médio
- **Gray Dark:** `#64748B` - Cinza escuro

---

## 📝 **TIPOGRAFIA**

### **Fontes**
1. **Fredoka** (Logo e títulos principais)
   - Peso: 300-700
   - Uso: Títulos, logo, destaques
   - Classe CSS: `font-brand-primary`

2. **Montserrat** (Texto corpo)
   - Peso: 300-700
   - Uso: Parágrafos, botões, navegação
   - Classe CSS: `font-brand-secondary`

---

## 🖼️ **LOGO**

### **Elementos do Logo**
- **Círculo roxo** (`#8B5CF6`) com stroke roxo escuro (`#7C3AED`)
- **Patas amarelas** (`#FCD34D`) dentro do círculo
- **Letras "PP"** em destaque
- **Animação:** paw-bounce (saltitante)

### **Arquivos**
- `frontend/public/par-de-patas-logo.svg` - Logo principal
- Dimensões recomendadas: 200x200px (escalável)

---

## 🎨 **CLASSES CSS PERSONALIZADAS**

### **Backgrounds**
```css
.brand-bg-primary       /* Roxo #8B5CF6 */
.brand-bg-secondary     /* Amarelo #FCD34D */
.brand-bg-light         /* Cinza claro #F8FAFC */
```

### **Textos**
```css
.brand-text-primary     /* Roxo #8B5CF6 */
.brand-text-secondary   /* Amarelo #FCD34D */
.slogan-brand           /* Slogan estilizado */
.logo-brand             /* Logo com gradiente */
```

### **Botões**
```css
.btn-brand-primary      /* Botão roxo com gradiente */
.btn-brand-secondary    /* Botão amarelo com gradiente */
```

### **Cards**
```css
.card-brand             /* Card com hover e transições */
```

### **Gradientes**
```css
.brand-gradient-primary     /* Gradiente roxo */
.brand-gradient-secondary   /* Gradiente amarelo */
.brand-gradient-rainbow     /* Gradiente roxo → amarelo */
```

### **Sombras**
```css
.shadow-brand           /* Sombra roxa suave */
.shadow-brand-lg        /* Sombra roxa grande */
```

### **Animações**
```css
.paw-animation          /* Animação de pata saltitante */
.loading-brand          /* Loading com shimmer */
```

---

## 📦 **ESTRUTURA DE ARQUIVOS**

### **Frontend**
```
frontend/
├── public/
│   └── par-de-patas-logo.svg      # Logo principal
├── src/
│   ├── styles/
│   │   └── brand.css               # Estilos da marca
│   └── index.css                   # Import das fontes
```

### **Arquivos Atualizados**
- ✅ `frontend/index.html` - Título e favicon
- ✅ `frontend/package.json` - Nome do projeto
- ✅ `frontend/src/Navbar.tsx` - Logo e cores
- ✅ `frontend/src/pages/Home.tsx` - Identidade visual
- ✅ `frontend/src/pages/Login.tsx` - Identidade visual
- ✅ `frontend/src/pages/Register.tsx` - Identidade visual
- ✅ `frontend/src/pages/Plans.tsx` - Cores dos planos
- ✅ `frontend/src/pages/PaymentFailure.tsx` - Botões e links
- ✅ `backend/package.json` - Nome e descrição
- ✅ `backend/index.ts` - CORS e Swagger
- ✅ `README.md` - Nome e URLs

---

## 🌐 **URLs E DOMÍNIOS**

### **Produção**
- **Frontend:** `https://par-de-patas.vercel.app`
- **Backend:** `https://par-de-patas.onrender.com`
- **Email Suporte:** `suporte@pardepatas.com.br`

### **Desenvolvimento**
- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:3000`

### **CORS Configurado**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://par-de-patas.vercel.app'
];
```

---

## 🔄 **PRÓXIMOS PASSOS**

### **1. Deploy**
- [ ] Fazer deploy do frontend no Vercel
- [ ] Fazer deploy do backend no Render
- [ ] Configurar domínio customizado (opcional)

### **2. Configurações**
- [ ] Atualizar webhooks do Asaas
- [ ] Atualizar variáveis de ambiente
- [ ] Testar todas as funcionalidades

### **3. GitHub**
- [ ] Renomear repositório para `par-de-patas`
- [ ] Atualizar descrição do repositório
- [ ] Atualizar README

### **4. Marketing**
- [ ] Atualizar redes sociais
- [ ] Criar materiais de marketing
- [ ] Enviar comunicado para usuários existentes (se houver)

---

## 🎯 **GUIA DE USO - COMPONENTES**

### **Como usar o logo**
```tsx
<img src="/par-de-patas-logo.svg" alt="Par de Patas" className="w-16 h-16 paw-animation" />
```

### **Como usar títulos**
```tsx
<h1 className="font-brand-primary brand-text-primary">
  Título Principal
</h1>
<p className="font-brand-secondary slogan-brand">
  Mais que encontros, conexões caninas
</p>
```

### **Como usar botões**
```tsx
{/* Botão primário (roxo) */}
<button className="btn-brand-primary">
  Clique Aqui
</button>

{/* Botão secundário (amarelo) */}
<button className="btn-brand-secondary">
  Ver Mais
</button>
```

### **Como usar cards**
```tsx
<div className="card-brand">
  <h3 className="font-brand-primary">Título do Card</h3>
  <p className="font-brand-secondary">Conteúdo do card</p>
</div>
```

### **Como usar backgrounds**
```tsx
<div className="brand-bg-light min-h-screen">
  {/* Conteúdo */}
</div>
```

---

## 📋 **CHECKLIST DE REBRANDING**

### **Visual**
- [x] Logo criado
- [x] Paleta de cores definida
- [x] Tipografia escolhida
- [x] CSS customizado criado
- [x] Favicon atualizado

### **Código**
- [x] Nome atualizado no frontend
- [x] Nome atualizado no backend
- [x] URLs atualizadas
- [x] CORS configurado
- [x] Documentação API atualizada
- [x] README atualizado

### **Páginas**
- [x] Home
- [x] Login
- [x] Register
- [x] Plans
- [x] PaymentFailure
- [x] Navbar
- [ ] PaymentSuccess (se necessário)
- [ ] Outras páginas

### **Deploy**
- [ ] Frontend deployado
- [ ] Backend deployado
- [ ] Webhooks configurados
- [ ] Domínio configurado

---

## 💡 **DICAS DE USO**

### **Manter Consistência**
- Sempre use as classes `brand-*` para elementos relacionados à marca
- Use `font-brand-primary` para títulos e destaques
- Use `font-brand-secondary` para texto corpo
- Mantenha o slogan visível em páginas de login/registro

### **Animações**
- Use `paw-animation` no logo para dar vida
- Use `loading-brand` para estados de carregamento
- Mantenha transições suaves (200-300ms)

### **Acessibilidade**
- Contraste adequado: roxo sobre branco ✅
- Amarelo apenas para destaques, não para texto sobre branco
- Mantenha textos legíveis (mínimo 14px)

---

## 📞 **SUPORTE**

Para dúvidas sobre o rebranding:
- **Email:** suporte@pardepatas.com.br
- **Documentação:** Este arquivo
- **Identidade Visual:** `/docs/ID. VISUAL - PAR DE PATAS.pdf`

---

**🐾 Feito com ❤️ para conectar pets e seus tutores!**

*Última atualização: 2025*
