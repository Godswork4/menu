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
    small: { fontSize: 14, top: -6, right: -2 },
    medium: { fontSize: 18, top: -8, right: -3 },
    large: { fontSize: 24, top: -10, right: -4 },
  };

  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        <Text style={[styles.logoText, sizeStyles[size], { color }]}>
          Men
          <Text style={[styles.logoText, sizeStyles[size], { color, fontStyle: 'italic' }]}>u</Text>
        </Text>
        
        {/* Subtle Christian Cross using fork and knife positioned as cross */}
        <View style={[
          styles.crossContainer,
          { 
            top: crossSizes[size].top,
            right: crossSizes[size].right,
          }
        ]}>
          {/* Vertical line of cross (fork) */}
          <Text style={[
            styles.verticalCross, 
            { 
              fontSize: crossSizes[size].fontSize,
              color: color,
              opacity: 0.7,
            }
          ]}>
            🍴
          </Text>
          {/* Horizontal line of cross (knife) */}
          <Text style={[
            styles.horizontalCross, 
            { 
              fontSize: crossSizes[size].fontSize * 0.8,
              color: color,
              opacity: 0.6,
            }
          ]}>
            🔪
          </Text>
        </View>
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
    fontStyle: 'italic',
  },
  crossContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalCross: {
    position: 'absolute',
    transform: [{ rotate: '0deg' }],
    textShadowColor: 'rgba(0, 100, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  horizontalCross: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
    textShadowColor: 'rgba(0, 100, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});