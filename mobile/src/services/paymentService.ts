import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/api';

export type PlanType = 'FREE' | 'PREMIUM' | 'VIP';
export type BillingType = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

export async function createPayment(planType: PlanType, billingType: BillingType = 'PIX') {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.post(`${API_URL}/payments/create-plan-payment`, {
      planType,
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
    
    const response = await axios.get(`${API_URL}/payments/status/${paymentId}`, {
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
    
    const response = await axios.get(`${API_URL}/payments/my-payments`, {
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
