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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Shadows } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { swipeService } from '../services/swipeService';
import { useAuth } from '../contexts/AuthContext';

interface Match {
  id: string;
  petA: {
    id: string;
    name: string;
    photoUrl: string;
    breed: string;
    age: number;
    gender: string;
    size: string;
    objective: string;
    isNeutered: boolean;
  };
  petB: {
    id: string;
    name: string;
    photoUrl: string;
    breed: string;
    age: number;
    gender: string;
    size: string;
    objective: string;
    isNeutered: boolean;
  };
  userAId: string;
  userBId: string;
  createdAt: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    isFromUser: boolean;
  };
  isNewMatch?: boolean;
}

export default function MatchesScreen() {
  const navigation = useNavigation();
  const { state } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      if (state.user && state.user.id) {
        const response = await swipeService.getMatchesByUser(state.user.id);
        console.log('Resposta completa:', response);
        
        // Verificar se response é um array direto ou tem propriedade matches
        let matchesData = [];
        if (Array.isArray(response)) {
          matchesData = response;
        } else if (response && response.matches && Array.isArray(response.matches)) {
          matchesData = response.matches;
        }
        
        console.log('Matches processados:', matchesData);
        
        if (matchesData.length > 0) {
          setMatches(matchesData);
        } else {
          // Nenhum match encontrado - deixar array vazio
          setMatches([]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };


  const handleMatchPress = (match: Match) => {
    // Determinar qual pet é o "outro" (não do usuário atual)
    const currentUserId = state.user?.id;
    const otherPet = match.petA.ownerId === currentUserId ? match.petB : match.petA;
    
    navigation.navigate('Chat' as never, {
      matchId: match.id,
      petName: otherPet.name,
      petImage: otherPet.photoUrl,
    } as never);
  };

  const handleSearch = () => {
    // Implementar busca
    console.log('Buscar matches');
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  const renderMatchItem = ({ item }: { item: Match }) => {
    // Determinar qual pet é do outro usuário (não do usuário atual)
    const currentUserId = state.user?.id;
    const otherPet = item.userAId === currentUserId ? item.petB : item.petA;
    const isNewMatch = item.isNewMatch;
    
    return (
      <TouchableOpacity
        style={styles.matchItem}
        onPress={() => handleMatchPress(item)}
      >
        <View style={styles.matchImageContainer}>
          <Image
            source={{ uri: otherPet.photoUrl || 'https://via.placeholder.com/64' }}
            style={styles.matchImage}
            resizeMode="cover"
          />
          {isNewMatch && <View style={styles.newMatchIndicator} />}
        </View>
        
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{otherPet.name}</Text>
          <Text style={styles.matchBreed}>{otherPet.breed} • {otherPet.age} anos</Text>
          <Text style={[
            styles.matchMessage,
            isNewMatch && styles.newMatchMessage
          ]}>
            {item.lastMessage?.text || 'Nova conversa'}
          </Text>
        </View>
        
        {item.lastMessage && (
          <Text style={styles.matchTime}>
            {formatTime(item.lastMessage.timestamp)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.grayLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="paw" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Seus Matches</Text>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Matches List */}
      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color={Colors.gray} />
          <Text style={styles.emptyTitle}>Nenhum match ainda</Text>
          <Text style={styles.emptyText}>
            Comece a curtir pets para encontrar matches!
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Swipe' as never)}
          >
            <Text style={styles.emptyButtonText}>Explorar Pets</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.matchesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.grayLight,
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
    color: Colors.textPrimary,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchesList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    marginHorizontal: 8,
    borderRadius: 12,
    marginVertical: 4,
  },
  matchImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  matchImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  newMatchIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.grayLight,
  },
  matchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  matchBreed: {
    fontFamily: Fonts.secondary,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  matchMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  newMatchMessage: {
    color: Colors.primary,
    fontWeight: '500',
  },
  matchTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: Fonts.primary,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontFamily: Fonts.secondary,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  emptyButtonText: {
    fontFamily: Fonts.primary,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
});