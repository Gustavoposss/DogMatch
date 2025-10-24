import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
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

export default function PaymentFailureScreen() {
  const navigation = useNavigation();

  const handleTryAgain = () => {
    navigation.navigate('PaymentPix' as never);
  };

  const handleSupport = () => {
    // Implementar suporte
    console.log('Abrir suporte');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={Colors.textLightPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Error Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbrHKRDxP-D3DrnVGRARr14DkxIldfg2RJS1kVyv5-c7a5lanpdX2M8FFkgYgZr8j6gJOECtCxVDKQ-sSfyr6FbM_b3Hl9wREHCILSirzetrsbw3cINeCVctjVdTPPYqNke7g654IEZReyDkh7kvPfTHWzUKvQ_uaM9p6yuOtvNRqh6A18WdS70YlcYzOm2JMBIc9ylnfM3Ra1LFTbOT4kcAdeNVV_CIG6X45IGNfrg2mHTLSG5tdeYGWhvS4ZAU3bMP-U1IP00Xka' }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Error Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Ih, deu patinha fora!</Text>
          <Text style={styles.message}>
            Não conseguimos processar sua transação. Verifique seus dados de pagamento e tente novamente.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
            <Text style={styles.tryAgainButtonText}>Tentar de Novo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportButton} onPress={handleSupport}>
            <Text style={styles.supportButtonText}>Precisa de ajuda? Fale com o suporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundLight,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    marginBottom: 24,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  tryAgainButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tryAgainButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  supportButton: {
    paddingVertical: 8,
  },
  supportButtonText: {
    color: 'rgba(238, 124, 43, 0.9)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});