import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Store, Phone, MapPin, Clock, Wifi, CheckCircle, ChefHat } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function VendorSignUpStep2() {
  const { fullName, email, password, role } = useLocalSearchParams();
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessType, setBusinessType] = useState('restaurant');
  const [operatingHours, setOperatingHours] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();

  const businessTypes = [
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'chef', name: 'Private Chef', icon: '👨‍🍳' },
  ];

  const validateForm = () => {
    if (!businessName || !phone || !address || !operatingHours) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number (10-11 digits)');
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
        role as string
      );

      if (error) {
        if (error.message?.includes('User already registered')) {
          Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.');
          router.push('/auth');
        } else {
          Alert.alert('Sign Up Error', error.message || 'Failed to create account. Please try again.');
        }
      } else {
        Alert.alert(
          'Kitchen Partner Account Created!', 
          'Welcome to Menu! Your kitchen partner account has been created. You can now start managing your food business.',
          [{ text: 'Get Started', onPress: () => router.push('/vendor-dashboard') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Vendor sign up error:', error);
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
          <View style={styles.logoContainer}>
            <CustomLogo size="medium" color="#FFFFFF" />
            <View style={styles.chefBadge}>
              <ChefHat size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.tagline}>Business Setup</Text>
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

      <View style={styles.content}>
        <Text style={styles.title}>Setup Your Kitchen</Text>
        <Text style={styles.subtitle}>
          Tell us about your culinary business
        </Text>

        {/* Account Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <CheckCircle size={20} color="#3F51B5" />
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
            <Text style={styles.summaryValue}>Kitchen Partner</Text>
          </View>
        </View>

        {/* Business Type Selection */}
        <View style={styles.businessTypeContainer}>
          <Text style={styles.businessTypeTitle}>Business Type</Text>
          <View style={styles.businessTypeGrid}>
            {businessTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.businessTypeCard,
                  businessType === type.id && styles.businessTypeCardActive
                ]}
                onPress={() => setBusinessType(type.id)}
              >
                <Text style={styles.businessTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.businessTypeName,
                  businessType === type.id && styles.businessTypeNameActive
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Business Name Input */}
        <View style={styles.inputContainer}>
          <Store size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Business/Restaurant name"
            value={businessName}
            onChangeText={setBusinessName}
            editable={!isLoading}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Phone size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Business phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <MapPin size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Business address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            editable={!isLoading}
          />
        </View>

        {/* Operating Hours Input */}
        <View style={styles.inputContainer}>
          <Clock size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Operating hours (e.g., 9:00 AM - 10:00 PM)"
            value={operatingHours}
            onChangeText={setOperatingHours}
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
              <Text style={styles.loadingText}>Creating Kitchen Partner Account...</Text>
            </View>
          ) : (
            <Text style={styles.createButtonText}>Start My Kitchen Journey</Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By creating a kitchen partner account, you agree to our{' '}
          <Text style={styles.termsLink}>Kitchen Partner Terms</Text>,{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
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
  logoContainer: {
    position: 'relative',
  },
  chefBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#3F51B5',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 8,
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
    backgroundColor: '#3F51B5',
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
  businessTypeContainer: {
    marginBottom: 20,
  },
  businessTypeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  businessTypeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  businessTypeCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D3D3D3',
  },
  businessTypeCardActive: {
    backgroundColor: '#E8F0FF',
    borderColor: '#3F51B5',
  },
  businessTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  businessTypeName: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#666666',
  },
  businessTypeNameActive: {
    color: '#3F51B5',
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
    backgroundColor: '#3F51B5',
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
    color: '#3F51B5',
    fontFamily: 'Inter-Semibold',
  },
});