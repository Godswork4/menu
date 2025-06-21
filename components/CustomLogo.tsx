import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function CustomLogo({ size = 'medium', color = '#FFFFFF' }: CustomLogoProps) {
  const sizeStyles = {
    small: { fontSize: 20 },
    medium: { fontSize: 28 },
    large: { fontSize: 36 },
  };

  const leafSizes = {
    small: { fontSize: 14, top: -4, right: -2 },
    medium: { fontSize: 18, top: -5, right: -3 },
    large: { fontSize: 24, top: -6, right: -4 },
  };

  return (
    <View style={styles.logoContainer}>
      <Text style={[styles.logoText, sizeStyles[size], { color }]}>
        Men
        <View style={styles.uContainer}>
          <Text style={[styles.logoText, sizeStyles[size], { color, fontStyle: 'italic' }]}>u</Text>
          <Text style={[
            styles.leaf, 
            { 
              fontSize: leafSizes[size].fontSize,
              top: leafSizes[size].top,
              right: leafSizes[size].right,
            }
          ]}>
            🌿
          </Text>
        </View>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    position: 'relative',
    fontStyle: 'italic',
  },
  uContainer: {
    position: 'relative',
    display: 'inline-flex',
  },
  leaf: {
    position: 'absolute',
    transform: [{ rotate: '-25deg' }, { scale: 1.2 }],
    textShadowColor: 'rgba(0, 100, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});