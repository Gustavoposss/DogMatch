import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { LogoIcon } from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import { petService } from '../services/petService';
import { useAuth } from '../contexts/AuthContext';
import { Pet } from '../types';

export default function PetsScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    try {
      setLoading(true);
      if (state.user && state.user.id) {
        const response = await petService.getPetsByUser(state.user.id);
        if (response && response.pets) {
          setPets(response.pets);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    (navigation as any).navigate('AddPet');
  };

  const handleEditPet = (pet: Pet) => {
    (navigation as any).navigate('EditPet', { pet });
  };

  const handleDeletePet = (pet: Pet) => {
    Alert.alert(
      'Excluir Pet',
      `Tem certeza que deseja excluir ${pet.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deletePet(pet.id)
        }
      ]
    );
  };

  const deletePet = async (petId: string) => {
    try {
      await petService.deletePet(petId);
      await loadPets(); // Recarregar lista
      Alert.alert('Sucesso', 'Pet excluído com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao excluir pet');
    }
  };

  const handlePetOptions = (pet: Pet) => {
    Alert.alert(
      pet.name,
      'O que você gostaria de fazer?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Editar', onPress: () => handleEditPet(pet) },
        { text: 'Excluir', style: 'destructive', onPress: () => handleDeletePet(pet) }
      ]
    );
  };

  const renderPetItem = ({ item }: { item: Pet }) => (
    <View style={styles.petCard}>
      <Image
        source={{ uri: item.photos?.[0] || 'https://via.placeholder.com/64' }}
        style={styles.petImage}
        resizeMode="cover"
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>
          {item.breed}, {item.age} anos
        </Text>
      </View>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => handlePetOptions(item)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.textLightSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LogoIcon width={64} height={64} />
      <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
      <Text style={styles.emptyMessage}>
        Adicione seu primeiro pet para começar a encontrar novos amigos!
      </Text>
      <TouchableOpacity style={styles.addFirstPetButton} onPress={handleAddPet}>
        <Text style={styles.addFirstPetButtonText}>Adicionar Pet</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando pets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Cães</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {pets.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.petsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPet}>
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLightSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  petsList: {
    padding: 16,
    paddingBottom: 100,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 14,
    color: Colors.textLightSecondary,
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addFirstPetButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addFirstPetButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});