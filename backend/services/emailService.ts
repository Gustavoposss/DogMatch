import nodemailer from 'nodemailer';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  console.warn('⚠️ Variáveis de ambiente SMTP não configuradas completamente. Envio de e-mails poderá falhar.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendPasswordResetCode(email: string, code: string) {
  if (!SMTP_FROM) {
    throw new Error('Remetente SMTP não configurado.');
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

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: 'Seu código de verificação - Par de Patas',
    html,
  });
}

