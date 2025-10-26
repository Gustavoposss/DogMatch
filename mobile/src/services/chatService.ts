import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Chat {
  id: string;
  matchId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Enviar mensagem
export async function sendMessage(matchId: string, content: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.post(`${API_URL}/chat/send`, {
      matchId,
      content
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Mensagem enviada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

// Buscar mensagens de um chat
export async function getChatMessages(matchId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.get(`${API_URL}/chat/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Mensagens recebidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
}

// Buscar informações do match para o chat
export async function getMatchInfo(matchId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');
    
    const response = await axios.get(`${API_URL}/matches/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Informações do match:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar informações do match:', error);
    throw error;
  }
}
