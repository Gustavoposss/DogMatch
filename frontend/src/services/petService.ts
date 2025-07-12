import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function getPetsByUser(userId: string, token: string) {
  const response = await axios.get(`${API_URL}/pets/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.pets || [];
}

export async function createPet(pet: any, token: string) {
  const response = await axios.post(`${API_URL}/pets`, pet, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function updatePet(id: string, pet: any, token: string) {
  const response = await axios.put(`${API_URL}/pets/${id}`, pet, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function deletePet(id: string, token: string) {
  const response = await axios.delete(`${API_URL}/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}