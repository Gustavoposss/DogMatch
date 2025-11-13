import api from '../api';
import { Match, Pet } from '@/types';

export const swipeService = {
  async likePet(toPetId: string): Promise<{ isMatch: boolean; match?: Match }> {
    const response = await api.post<{ isMatch: boolean; match?: Match }>('/swipe/like', {
      toPetId,
    });
    return response.data;
  },

  async getAvailablePets(): Promise<{ pets: Pet[] }> {
    const response = await api.get<{ pets: Pet[] }>('/swipe/available');
    return response.data;
  },

  async getFilterOptions(): Promise<{
    cities: string[];
    breeds: string[];
    sizes: string[];
    genders: string[];
    objectives: string[];
    ages: number[];
  }> {
    const response = await api.get('/swipe/filters');
    return response.data;
  },
};

