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
import { Pet } from '../types';
import { Colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface RouteParams {
  pet?: Pet;
}

export default function PetProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [pet, setPet] = useState<Pet | null>(null);
  // Removido: Backend usa apenas photoUrl (string), não photos (array)

  useEffect(() => {
    // Obter pet dos parâmetros da rota
    const params = route.params as RouteParams | undefined;
    if (params?.pet) {
      setPet(params.pet);
    }
  }, [route.params]);

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
    // Backend usa apenas uma foto (photoUrl), não há múltiplas fotos
    // Esta função não é mais necessária, mas mantida para compatibilidade
  };

  const prevPhoto = () => {
    // Backend usa apenas uma foto (photoUrl), não há múltiplas fotos
    // Esta função não é mais necessária, mas mantida para compatibilidade
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
        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: pet.photoUrl || 'https://via.placeholder.com/400' }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
        </View>

        {/* Profile Content */}
        <View style={styles.profileContent}>
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petDetails}>
              {pet.age} anos, {pet.breed}, {
                pet.gender === 'M' || pet.gender === 'MACHO' ? 'Macho' :
                pet.gender === 'F' || pet.gender === 'FEMEA' ? 'Fêmea' :
                pet.gender
              }
            </Text>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre Mim</Text>
            <Text style={styles.sectionText}>{pet.description || 'Sem descrição disponível'}</Text>
          </View>

          {/* Objective */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objetivo</Text>
            <View style={styles.interestsContainer}>
              <View style={styles.interestsIcon}>
                <Ionicons name="paw" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.interestsText}>
                {pet.objective === 'amizade' || pet.objective === 'AMIZADE' ? 'Amizade' :
                 pet.objective === 'cruzamento' || pet.objective === 'CRUZAMENTO' ? 'Cruzamento' :
                 pet.objective === 'adocao' || pet.objective === 'ADOCAO' ? 'Adoção' :
                 pet.objective}
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
  // Removido: photoIndicators e photoNav - backend usa apenas uma foto (photoUrl)
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
  // Removido: locationContainer - backend não fornece distância
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
  // Removido: tagsContainer - backend não fornece personality tags
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
