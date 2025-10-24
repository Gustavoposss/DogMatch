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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
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

  useFocusEffect(
    React.useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    try {
      setLoading(true);
      if (state.user && state.user.id) {
        const response = await swipeService.getPetsToSwipe(state.user.id);
        if (response && response.pets) {
          setPets(response.pets);
          setCurrentIndex(0);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex < pets.length) {
      const pet = pets[currentIndex];
      try {
        const response = await swipeService.likePet(pet.id);
        if (response && response.isMatch) {
          setMatchedPet(pet);
          setShowMatchModal(true);
        }
        setCurrentIndex(currentIndex + 1);
      } catch (error) {
        console.error('Erro ao dar like:', error);
      }
    }
  };

  const handlePass = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSuperLike = async () => {
    if (currentIndex < pets.length) {
      const pet = pets[currentIndex];
      try {
        const response = await swipeService.likePet(pet.id);
        if (response && response.isMatch) {
          setMatchedPet(pet);
          setShowMatchModal(true);
        }
        setCurrentIndex(currentIndex + 1);
      } catch (error) {
        console.error('Erro ao dar super like:', error);
      }
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMatchModalClose = () => {
    setShowMatchModal(false);
    setMatchedPet(null);
  };

  const handleSendMessage = () => {
    setShowMatchModal(false);
    navigation.navigate('Chat' as never, { pet: matchedPet } as never);
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

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="paw" size={64} color={Colors.primary} />
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
        <Text style={styles.headerTitle}>pinder</Text>
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

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUndo}>
          <View style={[styles.actionButtonInner, styles.undoButton]}>
            <Ionicons name="arrow-undo" size={24} color={Colors.undo} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePass}>
          <View style={[styles.actionButtonInner, styles.passButton]}>
            <Ionicons name="close" size={28} color={Colors.dislike} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSuperLike}>
          <View style={[styles.actionButtonInner, styles.superLikeButton]}>
            <Ionicons name="star" size={24} color={Colors.superlike} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <View style={[styles.actionButtonInner, styles.likeButton]}>
            <Ionicons name="heart" size={28} color={Colors.like} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Match Modal */}
      {showMatchModal && (
        <View style={styles.matchModal}>
          <View style={styles.matchModalContent}>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            
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
      )}
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
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundLight,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  undoButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  passButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  superLikeButton: {
    backgroundColor: 'rgba(103, 58, 183, 0.2)',
  },
  likeButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  matchModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
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