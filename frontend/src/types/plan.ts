export interface Plan {
  type: string;
  name: string;
  price: number;
  maxPets: number;
  maxSwipesPerDay: number;
  canSeeWhoLiked: boolean;
  canBoost: boolean;
  canUndoSwipe: boolean;
  boostsPerMonth: number;
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  usageLimits?: {
    maxPets: number;
    maxSwipesPerDay: number;
    swipesToday: number;
    canSeeWhoLiked: boolean;
    canBoost: boolean;
    canUndoSwipe: boolean;
    boostsRemaining: number;
  };
}

export interface UsageStats {
  planType: string;
  pets: {
    current: number;
    max: number;
    unlimited: boolean;
  };
  swipes: {
    today: number;
    max: number;
    unlimited: boolean;
    remaining: number;
  };
  boosts: {
    remaining: number;
    enabled: boolean;
  };
  features: {
    canSeeWhoLiked: boolean;
    canUndoSwipe: boolean;
  };
}

export interface PaymentPreference {
  paymentId: string;
  asaasPaymentId: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCode?: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
  };
  dueDate: string;
  value: number;
  status: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}
