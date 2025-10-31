import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { API_URL } from '../config/api';

export async function uploadImage(uri: string, type: string = 'image/jpeg') {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    console.log('Token para upload:', !!token);
    console.log('URI da imagem:', uri);
    console.log('Platform:', Platform.OS);
    
    const formData = new FormData();
    
    // Para web, precisamos converter blob URI para File/Blob
    if (Platform.OS === 'web') {
      try {
        // Buscar o blob da URI
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Criar um File a partir do blob
        const file = new File([blob], 'image.jpg', { type: type || blob.type || 'image/jpeg' });
        
        formData.append('image', file);
      } catch (blobError) {
        console.error('Erro ao converter blob:', blobError);
        // Fallback: tentar usar fetch diretamente
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      }
    } else {
      // Para React Native (iOS/Android), usar o formato esperado
      const fileName = uri.split('/').pop() || 'image.jpg';
      const fileExtension = fileName.split('.').pop() || 'jpg';
      
      formData.append('image', {
        uri: uri,
        type: type || `image/${fileExtension}`,
        name: `image.${fileExtension}`,
      } as any);
    }
    
    console.log('FormData criado');

    console.log('Enviando upload para:', `${API_URL}/upload/pet-photo`);
    
    const response = await axios.post(`${API_URL}/upload/pet-photo`, formData, {
      headers: {
        // NÃO definir Content-Type manualmente - deixar o axios fazer isso automaticamente
        // Isso permite que o boundary seja adicionado corretamente
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro no upload:', error);
    console.error('Erro response:', error.response?.data);
    console.error('Erro status:', error.response?.status);
    
    // Retornar mensagem de erro mais amigável
    const errorMessage = error.response?.data?.error || error.message || 'Erro ao fazer upload da imagem';
    throw new Error(errorMessage);
  }
}

export async function pickImage(): Promise<string | null> {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (permissionResult.granted === false) {
    throw new Error('Permission to access camera roll is required!');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], // Usar array ao invés de MediaTypeOptions (deprecated)
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  
  return null;
}

export async function takePhoto(): Promise<string | null> {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
  if (permissionResult.granted === false) {
    throw new Error('Permission to access camera is required!');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  
  return null;
}

// Exportar como objeto para facilitar importação
export const uploadService = {
  uploadImage,
  pickImage,
  takePhoto
};
