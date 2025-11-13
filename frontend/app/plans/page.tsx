"use client";

import { Layout } from "@/components/Layout";
import { PlanCard } from "@/components/PlanCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/lib/services/paymentService";
import { subscriptionService } from "@/lib/services/subscriptionService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionService.getPlans(),
  });

  const { data: subscriptionData, refetch: refetchSubscription } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: () => subscriptionService.getMySubscription(),
  });

  const { data: usageStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => subscriptionService.getUsageStats(),
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: (planType: 'FREE' | 'PREMIUM' | 'VIP') => 
      paymentService.createPlanPayment({ planType, billingType: 'PIX' }),
    onMutate: () => {
      setFeedback(null);
    },
    onSuccess: (payment) => {
      // Redirecionar para página de pagamento PIX
      const paymentId = payment.paymentId || payment.id;
      if (paymentId) {
        router.push(`/payment/pix?paymentId=${paymentId}`);
      } else {
        setFeedback('Pagamento iniciado, mas não foi possível obter o ID. Verifique no painel.');
      }
      refetchSubscription();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Erro ao iniciar pagamento. Tente novamente.';
      setFeedback(errorMessage);
    },
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Escolha o plano perfeito para seu pet</h1>
            <p className="text-[var(--foreground-secondary)]">Escolha o melhor plano para o seu momento.</p>
          </div>

          {subscriptionData && (
            <div className="mb-6 rounded-2xl border-2 border-[var(--primary)] bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Plano Atual</h3>
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    {subscriptionData.planType === 'FREE' ? 'Gratuito' : 
                     subscriptionData.planType === 'PREMIUM' ? 'Premium' : 'VIP'}
                  </p>
                  <p className="text-sm text-[var(--foreground-secondary)] mt-1">
                    Status: <span className={`font-semibold ${
                      subscriptionData.status === 'ACTIVE' ? 'text-green-400' : 
                      subscriptionData.status === 'PENDING' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {subscriptionData.status === 'ACTIVE' ? 'Ativo' : 
                       subscriptionData.status === 'PENDING' ? 'Pendente' : 
                       subscriptionData.status === 'CANCELLED' ? 'Cancelado' : 'Expirado'}
                    </span>
                  </p>
                </div>
                {subscriptionData.endDate && (
                  <div className="text-right">
                    <p className="text-sm text-[var(--foreground-secondary)]">Válido até</p>
                    <p className="text-lg font-semibold text-white">
                      {new Date(subscriptionData.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {feedback && (
            <div className="mb-6 rounded-lg bg-[var(--primary)]/20 border border-[var(--primary)] px-4 py-3 text-sm text-[var(--primary)]">{feedback}</div>
          )}

          {isLoadingStats ? (
            <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">Swipes disponíveis</h3>
                <p className="text-2xl font-bold text-white">Carregando...</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">Pets cadastrados</h3>
                <p className="text-2xl font-bold text-white">Carregando...</p>
              </div>
            </div>
          ) : usageStats ? (
            <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">Swipes disponíveis</h3>
                <p className="text-2xl font-bold text-white">
                  {usageStats.swipesUsed ?? 0} / {usageStats.swipesLimit === -1 ? '∞' : (usageStats.swipesLimit ?? 0)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-2">Pets cadastrados</h3>
                <p className="text-2xl font-bold text-white">
                  {usageStats.petsCount ?? 0} / {usageStats.maxPets === -1 ? '∞' : (usageStats.maxPets ?? 0)}
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plansData?.map((plan, index) => {
              const planType = (plan.type || plan.id || '').toUpperCase() as 'FREE' | 'PREMIUM' | 'VIP';
              const isCurrent = subscriptionData?.planType === planType;
              
              return (
                <PlanCard
                  key={plan.type || plan.id || `plan-${index}`}
                  plan={plan}
                  isCurrent={isCurrent}
                  onSelect={() => mutation.mutate(planType)}
                  selecting={mutation.isPending && mutation.variables === planType}
                />
              );
            })}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
