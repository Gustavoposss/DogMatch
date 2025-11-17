# 📌 Status do MVP — Par de Patas

> Atualizado em **17/11/2025**

## ✅ O que já está pronto
- Autenticação (login, registro e recuperação com OTP via Brevo)
- Dashboard web (Home, Swipe, Meus Pets, Matches, Chat em tempo real, Planos, Configurações)
- Pagamentos PIX via Asaas (checkout + tela de QR Code)
- Fluxo de suporte (novo menu e página com instruções de contato)
- Validação de cidade com base no catálogo IBGE (cadastro e perfil)
- Deploy contínuo no Render (backend + frontend)

## ⚠️ Pendências antes do lançamento
1. **Testes manuais completos**
   - Registro → cadastro de pet → swipe/match → chat → upgrade de plano → suporte
2. **Pagamentos**
   - Confirmar webhook do Asaas em produção (status pago/cancelado)
   - Verificar atualização de plano após confirmação
3. **Monitoramento/Logs**
   - Revisar erros do Render e definir rotina (mínimo: inspeção diária)
   - Opcional: configurar alerta ou ferramenta de observabilidade simples
4. **Documentação operacional**
   - Passo a passo de deploy/rollback
   - Como ajustar variáveis de ambiente e reiniciar serviços
5. **Checklist de lançamento**
   - Itens ainda abertos (backup do DB, testes em diferentes dispositivos, etc.)
6. **Mobile (caso faça parte do MVP)**
   - Validar build, dispositivos e publicação (item ainda pendente no checklist)

## ✅ Decisões tomadas agora
- MVP **não será lançado** até finalizar a lista acima
- Vamos retomar dessa etapa após a pausa e fechar cada item com evidências (testes, logs, screenshots)

---
Quando voltarmos, sugerido começar pelos testes ponta a ponta (item 1) para detectar qualquer regressão antes de mexer no restante. Em seguida avançamos em pagamentos/monitoramento/documentação.

