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
        <label className="mb-1 block text-sm font-medium text-white">Nome</label>
        <input
          type="text"
          {...register('name')}
          className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
        />
        {errors.name && <p className="mt-1 text-sm text-[var(--error)]">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">E-mail</label>
        <input
          type="email"
          {...register('email')}
          disabled
          className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--card-bg)] px-3 py-2 text-[var(--foreground-secondary)]"
        />
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">O e-mail não pode ser alterado.</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">Cidade</label>
        <input
          type="text"
          {...register('city')}
          className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
        />
        {errors.city && <p className="mt-1 text-sm text-[var(--error)]">{errors.city.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">Telefone</label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)]"
          placeholder="(11) 99999-9999"
        />
        {errors.phone && <p className="mt-1 text-sm text-[var(--error)]">{errors.phone.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[var(--primary)] px-4 py-3 font-semibold text-white transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)] disabled:opacity-60"
      >
        {submitting ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
  );
}
