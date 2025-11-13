'use client';

import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { paymentService } from '@/lib/services/paymentService';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Copy, Check, ArrowLeft, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function PaymentPixPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const [copied, setCopied] = useState(false);
  const [pixPayload, setPixPayload] = useState<string | null>(null);

  const { data: payment, isLoading, error } = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentService.checkPaymentStatus(paymentId!),
    enabled: !!paymentId,
    refetchInterval: (data) => {
      // Parar de verificar se o pagamento foi concluído
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
        return false;
      }
      // Verificar a cada 5 segundos se ainda está pendente
      return 5000;
    },
  });

  useEffect(() => {
    if (payment?.status === 'COMPLETED') {
      // Redirecionar para página de sucesso após 2 segundos
      setTimeout(() => {
        router.push(`/payment/success?paymentId=${paymentId}`);
      }, 2000);
    } else if (payment?.status === 'FAILED') {
      // Redirecionar para página de falha
      router.push(`/payment/failure?paymentId=${paymentId}`);
    }
  }, [payment?.status, paymentId, router]);

  useEffect(() => {
    if (payment?.pixQrCode?.payload) {
      setPixPayload(payment.pixQrCode.payload);
    }
  }, [payment?.pixQrCode]);

  const handleCopyPixCode = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!paymentId) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[var(--error)] bg-[var(--error)]/20 p-6 text-center">
              <p className="text-[var(--error)]">ID do pagamento não fornecido.</p>
              <button
                onClick={() => router.push('/plans')}
                className="mt-4 rounded-lg bg-[var(--primary)] px-6 py-2 text-white hover:bg-[var(--primary-dark)]"
              >
                Voltar para Planos
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center">
              <p className="text-[var(--foreground-secondary)]">Carregando informações do pagamento...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !payment) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[var(--error)] bg-[var(--error)]/20 p-6 text-center">
              <p className="text-[var(--error)]">Erro ao carregar informações do pagamento.</p>
              <button
                onClick={() => router.push('/plans')}
                className="mt-4 rounded-lg bg-[var(--primary)] px-6 py-2 text-white hover:bg-[var(--primary-dark)]"
              >
                Voltar para Planos
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const qrCodeImage = payment.pixQrCode?.encodedImage;
  const expirationDate = payment.pixQrCode?.expirationDate
    ? new Date(payment.pixQrCode.expirationDate)
    : null;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => router.push('/plans')}
            className="mb-6 flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Planos
          </button>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/20 mb-4">
                <QrCode className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Pagamento via PIX</h1>
              <p className="text-[var(--foreground-secondary)]">
                Escaneie o QR Code ou copie o código PIX para realizar o pagamento
              </p>
            </div>

            {payment.status === 'PENDING' && (
              <>
                <div className="mb-6 rounded-xl border-2 border-[var(--primary)] bg-[var(--primary)]/10 p-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-[var(--foreground-secondary)] mb-1">Valor a pagar</p>
                    <p className="text-4xl font-bold text-[var(--primary)]">
                      R$ {(payment.value || payment.amount).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                {qrCodeImage && (
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-xl border-2 border-[var(--card-border)] bg-white p-4">
                      <Image
                        src={`data:image/png;base64,${qrCodeImage}`}
                        alt="QR Code PIX"
                        width={300}
                        height={300}
                        className="w-full max-w-xs"
                      />
                    </div>
                  </div>
                )}

                {pixPayload && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                      Código PIX (Copiar e colar)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pixPayload}
                        readOnly
                        className="flex-1 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-3 text-white text-sm font-mono break-all"
                      />
                      <button
                        onClick={handleCopyPixCode}
                        className={`flex items-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors ${
                          copied
                            ? 'bg-green-600 text-white'
                            : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {expirationDate && (
                  <div className="mb-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] p-4">
                    <p className="text-sm text-[var(--foreground-secondary)] text-center">
                      <span className="font-semibold">Válido até:</span>{' '}
                      {expirationDate.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                <div className="rounded-lg bg-blue-500/20 border border-blue-500/50 p-4 mb-6">
                  <p className="text-sm text-blue-300 text-center">
                    💡 Após realizar o pagamento, aguarde alguns instantes. Você será redirecionado automaticamente.
                  </p>
                </div>
              </>
            )}

            {payment.status === 'COMPLETED' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h2>
                <p className="text-[var(--foreground-secondary)]">Redirecionando...</p>
              </div>
            )}

            {payment.status === 'FAILED' && (
              <div className="text-center py-8">
                <p className="text-[var(--error)] mb-4">Pagamento falhou. Tente novamente.</p>
                <button
                  onClick={() => router.push('/plans')}
                  className="rounded-lg bg-[var(--primary)] px-6 py-2 text-white hover:bg-[var(--primary-dark)]"
                >
                  Voltar para Planos
                </button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

