import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configurações de ambiente usando Expo Constants
const config = {
  // URLs de API para diferentes ambientes
  apiUrls: {
    development: {
      local: 'http://localhost:3000',
      network: `http://${Constants.expoConfig?.extra?.localIp || '192.168.0.10'}:3000`,
    },
    staging: {
      api: 'https://api-staging.par-de-patas.com',
    },
    production: {
      api: 'https://api.par-de-patas.com',
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
  
  if (env === 'development') {
    // Em desenvolvimento, escolher entre local ou network baseado na plataforma
    if (config.isExpoGo) {
      // Expo Go (celular físico) - usar IP da rede
      console.log('📱 Expo Go detectado - usando IP da rede:', config.apiUrls.development.network);
      return config.apiUrls.development.network;
    } else {
      // Emulador/Web - usar localhost
      console.log('💻 Emulador/Web detectado - usando localhost:', config.apiUrls.development.local);
      return config.apiUrls.development.local;
    }
  } else if (env === 'staging') {
    console.log('🧪 Staging - usando API de staging:', config.apiUrls.staging.api);
    return config.apiUrls.staging.api;
  } else {
    console.log('🚀 Produção - usando API de produção:', config.apiUrls.production.api);
    return config.apiUrls.production.api;
  }
};

// Exportar configurações
export const API_URL = getApiUrl();
export const ENVIRONMENT = config.environment;
export const DEBUG = config.debug;
export const IS_EXPO_GO = config.isExpoGo;
export const IS_EMULATOR = config.isEmulator;
export const IS_WEB = config.isWeb;

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
