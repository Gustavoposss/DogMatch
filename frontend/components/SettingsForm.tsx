"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  city: z.string().min(2, 'Informe a cidade'),
  phone: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof profileSchema>;

interface SettingsFormProps {
  defaultValues?: Partial<User>;
  onSubmit: (values: SettingsFormValues) => Promise<void>;
  submitting?: boolean;
}

export function SettingsForm({ defaultValues, onSubmit, submitting }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      city: defaultValues?.city ?? '',
      phone: defaultValues?.phone ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          {...register('email')}
          disabled
          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"
        />
        <p className="mt-1 text-sm text-gray-500">O e-mail não pode ser alterado.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Cidade</label>
        <input
          type="text"
          {...register('city')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          placeholder="(11) 99999-9999"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {submitting ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  );
}
