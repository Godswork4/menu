import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Animated, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Star, Clock, User, Bell, Wifi, ShoppingBag, ChefHat, X, Heart, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import CustomLogo from '@/components/CustomLogo';
import AIAssistant from '@/components/AIAssistant';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInsightNotification, setShowInsightNotification] = useState(true);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('dishes');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Animation values for category indicators
  const indicatorAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryScrollRef = useRef<ScrollView>(null);
  const slideScrollRef = useRef<ScrollView>(null);

  const { user, profile } = useAuth();
  const isGuest = !user;

  const categories = [
    { id: 1, name: 'Restaurants', icon: '🍽️', color: '#FF6B6B', route: 'restaurants' },
    { id: 2, name: 'Street Food', icon: '🌮', color: '#4ECDC4', route: 'street-food' },
    { id: 3, name: 'Desserts', icon: '🍰', color: '#45B7D1', route: 'desserts' },
    { id: 4, name: 'Bakery', icon: '🥖', color: '#FFA726', route: 'bakery' },
    { id: 5, name: 'Supermarket', icon: '🛒', color: '#9C27B0', route: 'supermarket' },
    { id: 6, name: 'Market', icon: '🏪', color: '#FF5722', route: 'market' },
    { id: 7, name: 'Foreign', icon: '🌍', color: '#AB47BC', route: 'international' },
    { id: 8, name: 'Budget Meals', icon: '💰', color: '#FFD54F', route: 'budget-meals' },
  ];

  const featuredFoods = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      price: 4500,
      originalPrice: 5500,
      rating: 4.8,
      image: 'https://images.shutterstock.com/image-photo/jollof-rice-west-african-dish-600nw-1891234567.jpg',
      badge: 'Chef Special',
      cookTime: '20 min',
      description: 'Authentic Nigerian jollof rice with premium spices, grilled chicken, and fried plantain',
    },
    {
      id: 2,
      name: 'Amala & Ewedu',
      restaurant: 'Yoruba Kitchen',
      price: 3800,
      originalPrice: 4800,
      rating: 4.9,
      image: 'https://images.shutterstock.com/image-photo/amala-ewedu-traditional-yoruba-food-600nw-1234567891.jpg',
      badge: 'Traditional',
      cookTime: '25 min',
      description: 'Traditional Yoruba delicacy with smooth amala and nutritious ewedu soup',
    },
    {
      id: 3,
      name: 'Pounded Yam & Egusi',
      restaurant: 'Traditional Taste',
      price: 5200,
      originalPrice: 6500,
      rating: 4.7,
      image: 'https://images.shutterstock.com/image-photo/pounded-yam-egusi-soup-nigerian-600nw-1567891234.jpg',
      badge: 'Popular',
      cookTime: '30 min',
      description: 'Smooth pounded yam served with rich egusi soup and assorted meat',
    },
    {
      id: 4,
      name: 'Pepper Soup',
      restaurant: 'Traditional Taste',
      price: 3200,
      originalPrice: 4200,
      rating: 4.9,
      image: 'https://images.shutterstock.com/image-photo/nigerian-pepper-soup-catfish-spicy-600nw-1345678912.jpg',
      badge: 'Spicy',
      cookTime: '25 min',
      description: 'Spicy Nigerian pepper soup with fresh catfish and aromatic spices',
    },
    {
      id: 5,
      name: 'Suya Platter',
      restaurant: 'Suya Spot',
      price: 6500,
      originalPrice: 8000,
      rating: 4.8,
      image: 'https://images.shutterstock.com/image-photo/suya-nigerian-grilled-meat-spices-600nw-1678912345.jpg',
      badge: 'Grilled',
      cookTime: '15 min',
      description: 'Grilled spiced beef skewers with traditional suya spice blend',
    },
  ];

  const popularItems = [
    {
      id: 1,
      name: 'Jollof Rice Bowl',
      description: 'Nigerian jollof rice with chicken and plantain',
      calories: '580 cal',
      image: 'https://images.shutterstock.com/image-photo/jollof-rice-west-african-dish-600nw-1891234567.jpg',
      price: 4500,
      rating: 4.8,
      restaurant: 'Lagos Kitchen',
      hasRecipe: true,
    },
    {
      id: 2,
      name: 'Pepper Soup',
      description: 'Spicy Nigerian pepper soup with fish',
      calories: '320 cal',
      image: 'https://images.shutterstock.com/image-photo/nigerian-pepper-soup-catfish-spicy-600nw-1345678912.jpg',
      price: 3200,
      rating: 4.9,
      restaurant: 'Traditional Taste',
      hasRecipe: true,
    },
    {
      id: 3,
      name: 'Suya Platter',
      description: 'Grilled spiced beef with onions and tomatoes',
      calories: '450 cal',
      image: 'https://images.shutterstock.com/image-photo/suya-nigerian-grilled-meat-spices-600nw-1678912345.jpg',
      price: 6500,
      rating: 4.7,
      restaurant: 'Suya Spot',
      hasRecipe: true,
    },
  ];

  // Food categories with different items
  const foodCategories = [
    {
      id: 'dishes',
      name: 'Dishes',
      icon: '🍽️',
      items: [
        {
          id: 1,
          name: 'Jollof Rice Special',
          restaurant: 'Lagos Kitchen',
          price: 4500,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/jollof-rice-west-african-dish-600nw-1891234567.jpg',
          cookTime: '20 min',
          hasRecipe: true,
        },
        {
          id: 2,
          name: 'Pounded Yam & Egusi',
          restaurant: 'Traditional Taste',
          price: 5200,
          rating: 4.9,
          image: 'https://images.shutterstock.com/image-photo/pounded-yam-egusi-soup-nigerian-600nw-1567891234.jpg',
          cookTime: '30 min',
          hasRecipe: true,
        },
        {
          id: 3,
          name: 'Fried Rice',
          restaurant: 'Asian Fusion',
          price: 3800,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/nigerian-fried-rice-colorful-mixed-600nw-1789123456.jpg',
          cookTime: '15 min',
          hasRecipe: true,
        },
        {
          id: 4,
          name: 'Pepper Soup',
          restaurant: 'Traditional Taste',
          price: 3200,
          rating: 4.9,
          image: 'https://images.shutterstock.com/image-photo/nigerian-pepper-soup-catfish-spicy-600nw-1345678912.jpg',
          cookTime: '25 min',
          hasRecipe: true,
        },
        {
          id: 5,
          name: 'Amala & Ewedu',
          restaurant: 'Yoruba Kitchen',
          price: 3800,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/amala-ewedu-traditional-yoruba-food-600nw-1234567891.jpg',
          cookTime: '25 min',
          hasRecipe: true,
        },
        {
          id: 6,
          name: 'Suya Platter',
          restaurant: 'Suya Spot',
          price: 6500,
          rating: 4.7,
          image: 'https://images.shutterstock.com/image-photo/suya-nigerian-grilled-meat-spices-600nw-1678912345.jpg',
          cookTime: '15 min',
          hasRecipe: true,
        },
      ]
    },
    {
      id: 'drinks',
      name: 'Drinks',
      icon: '🥤',
      items: [
        {
          id: 1,
          name: 'Zobo Drink',
          restaurant: 'Local Refreshments',
          price: 1200,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/zobo-drink-nigerian-hibiscus-tea-600nw-1456789123.jpg',
          cookTime: '10 min',
          hasRecipe: true,
        },
        {
          id: 2,
          name: 'Chapman',
          restaurant: 'Cocktail Corner',
          price: 2200,
          rating: 4.5,
          image: 'https://images.shutterstock.com/image-photo/chapman-nigerian-cocktail-drink-colorful-600nw-1567891234.jpg',
          cookTime: '7 min',
          hasRecipe: true,
        },
        {
          id: 3,
          name: 'Tiger Nut Drink',
          restaurant: 'Natural Drinks',
          price: 1800,
          rating: 4.9,
          image: 'https://images.shutterstock.com/image-photo/tiger-nut-drink-kunun-aya-600nw-1678912345.jpg',
          cookTime: '12 min',
          hasRecipe: true,
        },
        {
          id: 4,
          name: 'Kunu Drink',
          restaurant: 'Traditional Beverages',
          price: 1000,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/kunu-drink-nigerian-millet-beverage-600nw-1789123456.jpg',
          cookTime: '15 min',
          hasRecipe: true,
        },
        {
          id: 5,
          name: 'Fresh Orange Juice',
          restaurant: 'Juice Bar',
          price: 1500,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/fresh-orange-juice-glass-citrus-600nw-1891234567.jpg',
          cookTime: '5 min',
          hasRecipe: false,
        },
        {
          id: 6,
          name: 'Smoothie Bowl',
          restaurant: 'Healthy Drinks',
          price: 2800,
          rating: 4.7,
          image: 'https://images.shutterstock.com/image-photo/smoothie-bowl-tropical-fruits-healthy-600nw-1912345678.jpg',
          cookTime: '8 min',
          hasRecipe: true,
        },
      ]
    },
    {
      id: 'fruits',
      name: 'Fruits',
      icon: '🍎',
      items: [
        {
          id: 1,
          name: 'Fresh Fruit Salad',
          restaurant: 'Garden Fresh',
          price: 2500,
          rating: 4.9,
          image: 'https://images.shutterstock.com/image-photo/fresh-fruit-salad-tropical-fruits-600nw-1123456789.jpg',
          cookTime: '10 min',
          hasRecipe: false,
        },
        {
          id: 2,
          name: 'Watermelon Bowl',
          restaurant: 'Tropical Fruits',
          price: 1800,
          rating: 4.7,
          image: 'https://images.shutterstock.com/image-photo/watermelon-bowl-fresh-cut-fruit-600nw-1234567891.jpg',
          cookTime: '5 min',
          hasRecipe: false,
        },
        {
          id: 3,
          name: 'Pineapple Chunks',
          restaurant: 'Fresh Market',
          price: 2000,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/pineapple-chunks-fresh-cut-tropical-600nw-1345678912.jpg',
          cookTime: '3 min',
          hasRecipe: false,
        },
        {
          id: 4,
          name: 'Mixed Berry Bowl',
          restaurant: 'Berry Delights',
          price: 3200,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/mixed-berry-bowl-fresh-berries-600nw-1456789123.jpg',
          cookTime: '8 min',
          hasRecipe: false,
        },
        {
          id: 5,
          name: 'Mango Slices',
          restaurant: 'Tropical Paradise',
          price: 2200,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/mango-slices-fresh-tropical-fruit-600nw-1567891234.jpg',
          cookTime: '5 min',
          hasRecipe: false,
        },
        {
          id: 6,
          name: 'Coconut Water',
          restaurant: 'Fresh Coconuts',
          price: 1500,
          rating: 4.7,
          image: 'https://images.shutterstock.com/image-photo/coconut-water-fresh-natural-drink-600nw-1678912345.jpg',
          cookTime: '2 min',
          hasRecipe: false,
        },
      ]
    },
    {
      id: 'pastries',
      name: 'Pastries',
      icon: '🥐',
      items: [
        {
          id: 1,
          name: 'Meat Pie',
          restaurant: 'Nigerian Bakery',
          price: 1200,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/meat-pie-nigerian-pastry-savory-600nw-1789123456.jpg',
          cookTime: 'Fresh daily',
          hasRecipe: true,
        },
        {
          id: 2,
          name: 'Sausage Roll',
          restaurant: 'Golden Crust',
          price: 1500,
          rating: 4.7,
          image: 'https://images.shutterstock.com/image-photo/sausage-roll-pastry-meat-filling-600nw-1891234567.jpg',
          cookTime: 'Fresh daily',
          hasRecipe: true,
        },
        {
          id: 3,
          name: 'Chin Chin',
          restaurant: 'Sweet Treats',
          price: 800,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/chin-chin-nigerian-fried-snack-600nw-1912345678.jpg',
          cookTime: '15 min',
          hasRecipe: true,
        },
        {
          id: 4,
          name: 'Puff Puff',
          restaurant: 'Local Delights',
          price: 600,
          rating: 4.9,
          image: 'https://images.shutterstock.com/image-photo/puff-puff-nigerian-fried-dough-600nw-1123456789.jpg',
          cookTime: '20 min',
          hasRecipe: true,
        },
        {
          id: 5,
          name: 'Doughnut',
          restaurant: 'Sweet Circle',
          price: 900,
          rating: 4.5,
          image: 'https://images.shutterstock.com/image-photo/doughnut-glazed-sweet-pastry-ring-600nw-1234567891.jpg',
          cookTime: 'Fresh daily',
          hasRecipe: true,
        },
        {
          id: 6,
          name: 'Buns',
          restaurant: 'Bakery Corner',
          price: 700,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/buns-sweet-bread-rolls-bakery-600nw-1345678912.jpg',
          cookTime: 'Fresh daily',
          hasRecipe: true,
        },
      ]
    },
    {
      id: 'raw',
      name: 'Raw',
      icon: '🥗',
      items: [
        {
          id: 1,
          name: 'Garden Salad',
          restaurant: 'Green House',
          price: 2800,
          rating: 4.6,
          image: 'https://images.shutterstock.com/image-photo/garden-salad-fresh-vegetables-mixed-600nw-1456789123.jpg',
          cookTime: '8 min',
          hasRecipe: true,
        },
        {
          id: 2,
          name: 'Caesar Salad',
          restaurant: 'Salad Station',
          price: 3500,
          rating: 4.7,
          image: 'https://images.shutterstock.com/image-photo/caesar-salad-romaine-lettuce-croutons-600nw-1567891234.jpg',
          cookTime: '10 min',
          hasRecipe: true,
        },
        {
          id: 3,
          name: 'Sushi Platter',
          restaurant: 'Tokyo Raw',
          price: 8500,
          rating: 4.9,
          image: 'https://images.shutterstock.com/image-photo/sushi-platter-fresh-raw-fish-600nw-1678912345.jpg',
          cookTime: '20 min',
          hasRecipe: false,
        },
        {
          id: 4,
          name: 'Vegetable Wrap',
          restaurant: 'Healthy Wraps',
          price: 2200,
          rating: 4.5,
          image: 'https://images.shutterstock.com/image-photo/vegetable-wrap-fresh-vegetables-tortilla-600nw-1789123456.jpg',
          cookTime: '12 min',
          hasRecipe: true,
        },
        {
          id: 5,
          name: 'Cucumber Salad',
          restaurant: 'Fresh Greens',
          price: 1800,
          rating: 4.4,
          image: 'https://images.shutterstock.com/image-photo/cucumber-salad-fresh-sliced-vegetables-600nw-1891234567.jpg',
          cookTime: '5 min',
          hasRecipe: true,
        },
        {
          id: 6,
          name: 'Avocado Bowl',
          restaurant: 'Healthy Bites',
          price: 3800,
          rating: 4.8,
          image: 'https://images.shutterstock.com/image-photo/avocado-bowl-fresh-healthy-green-600nw-1912345678.jpg',
          cookTime: '8 min',
          hasRecipe: true,
        },
      ]
    },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleAuthAction = () => {
    router.push('/onboarding');
  };

  const handleOrdersPress = () => {
    if (isGuest) {
      router.push('/onboarding');
    } else {
      router.push('/orders');
    }
  };

  const handleCategoryPress = (categoryRoute: string) => {
    if (categoryRoute === 'supermarket') {
      router.push('/supermarket');
    } else if (categoryRoute === 'market') {
      router.push('/market');
    } else {
      router.push({
        pathname: '/category-detail',
        params: { category: categoryRoute }
      });
    }
  };

  const handleFoodItemPress = (itemId: number) => {
    router.push({
      pathname: '/food-detail',
      params: { id: itemId }
    });
  };

  const handleFoodCategoryChange = (categoryId: string, index: number) => {
    setSelectedFoodCategory(categoryId);
    
    // Animate the indicator
    Animated.spring(indicatorAnimation, {
      toValue: index,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const getCurrentCategoryItems = () => {
    return foodCategories.find(cat => cat.id === selectedFoodCategory)?.items || [];
  };

  const handleSlideScroll = (event: any) => {
    const slideWidth = width - 40; // Account for padding
    const currentIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setCurrentSlide(currentIndex);
  };

  const scrollToSlide = (index: number) => {
    const slideWidth = width - 40;
    slideScrollRef.current?.scrollTo({ x: index * slideWidth, animated: true });
    setCurrentSlide(index);
  };

  // Pan responder for swipe gestures on category items
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Handle swipe gestures
    },
    onPanResponderRelease: (evt, gestureState) => {
      const currentIndex = foodCategories.findIndex(cat => cat.id === selectedFoodCategory);
      
      if (gestureState.dx > 50 && currentIndex > 0) {
        // Swipe right - go to previous category
        const prevCategory = foodCategories[currentIndex - 1];
        handleFoodCategoryChange(prevCategory.id, currentIndex - 1);
      } else if (gestureState.dx < -50 && currentIndex < foodCategories.length - 1) {
        // Swipe left - go to next category
        const nextCategory = foodCategories[currentIndex + 1];
        handleFoodCategoryChange(nextCategory.id, currentIndex + 1);
      }
    },
  });

  const scrollToNextCategory = () => {
    const currentIndex = foodCategories.findIndex(cat => cat.id === selectedFoodCategory);
    if (currentIndex < foodCategories.length - 1) {
      const nextCategory = foodCategories[currentIndex + 1];
      handleFoodCategoryChange(nextCategory.id, currentIndex + 1);
    }
  };

  const scrollToPrevCategory = () => {
    const currentIndex = foodCategories.findIndex(cat => cat.id === selectedFoodCategory);
    if (currentIndex > 0) {
      const prevCategory = foodCategories[currentIndex - 1];
      handleFoodCategoryChange(prevCategory.id, currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* Header with Custom Logo */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.brandContainer}>
              <CustomLogo size="large" color="#FFFFFF" />
              <Text style={styles.brandTagline}>Food Explorer</Text>
            </View>
            
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#FFFFFF" />
                <View>
                  <Text style={styles.deliveryText}>Delivery to</Text>
                  <Text style={styles.locationText}>Lagos, Nigeria ⌄</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.ordersButton} onPress={handleOrdersPress}>
                <ShoppingBag size={20} color="#FFFFFF" />
                <Text style={styles.ordersText}>Orders</Text>
              </TouchableOpacity>
            </View>
            
            {isGuest && (
              <View style={styles.guestBanner}>
                <View style={styles.guestInfo}>
                  <User size={16} color="#B8860B" />
                  <Text style={styles.guestText}>Browsing as Guest</Text>
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={handleAuthAction}>
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isGuest && profile && (
              <View style={styles.userBanner}>
                <View style={styles.userInfo}>
                  <User size={16} color="#B8860B" />
                  <Text style={styles.userText}>Welcome back, {profile.full_name?.split(' ')[0] || 'User'}!</Text>
                </View>
                <View style={styles.userStats}>
                  <Text style={styles.userPoints}>{profile.points} pts</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Food Insight Notification */}
        {showInsightNotification && (
          <View style={styles.insightNotification}>
            <View style={styles.insightContent}>
              <Text style={styles.insightIcon}>💡</Text>
              <Text style={styles.insightText}>
                Did you know? Suya cheese is a great meat alternative with equal protein benefits!
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeNotification}
              onPress={() => setShowInsightNotification(false)}
            >
              <X size={16} color="#666666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for delicious food..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Food Slide Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Today</Text>
          
          {/* Slide Navigation */}
          <View style={styles.slideNavigation}>
            <TouchableOpacity 
              style={[styles.slideNavButton, currentSlide === 0 && styles.slideNavButtonDisabled]}
              onPress={() => scrollToSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={20} color={currentSlide === 0 ? "#CCCCCC" : "#006400"} />
            </TouchableOpacity>
            
            <View style={styles.slideIndicators}>
              {featuredFoods.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slideIndicator,
                    currentSlide === index && styles.slideIndicatorActive
                  ]}
                  onPress={() => scrollToSlide(index)}
                />
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.slideNavButton, currentSlide === featuredFoods.length - 1 && styles.slideNavButtonDisabled]}
              onPress={() => scrollToSlide(Math.min(featuredFoods.length - 1, currentSlide + 1))}
              disabled={currentSlide === featuredFoods.length - 1}
            >
              <ChevronRight size={20} color={currentSlide === featuredFoods.length - 1 ? "#CCCCCC" : "#006400"} />
            </TouchableOpacity>
          </View>

          {/* Slide View */}
          <ScrollView 
            ref={slideScrollRef}
            horizontal 
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleSlideScroll}
            style={styles.slideContainer}
          >
            {featuredFoods.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.slideCard} 
                onPress={() => handleFoodItemPress(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.slideImage} />
                <View style={styles.slideBadge}>
                  <Text style={styles.slideBadgeText}>{item.badge}</Text>
                </View>
                <View style={styles.slideOverlay}>
                  <View style={styles.slideInfo}>
                    <Text style={styles.slideName}>{item.name}</Text>
                    <Text style={styles.slideRestaurant}>{item.restaurant}</Text>
                    <Text style={styles.slideDescription}>{item.description}</Text>
                    <View style={styles.slideMeta}>
                      <View style={styles.ratingContainer}>
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.slideRating}>{item.rating}</Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Clock size={14} color="#FFFFFF" />
                        <Text style={styles.slideTime}>{item.cookTime}</Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.slidePrice}>{formatPrice(item.price)}</Text>
                      <Text style={styles.slideOriginalPrice}>{formatPrice(item.originalPrice)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.orderNowButton} onPress={handleAuthAction}>
                    <Text style={styles.orderNowText}>Order Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore Categories - Updated with Supermarket & Market */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <View style={styles.categoryNavigation}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={scrollToPrevCategory}
              >
                <ChevronLeft size={20} color="#006400" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={scrollToNextCategory}
              >
                <ChevronRight size={20} color="#006400" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView 
            ref={categoryScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryItem, { backgroundColor: category.color + '15' }]}
                onPress={() => handleCategoryPress(category.route)}
              >
                <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Near You - Square Images */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <TouchableOpacity>
              <Text style={styles.showAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.foodGrid}>
            {popularItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.foodGridItem}
                onPress={() => handleFoodItemPress(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.foodGridImage} />
                <View style={styles.foodGridInfo}>
                  <Text style={styles.foodGridName}>{item.name}</Text>
                  <Text style={styles.foodGridRestaurant}>{item.restaurant}</Text>
                  <View style={styles.foodGridMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.foodGridRating}>{item.rating}</Text>
                    </View>
                    <Text style={styles.foodGridCalories}>{item.calories}</Text>
                  </View>
                  <View style={styles.foodGridBottom}>
                    <Text style={styles.foodGridPrice}>{formatPrice(item.price)}</Text>
                    <View style={styles.actionButtonsRow}>
                      {item.hasRecipe && (
                        <TouchableOpacity style={styles.cookButton}>
                          <ChefHat size={12} color="#006400" />
                          <Text style={styles.cookButtonText}>Cook</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.orderButton} onPress={handleAuthAction}>
                        <Text style={styles.orderButtonText}>Order Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced More Delicious Options with Category Scrolling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Delicious Options</Text>
          
          {/* Category Tabs with Animated Indicator */}
          <View style={styles.foodCategoryContainer}>
            <View style={styles.foodCategoryTabs}>
              {foodCategories.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.foodCategoryTab,
                    selectedFoodCategory === category.id && styles.foodCategoryTabActive
                  ]}
                  onPress={() => handleFoodCategoryChange(category.id, index)}
                >
                  <Text style={styles.foodCategoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.foodCategoryTabText,
                    selectedFoodCategory === category.id && styles.foodCategoryTabTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Animated Green Line Indicator */}
            <Animated.View 
              style={[
                styles.categoryIndicator,
                {
                  left: indicatorAnimation.interpolate({
                    inputRange: [0, foodCategories.length - 1],
                    outputRange: ['10%', '90%'],
                    extrapolate: 'clamp',
                  }),
                }
              ]} 
            />
          </View>

          {/* Category Items Vertical Scroll with Swipe Gestures */}
          <View {...panResponder.panHandlers} style={styles.categoryItemsContainer}>
            <ScrollView 
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.categoryItemsScroll}
            >
              {getCurrentCategoryItems().map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.fullWidthFoodCard}
                  onPress={() => handleFoodItemPress(item.id)}
                >
                  <Image source={{ uri: item.image }} style={styles.fullWidthFoodImage} />
                  <View style={styles.fullWidthOverlay}>
                    <View style={styles.fullWidthInfo}>
                      <Text style={styles.fullWidthName}>{item.name}</Text>
                      <Text style={styles.fullWidthRestaurant}>{item.restaurant}</Text>
                      <View style={styles.fullWidthMeta}>
                        <View style={styles.ratingContainer}>
                          <Star size={14} color="#FFD700" fill="#FFD700" />
                          <Text style={styles.fullWidthRating}>{item.rating}</Text>
                        </View>
                        <View style={styles.timeContainer}>
                          <Clock size={14} color="#FFFFFF" />
                          <Text style={styles.fullWidthTime}>{item.cookTime}</Text>
                        </View>
                        <Text style={styles.fullWidthPrice}>{formatPrice(item.price)}</Text>
                      </View>
                    </View>
                    <View style={styles.fullWidthActions}>
                      {item.hasRecipe && (
                        <TouchableOpacity style={styles.fullWidthCookButton}>
                          <ChefHat size={16} color="#006400" />
                          <Text style={styles.fullWidthCookText}>Cook</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.fullWidthOrderButton} onPress={handleAuthAction}>
                        <Text style={styles.fullWidthOrderText}>Order Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.heartButton}>
                    <Heart size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Guest Call-to-Action */}
        {isGuest && (
          <View style={styles.guestCTA}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Ready to Order?</Text>
              <Text style={styles.ctaSubtitle}>Join thousands of food lovers and start your culinary journey</Text>
              <TouchableOpacity style={styles.ctaButton} onPress={handleAuthAction}>
                <Text style={styles.ctaButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* AI Assistant */}
      <AIAssistant />
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
    paddingBottom: 20,
  },
  headerContent: {
    gap: 15,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  brandTagline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  ordersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(184, 134, 11, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  ordersText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  guestBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#B8860B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signInText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Semibold',
    fontSize: 12,
  },
  userBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  userStats: {
    backgroundColor: '#B8860B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  userPoints: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Semibold',
    fontSize: 12,
  },
  insightNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#B8860B',
  },
  insightContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    lineHeight: 20,
  },
  closeNotification: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
    marginTop: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  filterIcon: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  showAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  categoryNavigation: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    padding: 8,
  },
  categoriesScroll: {
    marginTop: 10,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginRight: 12,
    width: 100,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    textAlign: 'center',
  },
  // Slide View Styles
  slideNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  slideNavButton: {
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    padding: 8,
  },
  slideNavButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  slideIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  slideIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
  },
  slideIndicatorActive: {
    backgroundColor: '#32CD32',
    width: 24,
  },
  slideContainer: {
    marginHorizontal: -20,
  },
  slideCard: {
    width: width - 40,
    height: 280,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  slideBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  slideInfo: {
    marginBottom: 15,
  },
  slideName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  slideRestaurant: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  slideDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 12,
  },
  slideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slideRating: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slideTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slidePrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#32CD32',
  },
  slideOriginalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  orderNowButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  orderNowText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  foodGrid: {
    gap: 15,
  },
  foodGridItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodGridImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  foodGridInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  foodGridName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 2,
  },
  foodGridRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  foodGridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  foodGridRating: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  foodGridCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  foodGridBottom: {
    gap: 8,
  },
  foodGridPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  cookButtonText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  orderButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  orderButtonText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  // Food Category Scroll Styles
  foodCategoryContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  foodCategoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 15,
  },
  foodCategoryTab: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  foodCategoryTabActive: {
    // Active state handled by indicator
  },
  foodCategoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  foodCategoryTabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  foodCategoryTabTextActive: {
    color: '#006400',
    fontFamily: 'Inter-Semibold',
  },
  categoryIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '15%',
    backgroundColor: '#32CD32',
    borderRadius: 2,
    marginLeft: '-7.5%',
  },
  categoryItemsContainer: {
    flex: 1,
  },
  categoryItemsScroll: {
    marginTop: 10,
  },
  fullWidthFoodCard: {
    position: 'relative',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
  },
  fullWidthFoodImage: {
    width: '100%',
    height: '100%',
  },
  fullWidthOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  fullWidthInfo: {
    flex: 1,
  },
  fullWidthName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fullWidthRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  fullWidthMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  fullWidthRating: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  fullWidthTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  fullWidthPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#32CD32',
  },
  fullWidthActions: {
    flexDirection: 'row',
    gap: 8,
  },
  fullWidthCookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    gap: 4,
  },
  fullWidthCookText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  fullWidthOrderButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  fullWidthOrderText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  heartButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  guestCTA: {
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: '#006400',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});