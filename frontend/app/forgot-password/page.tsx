'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ email, newPassword });
      setSuccess('Senha redefinida com sucesso! Você já pode fazer login.');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao redefinir senha. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Recuperar senha</h1>
          <p className="text-[var(--foreground-secondary)] text-sm">
            Informe seu e-mail e defina uma nova senha para continuar utilizando o Par de Patas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-[var(--error)]/20 border border-[var(--error)] p-3 text-sm text-[var(--error)]">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-[var(--success)]/20 border border-[var(--success)] p-3 text-sm text-[var(--success)]">
              {success}
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
            <label htmlFor="new-password" className="block text-sm font-medium text-white mb-2">
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-3 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-2">
              Confirmar nova senha
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-3 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Atualizando...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--foreground-secondary)]">
          Lembrou sua senha?{' '}
          <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}

