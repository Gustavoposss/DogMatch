import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
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
      // Para React Native (iOS/Android), ler arquivo e enviar como base64 via JSON
      // Isso é mais confiável que usar URI diretamente ou FormData
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const fileName = uri.split('/').pop() || 'image.jpg';
        const fileExtension = fileName.split('.').pop() || 'jpg';
        
        console.log('Enviando upload como JSON (base64) para:', `${API_URL}/upload/pet-photo`);
        
        // Enviar como JSON com base64
        const response = await fetch(`${API_URL}/upload/pet-photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: base64,
            filename: `image.${fileExtension}`,
            mimetype: type || `image/${fileExtension}`,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
          throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Upload response:', data);
        return data;
      } catch (fileError) {
        console.error('Erro ao ler arquivo ou fazer upload:', fileError);
        throw fileError;
      }
    }
    
    // Código abaixo só é executado para web
    console.log('FormData criado');

    console.log('Enviando upload para:', `${API_URL}/upload/pet-photo`);
    
    // Usar fetch ao invés de axios para melhor compatibilidade com FormData do React Native
    const response = await fetch(`${API_URL}/upload/pet-photo`, {
      method: 'POST',
      headers: {
        // NÃO definir Content-Type - o fetch faz isso automaticamente para FormData
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Upload response:', data);
    return data;
  } catch (error: any) {
    console.error('Erro no upload:', error);
    
    // Retornar mensagem de erro mais amigável
    const errorMessage = error.message || 'Erro ao fazer upload da imagem';
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
    quality: 0.7, // Reduzido de 0.8 para 0.7 para melhor compressão
    // Adicionar limitação de resolução máxima
    allowsMultipleSelection: false,
  });

  if (!result.canceled && result.assets[0]) {
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
    quality: 0.7, // Reduzido de 0.8 para 0.7 para melhor compressão
    allowsMultipleSelection: false,
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
