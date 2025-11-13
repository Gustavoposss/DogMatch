"use client";

import { Pet } from "@/types";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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

  const [preview, setPreview] = useState<string | null>(defaultValues?.photoUrl ?? null);

  const onFormSubmit = async (values: PetFormValues) => {
    const file = values.photo instanceof FileList ? values.photo[0] : undefined;
    await onSubmit(values, file);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Raça</label>
          <input
            type="text"
            {...register('breed')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          {errors.breed && <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Idade</label>
          <input
            type="number"
            min={0}
            max={30}
            {...register('age')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sexo</label>
          <select
            {...register('gender')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="MACHO">Macho</option>
            <option value="FEMEA">Fêmea</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Porte</label>
          <select
            {...register('size')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="PEQUENO">Pequeno</option>
            <option value="MEDIO">Médio</option>
            <option value="GRANDE">Grande</option>
          </select>
          {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Objetivo</label>
          <select
            {...register('objective')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="AMIZADE">Amizade</option>
            <option value="CRUZAMENTO">Cruzamento</option>
            <option value="ADOCAO">Adoção</option>
          </select>
          {errors.objective && <p className="mt-1 text-sm text-red-600">{errors.objective.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          id="isNeutered"
          type="checkbox"
          {...register('isNeutered')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-light"
        />
        <label htmlFor="isNeutered" className="text-sm text-gray-700">
          Meu pet é castrado
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          rows={4}
          {...register('description')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          placeholder="Fale sobre o seu pet"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Foto</label>
        <input
          type="file"
          accept="image/*"
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
          className="block w-full text-sm text-gray-700"
        />
        {preview && (
          <div className="mt-3 h-48 w-full overflow-hidden rounded-xl border">
            <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {submitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
