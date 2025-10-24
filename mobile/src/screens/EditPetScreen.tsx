import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { NavigationProps, Pet } from '../types';
import { updatePet } from '../services/petService';
import { pickImage, takePhoto, uploadImage } from '../services/uploadService';

const DOG_BREEDS = [
  'Labrador', 'Golden Retriever', 'Pastor Alemão', 'Bulldog', 'Poodle',
  'Beagle', 'Rottweiler', 'Yorkshire', 'Shih Tzu', 'Pug', 'Outro'
];

const SIZES = ['PEQUENO', 'MEDIO', 'GRANDE'];
const GENDERS = ['MACHO', 'FEMEA'];
const OBJECTIVES = ['AMIZADE', 'CRUZAMENTO', 'ADOCAO'];

export default function EditPetScreen({ navigation, route }: NavigationProps) {
  const { pet } = route.params as { pet: Pet };
  
  const [formData, setFormData] = useState({
    name: pet.name || '',
    breed: pet.breed || '',
    age: pet.age?.toString() || '',
    gender: pet.gender || '',
    size: pet.size || '',
    isNeutered: pet.isNeutered || false,
    objective: pet.objective || '',
    description: pet.description || '',
  });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet.photos && pet.photos.length > 0) {
      setPhotoUri(pet.photos[0]);
    }
  }, [pet]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        setPhotoUri(uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleCamera = async () => {
    try {
      const uri = await takePhoto();
      if (uri) {
        setPhotoUri(uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  const handleSubmit = async () => {
    const { name, breed, age, gender, size, objective } = formData;

    if (!name || !breed || !age || !gender || !size || !objective) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      let photoUrl = pet.photoUrl;
      
      // Se uma nova foto foi selecionada, fazer upload
      if (photoUri && photoUri !== pet.photos?.[0]) {
        const uploadResult = await uploadImage(photoUri);
        photoUrl = uploadResult.url;
      }

      // Atualizar pet
      const petData = {
        name,
        breed,
        age: parseInt(age),
        gender,
        size,
        isNeutered: formData.isNeutered,
        objective,
        description: formData.description,
        photoUrl,
      };

      await updatePet(pet.id, petData);
      Alert.alert('Sucesso', 'Pet atualizado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao atualizar pet:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao atualizar pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>✏️ Editar Pet</Text>
        </View>

        <View style={styles.form}>
          {/* Foto do Pet */}
          <View style={styles.photoSection}>
            <Text style={styles.label}>Foto do Pet</Text>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.petImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Adicionar Foto</Text>
              </View>
            )}
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
                <Text style={styles.imageButtonText}>📷 Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={handleCamera}>
                <Text style={styles.imageButtonText}>📸 Câmera</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nome */}
          <TextInput
            style={styles.input}
            placeholder="Nome do pet *"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            autoCapitalize="words"
          />

          {/* Raça */}
          <View style={styles.breedContainer}>
            <Text style={styles.label}>Raça *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breedScroll}>
              {DOG_BREEDS.map((breed) => (
                <TouchableOpacity
                  key={breed}
                  style={[
                    styles.breedButton,
                    formData.breed === breed && styles.breedButtonSelected
                  ]}
                  onPress={() => handleInputChange('breed', breed)}
                >
                  <Text style={[
                    styles.breedButtonText,
                    formData.breed === breed && styles.breedButtonTextSelected
                  ]}>
                    {breed}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Idade */}
          <TextInput
            style={styles.input}
            placeholder="Idade (anos) *"
            value={formData.age}
            onChangeText={(value) => handleInputChange('age', value)}
            keyboardType="numeric"
          />

          {/* Gênero */}
          <View style={styles.optionContainer}>
            <Text style={styles.label}>Gênero *</Text>
            <View style={styles.optionButtons}>
              {GENDERS.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.optionButton,
                    formData.gender === gender && styles.optionButtonSelected
                  ]}
                  onPress={() => handleInputChange('gender', gender)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.gender === gender && styles.optionButtonTextSelected
                  ]}>
                    {gender === 'MACHO' ? '♂ Macho' : '♀ Fêmea'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tamanho */}
          <View style={styles.optionContainer}>
            <Text style={styles.label}>Tamanho *</Text>
            <View style={styles.optionButtons}>
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    formData.size === size && styles.optionButtonSelected
                  ]}
                  onPress={() => handleInputChange('size', size)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.size === size && styles.optionButtonTextSelected
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Castrado */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('isNeutered', !formData.isNeutered)}
          >
            <View style={[styles.checkbox, formData.isNeutered && styles.checkboxSelected]}>
              {formData.isNeutered && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Pet é castrado/sterilizado</Text>
          </TouchableOpacity>

          {/* Objetivo */}
          <View style={styles.optionContainer}>
            <Text style={styles.label}>Objetivo *</Text>
            <View style={styles.optionButtons}>
              {OBJECTIVES.map((objective) => (
                <TouchableOpacity
                  key={objective}
                  style={[
                    styles.optionButton,
                    formData.objective === objective && styles.optionButtonSelected
                  ]}
                  onPress={() => handleInputChange('objective', objective)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.objective === objective && styles.optionButtonTextSelected
                  ]}>
                    {objective}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Descrição */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição do pet (opcional)"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={3}
          />

          {/* Botão de atualizar */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Atualizando...' : 'Atualizar Pet'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    flex: 1,
  },
  photoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 10,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  imageButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  breedContainer: {
    marginBottom: 15,
  },
  breedScroll: {
    marginBottom: 10,
  },
  breedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  breedButtonSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  breedButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  breedButtonTextSelected: {
    color: '#fff',
  },
  optionContainer: {
    marginBottom: 15,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    minWidth: 100,
  },
  optionButtonSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionButtonText: {
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

