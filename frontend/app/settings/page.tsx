"use client";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SettingsForm, SettingsFormValues } from "@/components/SettingsForm";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => userService.getMyProfile(),
  });

  const mutation = useMutation({
    mutationFn: (values: SettingsFormValues) => userService.updateProfile(values),
    onMutate: () => setFeedback(null),
    onSuccess: () => setFeedback('Perfil atualizado com sucesso!'),
    onError: () => setFeedback('Erro ao atualizar perfil. Tente novamente.'),
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            <p className="mt-1 text-[var(--foreground-secondary)]">Atualize os dados da sua conta e preferências.</p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg bg-[var(--primary)]/20 border border-[var(--primary)] px-4 py-3 text-sm text-[var(--primary)]">{feedback}</div>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center text-[var(--foreground-secondary)]">
              Carregando dados do perfil...
            </div>
          ) : (
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
              <SettingsForm
                defaultValues={data}
                onSubmit={async (values) => {
                  await mutation.mutateAsync(values);
                }}
                submitting={mutation.isPending}
              />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
