import axios from 'axios';
import { API_URL } from '../config/api';

export interface UpdateUserData {
  name?: string;
  city?: string;
  phone?: string;
}

export const userService = {
  async updateProfile(data: UpdateUserData) {
    try {
      const response = await axios.put(`${API_URL}/users/me`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(
        error.response?.data?.error || 'Erro ao atualizar perfil'
      );
    }
  },

  async getMyProfile() {
    try {
      const response = await axios.get(`${API_URL}/users/me`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      throw new Error(
        error.response?.data?.error || 'Erro ao buscar perfil'
      );
    }
  },
};

