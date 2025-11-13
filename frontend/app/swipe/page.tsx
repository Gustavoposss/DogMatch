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

export default function SwipePage() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<Pet[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [matchPet, setMatchPet] = useState<Pet | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['swipe-pets', user?.id],
    queryFn: () => user?.id ? petService.getPetsToSwipe(user.id) : Promise.resolve({ pets: [] }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data?.pets) {
      setQueue(data.pets);
    }
  }, [data?.pets]);

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
    await refetch();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Descobrir novos amigos</h1>
            <p className="text-sm text-gray-600">
              Dê like para conectar ou pule para ver outros pets. Se rolar match, vocês poderão conversar no chat.
            </p>
          </div>

          {feedback && (
            <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">{feedback}</div>
          )}

          <SwipeDeck pets={queue} onLike={handleLike} onPass={handlePass} loading={isLoading} />

          <button
            onClick={handleReload}
            className="mx-auto inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            Atualizar lista
          </button>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
