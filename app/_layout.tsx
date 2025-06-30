import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { Image, View, StyleSheet } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Semibold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('../assets/images/menulogo copy.webp')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="signup-step1" />
        <Stack.Screen name="vendor-signup" />
        <Stack.Screen name="vendor-dashboard" />
        <Stack.Screen name="add-food-item" />
        <Stack.Screen name="edit-food-item" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="food-detail" />
        <Stack.Screen name="category-detail" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="settings/profile" />
        <Stack.Screen name="settings/addresses" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/payments" />
        <Stack.Screen name="settings/appearance" />
        <Stack.Screen name="settings/language" />
        <Stack.Screen name="settings/security" />
        <Stack.Screen name="settings/device" />
        <Stack.Screen name="settings/help" />
        <Stack.Screen name="settings/about" />
        <Stack.Screen name="budget-analytics" />
        <Stack.Screen name="budget-goals" />
        <Stack.Screen name="budget-management" />
        <Stack.Screen name="meal-planning" />
        <Stack.Screen name="scheduled-orders" />
        <Stack.Screen name="market" />
        <Stack.Screen name="supermarket" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#006400" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  splashLogo: {
    width: 120,
    height: 120,
  },
});