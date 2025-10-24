import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../styles/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
  style?: any;
}

export default function GradientBackground({ 
  children, 
  colors = Colors.gradient.primary,
  style 
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={colors}
      style={[{ flex: 1 }, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
