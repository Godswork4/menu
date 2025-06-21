import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, Clock, MapPin, Filter } from 'lucide-react-native';

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Nearby', 'Rating', 'Price', 'Delivery Time'];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const restaurants = [
    {
      id: 1,
      name: 'Green Garden Bistro',
      cuisine: 'Healthy Mediterranean',
      rating: 4.8,
      reviews: 2341,
      deliveryTime: '20-30',
      deliveryFee: 1495,
      image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      featured: true,
    },
    {
      id: 2,
      name: 'Spice Kitchen',
      cuisine: 'Indian Fusion',
      rating: 4.6,
      reviews: 1876,
      deliveryTime: '25-35',
      deliveryFee: 1745,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      featured: false,
    },
    {
      id: 3,
      name: 'Ocean Fresh',
      cuisine: 'Seafood & Sushi',
      rating: 4.9,
      reviews: 987,
      deliveryTime: '30-40',
      deliveryFee: 2495,
      image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
      featured: true,
    },
    {
      id: 4,
      name: 'Farm to Table',
      cuisine: 'Organic Local',
      rating: 4.7,
      reviews: 1654,
      deliveryTime: '15-25',
      deliveryFee: 995,
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      featured: false,
    },
  ];

  const chefs = [
    {
      id: 1,
      name: 'Chef Maria Rodriguez',
      specialty: 'Italian Cuisine',
      rating: 4.9,
      orders: 543,
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    {
      id: 2,
      name: 'Chef James Chen',
      specialty: 'Asian Fusion',
      rating: 4.8,
      orders: 721,
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Restaurants & Chefs</Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants or chefs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#006400" />
          </TouchableOpacity>
        </View>

        {/* Filter Tags */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTag,
                selectedFilter === filter && styles.filterTagActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterTagText,
                selectedFilter === filter && styles.filterTagTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.filter(r => r.featured).map((restaurant) => (
              <TouchableOpacity key={restaurant.id} style={styles.featuredCard}>
                <Image source={{ uri: restaurant.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredName}>{restaurant.name}</Text>
                  <Text style={styles.featuredCuisine}>{restaurant.cuisine}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Restaurants</Text>
          {restaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{restaurant.rating}</Text>
                    <Text style={styles.reviews}>({restaurant.reviews})</Text>
                  </View>
                  
                  <View style={styles.deliveryInfo}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.deliveryTime}>{restaurant.deliveryTime} min</Text>
                    <Text style={styles.deliveryFee}>{formatPrice(restaurant.deliveryFee)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Private Chefs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Private Chefs</Text>
          {chefs.map((chef) => (
            <TouchableOpacity key={chef.id} style={styles.chefCard}>
              <Image source={{ uri: chef.image }} style={styles.chefImage} />
              <View style={styles.chefInfo}>
                <Text style={styles.chefName}>{chef.name}</Text>
                <Text style={styles.chefSpecialty}>{chef.specialty}</Text>
                
                <View style={styles.chefMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{chef.rating}</Text>
                  </View>
                  <Text style={styles.chefOrders}>{chef.orders} orders</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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
  filterButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#006400',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterTagActive: {
    backgroundColor: '#006400',
  },
  filterTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  filterTagTextActive: {
    color: '#FFFFFF',
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
  featuredCard: {
    width: 200,
    height: 140,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
  featuredName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  featuredCuisine: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginTop: 2,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  restaurantMeta: {
    gap: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  reviews: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  deliveryFee: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
    marginLeft: 'auto',
  },
  chefCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  chefImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chefInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chefName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  chefSpecialty: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 6,
  },
  chefMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chefOrders: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});