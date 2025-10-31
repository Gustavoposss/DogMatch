import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';

export async function getPlans() {
  try {
    const response = await axios.get(`${API_URL}/subscriptions/plans`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    throw error;
  }
}

export async function getMySubscription() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.get(`${API_URL}/subscriptions/my-subscription`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.post(`${API_URL}/subscriptions/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    throw error;
  }
}

// Exportar como objeto para facilitar importação
export const subscriptionService = {
  getPlans,
  getMySubscription,
  cancelSubscription
};
