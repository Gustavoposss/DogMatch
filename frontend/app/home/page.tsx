'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { petService } from '@/lib/services/petService';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth();
  const { data: petsData, isLoading } = useQuery({
    queryKey: ['pets', user?.id],
    queryFn: () => user?.id ? petService.getPetsByUser(user.id) : Promise.resolve({ pets: [] }),
    enabled: !!user?.id,
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Minha Matilha</h2>
          <p className="mt-1 text-gray-600">Gerencie seus pets cadastrados</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando pets...</p>
          </div>
        ) : petsData?.pets && petsData.pets.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {petsData.pets.map((pet) => (
              <div
                key={pet.id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                  <p className="text-sm text-gray-600">{pet.breed}</p>
                  <p className="text-sm text-gray-600">{pet.age} anos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">Você ainda não tem pets cadastrados.</p>
            <Link
              href="/pets/new"
              className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Cadastrar Primeiro Pet
            </Link>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/pets"
            className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">Meus Pets</h3>
            <p className="mt-2 text-sm text-gray-600">Gerenciar pets</p>
          </Link>

          <Link
            href="/swipe"
            className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">Descobrir</h3>
            <p className="mt-2 text-sm text-gray-600">Encontrar matches</p>
          </Link>

          <Link
            href="/matches"
            className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">Matches</h3>
            <p className="mt-2 text-sm text-gray-600">Ver conexões</p>
          </Link>

          <Link
            href="/plans"
            className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">Planos</h3>
            <p className="mt-2 text-sm text-gray-600">Assinaturas</p>
          </Link>
        </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

