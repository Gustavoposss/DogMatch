import api from '../api';
import { Message } from '@/types';

export const chatService = {
  async sendMessage(matchId: string, content: string): Promise<{ message: Message }> {
    const response = await api.post<{ message: Message }>('/chat/send', {
      matchId,
      content,
    });
    return response.data;
  },

  async getChatMessages(matchId: string): Promise<{ messages: Message[] }> {
    const response = await api.get<{ messages: Message[] }>(`/chat/${matchId}`);
    return response.data;
  },
};

