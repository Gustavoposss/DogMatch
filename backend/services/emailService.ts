import SibApiV3Sdk from '@sendinblue/client';

const {
  BREVO_API_KEY,
  BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME,
  SMTP_FROM,
} = process.env;

if (!BREVO_API_KEY) {
  console.warn('⚠️ BREVO_API_KEY não configurada. Envio de e-mails não funcionará no ambiente atual.');
}

const senderEmail = BREVO_SENDER_EMAIL || SMTP_FROM;
const senderName = BREVO_SENDER_NAME || 'Par de Patas';

const transactionalClient = new SibApiV3Sdk.TransactionalEmailsApi();
if (BREVO_API_KEY) {
  transactionalClient.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    BREVO_API_KEY
  );
}

export async function sendPasswordResetCode(email: string, code: string) {
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY não configurada.');
  }

  if (!senderEmail) {
    throw new Error('Remetente Brevo não configurado (BREVO_SENDER_EMAIL ou SMTP_FROM).');
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border-radius: 16px; background-color: #f7f7f9; border: 1px solid #e0e0e0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #ff6b6b; margin: 0;">Par de Patas</h2>
        <p style="color: #555; margin: 4px 0 0;">Código de verificação</p>
      </div>
      <p style="color: #333;">Olá! Recebemos uma solicitação para redefinir sua senha.</p>
      <p style="color: #333;">Use o código abaixo em até <strong>10 minutos</strong>:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="display: inline-block; padding: 16px 32px; font-size: 32px; letter-spacing: 12px; font-weight: bold; background: #ffffff; border-radius: 12px; border: 1px dashed #ff6b6b; color: #ff6b6b;">
          ${code}
        </span>
      </div>
      <p style="color: #555;">Se você não solicitou essa alteração, ignore este e-mail.</p>
      <p style="color: #999; font-size: 12px; margin-top: 32px;">Este e-mail foi enviado automaticamente. Não responda.</p>
    </div>
  `;

  await transactionalClient.sendTransacEmail({
    sender: {
      email: senderEmail,
      name: senderName,
    },
    to: [{ email }],
    subject: 'Seu código de verificação - Par de Patas',
    htmlContent: html,
  });
}

