import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Bell, Star, Clock, ChefHat, Heart, Utensils, ShoppingBag, Coffee, TrendingUp, Award } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import CustomLogo from '@/components/CustomLogo';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

const { width } = Dimensions.get('window');

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const { user, profile } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;

  const featuredItems = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      chef: 'Chef Adunni',
      price: 4500,
      originalPrice: 5500,
      rating: 4.8,
      reviews: 234,
      time: '20-25 min',
      image: IMAGES.JOLLOF_RICE,
      badge: 'Chef Special',
      badgeColor: '#FFD700',
    },
    {
      id: 2,
      name: 'Grilled Chicken Deluxe',
      restaurant: 'Spice Garden',
      chef: 'Chef Emeka',
      price: 6500,
      originalPrice: 7500,
      rating: 4.9,
      reviews: 189,
      time: '15-20 min',
      image: IMAGES.GRILLED_CHICKEN,
      badge: 'Popular',
      badgeColor: '#FF6B6B',
    },
    {
      id: 3,
      name: 'Traditional Pepper Soup',
      restaurant: 'Traditional Taste',
      chef: 'Chef Kemi',
      price: 3200,
      originalPrice: 4200,
      rating: 4.7,
      reviews: 156,
      time: '25-30 min',
      image: IMAGES.PEPPER_SOUP,
      badge: 'Authentic',
      badgeColor: '#32CD32',
    },
  ];

  const popularItems = [
    {
      id: 4,
      name: 'Amala & Ewedu',
      restaurant: 'Yoruba Kitchen',
      price: 3800,
      rating: 4.9,
      orders: 342,
      image: IMAGES.AMALA_EWEDU,
    },
    {
      id: 5,
      name: 'Pounded Yam & Egusi',
      restaurant: 'Traditional Taste',
      price: 5200,
      rating: 4.8,
      orders: 278,
      image: IMAGES.POUNDED_YAM_EGUSI,
    },
    {
      id: 6,
      name: 'Suya Platter',
      restaurant: 'Suya Spot',
      price: 6500,
      rating: 4.7,
      orders: 195,
      image: IMAGES.SUYA_PLATTER,
    },
  ];

  const deliciousItems = [
    {
      id: 7,
      name: 'Nigerian Fried Rice',
      restaurant: 'Asian Fusion',
      price: 3800,
      rating: 4.6,
      image: IMAGES.FRIED_RICE,
      discount: 15,
    },
    {
      id: 8,
      name: 'Meat Pie',
      restaurant: 'Nigerian Bakery',
      price: 1250,
      rating: 4.8,
      image: IMAGES.BAKERY_ITEMS,
      discount: 20,
    },
    {
      id: 9,
      name: 'Fresh Fruit Salad',
      restaurant: 'Tropical Vibes',
      price: 2500,
      rating: 4.9,
      image: IMAGES.FRUIT_SALAD,
      discount: 10,
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
      color: '#FF6B6B',
    },
    {
      id: 2,
      name: 'Street Food',
      icon: '🌮',
      count: '150+',
      image: IMAGES.STREET_FOOD_VENDOR,
      route: 'street-food',
      color: '#4ECDC4',
    },
    {
      id: 3,
      name: 'Desserts',
      icon: '🍰',
      count: '80+',
      image: IMAGES.DESSERT_DISPLAY,
      route: 'desserts',
      color: '#45B7D1',
    },
    {
      id: 4,
      name: 'Bakery',
      icon: '🥖',
      count: '120+',
      image: IMAGES.BAKERY_ITEMS,
      route: 'bakery',
      color: '#FFA726',
    },
    {
      id: 5,
      name: 'Healthy',
      icon: '🥗',
      count: '90+',
      image: IMAGES.HEALTHY_SALAD,
      route: 'healthy',
      color: '#26A69A',
    },
    {
      id: 6,
      name: 'Budget Meals',
      icon: '💰',
      count: '100+',
      image: IMAGES.BUDGET_MEALS,
      route: 'budget-meals',
      color: '#FFD54F',
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

  const renderCategoryIndicator = () => {
    const inputRange = categories.map((_, i) => i * (width * 0.7 + 15));
    
    return (
      <View style={styles.indicatorContainer}>
        {categories.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * (width * 0.7 + 15),
              index * (width * 0.7 + 15),
              (index + 1) * (width * 0.7 + 15),
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.indicator, { opacity }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <CustomLogo size="medium" color="#FFFFFF" />
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

        {/* Featured Today */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Today</Text>
            <View style={styles.sectionBadge}>
              <Award size={16} color="#FFD700" />
              <Text style={styles.sectionBadgeText}>Special</Text>
            </View>
          </View>
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
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{item.name}</Text>
                  <Text style={styles.featuredRestaurant}>{item.restaurant}</Text>
                  <Text style={styles.featuredChef}>by {item.chef}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.rating}>{item.rating}</Text>
                      <Text style={styles.reviews}>({item.reviews})</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Clock size={12} color="#666666" />
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    {item.originalPrice > item.price && (
                      <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular</Text>
            <View style={[styles.sectionBadge, { backgroundColor: '#FF6B6B20' }]}>
              <TrendingUp size={16} color="#FF6B6B" />
              <Text style={[styles.sectionBadgeText, { color: '#FF6B6B' }]}>Trending</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.popularCard}
                onPress={() => handleFoodPress(item.id)}
              >
                <ImageWithFallback 
                  source={item.image} 
                  style={styles.popularImage}
                  fallback={IMAGES.DEFAULT_FOOD}
                />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{item.name}</Text>
                  <Text style={styles.popularRestaurant}>{item.restaurant}</Text>
                  <View style={styles.popularMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <Text style={styles.orders}>{item.orders} orders</Text>
                  </View>
                  <Text style={styles.popularPrice}>{formatPrice(item.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Delicious */}
        <View style={styles.deliciousSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delicious</Text>
            <View style={[styles.sectionBadge, { backgroundColor: '#32CD3220' }]}>
              <ChefHat size={16} color="#32CD32" />
              <Text style={[styles.sectionBadgeText, { color: '#32CD32' }]}>Fresh</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {deliciousItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.deliciousCard}
                onPress={() => handleFoodPress(item.id)}
              >
                <ImageWithFallback 
                  source={item.image} 
                  style={styles.deliciousImage}
                  fallback={IMAGES.DEFAULT_FOOD}
                />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}% OFF</Text>
                </View>
                <View style={styles.deliciousInfo}>
                  <Text style={styles.deliciousName}>{item.name}</Text>
                  <Text style={styles.deliciousRestaurant}>{item.restaurant}</Text>
                  <View style={styles.deliciousMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <Text style={styles.deliciousPrice}>{formatPrice(item.price)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore Categories with Animation */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Animated.ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {categories.map((category, index) => {
              const inputRange = [
                (index - 1) * (width * 0.7 + 15),
                index * (width * 0.7 + 15),
                (index + 1) * (width * 0.7 + 15),
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.9, 1, 0.9],
                extrapolate: 'clamp',
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.7, 1, 0.7],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    {
                      transform: [{ scale }],
                      opacity,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleCategoryPress(category.route)}
                    style={styles.categoryTouchable}
                  >
                    <ImageWithFallback 
                      source={category.image} 
                      style={styles.categoryImage}
                      fallback={IMAGES.DEFAULT_RESTAURANT}
                    />
                    <View style={[styles.categoryOverlay, { backgroundColor: category.color + '90' }]}>
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryCount}>{category.count}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>
          {renderCategoryIndicator()}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#FFD700',
  },
  featuredCard: {
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  featuredInfo: {
    padding: 16,
  },
  featuredName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  featuredRestaurant: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 2,
  },
  featuredChef: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  reviews: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  popularSection: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  popularCard: {
    width: width * 0.6,
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
  popularImage: {
    width: '100%',
    height: 120,
  },
  popularInfo: {
    padding: 12,
  },
  popularName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  popularRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  popularMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orders: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  popularPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  deliciousSection: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  deliciousCard: {
    width: width * 0.5,
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
  deliciousImage: {
    width: '100%',
    height: 100,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  deliciousInfo: {
    padding: 12,
  },
  deliciousName: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  deliciousRestaurant: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  deliciousMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliciousPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  categoriesSection: {
    paddingVertical: 20,
    paddingLeft: 20,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  categoryCard: {
    width: width * 0.7,
    height: 140,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
  },
  categoryTouchable: {
    width: '100%',
    height: '100%',
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
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006400',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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