import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, MapPin, Calendar, Wifi, User, Mail, CheckCircle } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpStep2() {
  const { fullName, email, password, role } = useLocalSearchParams();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();

  useEffect(() => {
    // Validate that we have the required params
    if (!fullName || !email || !password) {
      Alert.alert(
        'Missing Information',
        'Required information is missing. Please go back and complete step 1.',
        [{ text: 'Go Back', onPress: () => router.push('/signup-step1') }]
      );
    }
  }, [fullName, email, password]);

  const validateForm = () => {
    if (!phone) {
      Alert.alert('Missing Information', 'Please enter your phone number.');
      return false;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number (10-11 digits).');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await signUp(
        email as string, 
        password as string, 
        fullName as string, 
        role as string || 'customer'
      );

      if (error) {
        if (error.message?.includes('User already registered')) {
          Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.');
          router.push('/auth');
        } else {
          Alert.alert('Sign Up Error', error.message || 'Failed to create account. Please try again.');
        }
      } else {
        // Update profile with additional information
        // This would typically be done in a separate API call
        
        Alert.alert(
          'Account Created!', 
          'Welcome to Menu! Your account has been created successfully.',
          [{ text: 'Continue', onPress: () => router.push('/(tabs)') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>12:07 AM</Text>
        <View style={styles.statusIcons}>
          <View style={styles.signalContainer}>
            <View style={[styles.signalBar, styles.signalBar1]} />
            <View style={[styles.signalBar, styles.signalBar2]} />
            <View style={[styles.signalBar, styles.signalBar3]} />
            <View style={[styles.signalBar, styles.signalBar4]} />
          </View>
          <Wifi size={16} color="#FFFFFF" />
          <View style={styles.batteryContainer}>
            <View style={styles.batteryBody}>
              <View style={styles.batteryLevel} />
            </View>
            <View style={styles.batteryTip} />
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.tagline}>Complete Your Profile</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Step 2 of 2</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Almost There!</Text>
        <Text style={styles.subtitle}>
          Add a few more details to complete your profile
        </Text>

        {/* Account Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <CheckCircle size={20} color="#32CD32" />
            <Text style={styles.summaryTitle}>Account Details</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>{fullName}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Email:</Text>
            <Text style={styles.summaryValue}>{email}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Role:</Text>
            <Text style={styles.summaryValue}>{role === 'vendor' ? 'Kitchen Partner' : 'Food Lover'}</Text>
          </View>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Phone size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        </View>

        {/* Address Input (Optional) */}
        <View style={styles.inputContainer}>
          <MapPin size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Address (Optional)"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            editable={!isLoading}
          />
        </View>

        {/* Birthdate Input (Optional) */}
        <View style={styles.inputContainer}>
          <Calendar size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Birthdate (Optional, YYYY-MM-DD)"
            value={birthdate}
            onChangeText={setBirthdate}
            editable={!isLoading}
          />
        </View>

        {/* Create Account Button */}
        <TouchableOpacity 
          style={[styles.createButton, isLoading && styles.createButtonDisabled]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingText}>Creating Account...</Text>
            </View>
          ) : (
            <Text style={styles.createButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By creating an account, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#006400',
  },
  time: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  signalBar: {
    backgroundColor: '#FFFFFF',
    width: 3,
  },
  signalBar1: {
    height: 4,
  },
  signalBar2: {
    height: 6,
  },
  signalBar3: {
    height: 8,
  },
  signalBar4: {
    height: 10,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    width: 22,
    height: 11,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    padding: 1,
  },
  batteryLevel: {
    flex: 1,
    backgroundColor: '#32CD32',
    borderRadius: 1,
    width: '80%',
  },
  batteryTip: {
    width: 2,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    marginLeft: 1,
  },
  header: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  createButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 30,
  },
  termsLink: {
    color: '#006400',
    fontFamily: 'Inter-Semibold',
  },
});