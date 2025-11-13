import api from '../api';
import { User } from '@/types';

export const userService = {
  async getMyProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },
};

