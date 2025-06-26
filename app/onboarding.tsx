import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, ChevronLeft, Sparkles, Users, ShoppingBag, Utensils, ChefHat, MapPin } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      id: 1,
      title: 'Discover Amazing Food',
      subtitle: 'Explore thousands of restaurants, local chefs, and hidden culinary gems',
      image: 'https://static.vecteezy.com/system/resources/previews/014/578/003/non_2x/delicious-food-on-a-wooden-table-free-photo.jpg',
      description: 'From street food to fine dining, discover your next favorite meal',
      icon: Sparkles,
      color: '#FF6B6B',
      features: [
        'Browse without signing up',
        'Real-time restaurant updates',
        'Authentic food reviews'
      ]
    },
    {
      id: 2,
      title: 'Connect with Local Chefs',
      subtitle: 'Book private chefs, learn recipes, and get personalized cooking tips',
      image: 'https://static.vecteezy.com/system/resources/previews/023/337/086/non_2x/ai-generative-professional-chef-cooking-in-kitchen-free-photo.jpg',
      description: 'Get exclusive access to chef secrets and cooking techniques',
      icon: ChefHat,
      color: '#4ECDC4',
      features: [
        'Direct chef communication',
        'Recipe sharing & learning',
        'Cooking masterclasses'
      ]
    },
    {
      id: 3,
      title: 'Smart Food Shopping',
      subtitle: 'Budget-friendly meals, grocery lists, and meal planning made easy',
      image: 'https://static.vecteezy.com/system/resources/previews/023/337/088/non_2x/ai-generative-fresh-vegetables-and-fruits-in-shopping-basket-free-photo.jpg',
      description: 'Save money while eating well with our intelligent recommendations',
      icon: ShoppingBag,
      color: '#45B7D1',
      features: [
        'AI-powered meal planning',
        'Budget tracking & insights',
        'Smart grocery lists'
      ]
    },
    {
      id: 4,
      title: 'World\'s Best Food App',
      subtitle: 'Not just ordering food - your complete culinary companion',
      image: 'https://static.vecteezy.com/system/resources/previews/023/337/087/non_2x/ai-generative-variety-of-international-cuisine-dishes-free-photo.jpg',
      description: 'Join millions of food lovers in the ultimate food discovery experience',
      icon: Utensils,
      color: '#32CD32',
      features: [
        'Global cuisine database',
        'Nutritional insights',
        'Food culture stories'
      ]
    },
  ];

  const currentOnboarding = onboardingSteps[currentStep];
  const IconComponent = currentOnboarding.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)');
  };

  const handleSignUp = () => {
    router.push('/auth');
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Header */}
      <View style={styles.logoHeader}>
        <CustomLogo size="large" color="#006400" />
        <Text style={styles.appTagline}>Your Food Explorer</Text>
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStep ? 
                [styles.progressDotActive, { backgroundColor: currentOnboarding.color }] : 
                styles.progressDotInactive,
            ]}
          />
        ))}
      </View>

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: currentOnboarding.image }} style={styles.image} />
          <View style={[styles.iconOverlay, { backgroundColor: currentOnboarding.color }]}>
            <IconComponent size={28} color="#FFFFFF" />
          </View>
        </View>
        
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: currentOnboarding.color }]}>
            {currentOnboarding.title}
          </Text>
          <Text style={styles.subtitle}>{currentOnboarding.subtitle}</Text>
          <Text style={styles.description}>{currentOnboarding.description}</Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featuresContainer}>
          {currentOnboarding.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: currentOnboarding.color }]} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Navigation & Actions */}
      <View style={styles.bottomSection}>
        {!isLastStep ? (
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.navButton, styles.backButton]}
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={20} color={currentStep === 0 ? '#CCCCCC' : '#006400'} />
              <Text style={[styles.navText, currentStep === 0 && styles.navTextDisabled]}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton, { backgroundColor: currentOnboarding.color }]} 
              onPress={handleNext}
            >
              <Text style={styles.nextText}>Next</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.finalActions}>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.guestButton} onPress={handleSkip}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  appTagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: width * 0.18,
    height: 4,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: '#006400',
  },
  progressDotInactive: {
    backgroundColor: '#D3D3D3',
  },
  skipButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  image: {
    width: width * 0.75,
    height: width * 0.5,
    borderRadius: 20,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -15,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    gap: 8,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    flex: 1,
    justifyContent: 'center',
  },
  nextButton: {
    flex: 2,
    justifyContent: 'center',
  },
  navText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  navTextDisabled: {
    color: '#CCCCCC',
  },
  nextText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  finalActions: {
    gap: 15,
  },
  signUpButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  signInButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 25,
  },
  guestText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});