import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configurações de ambiente usando Expo Constants
const config = {
  // URLs de API para diferentes ambientes
  apiUrls: {
    development: {
      local: 'http://localhost:3000',
      network: `http://${Constants.expoConfig?.extra?.localIp || '192.168.101.5'}:3000`,
    },
    staging: {
      api: 'https://api-staging.par-de-patas.com',
    },
    production: {
      api: Constants.expoConfig?.extra?.apiUrl || 'https://dogmatch.onrender.com',
    }
  },
  
  // Configurações de ambiente
  environment: Constants.expoConfig?.extra?.environment || 'development',
  debug: Constants.expoConfig?.extra?.debug === 'true' || __DEV__,
  
  // Detecção de plataforma
  isExpoGo: __DEV__ && Platform.OS !== 'web',
  isEmulator: Platform.OS === 'web' || Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
};

// Função para obter a URL da API baseada no ambiente
export const getApiUrl = (): string => {
  const env = config.environment as keyof typeof config.apiUrls;
  
  // Prioridade 1: Se tiver apiUrl customizada no app.config.js, usar ela (sempre)
  const customApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (customApiUrl) {
    console.log('🌐 Usando API URL customizada do app.config.js:', customApiUrl);
    return customApiUrl;
  }
  
  // Se ambiente for produção, SEMPRE usar URL de produção
  if (env === 'production') {
    const productionUrl = config.apiUrls.production.api || 'https://dogmatch.onrender.com';
    console.log('🚀 Produção detectada - usando API de produção:', productionUrl);
    return productionUrl;
  }
  
  if (env === 'development') {
    // Em desenvolvimento, escolher entre local ou network baseado na plataforma
    if (Platform.OS === 'web') {
      // Web - sempre usar localhost
      if (DEBUG) {
        console.log('💻 Web detectado - usando localhost:', config.apiUrls.development.local);
      }
      return config.apiUrls.development.local;
    } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Android/iOS (celular físico ou emulador físico) - usar IP da rede
      const networkUrl = config.apiUrls.development.network;
      if (DEBUG) {
        console.log('📱 Celular/Emulador detectado - usando IP da rede:', networkUrl);
      }
      return networkUrl;
    } else {
      // Fallback - usar localhost
      if (DEBUG) {
        console.log('💻 Emulador/Web detectado - usando localhost:', config.apiUrls.development.local);
      }
      return config.apiUrls.development.local;
    }
  } else if (env === 'staging') {
    if (DEBUG) {
      console.log('🧪 Staging - usando API de staging:', config.apiUrls.staging.api);
    }
    return config.apiUrls.staging.api;
  } else {
    // Produção - usar URL configurada
    const productionUrl = config.apiUrls.production.api;
    if (DEBUG) {
      console.log('🚀 Produção - usando API de produção:', productionUrl);
    }
    return productionUrl;
  }
};

// Exportar configurações
export const API_URL = getApiUrl();
export const ENVIRONMENT = config.environment;
export const DEBUG = config.debug;
export const IS_EXPO_GO = config.isExpoGo;
export const IS_EMULATOR = config.isEmulator;
export const IS_WEB = config.isWeb;

// Log inicial da configuração (sempre, mesmo em produção)
console.log('🔧 === CONFIGURAÇÃO DE API ===');
console.log('🌍 Environment:', ENVIRONMENT);
console.log('🌐 API URL:', API_URL);
console.log('📱 Platform:', Platform.OS);
console.log('📦 Custom API URL from config:', Constants.expoConfig?.extra?.apiUrl || 'não definida');
console.log('===============================');

// Função para debug
export const logEnvironmentConfig = () => {
  if (DEBUG) {
    console.log('🔧 === CONFIGURAÇÃO DE AMBIENTE ===');
    console.log('🌍 Environment:', ENVIRONMENT);
    console.log('📱 Platform:', Platform.OS);
    console.log('📱 isExpoGo:', IS_EXPO_GO);
    console.log('💻 isEmulator:', IS_EMULATOR);
    console.log('🌐 isWeb:', IS_WEB);
    console.log('🔧 Debug:', DEBUG);
    console.log('🌐 API URL:', API_URL);
    console.log('===============================');
  }
};

// Função para alterar IP local (para desenvolvimento)
export const setLocalIp = (newIp: string) => {
  if (ENVIRONMENT === 'development') {
    config.apiUrls.development.network = `http://${newIp}:3000`;
    console.log('🔄 IP local alterado para:', config.apiUrls.development.network);
  } else {
    console.warn('⚠️ Só é possível alterar IP em ambiente de desenvolvimento');
  }
};

// Função para obter configurações específicas do ambiente
export const getEnvironmentConfig = () => {
  return {
    apiUrl: API_URL,
    environment: ENVIRONMENT,
    debug: DEBUG,
    isExpoGo: IS_EXPO_GO,
    isEmulator: IS_EMULATOR,
    isWeb: IS_WEB,
  };
};
