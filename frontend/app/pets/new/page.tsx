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

      // Validar que há uma foto
      if (!file && !values.photoUrl) {
        setFeedback('Por favor, selecione uma foto para o pet.');
        setSubmitting(false);
        return;
      }

      let photoUrl = values.photoUrl;
      if (file) {
        try {
          const upload = await uploadService.uploadImage(file);
          photoUrl = upload.url;
          console.log('Upload concluído:', photoUrl);
        } catch (uploadError: any) {
          console.error('Erro no upload:', uploadError);
          const uploadErrorMessage = uploadError?.response?.data?.error || uploadError?.message || 'Erro ao fazer upload da foto. Tente novamente.';
          setFeedback(uploadErrorMessage);
          setSubmitting(false);
          return;
        }
      }

      // Validar que photoUrl não está vazio após upload
      if (!photoUrl || photoUrl.trim() === '') {
        setFeedback('Erro ao fazer upload da foto. Tente novamente.');
        setSubmitting(false);
        return;
      }

      await petService.createPet({
        ownerId: user.id,
        name: values.name,
        breed: values.breed,
        age: Number(values.age), // Garantir que age seja número
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
        photoUrl: photoUrl,
      });

      router.push('/pets');
    } catch (error: any) {
      console.error(error);
      // Mostrar mensagem de erro específica do backend se disponível
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao cadastrar pet. Verifique os dados e tente novamente.';
      setFeedback(errorMessage);
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
