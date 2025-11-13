# Configuração do Supabase Storage para Fotos de Pets

## 📋 Checklist de Configuração

### 1. ✅ Verificar Variáveis de Ambiente no Backend

Certifique-se de que as seguintes variáveis estão configuradas no `.env` do backend:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=seu-service-role-key
# OU
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
```

**⚠️ IMPORTANTE**: Use a **Service Role Key** (não a Anon Key) no backend para ter acesso completo ao Storage sem restrições de RLS.

### 2. ✅ Criar Bucket no Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique em **New Bucket**
5. Configure:
   - **Name**: `pet-photos`
   - **Public bucket**: ✅ **Marcado** (para URLs públicas)
   - **File size limit**: 5MB (ou conforme necessário)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### 3. ✅ Configurar Políticas de Acesso (RLS)

Como estamos usando **Service Role Key** no backend, as políticas RLS não se aplicam ao backend. No entanto, para garantir que as imagens sejam acessíveis publicamente:

#### Opção A: Bucket Público (Recomendado para fotos de pets)
- Marque o bucket como **Public** ao criá-lo
- Isso permite que qualquer pessoa acesse as URLs públicas das imagens

#### Opção B: Políticas RLS (Se precisar de controle de acesso)
Se quiser controlar o acesso, crie políticas no Supabase SQL Editor:

```sql
-- Permitir leitura pública de imagens
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pet-photos');

-- Permitir upload apenas para usuários autenticados (se necessário)
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-photos');
```

**Nota**: Como o backend usa Service Role Key, essas políticas não afetam o backend, apenas o acesso direto via frontend.

### 4. ✅ Verificar Implementação Atual

A implementação atual no backend (`backend/controllers/uploadController.ts`) está correta:

- ✅ Usa `multer` para processar `multipart/form-data`
- ✅ Suporta upload via base64 (para React Native)
- ✅ Valida tipo de arquivo (JPG, PNG, WebP)
- ✅ Valida tamanho (máximo 5MB)
- ✅ Gera nome único para arquivo: `pets/${Date.now()}_${filename}`
- ✅ Faz upload para o bucket `pet-photos`
- ✅ Retorna URL pública da imagem

### 5. ⚠️ Possíveis Problemas e Soluções

#### Problema 1: Erro "Bucket not found"
**Solução**: 
- Verifique se o bucket `pet-photos` existe no Supabase Dashboard
- Verifique se o nome está exatamente como no código: `pet-photos`

#### Problema 2: Erro "new row violates row-level security policy"
**Solução**: 
- Certifique-se de usar a **Service Role Key** (não Anon Key) no backend
- A Service Role Key bypassa as políticas RLS

#### Problema 3: Erro "Invalid API key"
**Solução**:
- Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão corretos
- A Service Role Key está em: Dashboard → Settings → API → `service_role` key

#### Problema 4: Imagens não aparecem no frontend
**Solução**:
- Verifique se o bucket está marcado como **Public**
- Verifique se a URL retornada está correta
- Teste a URL diretamente no navegador

#### Problema 5: Upload falha com "File too large"
**Solução**:
- Verifique o limite do bucket (configurado no Dashboard)
- O código atual limita a 5MB, mas o multer permite até 10MB
- Ajuste conforme necessário

### 6. 🔧 Melhorias Recomendadas

#### A. Adicionar Tratamento de Erros Mais Específicos

```typescript
if (error) {
  console.error('❌ Erro do Supabase:', error);
  
  // Erros específicos do Supabase
  if (error.message.includes('Bucket not found')) {
    return res.status(404).json({ 
      error: 'Bucket de armazenamento não encontrado. Contate o administrador.' 
    });
  }
  
  if (error.message.includes('The resource already exists')) {
    return res.status(409).json({ 
      error: 'Arquivo com este nome já existe. Tente novamente.' 
    });
  }
  
  return res.status(500).json({ 
    error: 'Erro ao fazer upload da imagem.', 
    details: error.message 
  });
}
```

#### B. Adicionar Compressão de Imagens (Opcional)

Para reduzir o tamanho dos arquivos, considere usar uma biblioteca como `sharp`:

```bash
npm install sharp
```

```typescript
import sharp from 'sharp';

// Comprimir imagem antes do upload
const compressedBuffer = await sharp(file.buffer)
  .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 85 })
  .toBuffer();
```

#### C. Adicionar Validação de Dimensões

```typescript
const image = sharp(file.buffer);
const metadata = await image.metadata();

if (metadata.width && metadata.height) {
  // Validar dimensões mínimas/máximas se necessário
  if (metadata.width < 200 || metadata.height < 200) {
    return res.status(400).json({ 
      error: 'Imagem muito pequena. Mínimo: 200x200px.' 
    });
  }
}
```

### 7. 📝 Testando o Upload

#### Teste Manual via cURL

```bash
curl -X POST http://localhost:3000/upload/pet-photo \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -F "image=@/caminho/para/imagem.jpg"
```

#### Teste via Frontend

O frontend já está configurado para usar o endpoint `/upload/pet-photo` através do `uploadService`.

### 8. 🔐 Segurança

- ✅ **Service Role Key** nunca deve ser exposta no frontend
- ✅ Validação de tipo de arquivo no backend
- ✅ Validação de tamanho de arquivo
- ✅ Autenticação obrigatória (middleware `authenticateToken`)
- ✅ Nomes de arquivo únicos para evitar sobrescritas

### 9. 📚 Referências

- [Documentação Oficial do Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Storage JavaScript Client](https://supabase.com/docs/reference/javascript/storage)
- [Políticas RLS do Supabase](https://supabase.com/docs/guides/storage/security/access-control)

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente configuradas no backend
- [ ] Bucket `pet-photos` criado no Supabase Dashboard
- [ ] Bucket marcado como **Public**
- [ ] Service Role Key configurada (não Anon Key)
- [ ] Teste de upload funcionando
- [ ] URLs públicas das imagens acessíveis

