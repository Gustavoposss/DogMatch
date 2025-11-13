import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
// Usar API legacy para compatibilidade com readAsStringAsync e EncodingType
import * as FileSystem from 'expo-file-system/legacy';
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
        // Verificar se a URI existe
        if (!uri) {
          throw new Error('URI da imagem não fornecida');
        }
        
        console.log('Lendo arquivo como base64, URI:', uri);
        
        // Usar API legacy do expo-file-system que suporta EncodingType.Base64
        // Conforme documentação: https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/
        let base64: string;
        
        try {
          // A API legacy garante que EncodingType.Base64 está disponível
          // Documentação: FileSystem.EncodingType.Base64 = "base64"
          base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Verificar se base64 foi retornado corretamente
          if (!base64 || typeof base64 !== 'string' || base64.length === 0) {
            throw new Error('Arquivo não foi convertido para base64 corretamente');
          }
          
          console.log('✅ Base64 lido com sucesso, tamanho:', base64.length, 'caracteres');
        } catch (readError: any) {
          console.error('❌ Erro ao ler arquivo como base64:', readError);
          console.error('📋 Erro detalhado:', readError.message);
          console.error('📋 Stack:', readError.stack);
          console.error('📋 URI que falhou:', uri);
          
          // Mensagens de erro mais específicas baseadas no tipo de erro
          if (readError.message?.includes('No such file') || readError.message?.includes('ENOENT') || readError.message?.includes('not found')) {
            throw new Error('Arquivo não encontrado. Por favor, selecione uma nova imagem.');
          } else if (readError.message?.includes('permission') || readError.message?.includes('Permission')) {
            throw new Error('Sem permissão para acessar o arquivo. Verifique as permissões do app nas configurações.');
          } else if (readError.message?.includes('base64') || readError.message?.includes('Base64')) {
            throw new Error('Erro ao processar imagem em base64. Por favor, tente novamente ou escolha outra imagem.');
          } else if (readError.message?.includes('undefined')) {
            throw new Error('Erro de configuração ao processar imagem. Por favor, reinicie o app e tente novamente.');
          } else {
            throw new Error(`Erro ao processar imagem: ${readError.message || 'Erro desconhecido'}`);
          }
        }
        
        if (!base64 || typeof base64 !== 'string') {
          throw new Error('Falha ao ler arquivo como base64 - resultado inválido');
        }
        
        const fileName = uri.split('/').pop() || 'image.jpg';
        const fileExtension = fileName.split('.').pop() || 'jpg';
        
        console.log('Enviando upload como JSON (base64), tamanho:', base64.length);
        
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
      } catch (fileError: any) {
        console.error('Erro ao ler arquivo ou fazer upload:', fileError);
        console.error('Erro detalhes:', fileError.message);
        console.error('URI que falhou:', uri);
        
        // Mensagem de erro mais específica
        if (fileError.message?.includes('base64')) {
          throw new Error('Erro ao processar imagem. Por favor, tente novamente ou escolha outra imagem.');
        }
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
    throw new Error('Permissão para acessar a galeria é necessária!');
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
    throw new Error('Permissão para acessar a câmera é necessária!');
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
