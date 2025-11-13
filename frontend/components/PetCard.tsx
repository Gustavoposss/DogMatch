"use client";

import Image from "next/image";
import Link from "next/link";
import { Pet } from "@/types";

interface PetCardProps {
  pet: Pet;
  onDelete?: (petId: string) => void;
  deleting?: boolean;
}

export function PetCard({ pet, onDelete, deleting }: PetCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] transition-all hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary-glow)]">
      <div className="relative h-48 w-full">
        <Image
          src={pet.photoUrl}
          alt={pet.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{pet.name}</h3>
          <p className="text-sm text-[var(--foreground-secondary)]">{pet.breed}</p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {pet.age} anos • {pet.gender === 'M' || pet.gender === 'MACHO' ? 'Macho' : 'Fêmea'}
          </p>
        </div>

        {pet.description && (
          <p className="line-clamp-2 text-sm text-[var(--foreground-secondary)]">{pet.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            href={`/pets/${pet.id}/edit`}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
          >
            Editar
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(pet.id)}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--error)] px-3 py-2 text-sm font-semibold text-[var(--error)] transition-colors hover:bg-[var(--error)]/20 disabled:opacity-60"
            >
              {deleting ? 'Removendo...' : 'Remover'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
