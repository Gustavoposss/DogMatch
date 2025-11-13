import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/authService';
import { petService } from '../services/petService';
import { useAuth } from '../contexts/AuthContext';
import { Pet } from '../types';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { LogoIcon } from '../components/Logo';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { signOut, state } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      loadUserPets();
    }, [state.user?.id])
  );

  const loadUserData = async () => {
    // Os dados do usuário já estão disponíveis no contexto
    // Não precisamos carregar novamente
  };

  const loadUserPets = async () => {
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

  const handleFindFriends = () => {
    navigation.navigate('Swipe' as never);
  };

  const handleConversations = () => {
    navigation.navigate('Matches' as never);
  };

  const handleEditProfile = () => {
    navigation.navigate('Settings' as never);
  };

  const handleAddPet = () => {
    navigation.navigate('AddPet' as never);
  };

  const handlePetPress = (pet: Pet) => {
    console.log('Pet selecionado:', pet.name);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // A navegação será automática através do AuthContext
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const renderPetCard = (pet: Pet) => (
    <TouchableOpacity
      key={pet.id}
      style={styles.petCard}
      onPress={() => handlePetPress(pet)}
    >
      <Image
        source={{ uri: pet.photos?.[0] || 'https://via.placeholder.com/120' }}
        style={styles.petImage}
        resizeMode="cover"
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LogoIcon width={32} height={32} />
        </View>
        <Text style={styles.headerTitle}>Par de Patas</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.logoContainer}>
              <LogoIcon width={64} height={64} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Olá, {state.user?.name || 'Usuário'}!</Text>
              <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* My Pack Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Matilha</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.petsScrollView}
            contentContainerStyle={styles.petsContainer}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando pets...</Text>
              </View>
            ) : (
              <>
                {pets.map(renderPetCard)}
                <TouchableOpacity style={styles.addPetCard} onPress={handleAddPet}>
                  <View style={styles.addPetContent}>
                    <Ionicons name="add-circle" size={32} color={Colors.textLight} />
                    <Text style={styles.addPetText}>Adicionar Pet</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleFindFriends}>
            <Ionicons name="heart" size={24} color={Colors.white} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Encontrar novos amigos!</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleConversations}>
            <Ionicons name="chatbubbles" size={24} color={Colors.primary} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Minhas conversas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerLeft: {
    width: 48,
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primary,
    fontFamily: Fonts.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.grayLight,
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.primary,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.secondary,
  },
  editButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Fonts.secondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    fontFamily: Fonts.primary,
  },
  petsScrollView: {
    paddingLeft: Spacing.lg,
  },
  petsContainer: {
    paddingRight: Spacing.lg,
  },
  loadingContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.secondary,
  },
  petCard: {
    width: 160,
    marginRight: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  petImage: {
    width: '100%',
    height: 120,
  },
  petInfo: {
    padding: Spacing.md,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.primary,
  },
  petBreed: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.secondary,
  },
  addPetCard: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grayLight,
  },
  addPetContent: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addPetText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    fontFamily: Fonts.secondary,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Fonts.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Fonts.primary,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
});