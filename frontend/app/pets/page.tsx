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
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Pets</h1>
              <p className="mt-1 text-gray-600">Gerencie os pets cadastrados na sua conta.</p>
            </div>
            <Link
              href="/pets/new"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              + Cadastrar novo pet
            </Link>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              {feedback}
            </div>
          )}

          {isLoading ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-gray-600">
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
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Nenhum pet cadastrado ainda</h2>
              <p className="mt-2 text-sm text-gray-500">Cadastre seu primeiro pet para começar a usar o Par de Patas.</p>
              <Link
                href="/pets/new"
                className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-dark"
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
