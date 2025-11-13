"use client";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PetCard } from "@/components/PetCard";
import { useAuth } from "@/contexts/AuthContext";
import { petService } from "@/lib/services/petService";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

export default function PetsPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pets', user?.id],
    queryFn: () => user?.id ? petService.getPetsByUser(user.id) : Promise.resolve({ pets: [] }),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (petId: string) => petService.deletePet(petId),
    onSuccess: () => {
      setFeedback('Pet removido com sucesso.');
      refetch();
    },
    onError: () => {
      setFeedback('Erro ao remover pet. Tente novamente.');
    },
  });

  const handleDelete = async (petId: string) => {
    setFeedback(null);
    await deleteMutation.mutateAsync(petId);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Meus Pets</h1>
              <p className="mt-1 text-[var(--foreground-secondary)]">Gerencie os pets cadastrados na sua conta.</p>
            </div>
            <Link
              href="/pets/new"
              className="inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
            >
              + Adicionar novo pet
            </Link>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg bg-[var(--primary)]/20 border border-[var(--primary)] px-4 py-3 text-sm text-[var(--primary)]">
              {feedback}
            </div>
          )}

          {isLoading ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] py-16 text-[var(--foreground-secondary)]">
              Carregando pets...
            </div>
          ) : data?.pets && data.pets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onDelete={handleDelete}
                  deleting={deleteMutation.isPending && deleteMutation.variables === pet.id}
                />
              ))}
              <Link
                href="/pets/new"
                className="flex h-full min-h-[300px] items-center justify-center rounded-xl border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-3xl">
                    +
                  </div>
                  <p className="text-white font-semibold">Adicionar novo pet</p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center">
              <h2 className="text-lg font-semibold text-white">Nenhum pet cadastrado ainda</h2>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">Cadastre seu primeiro pet para começar a usar o Par de Patas.</p>
              <Link
                href="/pets/new"
                className="mt-6 inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
              >
                Cadastrar pet
              </Link>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
