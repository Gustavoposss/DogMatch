"use client";

import { Layout } from "@/components/Layout";
import { PlanCard } from "@/components/PlanCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/lib/services/paymentService";
import { subscriptionService } from "@/lib/services/subscriptionService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function PlansPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionService.getPlans(),
  });

  const { data: subscriptionData, refetch: refetchSubscription } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: () => subscriptionService.getMySubscription(),
  });

  const { data: usageStats } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => subscriptionService.getUsageStats(),
  });

  const mutation = useMutation({
    mutationFn: (planId: string) => paymentService.createPlanPayment({ planId, paymentMethod: 'PIX' }),
    onMutate: () => {
      setFeedback(null);
    },
    onSuccess: (payment) => {
      setFeedback('Pagamento iniciado com sucesso! Utilize o QR Code PIX gerado no painel de pagamentos.');
      refetchSubscription();
    },
    onError: () => {
      setFeedback('Erro ao iniciar pagamento. Tente novamente.');
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

          {feedback && (
            <div className="mb-6 rounded-lg bg-[var(--primary)]/20 border border-[var(--primary)] px-4 py-3 text-sm text-[var(--primary)]">{feedback}</div>
          )}

          {usageStats && (
            <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">Swipes disponíveis</h3>
                <p className="text-2xl font-bold text-white">
                  {usageStats.swipesUsed} / {usageStats.swipesLimit === -1 ? '∞' : usageStats.swipesLimit}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">Pets cadastrados</h3>
                <p className="text-2xl font-bold text-white">
                  {usageStats.petsCount} / {usageStats.maxPets === -1 ? '∞' : usageStats.maxPets}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plansData?.map((plan, index) => (
              <PlanCard
                key={plan.type || plan.id || `plan-${index}`}
                plan={plan}
                isCurrent={subscriptionData?.planType === plan.name.toUpperCase()}
                onSelect={(planId) => mutation.mutate(planId)}
                selecting={mutation.isPending && mutation.variables === (plan.id || plan.type)}
              />
            ))}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
