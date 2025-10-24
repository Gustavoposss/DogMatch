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
import { useNavigation, useRoute } from '@react-navigation/native';
// Cores inline para evitar problemas de importação
const Colors = {
  primary: '#ee7c2b',
  backgroundLight: '#f8f7f6',
  textLightPrimary: '#1b130d',
  textLightSecondary: '#9a6c4c',
  white: '#FFFFFF',
  surfaceLight: '#ffffff',
  border: '#E1E5E9',
  success: '#4CAF50',
  error: '#F44336',
  like: '#4CAF50',
  dislike: '#F44336',
};
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender: string;
  description: string;
  personality: string[];
  interests: string[];
  photos: string[];
  distance?: string;
}

export default function PetProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [pet, setPet] = useState<Pet | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    // Simular carregamento do pet
    const mockPet: Pet = {
      id: '1',
      name: 'Max',
      age: 2,
      breed: 'Golden Retriever',
      gender: 'Macho',
      description: 'Sou um golden retriever super amigável que adora longas caminhadas no parque, buscar bolinhas e, claro, um bom cochilo no sofá. Estou procurando um amigo para brincar e explorar o mundo!',
      personality: ['Brincalhão', 'Calmo', 'Bom com crianças', 'Sociável'],
      interests: ['Amizades e encontros para brincar'],
      photos: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvJ1nQi455KYGESWlA60Mn-LDbM5trg2eby1lMCcBewmKbV4I4EFk3A2JiTWQj6tqALxoi-wTEaF_0xGP9gfZ-ZlV3foq-7aPyIc1BSZsIchEypyMdvc7T1SA60WAW4dTZYMxt1vUCShffnRPahLMSMPYbmZWVXI7RGFh5TdnOknvOGUmREu76IXZ2mrQrneu4V2frHG-CceP5OU16zp3NeFOEKq2e5RK-kWFzcWaU6LdtuUWzOcMJMop1b7j0benscbydS2kLbRv_',
        'https://via.placeholder.com/400',
        'https://via.placeholder.com/400',
        'https://via.placeholder.com/400',
      ],
      distance: '2km',
    };
    setPet(mockPet);
  }, []);

  const handleLike = () => {
    // Implementar like
    console.log('Like no pet:', pet?.name);
    navigation.goBack();
  };

  const handlePass = () => {
    // Implementar pass
    console.log('Pass no pet:', pet?.name);
    navigation.goBack();
  };

  const nextPhoto = () => {
    if (pet && currentPhotoIndex < pet.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textLightPrimary} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.textLightPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Gallery */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: pet.photos[currentPhotoIndex] }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          
          {/* Photo Indicators */}
          <View style={styles.photoIndicators}>
            {pet.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.photoIndicator,
                  index === currentPhotoIndex && styles.photoIndicatorActive
                ]}
              />
            ))}
          </View>

          {/* Photo Navigation */}
          {pet.photos.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.photoNav, styles.photoNavLeft]}
                onPress={prevPhoto}
                disabled={currentPhotoIndex === 0}
              >
                <Ionicons name="chevron-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoNav, styles.photoNavRight]}
                onPress={nextPhoto}
                disabled={currentPhotoIndex === pet.photos.length - 1}
              >
                <Ionicons name="chevron-forward" size={24} color={Colors.white} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Profile Content */}
        <View style={styles.profileContent}>
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petDetails}>
              {pet.age} anos, {pet.breed}, {pet.gender}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.locationText}>
              A {pet.distance} de distância
            </Text>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre Mim</Text>
            <Text style={styles.sectionText}>{pet.description}</Text>
          </View>

          {/* Personality Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personalidade</Text>
            <View style={styles.tagsContainer}>
              {pet.personality.map((trait, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{trait}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O que procuramos?</Text>
            <View style={styles.interestsContainer}>
              <View style={styles.interestsIcon}>
                <Ionicons name="paw" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.interestsText}>
                {pet.interests[0]}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Ionicons name="close" size={32} color={Colors.dislike} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Ionicons name="heart" size={40} color={Colors.like} />
        </TouchableOpacity>
      </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  photoContainer: {
    height: 400,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  photoIndicators: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  photoIndicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  photoNav: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }],
  },
  photoNavLeft: {
    left: 16,
  },
  photoNavRight: {
    right: 16,
  },
  profileContent: {
    padding: 16,
    paddingBottom: 100,
  },
  basicInfo: {
    marginBottom: 16,
  },
  petName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 18,
    color: Colors.textLightSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(238, 124, 43, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  locationText: {
    fontSize: 16,
    color: Colors.textLightPrimary,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: 'rgba(238, 124, 43, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  interestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  interestsIcon: {
    marginRight: 16,
  },
  interestsText: {
    fontSize: 16,
    color: Colors.textLightPrimary,
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  likeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
