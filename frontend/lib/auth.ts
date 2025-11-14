import api from './api';
import { User } from '@/types';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  city: string;
  cpf?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

// Autenticação
export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};

