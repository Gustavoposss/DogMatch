import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function uploadPetPhoto(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await axios.post(`${API_URL}/upload/pet-photo`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.url;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Verificar se é uma imagem
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Por favor, selecione apenas arquivos de imagem.' };
  }

  // Verificar tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'A imagem deve ter no máximo 5MB.' };
  }

  // Verificar formato
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Formatos permitidos: JPG, PNG, WebP.' };
  }

  return { valid: true };
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
