'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Lado esquerdo - Imagem e texto */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-[var(--background-dark)] to-[var(--background)] relative overflow-hidden">
        <div className="w-full max-w-xl text-center z-10">
          <div className="mb-8 flex items-center justify-center">
            <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl">
              <Image
                src="/loginimage.svg"
                alt="Par de Patas"
                width={400}
                height={400}
                className="w-full h-auto object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Encontre o par perfeito para o seu melhor amigo.
          </h2>
          <p className="text-[var(--foreground-secondary)] text-lg">
            Conecte seu pet com outros pets na sua região para amizade, cruzamento ou adoção.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Acesse sua conta</h1>
            <p className="text-[var(--foreground-secondary)]">Entre para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-[var(--error)]/20 border border-[var(--error)] p-3 text-sm text-[var(--error)]">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-3 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-3 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-[var(--primary)] hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

