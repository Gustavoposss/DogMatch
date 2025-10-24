import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://192.168.101.5:3000';

export async function uploadImage(uri: string, type: string = 'image/jpeg') {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Token para upload:', !!token);
    console.log('URI da imagem:', uri);
    
    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      type: type,
      name: 'image.jpg',
    } as any);
    
    console.log('FormData criado:', formData);

    console.log('Enviando upload para:', `${API_URL}/upload/pet-photo`);
    
    const response = await axios.post(`${API_URL}/upload/pet-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro no upload:', error);
    console.error('Erro response:', error.response?.data);
    throw error;
  }
}

export async function pickImage(): Promise<string | null> {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (permissionResult.granted === false) {
    throw new Error('Permission to access camera roll is required!');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
