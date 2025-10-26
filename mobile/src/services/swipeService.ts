import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

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

export async function likePet(toPetId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.post(`${API_URL}/swipe/like`, {
      toPetId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao curtir pet:', error);
    throw error;
  }
}

export async function getMatchesByUser(userId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.get(`${API_URL}/matches/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Matches recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar matches:', error);
    throw error;
  }
}

export async function getPetsToSwipe(userId: string, filters?: SwipeFilters) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    console.log('Buscando pets para swipe para usuário:', userId);
    
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await axios.get(`${API_URL}/pets/swipe/${userId}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Resposta dos pets para swipe:', response.data);
    
    // Verificar se a resposta é válida
    if (response.data && Array.isArray(response.data.pets)) {
      return response.data;
    } else if (Array.isArray(response.data)) {
      return { pets: response.data };
    } else {
      console.warn('Formato de resposta inesperado:', response.data);
      return { pets: [] };
    }
  } catch (error) {
    console.error('Erro ao buscar pets para swipe:', error);
    throw error;
  }
}

export async function getFilterOptions(): Promise<FilterOptions> {
  try {
    const response = await axios.get(`${API_URL}/swipe/filters`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar opções de filtro:', error);
    throw error;
  }
}

// Exportar como objeto para facilitar importação
export const swipeService = {
  likePet,
  getMatchesByUser,
  getPetsToSwipe,
  getFilterOptions
};
