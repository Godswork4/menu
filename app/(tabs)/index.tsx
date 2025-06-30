import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Star, Clock, MapPin, ChevronRight, ChevronLeft, Heart } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const { user, profile } = useAuth();

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️', color: '#FF6B6B' },
    { id: 'nigerian', name: 'Nigerian', icon: '🇳🇬', color: '#4ECDC4' },
    { id: 'continental', name: 'Continental', icon: '🌍', color: '#45B7D1' },
    { id: 'chinese', name: 'Chinese', icon: '🥢', color: '#FFA726' },
    { id: 'italian', name: 'Italian', icon: '🍝', color: '#AB47BC' },
    { id: 'indian', name: 'Indian', icon: '🍛', color: '#FF5722' },
  ];

  const featuredItems = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      description: 'Authentic Nigerian jollof rice with premium spices, grilled chicken, and fried plantain',
      price: 4500,
      originalPrice: 5500,
      rating: 4.8,
      deliveryTime: '20 min',
      image: 'https://images.pexels.com/photos/5695880/pexels-photo-5695880.jpeg',
    },
    {
      id: 2,
      name: 'Grilled Chicken Deluxe',
      restaurant: 'Spice Garden',
      description: 'Succulent grilled chicken marinated in African spices, served with seasoned rice',
      price: 6500,
      originalPrice: 7500,
      rating: 4.9,
      deliveryTime: '25 min',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    },
    {
      id: 3,
      name: 'Traditional Pepper Soup',
      restaurant: 'Traditional Taste',
      description: 'Authentic Nigerian pepper soup with fresh catfish and aromatic spices',
      price: 3200,
      originalPrice: 4200,
      rating: 4.7,
      deliveryTime: '15 min',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
    },
    {
      id: 4,
      name: 'Suya Platter',
      restaurant: 'Suya Spot',
      description: 'Premium beef suya with fresh onions, tomatoes, and special suya spice',
      price: 6500,
      originalPrice: 7500,
      rating: 4.8,
      deliveryTime: '20 min',
      image: 'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg',
    },
  ];

  const popularRestaurants = [
    {
      id: 1,
      name: 'Lagos Kitchen',
      cuisine: 'Nigerian',
      rating: 4.8,
      deliveryTime: '20-30 min',
      deliveryFee: 1200,
      image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
    },
    {
      id: 2,
      name: 'Spice Garden',
      cuisine: 'Continental',
      rating: 4.6,
      deliveryTime: '25-35 min',
      deliveryFee: 1500,
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    },
    {
      id: 3,
      name: 'Ocean Fresh',
      cuisine: 'Seafood',
      rating: 4.9,
      deliveryTime: '30-40 min',
      deliveryFee: 1800,
      image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
    },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  const handleFoodPress = (id: number) => {
    router.push({
      pathname: '/food-detail',
      params: { id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={18} color="#FFFFFF" />
            <View>
              <Text style={styles.deliveryText}>Delivery to</Text>
              <Text style={styles.locationText}>Lagos, Nigeria</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.ordersButton} onPress={() => router.push('/orders')}>
            <Text style={styles.ordersText}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for delicious food..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoIcon}>🍖</Text>
            <Text style={styles.promoText}>
              Did you know? Suya cheese is a great meat alternative with equal protein benefits!
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Today */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Today</Text>
          <View style={styles.paginationContainer}>
            {featuredItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlide === index ? styles.paginationDotActive : {}
                ]}
              />
            ))}
          </View>
          <View style={styles.carouselControls}>
            <TouchableOpacity style={styles.carouselControl} onPress={prevSlide}>
              <ChevronLeft size={20} color="#006400" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.carouselControl} onPress={nextSlide}>
              <ChevronRight size={20} color="#006400" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.featuredCard}
          onPress={() => handleFoodPress(featuredItems[currentSlide].id)}
        >
          <Image 
            source={{ uri: featuredItems[currentSlide].image }} 
            style={styles.featuredImage} 
          />
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredContent}>
              <Text style={styles.restaurantName}>{featuredItems[currentSlide].restaurant}</Text>
              <Text style={styles.foodName}>{featuredItems[currentSlide].name}</Text>
              <Text style={styles.foodDescription} numberOfLines={2}>
                {featuredItems[currentSlide].description}
              </Text>
              <View style={styles.featuredMeta}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{featuredItems[currentSlide].rating}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Clock size={16} color="#FFFFFF" />
                  <Text style={styles.timeText}>{featuredItems[currentSlide].deliveryTime}</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>
                  {formatPrice(featuredItems[currentSlide].price)}
                </Text>
                <Text style={styles.originalPrice}>
                  {formatPrice(featuredItems[currentSlide].originalPrice)}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <View style={styles.carouselControls}>
            <TouchableOpacity style={styles.carouselControl}>
              <ChevronLeft size={20} color="#006400" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.carouselControl}>
              <ChevronRight size={20} color="#006400" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                activeCategory === category.name && { borderColor: category.color }
              ]}
              onPress={() => setActiveCategory(category.name)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Text style={styles.categoryIconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantsContainer}>
          {popularRestaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantCardName}>{restaurant.name}</Text>
                <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.deliveryTimeText}>{restaurant.deliveryTime}</Text>
                  </View>
                  <Text style={styles.deliveryFeeText}>
                    {formatPrice(restaurant.deliveryFee)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended For You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.recommendedContainer}
        >
          {featuredItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.recommendedCard}
              onPress={() => handleFoodPress(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.recommendedImage} />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Heart 
                  size={20} 
                  color={favorites.includes(item.id) ? "#FF6B6B" : "#FFFFFF"} 
                  fill={favorites.includes(item.id) ? "#FF6B6B" : "transparent"}
                />
              </TouchableOpacity>
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedName}>{item.name}</Text>
                <Text style={styles.recommendedRestaurant}>{item.restaurant}</Text>
                <View style={styles.recommendedMeta}>
                  <Text style={styles.recommendedPrice}>{formatPrice(item.price)}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.smallRatingText}>{item.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontFamily: 'Inter-Regular',
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter-Semibold',
  },
  ordersButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ordersText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  promoBanner: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  promoIcon: {
    fontSize: 24,
  },
  promoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#999999',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
  },
  paginationDotActive: {
    backgroundColor: '#32CD32',
    width: 16,
  },
  carouselControls: {
    flexDirection: 'row',
    gap: 8,
  },
  carouselControl: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    marginBottom: 16,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredContent: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  foodName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#32CD32',
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
  orderButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  orderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333333',
  },
  restaurantsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
  },
  restaurantCardName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  deliveryFeeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  recommendedContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  recommendedCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedName: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  recommendedRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  recommendedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  smallRatingText: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
});