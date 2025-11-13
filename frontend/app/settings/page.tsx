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
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="mt-1 text-gray-600">Atualize os dados da sua conta e preferências.</p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">{feedback}</div>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-600">
              Carregando dados do perfil...
            </div>
          ) : (
            <SettingsForm
              defaultValues={data}
              onSubmit={async (values) => {
                await mutation.mutateAsync(values);
              }}
              submitting={mutation.isPending}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
