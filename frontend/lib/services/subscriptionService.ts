import api from '../api';
import { Plan, Subscription, Payment } from '@/types';

export const subscriptionService = {
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<{ plans: Plan[] }>('/subscriptions/plans');
    return response.data.plans;
  },

  async getMySubscription(): Promise<Subscription> {
    const response = await api.get<{ subscription: Subscription }>('/subscriptions/my-subscription');
    return response.data.subscription;
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
    const response = await api.get<{ stats: {
      swipesUsed: number;
      swipesLimit: number;
      petsCount: number;
      maxPets: number;
    } }>('/subscriptions/usage');
    return response.data.stats;
  },
};

