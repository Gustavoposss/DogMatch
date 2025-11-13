import api from '../api';
import { Match } from '@/types';

export const matchService = {
  async getMatchesByUser(userId: string): Promise<Match[]> {
    const response = await api.get<Match[]>(`/matches/user/${userId}`);
    return response.data;
  },

  async getMatchById(matchId: string): Promise<Match> {
    const response = await api.get<Match>(`/matches/${matchId}`);
    return response.data;
  },
};

