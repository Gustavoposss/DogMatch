// Par de Patas - Identidade Visual Mobile
// Baseado na identidade visual do frontend

export const Colors = {
  // Cores principais da marca
  primary: '#8B5CF6',        // Roxo principal
  primaryDark: '#7C3AED',    // Roxo escuro
  primaryLight: '#A78BFA',    // Roxo claro
  
  secondary: '#FCD34D',       // Amarelo neon
  secondaryDark: '#F59E0B',   // Amarelo escuro
  secondaryLight: '#FDE68A',  // Amarelo claro
  
  // Cores neutras
  white: '#FFFFFF',
  grayLight: '#F8FAFC',
  gray: '#E2E8F0',
  grayDark: '#64748B',
  
  // Cores de texto
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textLight: '#64748B',
  
  // Cores de estado
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Cores de fundo
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  
  // Cores específicas do app
  card: '#FFFFFF',
  shadow: 'rgba(139, 92, 246, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Gradientes
  gradient: {
    primary: ['#8B5CF6', '#7C3AED'],
    secondary: ['#FCD34D', '#F59E0B'],
    rainbow: ['#8B5CF6', '#FCD34D'],
  }
};

export const Fonts = {
  primary: 'Fredoka',
  secondary: 'Montserrat',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};