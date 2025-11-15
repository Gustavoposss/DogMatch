"use client";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SwipeDeck } from "@/components/SwipeDeck";
import { useAuth } from "@/contexts/AuthContext";
import { petService } from "@/lib/services/petService";
import { swipeService } from "@/lib/services/swipeService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pet } from "@/types";
import Link from "next/link";

export default function SwipePage() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<Pet[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [matchPet, setMatchPet] = useState<Pet | null>(null);

  const {
    data: myPetsData,
    isLoading: isLoadingMyPets,
    refetch: refetchMyPets,
  } = useQuery({
    queryKey: ['my-pets', user?.id],
    queryFn: () => user?.id ? petService.getPetsByUser(user.id) : Promise.resolve({ pets: [] }),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const hasAnyPet = (myPetsData?.pets?.length ?? 0) > 0;

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['swipe-pets', user?.id, hasAnyPet],
    queryFn: () => (user?.id && hasAnyPet) ? petService.getPetsToSwipe(user.id) : Promise.resolve({ pets: [] }),
    enabled: !!user?.id && hasAnyPet,
  });

  useEffect(() => {
    if (!hasAnyPet) {
      setQueue([]);
      return;
    }

    if (data?.pets) {
      setQueue(data.pets);
    }
  }, [data?.pets, hasAnyPet]);

  const handleLike = async (pet: Pet) => {
    setFeedback(null);
    const response = await swipeService.likePet(pet.id);
    if (response.isMatch) {
      setMatchPet(pet);
      setFeedback(`🎉 Você fez um match com ${pet.name}! Vá para Matches para conversar.`);
    } else {
      setFeedback(`Like enviado para ${pet.name}!`);
    }
    setQueue((prev) => prev.filter((item) => item.id !== pet.id));
  };

  const handlePass = (pet: Pet) => {
    setQueue((prev) => prev.filter((item) => item.id !== pet.id));
  };

  const handleReload = async () => {
    if (!hasAnyPet) {
      await refetchMyPets();
      return;
    }
    await refetch();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">Descobrir novos amigos</h1>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Dê like para conectar ou pule para ver outros pets. Se rolar match, vocês poderão conversar no chat.
            </p>
          </div>

          {feedback && (
            <div className="rounded-lg bg-[var(--primary)]/20 border border-[var(--primary)] px-4 py-3 text-sm text-[var(--primary)]">{feedback}</div>
          )}

          {!hasAnyPet && !isLoadingMyPets ? (
            <div className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-10 text-center">
              <h2 className="text-xl font-semibold text-white">Cadastre um pet para começar</h2>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                Você precisa ter ao menos um pet cadastrado para descobrir novos amigos.
              </p>
              <Link
                href="/pets/new"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
              >
                Cadastrar pet
              </Link>
            </div>
          ) : (
            <SwipeDeck pets={queue} onLike={handleLike} onPass={handlePass} loading={isLoading || isLoadingMyPets} />
          )}

          <button
            onClick={handleReload}
            className="mx-auto inline-flex items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-white transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            Atualizar lista
          </button>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
