"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import {
  CityOption,
  ensureCitiesLoaded,
  getCachedCities,
  normalizeCityName,
} from "@/lib/cities";

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
  onValidityChange?: (isValid: boolean) => void;
  invalidMessage?: string;
}

const DEFAULT_INVALID_MESSAGE = "Selecione uma cidade válida na lista.";

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
  onValidityChange,
  invalidMessage = DEFAULT_INVALID_MESSAGE,
}: CityAutocompleteProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const datalistId = `${inputId}-cities`;

  const [cities, setCities] = useState<CityOption[]>(getCachedCities());
  const [loading, setLoading] = useState(cities.length === 0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState(value);
  const [touched, setTouched] = useState(false);

  const loadCitiesIfNeeded = useCallback(async () => {
    if (cities.length > 0) return;
    try {
      setLoading(true);
      const list = await ensureCitiesLoaded();
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
    if (cities.length === 0) {
      loadCitiesIfNeeded();
    }
  }, [cities.length, loadCitiesIfNeeded]);

  useEffect(() => {
    setFilter(value);
  }, [value]);

  const normalizedCurrentValue = useMemo(() => normalizeCityName(value), [value]);

  const canValidate = !loading && cities.length > 0;

  const isValueValid = useMemo(() => {
    if (!value) {
      return !required;
    }
    if (!canValidate) {
      return false;
    }
    return cities.some((city) => city.normalized === normalizedCurrentValue);
  }, [value, required, canValidate, cities, normalizedCurrentValue]);

  useEffect(() => {
    if (!onValidityChange) return;
    if (!value) {
      onValidityChange(!required);
      return;
    }
    if (!canValidate) {
      onValidityChange(false);
      return;
    }
    onValidityChange(isValueValid);
  }, [onValidityChange, value, required, canValidate, isValueValid]);

  const visibleCities = useMemo(() => {
    if (!filter) {
      return cities.slice(0, 50);
    }

    const normalizedFilter = normalizeCityName(filter);
    return cities
      .filter((city) => city.normalized.includes(normalizedFilter))
      .slice(0, 50);
  }, [cities, filter]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    onChange(event.target.value);
  };

  const showInvalidValue =
    canValidate && touched && value !== "" && !isValueValid;

  const derivedError =
    loadError ||
    error ||
    (showInvalidValue ? invalidMessage : null);

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
        onBlur={() => {
          setTouched(true);
          onBlur?.();
        }}
        onFocus={loadCitiesIfNeeded}
        onClick={loadCitiesIfNeeded}
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
        <p className="mt-1 text-xs text-[var(--foreground-secondary)]">
          Carregando cidades...
        </p>
      )}

      {derivedError && (
        <p className="mt-1 text-sm text-[var(--error)]">{derivedError}</p>
      )}

      {!derivedError && !loading && (
        <p className="mt-1 text-xs text-[var(--foreground-secondary)]">
          Digite para filtrar. Dados fornecidos pelo IBGE.
        </p>
      )}
    </div>
  );
}


