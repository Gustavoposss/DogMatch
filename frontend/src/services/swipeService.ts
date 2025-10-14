import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface FilterOptions {
  cities: string[];
  breeds: string[];
  sizes: string[];
  genders: string[];
  objectives: string[];
  ages: number[];
}

export interface SwipeFilters {
  city?: string;
  size?: string;
  gender?: string;
  objective?: string;
  breed?: string;
  minAge?: number;
  maxAge?: number;
  isNeutered?: boolean;
}

export async function likePet(toPetId: string, token: string) {
  const response = await axios.post(`${API_URL}/swipe/like`, {
    toPetId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function getMatchesByUser(userId: string, token: string) {
  const response = await axios.get(`${API_URL}/matches/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function getPetsToSwipe(token: string, filters?: SwipeFilters) {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const response = await axios.get(`${API_URL}/swipe/available?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.pets;
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await axios.get(`${API_URL}/swipe/filters`);
  return response.data;
}