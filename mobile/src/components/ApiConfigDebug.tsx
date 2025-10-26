import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { API_URL, logApiConfig, setCustomIp, getEnvironmentConfig } from '../config/api';
import { Colors } from '../styles/colors';

interface ApiConfigDebugProps {
  visible?: boolean;
}

export const ApiConfigDebug: React.FC<ApiConfigDebugProps> = ({ visible = __DEV__ }) => {
  if (!visible) return null;

  const config = getEnvironmentConfig();

  const handleRefreshConfig = () => {
    logApiConfig();
  };

  const handleSetCustomIp = () => {
    // Exemplo: definir IP customizado
    const newIp = '192.168.1.100'; // Substitua pelo IP desejado
    setCustomIp(newIp);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Configuração da API</Text>
      <Text style={styles.url}>URL: {API_URL}</Text>
      <Text style={styles.env}>Env: {config.environment}</Text>
      <Text style={styles.platform}>Platform: {config.isExpoGo ? 'Expo Go' : config.isEmulator ? 'Emulator' : 'Web'}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleRefreshConfig}>
          <Text style={styles.buttonText}>🔄 Atualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSetCustomIp}>
          <Text style={styles.buttonText}>🌐 IP Custom</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  title: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  url: {
    color: Colors.primary,
    fontSize: 10,
    marginBottom: 4,
  },
  env: {
    color: Colors.secondary,
    fontSize: 9,
    marginBottom: 2,
  },
  platform: {
    color: Colors.secondary,
    fontSize: 9,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 10,
  },
});
