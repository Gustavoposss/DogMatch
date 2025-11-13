"use client";

import { useEffect, useState } from "react";
import { Pet } from "@/types";
import Image from "next/image";
import { X, Heart, Star } from "lucide-react";

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
      <div className="flex h-96 items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)]">
        <p className="text-[var(--foreground-secondary)]">Carregando pets...</p>
      </div>
    );
  }

  if (!currentPet) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)]">
        <h3 className="text-lg font-semibold text-white">Não há mais pets por perto</h3>
        <p className="text-sm text-[var(--foreground-secondary)]">Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[480px] w-full overflow-hidden rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl">
        <Image src={currentPet.photoUrl} alt={currentPet.name} fill className="object-cover" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentPet.name}, {currentPet.age}</h2>
              <p className="text-sm text-white/80">
                {currentPet.breed} • {currentPet.gender === 'M' || currentPet.gender === 'MACHO' ? 'Macho' : 'Fêmea'}
              </p>
            </div>
            <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold shadow-lg shadow-[var(--primary-glow)]">
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
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--error)] bg-[var(--card-bg)] text-[var(--error)] shadow-lg transition-all hover:bg-[var(--error)] hover:text-white hover:scale-110"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          onClick={handleLike}
          disabled={liking}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary-glow)] transition-all hover:scale-110 disabled:opacity-60"
        >
          <Heart className="h-8 w-8 fill-current" />
        </button>

        <button
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--secondary)] bg-[var(--card-bg)] text-[var(--secondary)] shadow-lg transition-all hover:bg-[var(--secondary)] hover:text-black hover:scale-110"
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
