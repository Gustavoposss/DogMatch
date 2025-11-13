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
  size: 'pequeno' | 'medio' | 'grande' | 'PEQUENO' | 'MEDIO' | 'GRANDE';
  gender: 'M' | 'F' | 'MACHO' | 'FEMEA';
  isNeutered: boolean;
  objective: 'amizade' | 'cruzamento' | 'adocao' | 'AMIZADE' | 'CRUZAMENTO' | 'ADOCAO';
  description?: string | null;
  photoUrl: string; // Backend usa photoUrl (string), não photos (array)
  ownerId: string; // Backend usa ownerId
  createdAt: string;
  updatedAt?: string;
}

export interface Match {
  id: string;
  petAId: string; // Backend usa petAId
  petBId: string; // Backend usa petBId
  userAId: string; // Backend usa userAId
  userBId: string; // Backend usa userBId
  petA?: Pet; // Opcional, pode não vir na resposta
  petB?: Pet; // Opcional, pode não vir na resposta
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
  senderId: string; // Backend usa apenas senderId
  chatId: string; // Backend usa chatId, não matchId diretamente
  content: string;
  createdAt: string; // Backend usa createdAt, não timestamp
  sender?: { // Opcional, pode vir na resposta
    id: string;
    name: string;
    email?: string;
  };
}

export interface ChatMatch {
  id: string;
  pet: Pet;
  lastMessage?: Message;
  unreadCount: number;
}
