"use client";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const SUPPORT_EMAIL = "pardepatasapp@gmail.com";

const faq = [
  {
    title: "Problemas de acesso",
    description: "Não está conseguindo entrar? Informe o e-mail cadastrado e descreva o que acontece (erro exibido, prints, horário).",
  },
  {
    title: "Dúvidas sobre planos",
    description: "Conte o plano atual, o que deseja contratar e se houve cobrança indevida. Enviaremos instruções rápidas.",
  },
  {
    title: "Sugestões ou feedbacks",
    description: "Estamos construindo o produto com você. Qualquer ideia para melhorar a experiência é muito bem-vinda.",
  },
];

export default function SupportPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white">Central de Suporte</h1>
            <p className="mt-2 text-[var(--foreground-secondary)]">
              Precisa falar com a gente? Nossa equipe responde de segunda a sexta, das 9h às 18h (horário de Brasília).
              Quanto mais detalhes você enviar, mais rápido conseguimos ajudar.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">Contato direto</p>
                <p className="mt-2 text-2xl font-bold text-white">{SUPPORT_EMAIL}</p>
                <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                  Clique no botão abaixo para abrir seu aplicativo de e-mail já com o assunto preenchido.
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Suporte%20Par%20de%20Patas`}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
                >
                  Enviar e-mail
                </a>
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-white/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-white">Checklist para abrir um chamado</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--foreground-secondary)]">
                  <li>• Seu nome e e-mail cadastrado</li>
                  <li>• Qual dispositivo/navegador está usando</li>
                  <li>• Passo a passo do que aconteceu</li>
                  <li>• Prints ou mensagens de erro (se houver)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
            <h2 className="text-2xl font-semibold text-white">Dúvidas frequentes</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {faq.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--foreground-secondary)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}


