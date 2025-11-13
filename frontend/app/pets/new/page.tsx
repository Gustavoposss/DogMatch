"use client";

import { Layout } from "@/components/Layout";
import { PetForm, PetFormValues } from "@/components/PetForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { petService } from "@/lib/services/petService";
import { uploadService } from "@/lib/services/uploadService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPetPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: PetFormValues, file?: File | null) => {
    if (!user) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      let photoUrl = values.photoUrl;
      if (file) {
        const upload = await uploadService.uploadImage(file);
        photoUrl = upload.url;
      }

      await petService.createPet({
        ownerId: user.id,
        name: values.name,
        breed: values.breed,
        age: values.age,
        gender: values.gender === 'M' || values.gender === 'MACHO' ? 'MACHO' : 'FEMEA',
        size: values.size === 'PEQUENO' || values.size === 'pequeno' ? 'PEQUENO' : values.size === 'GRANDE' || values.size === 'grande' ? 'GRANDE' : 'MEDIO',
        isNeutered: values.isNeutered,
        objective:
          values.objective === 'AMIZADE' || values.objective === 'amizade'
            ? 'AMIZADE'
            : values.objective === 'CRUZAMENTO' || values.objective === 'cruzamento'
              ? 'CRUZAMENTO'
              : 'ADOCAO',
        description: values.description ?? '',
        photoUrl: photoUrl ?? '',
      });

      router.push('/pets');
    } catch (error) {
      console.error(error);
      setFeedback('Erro ao cadastrar pet. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Cadastrar novo pet</h1>
            <p className="mt-2 text-[var(--foreground-secondary)]">Informe os dados do seu pet para começar a conectar.</p>
          </div>

          {feedback && (
            <div className="mb-6 rounded-lg bg-[var(--error)]/20 border border-[var(--error)] px-4 py-3 text-sm text-[var(--error)]">
              {feedback}
            </div>
          )}

          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
            <PetForm onSubmit={handleSubmit} submitting={submitting} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
