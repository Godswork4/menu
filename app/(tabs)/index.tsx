import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Bell, Star, Clock, ChefHat, Heart, Utensils, ShoppingBag, Coffee } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import CustomLogo from '@/components/CustomLogo';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

const { width } = Dimensions.get('window');

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile } = useAuth();

  const featuredItems = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      price: 4500,
      originalPrice: 5500,
      rating: 4.8,
      image: IMAGES.JOLLOF_RICE,
      badge: 'Chef Special',
      badgeColor: '#FFD700',
    },
    {
      id: 2,
      name: 'Grilled Chicken',
      restaurant: 'Spice Garden',
      price: 6500,
      originalPrice: 7500,
      rating: 4.9,
      image: IMAGES.GRILLED_CHICKEN,
      badge: 'Traditional',
      badgeColor: '#32CD32',
    },
    {
      id: 3,
      name: 'Pepper Soup',
      restaurant: 'Traditional Taste',
      price: 3200,
      originalPrice: 4200,
      rating: 4.7,
      image: IMAGES.PEPPER_SOUP,
      badge: 'Popular',
      badgeColor: '#FF6B6B',
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Restaurants',
      icon: '🍽️',
      count: '200+',
      image: IMAGES.PROFESSIONAL_CHEF,
      route: 'restaurants',
    },
    {
      id: 2,
      name: 'Street Food',
      icon: '🌮',
      count: '150+',
      image: IMAGES.STREET_FOOD_VENDOR,
      route: 'street-food',
    },
    {
      id: 3,
      name: 'Desserts',
      icon: '🍰',
      count: '80+',
      image: IMAGES.DESSERT_DISPLAY,
      route: 'desserts',
    },
    {
      id: 4,
      name: 'Bakery',
      icon: '🥖',
      count: '120+',
      image: IMAGES.BAKERY_ITEMS,
      route: 'bakery',
    },
    {
      id: 5,
      name: 'Healthy',
      icon: '🥗',
      count: '90+',
      image: IMAGES.HEALTHY_SALAD,
      route: 'healthy',
    },
    {
      id: 6,
      name: 'Budget Meals',
      icon: '💰',
      count: '100+',
      image: IMAGES.BUDGET_MEALS,
      route: 'budget-meals',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Order Food',
      subtitle: 'From restaurants',
      icon: Utensils,
      color: '#FF6B6B',
      route: '/categories',
    },
    {
      id: 2,
      title: 'Grocery Shopping',
      subtitle: 'Fresh ingredients',
      icon: ShoppingBag,
      color: '#4ECDC4',
      route: '/supermarket',
    },
    {
      id: 3,
      title: 'Local Market',
      subtitle: 'Traditional items',
      icon: Coffee,
      color: '#45B7D1',
      route: '/market',
    },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleCategoryPress = (route: string) => {
    router.push({
      pathname: '/category-detail',
      params: { category: route }
    });
  };

  const handleFoodPress = (foodId: number) => {
    router.push({
      pathname: '/food-detail',
      params: { id: foodId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <CustomLogo size="medium" color="#FFFFFF" showImage={true} />
              <Text style={styles.tagline}>Your Food Explorer</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.locationContainer}>
            <MapPin size={16} color="#FFFFFF" />
            <Text style={styles.locationText}>Lagos, Nigeria</Text>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for food, restaurants..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Featured Today - Reduced Height */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Today</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.featuredCard}
                onPress={() => handleFoodPress(item.id)}
              >
                <ImageWithFallback 
                  source={item.image} 
                  style={styles.featuredImage}
                  fallback={IMAGES.DEFAULT_FOOD}
                />
                <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <Text style={styles.featuredRestaurant}>{item.restaurant}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{formatPrice(item.price)}</Text>
                      {item.originalPrice > item.price && (
                        <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.quickActionCard, { borderLeftColor: action.color }]}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <IconComponent size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.quickActionContent}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Explore Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.route)}
              >
                <ImageWithFallback 
                  source={category.image} 
                  style={styles.categoryImage}
                  fallback={IMAGES.DEFAULT_RESTAURANT}
                />
                <View style={styles.categoryOverlay}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Welcome Message for Users */}
        {user && (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Food Lover'}! 👋
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to discover amazing food today?
            </Text>
          </View>
        )}

        {/* Guest Prompt */}
        {!user && (
          <View style={styles.guestSection}>
            <Text style={styles.guestTitle}>Join the Food Community</Text>
            <Text style={styles.guestSubtitle}>
              Sign up to save favorites, track orders, and get personalized recommendations
            </Text>
            <TouchableOpacity 
              style={styles.guestButton}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.guestButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoSection: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  featuredSection: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  featuredCard: {
    width: width * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: 140,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  featuredInfo: {
    padding: 15,
  },
  featuredName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  featuredRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  categoriesSection: {
    paddingVertical: 15,
    paddingLeft: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  categoryCard: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  welcomeSection: {
    backgroundColor: '#E8F5E8',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#006400',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  guestSection: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  guestButton: {
    backgroundColor: '#006400',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  guestButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});