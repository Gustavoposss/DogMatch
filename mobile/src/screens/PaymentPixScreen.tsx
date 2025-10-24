import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
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

export default function PaymentPixScreen() {
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    generatePixCode();
    startTimer();
  }, []);

  const generatePixCode = () => {
    // Simular geração de código PIX
    const mockPixCode = '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-42661417400052040000530398654041.005802BR5913Teste Pagamento6008Brasilia62070503***6304';
    setPixCode(mockPixCode);
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = async () => {
    try {
      // Aqui você implementaria a cópia para clipboard
      Alert.alert('Código copiado!', 'O código PIX foi copiado para a área de transferência.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o código.');
    }
  };

  const renderInstructions = () => (
    <View style={styles.instructionsContainer}>
      <View style={styles.instructionItem}>
        <View style={styles.instructionNumber}>
          <Text style={styles.instructionNumberText}>1</Text>
        </View>
        <Text style={styles.instructionText}>
          Abra o app do seu banco e escolha a área PIX.
        </Text>
      </View>
      
      <View style={styles.instructionItem}>
        <View style={styles.instructionNumber}>
          <Text style={styles.instructionNumberText}>2</Text>
        </View>
        <Text style={styles.instructionText}>
          Escaneie o QR code ou cole a chave PIX.
        </Text>
      </View>
      
      <View style={styles.instructionItem}>
        <View style={styles.instructionNumber}>
          <Text style={styles.instructionNumberText}>3</Text>
        </View>
        <Text style={styles.instructionText}>
          Confira os dados e confirme o pagamento.
        </Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Finalize seu Pagamento</Text>
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.orderItem}>
            <Text style={styles.orderLabel}>Plano</Text>
            <Text style={styles.orderValue}>Plano Au-Migo Premium</Text>
          </View>
          <View style={styles.orderItem}>
            <Text style={styles.orderLabel}>Valor Total</Text>
            <Text style={[styles.orderValue, styles.orderPrice]}>R$ 19,90</Text>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Pague com QR Code</Text>
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARreM-edDRf82_wRR3_ZW87X-ZOd5uwx3ug2eUCCSEEU2ejfZ4FTlzUSlnPUDoVK38mV1z4GlA9dCYc0EhBFIwYNj_jrZqiLw2oO7JK7YCFH8naI-d0xQV0Tz9aOABvHn3mpC4Zq7C4hbzyA-KXdzl7-DHVPSdgcz9KdDuzeilQhx7vhg6Ss5YJAU-u0GkpLfuDeRIJWdXdcx3NfD2IJ8bRL0yohmrCIvGuXtKhFgAKVMbYBcbL8mYfmDBWxayWTrS1rySewLT3G3l' }}
              style={styles.qrCode}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={16} color={Colors.textLightSecondary} />
          <Text style={styles.timerText}>
            Este código expira em <Text style={styles.timerBold}>{formatTime(timeLeft)}</Text>
          </Text>
        </View>

        {/* PIX Copy and Paste */}
        <View style={styles.pixSection}>
          <Text style={styles.pixTitle}>Ou use o PIX Copia e Cola</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Ionicons name="copy" size={20} color={Colors.white} />
            <Text style={styles.copyButtonText}>Copiar código</Text>
          </TouchableOpacity>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <Ionicons name="refresh" size={16} color={Colors.primary} style={styles.spinningIcon} />
          <Text style={styles.statusText}>Aguardando confirmação do pagamento...</Text>
        </View>

        {/* Instructions */}
        {renderInstructions()}
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
    alignItems: 'center',
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.textLightPrimary,
    marginRight: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24,
  },
  orderSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  orderLabel: {
    fontSize: 14,
    color: Colors.textLightSecondary,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLightPrimary,
  },
  orderPrice: {
    color: Colors.primary,
  },
  qrSection: {
    alignItems: 'center',
    gap: 8,
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
  },
  qrContainer: {
    width: 240,
    height: 240,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textLightSecondary,
  },
  timerBold: {
    fontWeight: 'bold',
  },
  pixSection: {
    alignItems: 'center',
    gap: 16,
  },
  pixTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLightPrimary,
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  copyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(238, 124, 43, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 8,
  },
  spinningIcon: {
    // Animação seria implementada com Animated
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(248, 247, 246, 0.8)',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(238, 124, 43, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    flex: 1,
    paddingTop: 4,
  },
});