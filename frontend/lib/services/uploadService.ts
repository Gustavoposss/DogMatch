import api from '../api';

export interface UploadResponse {
  url: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/upload/pet-photo', formData);

    return response.data;
  },
};

