import api from '../api';

export const breedService = {
  async getBreeds(): Promise<string[]> {
    const response = await api.get<{ breeds: string[] }>('/pets/breeds');
    return response.data.breeds;
  },
};

