import axios from 'axios';
import type { PaymentPreference, Payment } from '../types/plan';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Criar pagamento para upgrade de plano
export const createPlanPayment = async (
  planType: string,
  token: string,
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'PIX'
): Promise<PaymentPreference> => {
  const response = await axios.post(
    `${API_URL}/payments/create-plan-payment`,
    { planType, billingType },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

// Verificar status de um pagamento
export const checkPaymentStatus = async (
  paymentId: string,
  token: string
): Promise<{ payment: Payment }> => {
  const response = await axios.get(
    `${API_URL}/payments/status/${paymentId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

// Listar pagamentos do usuário
export const getMyPayments = async (token: string): Promise<{ payments: Payment[] }> => {
  const response = await axios.get(`${API_URL}/payments/my-payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Criar pagamento para produto extra
export const createExtraProductPayment = async (
  productType: string,
  amount: number,
  token: string,
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' = 'PIX'
): Promise<PaymentPreference> => {
  const response = await axios.post(
    `${API_URL}/payments/create-extra-payment`,
    { productType, amount, billingType },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

// Cancelar pagamento
export const cancelPayment = async (
  paymentId: string,
  token: string
): Promise<{ message: string }> => {
  const response = await axios.delete(
    `${API_URL}/payments/cancel/${paymentId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

