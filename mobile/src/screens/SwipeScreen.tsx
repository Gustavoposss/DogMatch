import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { LogoIcon } from '../components/Logo';
import { Ionicons } from '@expo/vector-icons';
import { swipeService } from '../services/swipeService';
import { useAuth } from '../contexts/AuthContext';
import { Pet } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SwipeScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedPet, setMatchedPet] = useState<Pet | null>(null);
  const [liking, setLiking] = useState(false);
  const [likedPetIds, setLikedPetIds] = useState<Set<string>>(new Set());

  useFocusEffect(
    React.useCallback(() => {
      // Limpar lista de pets curtidos ao sair e voltar (opcional - pode manter para melhor UX)
      // setLikedPetIds(new Set());
      loadPets();
    }, [state.user?.id])
  );

  const loadPets = async (forceReload = false) => {
    try {
      setLoading(true);
      console.log('=== LOAD PETS DEBUG ===');
      console.log('User ID:', state.user?.id);
      
      if (state.user && state.user.id) {
        // Primeiro verificar se o usuário tem pelo menos um pet
        const { petService } = await import('../services/petService');
        const userPetsResponse = await petService.getPetsByUser(state.user.id);
        
        if (!userPetsResponse || !userPetsResponse.pets || userPetsResponse.pets.length === 0) {
          console.log('Usuário não tem pets cadastrados');
          setPets([]);
          setLoading(false);
          return;
        }

        // Se não for reload forçado e já temos pets suficientes, não recarregar
        // Mas sempre recarregar se estiver no último pet ou não houver pets
        if (!forceReload && pets.length > 0 && currentIndex < pets.length - 1) {
          console.log('Já temos pets carregados, pulando reload');
          setLoading(false);
          return;
        }

        const response = await swipeService.getPetsToSwipe(state.user.id);
        console.log('Resposta completa:', response);
        
        if (response && response.pets) {
          console.log('Pets encontrados:', response.pets.length);
          console.log('Primeiro pet:', response.pets[0]);
          
          // Filtrar pets já curtidos (o backend já deve filtrar, mas garantimos aqui também)
          // Filtrar pets que já estão no set de likedPetIds
          const filteredPets = response.pets.filter(pet => !likedPetIds.has(pet.id));
          console.log('Pets após filtro local:', filteredPets.length);
          
          setPets(filteredPets);
          // Ajustar índice se necessário
          if (currentIndex >= filteredPets.length) {
            setCurrentIndex(Math.max(0, filteredPets.length - 1));
          }
        } else {
          console.log('Nenhum pet encontrado ou formato inválido');
          setPets([]);
        }
      } else {
        console.log('Usuário não logado');
        setPets([]);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex < pets.length && !liking) {
      const pet = pets[currentIndex];
      
      // Prevenir like duplicado
      if (likedPetIds.has(pet.id)) {
        // Se já deu like, remover da lista e avançar
        setPets(prev => prev.filter(p => p.id !== pet.id));
        setCurrentIndex(prev => Math.min(prev, pets.length - 2));
        return;
      }
      
      try {
        setLiking(true);
        
        // Adicionar feedback visual imediato (otimistic update)
        setLikedPetIds(prev => new Set(prev).add(pet.id));
        
        // Remover o pet da lista imediatamente para evitar que apareça novamente
        setPets(prev => prev.filter(p => p.id !== pet.id));
        
        const response = await swipeService.likePet(pet.id);
        
        // Feedback visual de sucesso
        // O loading indicator já mostra que está processando
        
        if (response && response.isMatch) {
          setMatchedPet(pet);
          setShowMatchModal(true);
        } else {
          // Mostrar feedback de like enviado (sem match)
          // O usuário verá o próximo pet aparecer, indicando que o like foi processado
        }
        
        // Ajustar índice se necessário (já removemos o pet da lista)
        setCurrentIndex(prev => {
          const newLength = pets.length - 1;
          return Math.max(0, Math.min(prev, newLength - 1));
        });
        
        // Se não há mais pets, recarregar lista após um pequeno delay
        // para dar tempo do backend processar o like
        if (pets.length <= 1) {
          setTimeout(() => {
            loadPets(true);
          }, 500);
        }
      } catch (error) {
        console.error('Erro ao dar like:', error);
        Alert.alert('Erro', 'Não foi possível enviar o like. Tente novamente.');
        // Remover do set de liked se der erro e restaurar o pet na lista
        setLikedPetIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(pet.id);
          return newSet;
        });
        // Não restaurar o pet na lista se o erro for de duplicação (já foi curtido)
        // O backend retornará erro 409 se já foi curtido
      } finally {
        setLiking(false);
      }
    }
  };

  const handlePass = () => {
    if (currentIndex < pets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Se passou do último pet, recarregar lista para buscar mais pets
      // Forçar reload para buscar novos pets do backend
      loadPets(true);
    }
  };


  const handleMatchModalClose = () => {
    setShowMatchModal(false);
    setMatchedPet(null);
  };

  const handleSendMessage = () => {
    setShowMatchModal(false);
    (navigation as any).navigate('Chat', { pet: matchedPet });
  };

  const currentPet = pets[currentIndex];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando pets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (pets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <LogoIcon width={64} height={64} />
          <Text style={styles.emptyTitle}>Nenhum pet encontrado!</Text>
          <Text style={styles.emptyMessage}>
            Não há pets cadastrados no sistema ainda. Cadastre seu primeiro pet!
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={() => navigation.navigate('Pets' as never)}
          >
            <Text style={styles.refreshButtonText}>Cadastrar Pet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <LogoIcon width={64} height={64} />
          <Text style={styles.emptyTitle}>Não há mais pets!</Text>
          <Text style={styles.emptyMessage}>
            Você viu todos os pets disponíveis. Tente novamente mais tarde.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadPets}>
            <Text style={styles.refreshButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="person" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Par de Patas</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="chatbubble" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: currentPet.photos?.[0] || 'https://via.placeholder.com/400' }}
          style={styles.petImage}
          resizeMode="cover"
        />
        
        {/* Page Indicators */}
        <View style={styles.pageIndicators}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        {/* Pet Info Overlay */}
        <View style={styles.petInfoOverlay}>
          <Text style={styles.petName}>{currentPet.name}, {currentPet.age} anos</Text>
          <View style={styles.petDetails}>
            <Text style={styles.petBreed}>{currentPet.breed}</Text>
            <Text style={styles.petDistance}>• A 3km de você</Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons - Simplified */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handlePass}
          disabled={liking}
        >
          <View style={[styles.actionButtonInner, styles.passButton, liking && styles.actionButtonDisabled]}>
            <Ionicons name="close" size={32} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLike}
          disabled={liking || currentIndex >= pets.length}
        >
          <View style={[styles.actionButtonInner, styles.likeButton, liking && styles.actionButtonDisabled]}>
            {liking ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="heart" size={32} color={Colors.white} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Match Modal */}
      <Modal
        visible={showMatchModal}
        transparent
        animationType="fade"
        onRequestClose={handleMatchModalClose}
      >
        <View style={styles.matchModal}>
          <View style={styles.matchModalContent}>
            <Text style={styles.matchTitle}>É um Match!</Text>
            
            <View style={styles.matchImages}>
              <Image
                source={{ uri: currentPet.photos?.[0] || 'https://via.placeholder.com/100' }}
                style={[styles.matchImage, styles.matchImageLeft]}
              />
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }} // Pet do usuário
                style={[styles.matchImage, styles.matchImageRight]}
              />
            </View>

            <Text style={styles.matchMessage}>
              Você e a {matchedPet?.name} deram like um no outro!
            </Text>

            <View style={styles.matchButtons}>
              <TouchableOpacity style={styles.sendMessageButton} onPress={handleSendMessage}>
                <Text style={styles.sendMessageButtonText}>Enviar Mensagem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={handleMatchModalClose}>
                <Text style={styles.continueButtonText}>Continuar Deslizando</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 100,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  pageIndicators: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
  },
  indicator: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  petInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
  },
  petName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  petDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petBreed: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  petDistance: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
  },
  infoButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    gap: 48,
    backgroundColor: Colors.backgroundLight,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  passButton: {
    backgroundColor: Colors.error,
  },
  likeButton: {
    backgroundColor: Colors.primary,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  matchModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchModalContent: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  matchTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 24,
  },
  matchImages: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: 192,
    height: 128,
  },
  matchImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  matchImageLeft: {
    position: 'absolute',
    left: 0,
    transform: [{ rotate: '-15deg' }],
  },
  matchImageRight: {
    position: 'absolute',
    right: 0,
    transform: [{ rotate: '15deg' }],
  },
  matchMessage: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  matchButtons: {
    width: '100%',
    gap: 12,
  },
  sendMessageButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  sendMessageButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});