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
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
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
          <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <p className="text-sm text-gray-600">{pet.breed}</p>
          <p className="text-sm text-gray-500">
            {pet.age} anos • {pet.gender === 'M' || pet.gender === 'MACHO' ? 'Macho' : 'Fêmea'}
          </p>
        </div>

        {pet.description && (
          <p className="line-clamp-2 text-sm text-gray-600">{pet.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            href={`/pets/${pet.id}/edit`}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Editar
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(pet.id)}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? 'Removendo...' : 'Remover'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
