'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    title: 'Match Playdates',
    description: 'Encontre cães com perfis compatíveis perto de você para encontros seguros e divertidos.',
    icon: '🐾',
  },
  {
    title: 'Perfis Exclusivos',
    description: 'Crie perfis completos com fotos, preferências e histórico para cada pet.',
    icon: '📸',
  },
  {
    title: 'Chat Instantâneo',
    description: 'Converse com tutores em tempo real e organize os próximos passeios.',
    icon: '💬',
  },
];

const steps = [
  'Crie o perfil do seu pet com fotos e preferências.',
  'Dê like nos perfis que combinam com vocês.',
  'Converse no chat e agende um encontro seguro.',
];

const testimonials = [
  {
    name: 'Camila',
    city: 'São Paulo/SP',
    quote:
      'Bento era super tímido com outros cães, mas através do Par de Patas ele fez amigos incríveis. A comunidade é acolhedora e segura.',
  },
  {
    name: 'Bruno',
    city: 'Rio de Janeiro/RJ',
    quote:
      'As sugestões de matches são muito precisas! Cada encontro é supervisionado pelos tutores e a Luna está sempre animada.',
  },
  {
    name: 'Renata',
    city: 'Curitiba/PR',
    quote:
      'Finalmente encontrei uma forma simples de combinar passeios. O chat integrado facilita tudo e dá segurança.',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d0216] text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0d0216]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12">
        <Image
                src="/logopardepatas-clean.svg"
                alt="Logo Par de Patas"
                width={48}
                height={48}
          priority
        />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Par de Patas
              </p>
              <p className="text-lg font-bold text-white">Playdates para pets</p>
            </div>
          </Link>

          <nav className="hidden gap-8 text-sm font-semibold text-white/70 md:flex">
            <a href="#features" className="transition hover:text-white">
              Recursos
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              Como funciona
            </a>
            <a href="#testimonials" className="transition hover:text-white">
              Depoimentos
            </a>
            <a href="#cta" className="transition hover:text-white">
              Comece agora
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/home"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
              >
                Ir para o app
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[#0d0216] transition hover:bg-[var(--primary-dark)]"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#160329] to-[#0d0216]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pb-24 pt-16 md:flex-row md:gap-16 md:pt-24">
            <div className="space-y-8 text-center md:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                SOCIALIZE COM SEGURANÇA
              </p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                Encontre o melhor playdate para o seu melhor amigo.
              </h1>
              <p className="text-lg text-white/70">
                Conectamos tutores responsáveis que desejam proporcionar interações seguras e divertidas
                para seus cães. Perfis verificados, recomendações inteligentes e chat integrado.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href={isAuthenticated ? '/home' : '/register'}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3 text-base font-semibold text-[#0d0216] shadow-lg shadow-[var(--primary-glow)] transition hover:bg-[var(--primary-dark)]"
                >
                  {isAuthenticated ? 'Abrir meu painel' : 'Criar conta gratuita'}
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
                  >
                    Já tenho conta
                  </Link>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-left text-sm text-white/60">
                <div>
                  <p className="text-3xl font-bold text-white">+3k</p>
                  <p>Tutores verificados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">+8k</p>
                  <p>Playdates organizados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">98%</p>
                  <p>Satisfação dos tutores</p>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[36px] bg-[var(--primary)]/40 blur-[120px]" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#120220] p-8 text-white shadow-[0_40px_120px_rgba(6,0,20,0.65)]">
                <div className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-[#3b0a5f]" />
                <div className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[#1c0532]" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#351050] text-2xl shadow-inner shadow-black/40">
                    🐾
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#fbbcff]">
                    Tecnologia exclusiva
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold text-white">Match Perfeito</h3>
                  <p className="mt-4 text-base text-white/70">
                    Nosso algoritmo cruza raça, temperamento, nível de energia e localização para sugerir o parceiro ideal
                    para cada pet, garantindo encontros seguros e equilibrados.
                  </p>

                  <p className="mt-6 text-sm text-white/70">
                   os tutores confirmaram o encontro e receberam o chat seguro para alinhar os detalhes.
                  </p>

                  <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-[#1c032f] p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Playdate aprovado</p>
                      <p className="text-xs text-white/70">Chat liberado para combinar o encontro</p>
                    </div>
                    <span className="rounded-full bg-[#ffe24f] px-4 py-1 text-xs font-bold uppercase text-[#3a1a00]">
                      Novo!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-white/5 bg-[#130425] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Recursos pensados para tutores
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Tudo o que você precisa para socializar seu pet com segurança.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/5 bg-white/5 p-8 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--primary)]/40"
                >
                  <div className="mb-6 text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-white/5 bg-[#0f031b] py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-center">
            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Como funciona
              </p>
              <h2 className="text-3xl font-bold text-white">
                Em poucos passos você encontra playdates perfeitos.
              </h2>
              <p className="text-white/70">
                Nosso algoritmo considera perfil, energia, porte e preferências dos pets para indicar combinações
                responsáveis e supervisionadas.
              </p>
              <ul className="mt-6 space-y-4">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/20 text-lg font-bold text-[var(--primary)]">
                      {index + 1}
                    </span>
                    <p className="text-lg text-white/80">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 rounded-[32px] border border-white/10 bg-[#1b0834] p-8 shadow-[0_20px_80px_rgba(5,0,20,0.6)]">
              <h3 className="text-2xl font-semibold text-white">Playdates supervisionados</h3>
              <p className="mt-4 text-white/70">
                Cada encontro exige confirmação dos tutores e libera um chat seguro para combinar os detalhes. Assim,
                todos se sentem tranquilos durante o processo.
              </p>
              <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Combinações perfeitas</span>
                  <span>92%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full w-[92%] rounded-full bg-[var(--primary)]" />
                </div>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Encontros concluídos</span>
                  <span>84%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full w-[84%] rounded-full bg-[var(--primary)]/70" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-b border-white/5 bg-[#130425] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Quem já usa aprova
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white">Amado por tutores e pelos próprios pets.</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-3xl border border-white/5 bg-white/5 p-6 text-white shadow-lg">
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">{item.city}</p>
                  <p className="mt-4 text-lg text-white/80">“{item.quote}”</p>
                  <p className="mt-6 text-sm font-semibold text-white/70">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="bg-[#0f031b] py-20">
          <div className="mx-auto max-w-4xl rounded-[40px] border border-white/10 bg-gradient-to-r from-[#371162] to-[#15052a] px-8 py-16 text-center shadow-[0_20px_80px_rgba(5,0,20,0.6)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
              Pronto para começar?
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">Leve seu pet para novas amizades em minutos.</h2>
            <p className="mt-4 text-lg text-white/70">
              Cadastre-se gratuitamente, personalize o perfil do seu pet e encontre playdates selecionados pela nossa
              plataforma. Tudo em um único lugar.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href={isAuthenticated ? '/home' : '/register'}
                className="rounded-full bg-[var(--primary)] px-10 py-3 text-base font-semibold text-[#0d0216] transition hover:bg-[var(--primary-dark)]"
              >
                {isAuthenticated ? 'Ir para o app' : 'Criar conta agora'}
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="rounded-full border border-white/20 px-10 py-3 text-base font-semibold text-white transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
                >
                  Fazer login
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-center text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Par de Patas. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-6">
            <Link href="/plans" className="transition hover:text-white">
              Planos
            </Link>
            <Link href="/support" className="transition hover:text-white">
              Suporte
            </Link>
            <a href="mailto:pardepatasapp@gmail.com" className="transition hover:text-white">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
