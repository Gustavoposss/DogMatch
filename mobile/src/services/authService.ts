import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, logApiConfig } from '../config/api';
import { logger, IS_DEBUG } from '../utils/logger';

// Log da configuração atual (apenas em debug)
if (IS_DEBUG) {
  logApiConfig();
}

// Configurar axios globalmente com timeout maior para rede local
axios.defaults.timeout = 15000; // 15 segundos
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para log de requisições (desenvolvimento)
axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log da requisição (apenas em debug)
      if (IS_DEBUG) {
        logger.debug(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
          logger.debug('📦 Body:', JSON.stringify(config.data, null, 2));
        }
      }
    } catch (error) {
      logger.error('Erro ao adicionar token:', error);
    }
    return config;
  },
  (error) => {
    logger.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas e erros
axios.interceptors.response.use(
  (response) => {
    if (IS_DEBUG) {
      logger.debug(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error(`❌ ${error.response.status} ${error.config?.url}`);
      if (IS_DEBUG) {
        logger.debug('📦 Erro:', error.response.data);
      }
    } else if (error.request) {
      logger.error('❌ Erro de rede - sem resposta do servidor');
      if (IS_DEBUG) {
        logger.debug('🌐 URL tentada:', error.config?.url);
        logger.debug('🔌 Verifique se o backend está rodando em:', API_URL);
      }
    } else {
      logger.error('❌ Erro ao configurar requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  try {
    if (IS_DEBUG) {
      logger.debug('Fazendo requisição para:', `${API_URL}/auth/login`);
      logger.debug('Dados enviados:', { email, password: '***' });
    }
    
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (IS_DEBUG) {
      logger.debug('Resposta recebida:', { token: '***', user: response.data.user });
    }
    
    const { token, user } = response.data;
    
    // Salvar token no AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error: any) {
    logger.error('Erro na requisição de login:', error.message);
    if (IS_DEBUG) {
      logger.debug('Status:', error.response?.status);
      logger.debug('Data:', error.response?.data);
    }
    throw error;
  }
}

export async function register(
  name: string, 
  email: string, 
  password: string, 
  city: string,
  cpf: string,
  phone?: string
) {
  try {
    // Log forçado para debug (sempre aparece)
    console.log('🔧 === TENTANDO REGISTRO ===');
    console.log('🌐 API URL:', API_URL);
    console.log('📝 Endpoint completo:', `${API_URL}/auth/register`);
    
    if (IS_DEBUG) {
      logger.debug('=== TENTANDO REGISTRO ===');
      logger.debug('🌐 API URL:', API_URL);
      logger.debug('📝 Endpoint completo:', `${API_URL}/auth/register`);
      logger.debug('👤 Dados:', { 
        name, 
        email, 
        city,
        cpf: `${cpf.substring(0, 3)}***`,
        phone: phone || 'não informado'
      });
    }
    
    const response = await axios.post(`${API_URL}/auth/register`, { 
      name, 
      email, 
      password, 
      city,
      cpf,
      phone
    });
    
    if (IS_DEBUG) {
      logger.debug('✅ Registro bem-sucedido');
      logger.debug('📦 Resposta:', { token: '***', user: response.data.user });
    }
    
    const { token, user } = response.data;
    
    if (!token) {
      throw new Error('Token não recebido do servidor');
    }
    
    if (!user) {
      throw new Error('Dados do usuário não recebidos do servidor');
    }
    
    // Salvar token no AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error: any) {
    logger.error('❌ Erro no registro:', error.message);
    if (IS_DEBUG) {
      logger.debug('Detalhes do erro:', error);
    }
    
    if (error.response) {
      // Servidor respondeu com erro
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Erro ao criar conta';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando e se você está na mesma rede Wi-Fi.');
    } else {
      // Erro ao configurar a requisição
      throw new Error(error.message || 'Erro desconhecido ao criar conta');
    }
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

export async function getCurrentUser() {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

export async function getToken() {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

// Exportar como objeto para facilitar importação
export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated
};
