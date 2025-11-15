"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";

interface CityAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  error?: string;
}

interface CityOption {
  display: string;
  normalized: string;
}

const IBGE_CITIES_ENDPOINT = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome";

let cachedCities: CityOption[] | null = null;
let loadingPromise: Promise<CityOption[]> | null = null;

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

async function fetchBrazilianCities(): Promise<CityOption[]> {
  if (cachedCities) {
    return cachedCities;
  }

  if (!loadingPromise) {
    loadingPromise = fetch(IBGE_CITIES_ENDPOINT)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Não foi possível carregar a lista de cidades.");
        }
        return response.json();
      })
      .then((data: any[]) => {
        const list: CityOption[] = data.map((city) => {
          const state = city?.microrregiao?.mesorregiao?.UF?.sigla ?? "";
          const display = state ? `${city.nome} - ${state}` : city.nome;
          return {
            display,
            normalized: normalize(display),
          };
        });
        cachedCities = list;
        return list;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export function CityAutocomplete({
  label,
  placeholder = "Digite e selecione sua cidade",
  value,
  onChange,
  onBlur,
  required,
  name,
  id,
  disabled,
  error,
}: CityAutocompleteProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const datalistId = `${inputId}-cities`;

  const [cities, setCities] = useState<CityOption[]>(cachedCities ?? []);
  const [loading, setLoading] = useState(!cachedCities);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const ensureCitiesLoaded = useCallback(async () => {
    if (cities.length > 0 || loadingPromise) {
      return;
    }

    try {
      setLoading(true);
      const list = await fetchBrazilianCities();
      setCities(list);
      setLoadError(null);
    } catch (err) {
      console.error("Erro ao carregar cidades", err);
      setLoadError("Não foi possível carregar as cidades. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [cities.length]);

  useEffect(() => {
    if (!cachedCities) {
      ensureCitiesLoaded();
    }
  }, [ensureCitiesLoaded]);

  const visibleCities = useMemo(() => {
    if (!filter) {
      return cities.slice(0, 50);
    }

    const normalizedFilter = normalize(filter);
    return cities
      .filter((city) => city.normalized.includes(normalizedFilter))
      .slice(0, 50);
  }, [cities, filter]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type="text"
        list={datalistId}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={ensureCitiesLoaded}
        onClick={ensureCitiesLoaded}
        required={required}
        disabled={disabled}
        autoComplete="off"
        placeholder={placeholder}
        className="w-full rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] px-4 py-3 text-white placeholder:text-[var(--foreground-secondary)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-glow)] disabled:opacity-60"
      />

      <datalist id={datalistId}>
        {visibleCities.map((city) => (
          <option key={city.display} value={city.display} />
        ))}
      </datalist>

      {loading && (
        <p className="mt-1 text-xs text-[var(--foreground-secondary)]">Carregando cidades...</p>
      )}

      {loadError && (
        <p className="mt-1 text-xs text-[var(--error)]">{loadError}</p>
      )}

      {!error && !loadError && (
        <p className="mt-1 text-xs text-[var(--foreground-secondary)]">
          Digite para filtrar. Dados fornecidos pelo IBGE.
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
}


