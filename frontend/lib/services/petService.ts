import api from '../api';
import { Pet } from '@/types';

export const petService = {
  async getPetsByUser(userId: string): Promise<{ pets: Pet[] }> {
    const response = await api.get<{ pets: Pet[] }>(`/pets/user/${userId}`);
    return response.data;
  },

  async createPet(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'> & { ownerId: string }): Promise<Pet> {
    const response = await api.post<Pet>('/pets', pet);
    return response.data;
  },

  async updatePet(id: string, pet: Partial<Pet>): Promise<Pet> {
    const response = await api.put<Pet>(`/pets/${id}`, pet);
    return response.data;
  },

  async deletePet(id: string): Promise<void> {
    await api.delete(`/pets/${id}`);
  },

  async getPet(id: string): Promise<Pet> {
    const response = await api.get<Pet>(`/pets/${id}`);
    return response.data;
  },

  async getPetsToSwipe(userId: string, filters?: Record<string, any>): Promise<{ pets: Pet[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<{ pets: Pet[] }>(`/pets/swipe/${userId}?${params.toString()}`);
    return response.data;
  },
};

