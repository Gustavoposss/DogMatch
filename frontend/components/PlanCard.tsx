"use client";

import { Plan } from "@/types";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  onSelect?: (planId: string) => void;
  selecting?: boolean;
}

export function PlanCard({ plan, isCurrent, onSelect, selecting }: PlanCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
        isCurrent 
          ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-lg shadow-[var(--primary-glow)]' 
          : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
        {isCurrent && (
          <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-[var(--primary-glow)]">
            Plano atual
          </span>
        )}
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-white">R$ {plan.price.toFixed(2)}</span>
        <span className="ml-1 text-sm text-[var(--foreground-secondary)]">/mês</span>
      </div>

      <ul className="mb-6 space-y-2 text-sm text-[var(--foreground-secondary)]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {onSelect && (
          <button
            onClick={() => onSelect(plan.id || plan.type || '')}
            disabled={isCurrent || selecting}
            className={`w-full rounded-lg px-4 py-2 font-semibold transition-all ${
              isCurrent
                ? 'cursor-not-allowed bg-[var(--card-bg)] text-[var(--foreground-secondary)]'
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] hover:shadow-lg hover:shadow-[var(--primary-glow)]'
            }`}
          >
            {selecting ? 'Processando...' : isCurrent ? 'Plano Atual' : 'Assinar Plano'}
          </button>
        )}
      </div>
    </div>
  );
}
