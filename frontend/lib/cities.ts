"use client";

export interface CityOption {
  display: string;
  normalized: string;
}

const IBGE_CITIES_ENDPOINT =
  "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome";

let cachedCities: CityOption[] | null = null;
let loadingPromise: Promise<CityOption[]> | null = null;

export const normalizeCityName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

async function fetchCitiesFromIBGE(): Promise<CityOption[]> {
  const response = await fetch(IBGE_CITIES_ENDPOINT);
  if (!response.ok) {
    throw new Error("Não foi possível carregar a lista de cidades.");
  }
  const data = await response.json();
  return data.map((city: any) => {
    const state = city?.microrregiao?.mesorregiao?.UF?.sigla ?? "";
    const display = state ? `${city.nome} - ${state}` : city.nome;
    return {
      display,
      normalized: normalizeCityName(display),
    };
  });
}

export function getCachedCities(): CityOption[] {
  return cachedCities ?? [];
}

export async function ensureCitiesLoaded(): Promise<CityOption[]> {
  if (cachedCities) {
    return cachedCities;
  }

  if (!loadingPromise) {
    loadingPromise = fetchCitiesFromIBGE()
      .then((cities) => {
        cachedCities = cities;
        return cities;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export function isCityNameValid(value: string): boolean {
  if (!value) return false;
  if (!cachedCities) return false;
  const normalizedValue = normalizeCityName(value);
  return cachedCities.some((city) => city.normalized === normalizedValue);
}


