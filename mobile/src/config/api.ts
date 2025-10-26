// Re-exportar configurações do environment.ts para manter compatibilidade
export {
  API_URL,
  getApiUrl,
  logEnvironmentConfig as logApiConfig,
  setLocalIp as setCustomIp,
  getEnvironmentConfig,
  ENVIRONMENT,
  DEBUG,
  IS_EXPO_GO,
  IS_EMULATOR,
  IS_WEB,
} from './environment';
