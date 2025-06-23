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

  const crossSizes = {
    small: { fontSize: 12, top: -2, right: -1 },
    medium: { fontSize: 16, top: -3, right: -2 },
    large: { fontSize: 20, top: -4, right: -3 },
  };

  return (
    <View style={styles.logoContainer}>
      <Text style={[styles.logoText, sizeStyles[size], { color }]}>
        Men
        <View style={styles.uContainer}>
          <Text style={[styles.logoText, sizeStyles[size], { color, fontStyle: 'italic' }]}>u</Text>
          {/* Subtle cross using fork and spoon symbols */}
          <View style={[
            styles.crossContainer,
            { 
              top: crossSizes[size].top,
              right: crossSizes[size].right,
            }
          ]}>
            <Text style={[
              styles.forkSpoon, 
              { 
                fontSize: crossSizes[size].fontSize,
                color: color,
                opacity: 0.8,
              }
            ]}>
              🍴
            </Text>
          </View>
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
  crossContainer: {
    position: 'absolute',
    transform: [{ rotate: '15deg' }, { scale: 0.8 }],
  },
  forkSpoon: {
    textShadowColor: 'rgba(0, 100, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});