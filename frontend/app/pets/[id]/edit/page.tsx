"use client";

import { Layout } from "@/components/Layout";
import { PetForm, PetFormValues } from "@/components/PetForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { petService } from "@/lib/services/petService";
import { uploadService } from "@/lib/services/uploadService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import { useState, use } from "react";

interface EditPetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPetPage({ params }: EditPetPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Unwrap params Promise usando React.use()
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petService.getPet(id),
  });

  const mutation = useMutation({
    mutationFn: async (values: { form: PetFormValues; file?: File | null }) => {
      const { form, file } = values;

      let photoUrl = form.photoUrl;
      if (file) {
        const upload = await uploadService.uploadImage(file);
        photoUrl = upload.url;
      }

      return petService.updatePet(id, {
        name: form.name,
        breed: form.breed,
        age: form.age,
        gender: form.gender === 'M' || form.gender === 'MACHO' ? 'MACHO' : 'FEMEA',
        size: form.size === 'PEQUENO' || form.size === 'pequeno' ? 'PEQUENO' : form.size === 'GRANDE' || form.size === 'grande' ? 'GRANDE' : 'MEDIO',
        isNeutered: form.isNeutered,
        objective:
          form.objective === 'AMIZADE' || form.objective === 'amizade'
            ? 'AMIZADE'
            : form.objective === 'CRUZAMENTO' || form.objective === 'cruzamento'
              ? 'CRUZAMENTO'
              : 'ADOCAO',
        description: form.description ?? '',
        photoUrl: photoUrl ?? data?.photoUrl ?? '',
      });
    },
    onSuccess: () => {
      router.push('/pets');
    },
    onError: () => {
      setFeedback('Erro ao atualizar pet. Tente novamente.');
    },
  });

  if (!isLoading && !data) {
    notFound();
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Editar pet</h1>
            <p className="mt-2 text-[var(--foreground-secondary)]">Atualize os dados do seu pet.</p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg bg-[var(--error)]/20 border border-[var(--error)] px-4 py-3 text-sm text-[var(--error)]">
              {feedback}
            </div>
          )}

          {isLoading || !data ? (
            <div className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-12 text-center text-[var(--foreground-secondary)]">
              Carregando dados do pet...
            </div>
          ) : (
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
              <PetForm
                defaultValues={data}
                submitting={mutation.isPending}
                onSubmit={async (form, file) => {
                  await mutation.mutateAsync({ form, file });
                }}
              />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
