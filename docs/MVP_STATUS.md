# 📌 Status do MVP — Par de Patas

> Atualizado em **17/11/2025**

## ✅ O que já está pronto
- Autenticação completa (login, registro e recuperação com OTP via Brevo)
- Dashboard web (Home, Swipe, Meus Pets, Matches, Chat, Planos, Configurações, Suporte)
- Pagamentos PIX via Asaas (checkout + tela de QR Code)
- Validação de cidade com base no catálogo IBGE
- Deploy contínuo no Render (frontend + backend)

## 🧪 Testes manuais concluídos
- Registro → cadastro/edição de pet → swipe/match → chat em tempo real
- Ajustes de perfil e validação de cidade
- Landing page, suporte e logout
- Fluxo de pagamento até a geração do QR Code (sem liquidar o PIX real)

## ⚠️ Pendências antes do lançamento
1. **Pagamento real no Asaas**
   - Aguardando saldo para efetivar um pagamento completo.
   - Após viabilizar, validar webhook em produção e atualização automática do plano.
2. **Monitoramento e logs**
   - Definir rotina mínima (ex.: checagem diária no Render).
   - Opcional: alerta simples (email ou ferramenta leve).
3. **Documentação operacional**
   - Passo a passo de deploy/rollback.
   - Como ajustar variáveis de ambiente e reiniciar serviços.
4. **Checklist de lançamento**
   - Preencher itens remanescentes (backup do banco, revisão de textos/links, política de suporte).

## ✅ Decisões atuais
- Lançamento inicial será **somente web**; app mobile foi adiado.
- Pagamentos reais serão testados assim que houver crédito disponível.
- Logs, documentação e checklist precisam estar 100% antes do anúncio público.

---

Próximos passos: finalizar documentação + monitoramento, e preparar o procedimento de validação do Asaas assim que houver saldo para o teste real.

