# ✅ Verificação da Configuração do Supabase Storage

## 🔍 Checklist de Verificação

Use este checklist para garantir que o Supabase Storage está configurado corretamente:

### 1. Variáveis de Ambiente no Backend

- [ ] Arquivo `.env` existe na pasta `backend/`
- [ ] `SUPABASE_URL` está configurado (formato: `https://xxxxx.supabase.co`)
- [ ] `SUPABASE_SERVICE_KEY` ou `SUPABASE_SERVICE_ROLE_KEY` está configurado
- [ ] ⚠️ **NÃO** está usando `SUPABASE_ANON_KEY` (use Service Role Key)

**Como encontrar as chaves:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **URL**: `Project URL`
   - **Service Role Key**: `service_role` key (⚠️ NÃO use a `anon` key)

### 2. Bucket `pet-photos` no Supabase

- [ ] Bucket `pet-photos` foi criado
- [ ] Bucket está marcado como **Public**
- [ ] Limite de tamanho configurado (recomendado: 5MB)
- [ ] Tipos MIME permitidos: `image/jpeg, image/jpg, image/png, image/webp`

**Como criar o bucket:**
1. No Supabase Dashboard, vá em **Storage**
2. Clique em **New Bucket**
3. Nome: `pet-photos`
4. Marque **Public bucket**
5. Configure limites conforme necessário

### 3. Teste de Upload

Execute este teste para verificar se está funcionando:

```bash
# 1. Obtenha um token JWT fazendo login
# 2. Teste o upload
curl -X POST http://localhost:3000/upload/pet-photo \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -F "image=@/caminho/para/teste.jpg"
```

**Resposta esperada:**
```json
{
  "url": "https://xxxxx.supabase.co/storage/v1/object/public/pet-photos/pets/1234567890_teste.jpg"
}
```

### 4. Verificação de Erros Comuns

#### ❌ Erro: "Bucket not found"
**Causa**: Bucket não foi criado ou nome está incorreto
**Solução**: 
- Verifique se o bucket `pet-photos` existe
- Verifique se o nome está exatamente como no código

#### ❌ Erro: "new row violates row-level security policy"
**Causa**: Está usando Anon Key ao invés de Service Role Key
**Solução**: 
- Use `SUPABASE_SERVICE_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`
- NÃO use `SUPABASE_ANON_KEY`

#### ❌ Erro: "Invalid API key"
**Causa**: Chave incorreta ou não configurada
**Solução**: 
- Verifique se a Service Role Key está correta
- Verifique se está no formato correto (começa com `eyJ...`)

#### ❌ Erro: "File too large"
**Causa**: Arquivo excede o limite configurado
**Solução**: 
- Verifique o limite do bucket no Dashboard
- O código limita a 5MB, mas o multer permite até 10MB

#### ❌ Imagens não aparecem no frontend
**Causa**: Bucket não está público ou URL incorreta
**Solução**: 
- Marque o bucket como **Public**
- Verifique se a URL retornada está acessível

### 5. Verificação de Logs

Verifique os logs do backend ao fazer upload:

```
📤 Recebendo upload de pet photo
☁️ Fazendo upload para Supabase: pets/1234567890_imagem.jpg
✅ Upload concluído: https://xxxxx.supabase.co/storage/v1/object/public/pet-photos/pets/...
```

Se aparecer erro, verifique:
- Se as variáveis de ambiente estão carregadas
- Se o bucket existe
- Se a Service Role Key está correta

### 6. Estrutura de Arquivos no Storage

Os arquivos são salvos com a seguinte estrutura:
```
pet-photos/
  └── pets/
      ├── 1234567890_imagem1.jpg
      ├── 1234567891_imagem2.png
      └── ...
```

### 7. URLs Públicas

As URLs públicas seguem este formato:
```
https://{PROJECT_ID}.supabase.co/storage/v1/object/public/pet-photos/pets/{filename}
```

Essas URLs são acessíveis publicamente se o bucket estiver marcado como **Public**.

---

## 📝 Próximos Passos

Após verificar todos os itens acima:

1. ✅ Teste o upload de uma foto via frontend
2. ✅ Verifique se a imagem aparece corretamente
3. ✅ Teste com diferentes formatos (JPG, PNG, WebP)
4. ✅ Teste com arquivos grandes (próximo do limite)

---

## 🔗 Referências

- [Documentação do Supabase Storage](https://supabase.com/docs/guides/storage)
- [Guia de Configuração Completo](./SUPABASE_STORAGE_SETUP.md)

