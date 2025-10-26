import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, logApiConfig } from '../config/api';

// Log da configuração atual
logApiConfig();

// Configurar axios com interceptors para incluir token automaticamente
axios.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Erro ao adicionar token:', error);
  }
  return config;
});

export async function login(email: string, password: string) {
  try {
    console.log('Fazendo requisição para:', `${API_URL}/auth/login`);
    console.log('Dados enviados:', { email, password });
    
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log('Resposta recebida:', response.data);
    
    const { token, user } = response.data;
    
    // Salvar token no AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error: any) {
    console.error('Erro na requisição de login:', error);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
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
    const response = await axios.post(`${API_URL}/auth/register`, { 
      name, 
      email, 
      password, 
      city,
      cpf,
      phone
    });
    const { token, user } = response.data;
    
    // Salvar token no AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    throw error;
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
