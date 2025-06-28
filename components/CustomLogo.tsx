import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CustomLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showImage?: boolean;
}

export default function CustomLogo({ size = 'medium', color = '#FFFFFF', showImage = true }: CustomLogoProps) {
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

  const imageSizes = {
    small: { width: 24, height: 24 },
    medium: { width: 32, height: 32 },
    large: { width: 40, height: 40 },
  };

  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        {showImage ? (
          <View style={styles.imageContainer}>
            <Image 
              source={require('@/assets/images/menulogo.webp')} 
              style={[styles.logoImage, imageSizes[size]]}
              resizeMode="contain"
            />
            <Text style={[styles.logoText, sizeStyles[size], { color }]}>
              Menu
              <Text style={[styles.smallS, smallSStyles[size], { color }]}>s</Text>
            </Text>
          </View>
        ) : (
          <Text style={[styles.logoText, sizeStyles[size], { color }]}>
            Menu
            <Text style={[styles.smallS, smallSStyles[size], { color }]}>s</Text>
          </Text>
        )}
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
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    borderRadius: 6,
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
});