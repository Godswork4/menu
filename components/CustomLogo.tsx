import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CustomLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  useImage?: boolean;
}

export default function CustomLogo({ size = 'medium', color = '#FFFFFF', useImage = false }: CustomLogoProps) {
  if (useImage) {
    const logoSizes = {
      small: { width: 24, height: 24 },
      medium: { width: 32, height: 32 },
      large: { width: 48, height: 48 },
    };
    
    return (
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/menulogo copy.webp')} 
          style={[styles.logoImage, logoSizes[size]]}
          resizeMode="contain"
        />
      </View>
    );
  }

  const sizeStyles = {
    small: { fontSize: 18 },
    medium: { fontSize: 24 },
    large: { fontSize: 32 },
  };

  const smallSStyles = {
    small: { fontSize: 12 },
    medium: { fontSize: 16 },
    large: { fontSize: 22 },
  };

  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        <Text style={[styles.logoText, sizeStyles[size], { color }]}>
          Menu
          <Text style={[styles.smallS, smallSStyles[size], { color }]}>s</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'relative',
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  smallS: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    opacity: 0.8,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
});