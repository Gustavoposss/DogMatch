import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Pet } from '../types';
import { Colors, Fonts } from '../styles/colors';

interface MatchPopupProps {
  visible: boolean;
  pet1: Pet;
  pet2: Pet;
  onSendMessage: () => void;
  onContinueSwiping: () => void;
}

export default function MatchPopup({ 
  visible, 
  pet1, 
  pet2, 
  onSendMessage, 
  onContinueSwiping 
}: MatchPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>It's a Match!</Text>
          
          <View style={styles.petsContainer}>
            <View style={styles.petContainer}>
              <Image
                source={{ uri: pet1.photos?.[0] || 'https://via.placeholder.com/80' }}
                style={styles.petImage}
              />
            </View>
            
            <View style={styles.petContainer}>
              <Image
                source={{ uri: pet2.photos?.[0] || 'https://via.placeholder.com/80' }}
                style={styles.petImage}
              />
            </View>
          </View>
          
          <Text style={styles.matchText}>
            Você e a {pet2.name} deram like um no outro!
          </Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.sendMessageButton}
              onPress={onSendMessage}
            >
              <Text style={styles.sendMessageButtonText}>Enviar Mensagem</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={onContinueSwiping}
            >
              <Text style={styles.continueButtonText}>Continuar Deslizando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.primary,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  petsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  petContainer: {
    marginHorizontal: 10,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  matchText: {
    fontSize: 16,
    fontFamily: Fonts.secondary,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
  },
  sendMessageButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  sendMessageButtonText: {
    fontSize: 16,
    fontFamily: Fonts.secondary,
    fontWeight: 'bold',
    color: Colors.white,
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: Fonts.secondary,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
