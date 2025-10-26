import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({ 
  width = 120, 
  height = 120, 
  color = Colors.primary,
  style 
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={[styles.logoShape, { backgroundColor: color }]}>
        <Text style={styles.logoText}>🐾</Text>
      </View>
    </View>
  );
};

// Logo simplificada para uso em headers
export const LogoIcon: React.FC<LogoProps> = ({ 
  width = 32, 
  height = 32, 
  color = Colors.primary,
  style 
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={[styles.iconShape, { backgroundColor: color }]}>
        <Text style={styles.iconText}>🐾</Text>
      </View>
    </View>
  );
};

// Logo com gradiente (usando cores da identidade visual)
export const LogoGradient: React.FC<LogoProps> = ({ 
  width = 120, 
  height = 120, 
  style 
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.gradientContainer}>
        <View style={[styles.gradientShape, { backgroundColor: Colors.primary }]}>
          <Text style={styles.logoText}>🐾</Text>
        </View>
        <View style={[styles.gradientAccent, { backgroundColor: Colors.secondary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShape: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconShape: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gradientShape: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '10%',
    left: '10%',
    zIndex: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientAccent: {
    width: '60%',
    height: '60%',
    borderRadius: 15,
    position: 'absolute',
    top: '20%',
    right: '10%',
    zIndex: 1,
    opacity: 0.7,
  },
  logoText: {
    fontSize: 48,
    color: Colors.white,
  },
  iconText: {
    fontSize: 20,
    color: Colors.white,
  },
});