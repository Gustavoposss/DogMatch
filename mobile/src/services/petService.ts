import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

// Criar instância separada do axios para evitar conflitos com interceptors
const apiClient = axios.create({
  baseURL: API_URL,
});

export async function getPetsByUser(userId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    console.log('Buscando pets para usuário:', userId);
    const response = await apiClient.get(`/pets/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Resposta dos pets:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    throw error;
  }
}

export async function createPet(pet: any) {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token encontrado:', !!token);
    console.log('Token (primeiros 20 chars):', token?.substring(0, 20));
    
    if (!token) throw new Error('Token não encontrado');
    
    console.log('Enviando requisição para:', `${API_URL}/pets`);
    console.log('Dados do pet:', pet);
    
    const response = await apiClient.post(`/pets`, pet, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar pet:', error);
    console.error('Detalhes do erro:', error.response?.data);
    console.error('Status do erro:', error.response?.status);
    throw error;
  }
}

export async function updatePet(id: string, pet: any) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await apiClient.put(`/pets/${id}`, pet, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    throw error;
  }
}

export async function deletePet(id: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await apiClient.delete(`/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    throw error;
  }
}

// Exportar como objeto para facilitar importação
export const petService = {
  getPetsByUser,
  createPet,
  updatePet,
  deletePet
};
