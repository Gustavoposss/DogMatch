import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function login(email: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data; // deve retornar { token, user }
}

export async function register(name: string, email: string, password: string, city: string) {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, city });
  return response.data; // deve retornar { token, user }
}

export async function getUserById(id: string, token: string) {
  const response = await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}