// Par de Patas - Identidade Visual Mobile
// Baseado na paleta de cores da logo oficial

export const Colors = {
  // Cores principais da marca (baseadas na logo)
  primary: '#B952EB',        // Roxo vibrante principal da logo
  primaryDark: '#AF68D1',    // Roxo escuro
  primaryLight: '#F7DFFD',   // Roxo claro/pastel
  
  secondary: '#FDED11',      // Amarelo neon vibrante da logo
  secondaryDark: '#F59E0B',  // Amarelo escuro
  secondaryLight: '#FDE68A', // Amarelo claro
  
  // Cores de apoio da logo
  accent: '#BC7299',         // Rosa-roxo da logo
  accentLight: '#F9E1FD',    // Rosa claro
  accentDark: '#BA58D9',     // Rosa escuro
  
  // Cores neutras (mantendo contraste)
  white: '#FFFFFF',
  black: '#000000',
  grayLight: '#F8FAFC',
  gray: '#E2E8F0',
  grayDark: '#64748B',
  
  // Cores de texto
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textLight: '#64748B',
  textLightPrimary: '#1E293B',
  textLightSecondary: '#64748B',
  
  // Cores de estado
  success: '#10B981',
  warning: '#FDED11',        // Usando amarelo da logo
  error: '#EF4444',
  info: '#B952EB',           // Usando roxo da logo
  
  // Cores de fundo
  background: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  backgroundDark: '#1E293B',
  surface: '#FFFFFF',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#1E293B',
  border: '#E2E8F0',
  
  // Cores específicas do app
  card: '#FFFFFF',
  shadow: 'rgba(185, 82, 235, 0.15)',  // Sombra com cor da logo
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Cores da logo para uso específico
  logoPurple: '#B952EB',
  logoPurpleLight: '#F7DFFD',
  logoPurpleDark: '#AF68D1',
  logoYellow: '#FDED11',
  logoYellowLight: '#FDE68A',
  logoPink: '#BC7299',
  logoPinkLight: '#F9E1FD',
  
  // Gradientes baseados na logo
  gradient: {
    primary: ['#B952EB', '#AF68D1'],
    secondary: ['#FDED11', '#F59E0B'],
    logo: ['#B952EB', '#FDED11'],        // Gradiente principal da marca
    purple: ['#B952EB', '#F7DFFD'],      // Gradiente roxo
    yellow: ['#FDED11', '#FDE68A'],      // Gradiente amarelo
    rainbow: ['#B952EB', '#BC7299', '#FDED11'], // Gradiente completo da logo
  },
  
  // Cores para diferentes estados da UI
  like: '#B952EB',           // Cor para likes (roxo da logo)
  dislike: '#EF4444',        // Cor para dislikes (vermelho)
  superlike: '#FDED11',      // Cor para super likes (amarelo da logo)
  undo: '#64748B',           // Cor para undo (cinza)
};

export const Fonts = {
  primary: 'Fredoka',
  secondary: 'Montserrat',
  logo: 'Fredoka',           // Fonte para logo
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
    shadowColor: '#B952EB',  // Sombra com cor da logo
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#B952EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#B952EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Cores específicas para componentes
export const ComponentColors = {
  button: {
    primary: Colors.primary,
    secondary: Colors.secondary,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
  },
  input: {
    border: Colors.border,
    focus: Colors.primary,
    error: Colors.error,
    background: Colors.surface,
  },
  card: {
    background: Colors.surface,
    border: Colors.border,
    shadow: Colors.shadow,
  },
  navigation: {
    active: Colors.primary,
    inactive: Colors.textLight,
    background: Colors.background,
  },
};