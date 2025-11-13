// Tipos principais do aplicativo (compatíveis com backend)

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  cpf?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'pequeno' | 'medio' | 'grande' | 'PEQUENO' | 'MEDIO' | 'GRANDE';
  gender: 'M' | 'F' | 'MACHO' | 'FEMEA';
  isNeutered: boolean;
  objective: 'amizade' | 'cruzamento' | 'adocao' | 'AMIZADE' | 'CRUZAMENTO' | 'ADOCAO';
  description?: string | null;
  photoUrl: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Match {
  id: string;
  petAId: string;
  petBId: string;
  userAId: string;
  userBId: string;
  petA?: Pet;
  petB?: Pet;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planType: 'FREE' | 'PREMIUM' | 'VIP';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
}

export interface Payment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  pixCode?: string;
  pixQrCode?: string;
  createdAt: string;
}

export interface Plan {
  id?: string;
  type?: string;
  name: string;
  price: number;
  features: string[];
  maxPets: number;
  maxSwipesPerDay: number;
}

