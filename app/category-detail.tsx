import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, Star, Clock, MapPin, ChefHat, Heart, Filter } from 'lucide-react-native';

// Move categoryData outside the component to prevent recreation on every render
const categoryData: { [key: string]: any } = {
  'restaurants': {
    title: 'Restaurants',
    subtitle: 'Fine dining and casual restaurants',
    icon: '🍽️',
    color: '#FF6B6B',
    filters: ['All', 'Fine Dining', 'Casual', 'Fast Food', 'Family Style'],
    items: [
      {
        id: 1,
        name: 'Truffle Risotto',
        restaurant: 'Bella Vista Italian',
        chef: 'Chef Marco Romano',
        location: 'Victoria Island, 0.8 km',
        price: 14495,
        originalPrice: 17995,
        rating: 4.9,
        reviews: 234,
        cookTime: '25 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/149/non_2x/ai-generative-truffle-risotto-italian-cuisine-gourmet-dish-free-photo.jpg',
        description: 'Creamy arborio rice with black truffle shavings and parmesan',
        hasRecipe: true,
      },
      {
        id: 2,
        name: 'Wagyu Steak',
        restaurant: 'Prime Steakhouse',
        chef: 'Chef Robert Johnson',
        location: 'Ikoyi, 1.2 km',
        price: 32500,
        originalPrice: 37500,
        rating: 4.8,
        reviews: 189,
        cookTime: '30 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/150/non_2x/ai-generative-wagyu-steak-premium-beef-grilled-perfection-free-photo.jpg',
        description: 'Premium A5 Wagyu beef with seasonal vegetables',
        hasRecipe: false,
      },
      {
        id: 3,
        name: 'Lobster Thermidor',
        restaurant: 'Ocean Pearl',
        chef: 'Chef Sarah Chen',
        location: 'Lekki, 2.1 km',
        price: 21250,
        originalPrice: 26250,
        rating: 4.7,
        reviews: 156,
        cookTime: '35 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/151/non_2x/ai-generative-lobster-thermidor-french-cuisine-gourmet-seafood-free-photo.jpg',
        description: 'Classic French lobster dish with cognac cream sauce',
        hasRecipe: true,
      },
    ]
  },
  'street-food': {
    title: 'Street Food',
    subtitle: 'Authentic street food from around the world',
    icon: '🌮',
    color: '#4ECDC4',
    filters: ['All', 'Nigerian', 'Asian', 'Middle Eastern', 'American'],
    items: [
      {
        id: 1,
        name: 'Suya Wrap',
        restaurant: 'Abuja Suya Spot',
        chef: 'Chef Musa Ibrahim',
        location: 'Surulere, 0.5 km',
        price: 6495,
        originalPrice: 8495,
        rating: 4.8,
        reviews: 342,
        cookTime: '10 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/152/non_2x/ai-generative-suya-wrap-nigerian-street-food-spiced-beef-free-photo.jpg',
        description: 'Spiced grilled beef in soft wrap with vegetables',
        hasRecipe: true,
      },
      {
        id: 2,
        name: 'Jollof Rice Bowl',
        restaurant: 'Mama\'s Kitchen',
        chef: 'Chef Adunni Okafor',
        location: 'Ikeja, 1.0 km',
        price: 4250,
        originalPrice: 5750,
        rating: 4.9,
        reviews: 278,
        cookTime: '8 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/089/non_2x/ai-generative-jollof-rice-nigerian-dish-tomato-spices-free-photo.jpg',
        description: 'Nigerian jollof rice with chicken and plantain',
        hasRecipe: true,
      },
      {
        id: 3,
        name: 'Akara & Bread',
        restaurant: 'Lagos Street Food',
        chef: 'Chef Kemi Adebayo',
        location: 'Yaba, 0.7 km',
        price: 2995,
        originalPrice: 3995,
        rating: 4.6,
        reviews: 195,
        cookTime: '12 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/153/non_2x/ai-generative-akara-bread-nigerian-bean-cakes-breakfast-free-photo.jpg',
        description: 'Crispy bean cakes with fresh bread and pepper sauce',
        hasRecipe: true,
      },
    ]
  },
  'bakery': {
    title: 'Bakery',
    subtitle: 'Fresh baked goods and artisan breads',
    icon: '🥖',
    color: '#FFA726',
    filters: ['All', 'Breads', 'Pastries', 'Cakes', 'Cookies'],
    items: [
      {
        id: 1,
        name: 'Artisan Sourdough',
        restaurant: 'Golden Crust Bakery',
        chef: 'Baker Emma Thompson',
        location: 'Gbagada, 0.6 km',
        price: 3495,
        originalPrice: 4495,
        rating: 4.9,
        reviews: 167,
        cookTime: '24 hrs fermentation',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/154/non_2x/ai-generative-artisan-sourdough-bread-rustic-bakery-loaf-free-photo.jpg',
        description: 'Traditional sourdough with 48-hour fermentation process',
        hasRecipe: true,
      },
      {
        id: 2,
        name: 'Meat Pie',
        restaurant: 'Nigerian Bakery',
        chef: 'Baker Tunde Bakare',
        location: 'Ojuelegba, 1.1 km',
        price: 1250,
        originalPrice: 1750,
        rating: 4.8,
        reviews: 298,
        cookTime: 'Fresh daily',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/107/non_2x/ai-generative-meat-pie-nigerian-pastry-savory-baked-free-photo.jpg',
        description: 'Flaky pastry filled with seasoned minced meat',
        hasRecipe: true,
      },
      {
        id: 3,
        name: 'Chin Chin',
        restaurant: 'Sweet Dreams Bakery',
        chef: 'Baker Funmi Adeyemi',
        location: 'Mushin, 0.9 km',
        price: 1995,
        originalPrice: 2995,
        rating: 4.7,
        reviews: 134,
        cookTime: 'Made to order',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/109/non_2x/ai-generative-chin-chin-nigerian-fried-snack-sweet-crunchy-free-photo.jpg',
        description: 'Crunchy fried dough cubes with sugar coating',
        hasRecipe: false,
      },
    ]
  },
  'desserts': {
    title: 'Desserts',
    subtitle: 'Sweet treats and decadent desserts',
    icon: '🍰',
    color: '#45B7D1',
    filters: ['All', 'Cakes', 'Ice Cream', 'Chocolate', 'Fruit-based'],
    items: [
      {
        id: 1,
        name: 'Chocolate Cake',
        restaurant: 'Sweet Treats',
        chef: 'Pastry Chef Bola Adebisi',
        location: 'Magodo, 0.8 km',
        price: 4495,
        originalPrice: 6495,
        rating: 4.9,
        reviews: 245,
        cookTime: '6 hrs chilling',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/155/non_2x/ai-generative-chocolate-cake-rich-dessert-cream-frosting-free-photo.jpg',
        description: 'Rich chocolate cake with cream frosting',
        hasRecipe: true,
      },
      {
        id: 2,
        name: 'Puff Puff',
        restaurant: 'Lagos Sweets',
        chef: 'Chef Ngozi Okoro',
        location: 'Festac, 1.3 km',
        price: 1995,
        originalPrice: 2995,
        rating: 4.8,
        reviews: 189,
        cookTime: '15 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/110/non_2x/ai-generative-puff-puff-nigerian-fried-dough-sweet-snack-free-photo.jpg',
        description: 'Sweet fried dough balls dusted with sugar',
        hasRecipe: true,
      },
      {
        id: 3,
        name: 'Coconut Candy',
        restaurant: 'Traditional Sweets',
        chef: 'Chef Amina Hassan',
        location: 'Alaba, 1.5 km',
        price: 1495,
        originalPrice: 2495,
        rating: 4.7,
        reviews: 156,
        cookTime: '4 hrs setting',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/156/non_2x/ai-generative-coconut-candy-nigerian-sweet-treat-dessert-free-photo.jpg',
        description: 'Sweet coconut candy with local spices',
        hasRecipe: true,
      },
    ]
  },
  'healthy': {
    title: 'Healthy Options',
    subtitle: 'Nutritious and delicious healthy meals',
    icon: '🥗',
    color: '#26A69A',
    filters: ['All', 'Salads', 'Smoothie Bowls', 'Protein Bowls', 'Vegan'],
    items: [
      {
        id: 1,
        name: 'Garden Salad Bowl',
        restaurant: 'Green Garden',
        chef: 'Chef Lisa Martinez',
        location: 'Lekki Phase 1, 0.4 km',
        price: 7495,
        originalPrice: 9495,
        rating: 4.8,
        reviews: 312,
        cookTime: '15 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/113/non_2x/ai-generative-garden-salad-fresh-vegetables-mixed-greens-free-photo.jpg',
        description: 'Mixed greens, vegetables, and healthy dressing',
        hasRecipe: true,
      },
      {
        id: 2,
        name: 'Fruit Bowl',
        restaurant: 'Tropical Vibes',
        chef: 'Chef Carlos Rivera',
        location: 'Ajah, 1.2 km',
        price: 5750,
        originalPrice: 7750,
        rating: 4.9,
        reviews: 267,
        cookTime: '10 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/101/non_2x/ai-generative-fresh-fruit-salad-tropical-fruits-healthy-free-photo.jpg',
        description: 'Fresh tropical fruits with yogurt and granola',
        hasRecipe: true,
      },
      {
        id: 3,
        name: 'Grilled Fish Salad',
        restaurant: 'Ocean Fresh',
        chef: 'Chef David Kim',
        location: 'Apapa, 1.8 km',
        price: 9495,
        originalPrice: 12495,
        rating: 4.7,
        reviews: 198,
        cookTime: '20 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/157/non_2x/ai-generative-grilled-fish-salad-healthy-seafood-meal-fresh-free-photo.jpg',
        description: 'Grilled tilapia with mixed greens and citrus dressing',
        hasRecipe: false,
      },
    ]
  },
  'budget-meals': {
    title: 'Budget Meals',
    subtitle: 'Delicious meals that won\'t break the bank',
    icon: '💰',
    color: '#FFD54F',
    filters: ['All', 'Under ₦5K', 'Under ₦10K', 'Family Size', 'Student Deals'],
    items: [
      {
        id: 1,
        name: 'Rice & Beans',
        restaurant: 'Budget Bites',
        chef: 'Chef Tony Chen',
        location: 'Unilag Area, 0.3 km',
        price: 2995,
        originalPrice: 4495,
        rating: 4.6,
        reviews: 423,
        cookTime: '12 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/158/non_2x/ai-generative-rice-and-beans-nigerian-staple-food-budget-free-photo.jpg',
        description: 'Rice and beans with plantain and stew',
        hasRecipe: true,
      },
      {
        id: 2,
        name: 'Eba & Soup',
        restaurant: 'Mama\'s Kitchen',
        chef: 'Chef Rosa Gonzalez',
        location: 'Agege, 0.7 km',
        price: 3250,
        originalPrice: 4750,
        rating: 4.5,
        reviews: 356,
        cookTime: '15 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/159/non_2x/ai-generative-eba-soup-nigerian-garri-vegetable-soup-meal-free-photo.jpg',
        description: 'Garri (eba) with vegetable soup and meat',
        hasRecipe: true,
      },
      {
        id: 3,
        name: 'Bread & Akara',
        restaurant: 'Quick Eats',
        chef: 'Chef Miguel Rodriguez',
        location: 'Oshodi, 0.5 km',
        price: 1995,
        originalPrice: 2995,
        rating: 4.4,
        reviews: 289,
        cookTime: '8 min',
        image: 'https://static.vecteezy.com/system/resources/previews/023/337/153/non_2x/ai-generative-akara-bread-nigerian-bean-cakes-breakfast-free-photo.jpg',
        description: 'Fresh bread with bean cakes and pepper sauce',
        hasRecipe: true,
      },
    ]
  }
};

export default function CategoryDetail() {
  const { category } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);

  const currentCategory = categoryData[category as string] || categoryData['restaurants'];
  const [filteredItems, setFilteredItems] = useState(currentCategory.items);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  useEffect(() => {
    let filtered = currentCategory.items;
    
    if (selectedFilter !== 'All') {
      // Filter logic based on category and filter type
      filtered = currentCategory.items.filter((item: any) => {
        // Add specific filtering logic here based on the filter type
        return true; // For now, show all items
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chef.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedFilter, searchQuery, currentCategory]);

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleOrderNow = () => {
    router.push('/auth');
  };

  const handleGetRecipe = () => {
    // Navigate to recipe detail or show recipe modal
    console.log('Get Recipe pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: currentCategory.color }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>{currentCategory.icon}</Text>
            <Text style={styles.headerTitle}>{currentCategory.title}</Text>
            <Text style={styles.headerSubtitle}>{currentCategory.subtitle}</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${currentCategory.title.toLowerCase()}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={currentCategory.color} />
          </TouchableOpacity>
        </View>

        {/* Filter Tags */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {currentCategory.filters.map((filter: string) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTag,
                selectedFilter === filter && [styles.filterTagActive, { backgroundColor: currentCategory.color }]
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

        {/* Items List */}
        <View style={styles.itemsSection}>
          <Text style={styles.itemsTitle}>
            {filteredItems.length} {currentCategory.title} Available
          </Text>
          
          {filteredItems.map((item: any) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.itemCard}
              onPress={() => router.push('/food-detail')}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              
              {/* Favorite Button */}
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

              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                    {item.originalPrice > item.price && (
                      <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{item.restaurant}</Text>
                  <Text style={styles.chefName}>by {item.chef}</Text>
                </View>

                <Text style={styles.itemDescription}>{item.description}</Text>

                <View style={styles.itemMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                    <Text style={styles.reviews}>({item.reviews})</Text>
                  </View>
                  
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#666666" />
                    <Text style={styles.location}>{item.location}</Text>
                  </View>
                  
                  <View style={styles.timeContainer}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.cookTime}>{item.cookTime}</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  {item.hasRecipe && (
                    <TouchableOpacity 
                      style={[styles.recipeButton, { borderColor: currentCategory.color }]}
                      onPress={handleGetRecipe}
                    >
                      <ChefHat size={16} color={currentCategory.color} />
                      <Text style={[styles.recipeButtonText, { color: currentCategory.color }]}>
                        Get Recipe
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.orderButton, { backgroundColor: currentCategory.color }]}
                    onPress={handleOrderNow}
                  >
                    <Text style={styles.orderButtonText}>Order Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
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
    borderColor: '#D3D3D3',
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
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  filterTagActive: {
    borderColor: 'transparent',
  },
  filterTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  filterTagTextActive: {
    color: '#FFFFFF',
  },
  itemsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  itemInfo: {
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    flex: 1,
    marginRight: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  restaurantInfo: {
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#333333',
  },
  chefName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 15,
  },
  itemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cookTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  recipeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 2,
    gap: 6,
  },
  recipeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
  },
  orderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});