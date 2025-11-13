"use client";

import { Plan } from "@/types";

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  onSelect?: (planId: string) => void;
  selecting?: boolean;
}

export function PlanCard({ plan, isCurrent, onSelect, selecting }: PlanCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-transform hover:-translate-y-1 ${
        isCurrent ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
        {isCurrent && (
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Plano atual
          </span>
        )}
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">R$ {plan.price.toFixed(2)}</span>
        <span className="ml-1 text-sm text-gray-500">/mês</span>
      </div>

      <ul className="mb-6 space-y-2 text-sm text-gray-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="text-primary">✔</span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {onSelect && (
          <button
            onClick={() => onSelect(plan.id)}
            disabled={isCurrent || selecting}
            className={`w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
              isCurrent
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {selecting ? 'Processando...' : isCurrent ? 'Plano Atual' : 'Escolher plano'}
          </button>
        )}
      </div>
    </div>
  );
}
