// Tipos principais do aplicativo

export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  city?: string;
  plan: 'FREE' | 'PREMIUM' | 'VIP';
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'PEQUENO' | 'MEDIO' | 'GRANDE';
  gender: 'MACHO' | 'FEMEA';
  isNeutered: boolean;
  objective: 'AMIZADE' | 'CRUZAMENTO' | 'ADOCAO';
  description?: string;
  photos: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  pet1Id: string;
  pet2Id: string;
  pet1: Pet;
  pet2: Pet;
  createdAt: string;
}

export interface Swipe {
  id: string;
  swiperPetId: string;
  targetPetId: string;
  action: 'LIKE' | 'DISLIKE';
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxPets: number;
  maxSwipesPerDay: number;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

// Tipos para Pagamentos e Assinaturas
export interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
}

export interface Payment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  pixCode?: string;
  pixQrCode?: string;
  createdAt: string;
}

export interface UsageStats {
  swipesUsed: number;
  swipesLimit: number;
  superLikesUsed: number;
  superLikesLimit: number;
  messagesSent: number;
  messagesLimit: number;
}

// Tipos para Chat
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  matchId: string;
}

export interface ChatMatch {
  id: string;
  pet: Pet;
  lastMessage?: Message;
  unreadCount: number;
}
