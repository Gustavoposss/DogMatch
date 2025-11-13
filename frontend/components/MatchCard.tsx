"use client";

import Image from "next/image";
import Link from "next/link";
import { Match, Pet } from "@/types";

interface MatchCardProps {
  match: Match;
  currentPet?: Pet;
  otherPet?: Pet;
}

export function MatchCard({ match, currentPet, otherPet }: MatchCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {otherPet?.photoUrl ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image src={otherPet.photoUrl} alt={otherPet.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            🐾
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900">{otherPet?.name ?? 'Pet'}</h3>
          <p className="text-sm text-gray-600">Conectado em {new Date(match.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <Link
        href={`/matches/${match.id}`}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Abrir chat
      </Link>
    </div>
  );
}
