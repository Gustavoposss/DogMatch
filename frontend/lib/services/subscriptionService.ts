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
      swipes: {
        today: number;
        max: number;
        unlimited: boolean;
      };
      pets: {
        current: number;
        max: number;
        unlimited: boolean;
      };
    } }>('/subscriptions/usage');
    
    const stats = response.data.stats;
    
    return {
      swipesUsed: stats.swipes.today,
      swipesLimit: stats.swipes.unlimited ? -1 : stats.swipes.max,
      petsCount: stats.pets.current,
      maxPets: stats.pets.unlimited ? -1 : stats.pets.max,
    };
  },
};

