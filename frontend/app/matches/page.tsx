"use client";

import { Layout } from "@/components/Layout";
import { MatchCard } from "@/components/MatchCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { matchService } from "@/lib/services/matchService";
import { useQuery } from "@tanstack/react-query";

export default function MatchesPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['matches', user?.id],
    queryFn: () => user?.id ? matchService.getMatchesByUser(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
            <p className="mt-1 text-gray-600">Converse com os tutores que também curtiram seu pet.</p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-600">
              Carregando matches...
            </div>
          ) : data && data.length > 0 ? (
            <div className="space-y-4">
              {data.map((match) => {
                const otherPet = match.petA?.ownerId === user?.id ? match.petB : match.petA;
                const currentPet = match.petA?.ownerId === user?.id ? match.petA : match.petB;
                return (
                  <MatchCard
                    key={match.id}
                    match={match}
                    currentPet={currentPet}
                    otherPet={otherPet}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Você ainda não tem matches.</h2>
              <p className="mt-2 text-sm text-gray-500">Continue dando likes para encontrar conexões.</p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
