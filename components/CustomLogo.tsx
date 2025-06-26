import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CustomLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function CustomLogo({ size = 'medium', color = '#FFFFFF' }: CustomLogoProps) {
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
});