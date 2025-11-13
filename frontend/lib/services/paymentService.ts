import api from '../api';
import { Payment } from '@/types';

export interface CreatePaymentData {
  planType: 'FREE' | 'PREMIUM' | 'VIP';
  billingType?: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
}

export const paymentService = {
  async createPlanPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post<Payment>('/payments/create-plan-payment', {
      planType: data.planType,
      billingType: data.billingType || 'PIX'
    });
    return response.data;
  },

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    const response = await api.get<{ payment: Payment }>(`/payments/status/${paymentId}`);
    return response.data.payment;
  },

  async getUserPayments(): Promise<Payment[]> {
    const response = await api.get<Payment[]>('/payments/my-payments');
    return response.data;
  },
};

