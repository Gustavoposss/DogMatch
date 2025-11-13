'use client';

import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-green-500/50 bg-green-500/10 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Pagamento Confirmado!</h1>
            
            <p className="text-[var(--foreground-secondary)] mb-8 text-lg">
              Seu pagamento foi processado com sucesso. Sua assinatura está ativa!
            </p>

            {paymentId && (
              <div className="mb-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] p-4">
                <p className="text-sm text-[var(--foreground-secondary)]">
                  ID do pagamento: <span className="font-mono text-white">{paymentId}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/home"
                className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--primary-dark)] transition-colors"
              >
                Ir para Home
              </Link>
              <Link
                href="/plans"
                className="rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] px-6 py-3 font-semibold text-white hover:bg-[var(--card-bg)]/80 transition-colors"
              >
                Ver Planos
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

