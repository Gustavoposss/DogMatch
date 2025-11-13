import api from '../api';
import { Plan, Subscription, Payment } from '@/types';

export const subscriptionService = {
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<Plan[]>('/subscriptions/plans');
    return response.data;
  },

  async getMySubscription(): Promise<Subscription> {
    const response = await api.get<Subscription>('/subscriptions/my-subscription');
    return response.data;
  },

  async cancelSubscription(): Promise<void> {
    await api.post('/subscriptions/cancel');
  },

  async getUsageStats(): Promise<{
    swipesUsed: number;
    swipesLimit: number;
    petsCount: number;
    maxPets: number;
  }> {
    const response = await api.get('/subscriptions/usage-stats');
    return response.data;
  },
};

