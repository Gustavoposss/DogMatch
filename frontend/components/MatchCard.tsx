"use client";

import Image from "next/image";
import Link from "next/link";
import { Match, Pet } from "@/types";
import { PawPrint } from "lucide-react";

interface MatchCardProps {
  match: Match;
  currentPet?: Pet;
  otherPet?: Pet;
}

export function MatchCard({ match, currentPet, otherPet }: MatchCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition-all hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary-glow)]">
      <div className="flex items-center gap-4">
        {otherPet?.photoUrl ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[var(--primary)]">
            <Image src={otherPet.photoUrl} alt={otherPet.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)] border-2 border-[var(--primary)]">
            <PawPrint className="h-8 w-8" />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-white">{otherPet?.name ?? 'Pet'}</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">Conectado em {new Date(match.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <Link
        href={`/matches/${match.id}`}
        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
      >
        Abrir chat
      </Link>
    </div>
  );
}
