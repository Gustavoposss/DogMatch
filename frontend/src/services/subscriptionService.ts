import axios from 'axios';
import type { Plan, Subscription, UsageStats } from '../types/plan';

const API_URL = 'http://localhost:3000';

// Listar todos os planos disponíveis
export const getPlans = async (): Promise<{ plans: Plan[] }> => {
  const response = await axios.get(`${API_URL}/subscriptions/plans`);
  return response.data;
};

// Buscar assinatura do usuário
export const getMySubscription = async (token: string): Promise<{ subscription: Subscription; usage: UsageStats }> => {
  const response = await axios.get(`${API_URL}/subscriptions/my-subscription`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Cancelar assinatura
export const cancelSubscription = async (token: string): Promise<{ message: string; subscription: Subscription }> => {
  const response = await axios.post(`${API_URL}/subscriptions/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Verificar limites
export const checkLimits = async (token: string) => {
  const response = await axios.get(`${API_URL}/subscriptions/limits`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Obter estatísticas de uso
export const getUsageStats = async (token: string): Promise<{ stats: UsageStats }> => {
  const response = await axios.get(`${API_URL}/subscriptions/usage`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
