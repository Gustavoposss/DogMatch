import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.101.5:3000';

export async function createPayment(planId: string, billingType: 'MONTHLY' | 'YEARLY') {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.post(`${API_URL}/payments/create`, {
      planId,
      billingType
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
}

export async function getPaymentStatus(paymentId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.get(`${API_URL}/payments/${paymentId}/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
}

export async function getMyPayments() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.get(`${API_URL}/payments/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    throw error;
  }
}

// Exportar como objeto para facilitar importação
export const paymentService = {
  createPayment,
  getPaymentStatus,
  getMyPayments
};
