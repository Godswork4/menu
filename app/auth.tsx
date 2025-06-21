import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, Truck, Store, Mail, Lock, Eye, EyeOff, ArrowLeft, Wifi } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn } = useAuth();

  const userRoles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Explore restaurants, order food, and discover recipes',
      icon: User,
      color: '#006400',
      available: true,
    },
    {
      id: 'delivery',
      title: 'Delivery Partner',
      description: 'Deliver food and earn money on your schedule',
      icon: Truck,
      color: '#FF8F00',
      available: false,
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Sell your food, manage your restaurant or kitchen',
      icon: Store,
      color: '#3F51B5',
      available: false,
    },
  ];

  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!isLogin && !fullName) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    if (!isLogin && selectedRole !== 'customer') {
      Alert.alert('Coming Soon', `${userRoles.find(r => r.id === selectedRole)?.title} registration will be available soon. Please sign up as a Customer for now.`);
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          Alert.alert('Sign In Error', error.message || 'Failed to sign in. Please check your credentials.');
        } else {
          Alert.alert(
            'Welcome Back!', 
            'You have successfully signed in.',
            [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
          );
        }
      } else {
        const { error } = await signUp(email, password, fullName, selectedRole);
        if (error) {
          if (error.message?.includes('User already registered')) {
            Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.');
            setIsLogin(true);
          } else {
            Alert.alert('Sign Up Error', error.message || 'Failed to create account. Please try again.');
          }
        } else {
          Alert.alert(
            'Account Created Successfully!', 
            'Welcome to Menu! Your account has been created and you can now start exploring delicious food options.',
            [{ text: 'Get Started', onPress: () => router.push('/(tabs)') }]
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
  };

  const handleGuestMode = () => {
    router.push('/(tabs)');
  };

  const handleRoleSelection = (roleId: string) => {
    const role = userRoles.find(r => r.id === roleId);
    if (!role?.available) {
      Alert.alert('Coming Soon', `${role?.title} registration will be available soon. Please choose Customer for now.`);
      return;
    }
    setSelectedRole(roleId);
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
          <CustomLogo size="large" color="#FFFFFF" />
          <Text style={styles.tagline}>Your Food Explorer</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin 
            ? 'Sign in to continue your food journey'
            : 'Join us to explore amazing food experiences'
          }
        </Text>

        {!isLogin && (
          <>
            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.roleTitle}>I want to join as:</Text>
              <View style={styles.rolesGrid}>
                {userRoles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <TouchableOpacity
                      key={role.id}
                      style={[
                        styles.roleCard,
                        selectedRole === role.id && styles.roleCardActive,
                        !role.available && styles.roleCardDisabled,
                      ]}
                      onPress={() => handleRoleSelection(role.id)}
                    >
                      <View style={styles.roleCardHeader}>
                        <IconComponent
                          size={24}
                          color={selectedRole === role.id ? '#FFFFFF' : role.color}
                        />
                        {!role.available && (
                          <View style={styles.comingSoonBadge}>
                            <Text style={styles.comingSoonText}>Soon</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.roleCardTitle,
                        selectedRole === role.id && styles.roleCardTitleActive,
                        !role.available && styles.roleCardTitleDisabled,
                      ]}>
                        {role.title}
                      </Text>
                      <Text style={[
                        styles.roleCardDescription,
                        selectedRole === role.id && styles.roleCardDescriptionActive,
                        !role.available && styles.roleCardDescriptionDisabled,
                      ]}>
                        {role.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <User size={20} color="#666666" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </>
        )}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Mail size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#666666" />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={20} color="#666666" />
            ) : (
              <Eye size={20} color="#666666" />
            )}
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input (Sign Up Only) */}
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Lock size={20} color="#666666" />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
          </View>
        )}

        {/* Privacy Notice */}
        {!isLogin && (
          <View style={styles.privacyContainer}>
            <View style={styles.privacyIcon}>
              <Text style={styles.privacyIconText}>🛡️</Text>
            </View>
            <View style={styles.privacyText}>
              <Text style={styles.privacyTitle}>Privacy Protected</Text>
              <Text style={styles.privacyDescription}>
                Your information is secure and will only be used to enhance your Menu experience
              </Text>
            </View>
          </View>
        )}

        {/* Auth Button */}
        <TouchableOpacity 
          style={[styles.authButton, isLoading && styles.authButtonDisabled]} 
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingText}>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Guest Mode */}
        <TouchableOpacity 
          style={[styles.guestButton, isLoading && styles.guestButtonDisabled]} 
          onPress={handleGuestMode}
          disabled={isLoading}
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        {/* Toggle Auth Mode */}
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={toggleAuthMode}
          disabled={isLoading}
        >
          <Text style={styles.toggleText}>
            {isLogin 
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"
            }
          </Text>
        </TouchableOpacity>
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
  roleSection: {
    marginBottom: 30,
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  rolesGrid: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  roleCardActive: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  roleCardDisabled: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E0E0E0',
    opacity: 0.7,
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  comingSoonBadge: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: '#FF8F00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  comingSoonText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  roleCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  roleCardTitleActive: {
    color: '#FFFFFF',
  },
  roleCardTitleDisabled: {
    color: '#999999',
  },
  roleCardDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  roleCardDescriptionActive: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  roleCardDescriptionDisabled: {
    color: '#BBBBBB',
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
  privacyContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#006400',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyIconText: {
    fontSize: 18,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 16,
  },
  authButton: {
    backgroundColor: '#006400',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  authButtonDisabled: {
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
  authButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  guestButtonDisabled: {
    opacity: 0.7,
  },
  guestButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
});