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
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Olá, {user?.name ? `Bem-vindo!` : 'Bem-vindo!'}
            </h2>
            <p className="text-[var(--foreground-secondary)]">Gerencie seus pets e encontre novos amigos</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-[var(--foreground-secondary)]">Carregando pets...</p>
            </div>
          ) : petsData?.pets && petsData.pets.length > 0 ? (
            <div className="mb-8">
              <div className="relative h-96 w-96 rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)]">
                <img
                  src={petsData.pets[0].photoUrl}
                  alt={petsData.pets[0].name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">{petsData.pets[0].name}</h3>
                  <p className="text-white/80">{petsData.pets[0].breed} • {petsData.pets[0].age} anos</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Sugestões para você</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {petsData.pets.slice(1, 4).map((pet) => (
                    <div
                      key={pet.id}
                      className="overflow-hidden rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] transition-all hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
                    >
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white">{pet.name}</h3>
                        <p className="text-sm text-[var(--foreground-secondary)]">{pet.breed}</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">{pet.age} anos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-12 text-center">
              <p className="text-[var(--foreground-secondary)] mb-4">Você ainda não tem pets cadastrados.</p>
              <Link
                href="/pets/new"
                className="inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]"
              >
                Cadastrar Primeiro Pet
              </Link>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

