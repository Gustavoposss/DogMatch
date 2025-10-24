import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
};
import { Ionicons } from '@expo/vector-icons';

export default function PaymentSuccessScreen() {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Navegar para a tela principal
    navigation.navigate('MainTabNavigator' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={112} color="#2ECC71" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Pagamento Aprovado!</Text>
        <Text style={styles.message}>
          Sua assinatura foi ativada. Agora seu pet tem acesso ilimitado a todos os recursos premium. Boa paquera!
        </Text>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Procurar novos AUmigos</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: 'rgba(27, 19, 13, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: Colors.textLightPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});