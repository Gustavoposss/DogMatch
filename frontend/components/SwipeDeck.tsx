"use client";

import { useEffect, useState } from "react";
import { Pet } from "@/types";
import Image from "next/image";

interface SwipeDeckProps {
  pets: Pet[];
  onLike: (pet: Pet) => Promise<void>;
  onPass: (pet: Pet) => void;
  loading?: boolean;
}

export function SwipeDeck({ pets, onLike, onPass, loading }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPet = pets[currentIndex];
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [pets.length]);

  const handleLike = async () => {
    if (!currentPet || liking) return;
    setLiking(true);
    try {
      await onLike(currentPet);
      setCurrentIndex((prev) => prev + 1);
    } finally {
      setLiking(false);
    }
  };

  const handlePass = () => {
    if (!currentPet) return;
    onPass(currentPet);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-600">Carregando pets...</p>
      </div>
    );
  }

  if (!currentPet) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white">
        <h3 className="text-lg font-semibold text-gray-700">Não há mais pets por perto</h3>
        <p className="text-sm text-gray-500">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[480px] w-full overflow-hidden rounded-3xl bg-white shadow-xl">
        <Image src={currentPet.photoUrl} alt={currentPet.name} fill className="object-cover" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentPet.name}</h2>
              <p className="text-sm text-white/80">
                {currentPet.breed} • {currentPet.age} anos •{' '}
                {currentPet.gender === 'M' || currentPet.gender === 'MACHO' ? 'Macho' : 'Fêmea'}
              </p>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold">
              {currentPet.objective === 'AMIZADE' || currentPet.objective === 'amizade'
                ? 'Amizade'
                : currentPet.objective === 'CRUZAMENTO' || currentPet.objective === 'cruzamento'
                  ? 'Cruzamento'
                  : 'Adoção'}
            </span>
          </div>

          {currentPet.description && (
            <p className="mt-3 line-clamp-3 text-sm text-white/90">{currentPet.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePass}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-500 shadow-lg transition-colors hover:border-gray-300 hover:text-gray-700"
        >
          ❌
        </button>

        <button
          onClick={handleLike}
          disabled={liking}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-xl transition-transform hover:scale-105 disabled:opacity-60"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
