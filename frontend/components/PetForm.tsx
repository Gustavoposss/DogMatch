"use client";

import { Pet } from "@/types";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { breedService } from "@/lib/services/breedService";
import { useQuery } from "@tanstack/react-query";

const petSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  breed: z.string().min(2, 'Informe a raça'),
  age: z.coerce.number().min(0).max(30),
  gender: z.enum(['MACHO', 'FEMEA', 'M', 'F']),
  size: z.enum(['PEQUENO', 'MEDIO', 'GRANDE', 'pequeno', 'medio', 'grande']),
  isNeutered: z.boolean(),
  objective: z.enum(['AMIZADE', 'CRUZAMENTO', 'ADOCAO', 'amizade', 'cruzamento', 'adocao']),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
});

const formSchema = petSchema.extend({
  photo: z.any().optional(),
});

export type PetFormValues = z.infer<typeof formSchema>;

interface PetFormProps {
  defaultValues?: Partial<Pet>;
  onSubmit: (values: PetFormValues, file?: File | null) => Promise<void>;
  submitting?: boolean;
}

export function PetForm({ defaultValues, onSubmit, submitting }: PetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PetFormValues>({
    resolver: zodResolver(formSchema) as Resolver<PetFormValues>,
    defaultValues: {
      name: defaultValues?.name ?? '',
      breed: defaultValues?.breed ?? '',
      age: defaultValues?.age ?? 1,
      gender: defaultValues?.gender ?? 'MACHO',
      size: defaultValues?.size ?? 'MEDIO',
      isNeutered: defaultValues?.isNeutered ?? false,
      objective: defaultValues?.objective ?? 'AMIZADE',
      description: defaultValues?.description ?? '',
      photoUrl: defaultValues?.photoUrl,
      photo: undefined,
    },
  });

  const { data: breeds = [], isLoading: loadingBreeds, error: breedsError } = useQuery({
    queryKey: ['breeds'],
    queryFn: () => breedService.getBreeds(),
    retry: 2,
  });

  // Debug: log para verificar se as raças estão sendo carregadas
  if (breeds.length > 0) {
    console.log('Raças carregadas:', breeds);
  }
  if (breedsError) {
    console.error('Erro ao carregar raças:', breedsError);
  }

  const [preview, setPreview] = useState<string | null>(defaultValues?.photoUrl ?? null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const onFormSubmit = async (values: PetFormValues) => {
    const file = values.photo instanceof FileList ? values.photo[0] : undefined;
    await onSubmit(values, file);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-white">Nome</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          />
          {errors.name && <p className="mt-1 text-sm text-[var(--error)]">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">Raça</label>
          <select
            {...register('breed', { required: 'Selecione uma raça' })}
            disabled={loadingBreeds}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)] disabled:bg-[var(--card-bg)] disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingBreeds ? 'Carregando raças...' : 'Selecione uma raça'}
            </option>
            {breeds.length > 0 && breeds.map((breed) => (
              <option key={breed} value={breed} className="bg-[var(--input-bg)]">
                {breed}
              </option>
            ))}
          </select>
          {errors.breed && <p className="mt-1 text-sm text-[var(--error)]">{errors.breed.message}</p>}
          {breedsError && (
            <p className="mt-1 text-sm text-[var(--error)]">Erro ao carregar raças. Verifique sua conexão.</p>
          )}
          {!loadingBreeds && !breedsError && breeds.length === 0 && (
            <p className="mt-1 text-sm text-[var(--warning)]">Nenhuma raça disponível. Tente recarregar a página.</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">Idade</label>
          <input
            type="number"
            min={0}
            max={30}
            {...register('age')}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          />
          {errors.age && <p className="mt-1 text-sm text-[var(--error)]">{errors.age.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">Sexo</label>
          <select
            {...register('gender')}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          >
            <option value="MACHO" className="bg-[var(--input-bg)]">Macho</option>
            <option value="FEMEA" className="bg-[var(--input-bg)]">Fêmea</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-[var(--error)]">{errors.gender.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">Porte</label>
          <select
            {...register('size')}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          >
            <option value="PEQUENO" className="bg-[var(--input-bg)]">Pequeno</option>
            <option value="MEDIO" className="bg-[var(--input-bg)]">Médio</option>
            <option value="GRANDE" className="bg-[var(--input-bg)]">Grande</option>
          </select>
          {errors.size && <p className="mt-1 text-sm text-[var(--error)]">{errors.size.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white">Objetivo</label>
          <select
            {...register('objective')}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          >
            <option value="AMIZADE" className="bg-[var(--input-bg)]">Amizade</option>
            <option value="CRUZAMENTO" className="bg-[var(--input-bg)]">Cruzamento</option>
            <option value="ADOCAO" className="bg-[var(--input-bg)]">Adoção</option>
          </select>
          {errors.objective && <p className="mt-1 text-sm text-[var(--error)]">{errors.objective.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          id="isNeutered"
          type="checkbox"
          {...register('isNeutered')}
          className="h-4 w-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--primary)] focus:ring-[var(--primary-glow)]"
        />
        <label htmlFor="isNeutered" className="text-sm text-white">
          Meu pet é castrado
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">Descrição</label>
        <textarea
          rows={4}
          {...register('description')}
          className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          placeholder="Fale sobre o seu pet"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-[var(--error)]">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">Foto</label>
        <div className="space-y-3">
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            id="photo-upload"
            {...register('photo')}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[var(--input-border)] bg-[var(--card-bg)] px-4 py-6 transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-[var(--foreground-secondary)]"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                <span className="font-semibold text-[var(--primary)]">Clique para enviar</span> ou arraste e solte
              </p>
              <p className="text-xs text-[var(--foreground-secondary)]">PNG, JPG, GIF até 10MB</p>
            </div>
          </label>
          {preview && (
            <div className="relative">
              <div className="h-64 w-full overflow-hidden rounded-xl border border-[var(--card-border)]">
                <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setFileInputKey((prev) => prev + 1);
                }}
                className="absolute right-2 top-2 rounded-full bg-[var(--error)] p-2 text-white shadow-lg transition-colors hover:bg-[var(--error)]/80"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)] disabled:opacity-60"
      >
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
