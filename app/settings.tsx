import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, User, Bell, MapPin, CreditCard, Shield, Globe, Moon, Smartphone, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const { user, signOut } = useAuth();

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Information',
          description: 'Update your personal details',
          icon: User,
          color: '#006400',
          onPress: () => router.push('/settings/profile'),
        },
        {
          id: 'addresses',
          title: 'Delivery Addresses',
          description: 'Manage your saved addresses',
          icon: MapPin,
          color: '#FF6B6B',
          onPress: () => router.push('/settings/addresses'),
        },
        {
          id: 'payments',
          title: 'Payment Methods',
          description: 'Cards and payment options',
          icon: CreditCard,
          color: '#4CAF50',
          onPress: () => router.push('/settings/payments'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Push notifications and alerts',
          icon: Bell,
          color: '#FFA726',
          onPress: () => router.push('/settings/notifications'),
        },
        {
          id: 'language',
          title: 'Language & Region',
          description: 'English (Nigeria)',
          icon: Globe,
          color: '#3F51B5',
          onPress: () => router.push('/settings/language'),
        },
        {
          id: 'appearance',
          title: 'Appearance',
          description: 'Theme and display settings',
          icon: Moon,
          color: '#9C27B0',
          onPress: () => router.push('/settings/appearance'),
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'security',
          title: 'Security & Privacy',
          description: 'Password and privacy settings',
          icon: Shield,
          color: '#FF5722',
          onPress: () => router.push('/settings/security'),
        },
        {
          id: 'device',
          title: 'Device Settings',
          description: 'App permissions and access',
          icon: Smartphone,
          color: '#607D8B',
          onPress: () => router.push('/settings/device'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          description: 'FAQs and contact support',
          icon: HelpCircle,
          color: '#00ACC1',
          onPress: () => router.push('/settings/help'),
        },
        {
          id: 'about',
          title: 'About Menu',
          description: 'App version and information',
          icon: Info,
          color: '#795548',
          onPress: () => router.push('/settings/about'),
        },
      ],
    },
  ];

  const quickSettings = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Get notified about orders and offers',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      id: 'location',
      title: 'Location Services',
      description: 'Find restaurants near you',
      value: locationEnabled,
      onToggle: setLocationEnabled,
    },
    {
      id: 'darkmode',
      title: 'Dark Mode',
      description: 'Use dark theme for the app',
      value: darkModeEnabled,
      onToggle: setDarkModeEnabled,
    },
    {
      id: 'biometric',
      title: 'Biometric Login',
      description: 'Use fingerprint or face ID',
      value: biometricEnabled,
      onToggle: setBiometricEnabled,
    },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.push('/auth');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          {quickSettings.map((setting) => (
            <View key={setting.id} style={styles.quickSettingItem}>
              <View style={styles.quickSettingInfo}>
                <Text style={styles.quickSettingTitle}>{setting.title}</Text>
                <Text style={styles.quickSettingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onToggle}
                trackColor={{ false: '#D3D3D3', true: '#32CD32' }}
                thumbColor={setting.value ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
          ))}
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            {group.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={item.onPress}
                >
                  <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                  <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.appInfoCard}>
            <View style={styles.appInfoHeader}>
              <CustomLogo size="medium" color="#006400" />
              <View style={styles.appInfoText}>
                <Text style={styles.appName}>Menu - Food Explorer</Text>
                <Text style={styles.appVersion}>Version 2.1.0</Text>
              </View>
            </View>
            <Text style={styles.appDescription}>
              Your complete food discovery and ordering companion. Explore restaurants, 
              plan meals, manage budgets, and enjoy amazing food experiences.
            </Text>
          </View>
        </View>

        {/* Account Actions */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogOut size={20} color="#FF6B6B" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <ChevronRight size={16} color="#666666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <ChevronRight size={16} color="#666666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Cookie Policy</Text>
            <ChevronRight size={16} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for food lovers everywhere
          </Text>
          <Text style={styles.footerCopyright}>
            © 2024 Menu App. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  quickSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickSettingInfo: {
    flex: 1,
  },
  quickSettingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  quickSettingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  appInfoText: {
    marginLeft: 15,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    lineHeight: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFD3D3',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FF6B6B',
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 8,
  },
  legalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textAlign: 'center',
  },
});