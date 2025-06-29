import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, CreditCard, Bell, MapPin, ChevronRight, Star, Award, Truck, Store, LogOut, Edit3, Calendar, DollarSign, Target, BarChart3 } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const { user, profile, signOut, loading } = useAuth();

  const menuItems = [
    {
      id: 1,
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: Edit3,
      color: '#006400',
      onPress: () => router.push('/settings/profile'),
    },
    {
      id: 2,
      title: 'Budget Management',
      description: 'Set budgets and track spending',
      icon: DollarSign,
      color: '#FF8F00',
      onPress: () => router.push('/budget-management'),
    },
    {
      id: 3,
      title: 'Meal Planning',
      description: 'Schedule your meals and orders',
      icon: Calendar,
      color: '#3F51B5',
      onPress: () => router.push('/meal-planning'),
    },
    {
      id: 4,
      title: 'Order History',
      description: 'View your past orders',
      icon: CreditCard,
      color: '#9C27B0',
      onPress: () => router.push('/orders'),
    },
    {
      id: 5,
      title: 'Favorites',
      description: 'Your saved restaurants and dishes',
      icon: Heart,
      color: '#E91E63',
      onPress: () => router.push('/favorites'),
    },
    {
      id: 6,
      title: 'Addresses',
      description: 'Manage delivery addresses',
      icon: MapPin,
      color: '#00ACC1',
      onPress: () => router.push('/settings/addresses'),
    },
    {
      id: 7,
      title: 'Payment Methods',
      description: 'Manage cards and payment options',
      icon: CreditCard,
      color: '#4CAF50',
      onPress: () => router.push('/settings/payments'),
    },
    {
      id: 8,
      title: 'Notifications',
      description: 'Control your notification preferences',
      icon: Bell,
      color: '#FF5722',
      onPress: () => router.push('/settings/notifications'),
    },
    {
      id: 9,
      title: 'App Settings',
      description: 'App preferences and privacy',
      icon: Settings,
      color: '#607D8B',
      onPress: () => router.push('/settings'),
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Food Explorer',
      description: 'Tried 10+ cuisines',
      icon: '🌍',
      unlocked: profile?.total_orders ? profile.total_orders >= 10 : false,
    },
    {
      id: 2,
      title: 'Loyal Customer',
      description: '25+ orders completed',
      icon: '🏆',
      unlocked: profile?.total_orders ? profile.total_orders >= 25 : false,
    },
    {
      id: 3,
      title: 'Review Master',
      description: 'Left 20+ reviews',
      icon: '⭐',
      unlocked: false,
    },
    {
      id: 4,
      title: 'Budget Saver',
      description: 'Saved ₦50,000+ with deals',
      icon: '💰',
      unlocked: profile?.points ? profile.points >= 5000 : false,
    },
  ];

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

  const handleGuestSignIn = () => {
    router.push('/auth');
  };

  // Guest Profile View
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* Guest Profile Card */}
          <View style={styles.guestProfileCard}>
            <View style={styles.guestIconContainer}>
              <User size={40} color="#666666" />
            </View>
            <Text style={styles.guestTitle}>You're browsing as a guest</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to save your favorites, track orders, and get personalized recommendations
            </Text>
            <TouchableOpacity style={styles.guestSignInButton} onPress={handleGuestSignIn}>
              <Text style={styles.guestSignInText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Limited Menu Items for Guests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore</Text>
            {menuItems.slice(7, 9).map((item) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  </View>
                  <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Menu App v2.1.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Authenticated User Profile View
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <ImageWithFallback 
              source={profile?.avatar_url} 
              style={styles.profileImage}
              fallback={IMAGES.DEFAULT_CHEF}
            />
            <View style={styles.profileBadge}>
              <User size={16} color="#FFFFFF" />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.full_name || 'User'}</Text>
            <Text style={styles.profileRole}>{profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || 'Customer'}</Text>
            <Text style={styles.profileEmail}>{profile?.email || user?.email}</Text>
            <Text style={styles.memberSince}>
              Member since {profile?.member_since ? new Date(profile.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
            </Text>
          </View>

          <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/settings/profile')}>
            <Edit3 size={16} color="#006400" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.total_orders || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.statNumber}>{profile?.rating || 0}</Text>
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, { borderLeftColor: '#FF8F00' }]}
              onPress={() => router.push('/budget-management')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF8F00' }]}>
                <DollarSign size={20} color="#FFFFFF" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>Budget</Text>
                <Text style={styles.quickActionSubtitle}>Manage spending</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { borderLeftColor: '#3F51B5' }]}
              onPress={() => router.push('/meal-planning')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#3F51B5' }]}>
                <Calendar size={20} color="#FFFFFF" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>Plan Meals</Text>
                <Text style={styles.quickActionSubtitle}>Schedule orders</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { borderLeftColor: '#4CAF50' }]}
              onPress={() => router.push('/budget-analytics')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' }]}>
                <BarChart3 size={20} color="#FFFFFF" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>Analytics</Text>
                <Text style={styles.quickActionSubtitle}>Spending insights</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, { borderLeftColor: '#E91E63' }]}
              onPress={() => router.push('/favorites')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E91E63' }]}>
                <Heart size={20} color="#FFFFFF" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>Favorites</Text>
                <Text style={styles.quickActionSubtitle}>Saved items</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Award size={12} color="#FFD700" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <IconComponent size={20} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <ChevronRight size={20} color="#666666" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#00ACC1" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Get notified about orders and offers</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D3D3D3', true: '#32CD32' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MapPin size={20} color="#FF8F00" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingDescription}>Find restaurants near you</Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#D3D3D3', true: '#32CD32' }}
              thumbColor={locationEnabled ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Role Switching */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch Role</Text>
          <View style={styles.roleGrid}>
            <TouchableOpacity style={styles.roleOption}>
              <Truck size={24} color="#FF8F00" />
              <Text style={styles.roleOptionText}>Become a Delivery Partner</Text>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.roleOption}>
              <Store size={24} color="#3F51B5" />
              <Text style={styles.roleOptionText}>Register as Vendor</Text>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut} disabled={loading}>
            <LogOut size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Menu App v2.1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  guestProfileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guestIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  guestTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  guestSignInButton: {
    backgroundColor: '#006400',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  guestSignInText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#006400',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  editProfileButton: {
    backgroundColor: '#E8F5E8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  achievementCard: {
    width: 140,
    borderRadius: 15,
    padding: 15,
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  achievementUnlocked: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#32CD32',
  },
  achievementLocked: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#666666',
  },
  achievementDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  achievementDescriptionLocked: {
    color: '#999999',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingContent: {
    marginLeft: 15,
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
  roleGrid: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    gap: 15,
    position: 'relative',
  },
  roleOptionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  comingSoonBadge: {
    backgroundColor: '#FF8F00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  logoutButton: {
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
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FF6B6B',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
});