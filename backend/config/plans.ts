export interface PlanConfig {
    name: string;
    price: number; // em reais
    maxPets: number; // -1 para ilimitado
    maxSwipesPerDay: number; // -1 para ilimitado
    canSeeWhoLiked: boolean;
    canBoost: boolean;
    canUndoSwipe: boolean;
    boostsPerMonth: number;
    features: string[];
  }
  
  export const PLANS: Record<string, PlanConfig> = {
    FREE: {
      name: 'Gratuito',
      price: 0,
      maxPets: 1,
      maxSwipesPerDay: 5,
      canSeeWhoLiked: false,
      canBoost: false,
      canUndoSwipe: false,
      boostsPerMonth: 0,
      features: [
        '1 pet cadastrado',
        '5 swipes por dia',
        'Ver matches',
        'Chat básico'
      ]
    },
    PREMIUM: {
      name: 'Premium',
      price: 19.90,
      maxPets: 5,
      maxSwipesPerDay: -1, // ilimitado
      canSeeWhoLiked: true,
      canBoost: true,
      canUndoSwipe: false,
      boostsPerMonth: 1,
      features: [
        'Até 5 pets cadastrados',
        'Swipes ilimitados',
        'Ver quem curtiu seu pet',
        '1 Boost por mês',
        'Filtros avançados',
        'Chat sem limitações',
        'Badge verificado',
        'Suporte prioritário'
      ]
    },
    VIP: {
      name: 'VIP',
      price: 39.90,
      maxPets: -1, // ilimitado
      maxSwipesPerDay: -1, // ilimitado
      canSeeWhoLiked: true,
      canBoost: true,
      canUndoSwipe: true,
      boostsPerMonth: 3,
      features: [
        'Pets ilimitados',
        'Swipes ilimitados',
        'Ver quem curtiu seu pet',
        '3 Boosts por mês',
        'Aparecer primeiro nos resultados',
        'Desfazer swipes',
        'Modo viagem',
        'Analytics do perfil',
        'Selo VIP',
        'Suporte VIP prioritário'
      ]
    }
  };
  
  // Produtos extras avulsos
  export const EXTRA_PRODUCTS = {
    SUPER_BOOST: {
      name: 'Super Boost',
      price: 9.90,
      description: 'Aparecer em destaque por 3 horas'
    },
    SWIPE_PACK: {
      name: 'Pacote de Swipes',
      price: 4.90,
      quantity: 50,
      description: '+50 swipes extras'
    },
    UNDO_SWIPE: {
      name: 'Desfazer Swipe',
      price: 2.90,
      description: 'Voltar em 1 swipe'
    }
  };