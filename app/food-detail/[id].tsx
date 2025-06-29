import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, User, Heart, ShoppingCart, Plus, Minus, MapPin, Phone, ChefHat } from 'lucide-react-native';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

// Comprehensive food database with Adobe Stock style images
const foodDatabase: { [key: number]: any } = {
  1: {
    name: 'Jollof Rice Special',
    price: 4500,
    originalPrice: 5500,
    description: 'Authentic Nigerian jollof rice cooked with premium basmati rice, fresh tomatoes, bell peppers, and aromatic spices. Served with perfectly grilled chicken, fried plantain, and a side of coleslaw.',
    image: IMAGES.JOLLOF_RICE,
    rating: 4.8,
    reviews: 1245,
    chef: {
      name: 'Chef Adunni Okafor',
      restaurant: 'Lagos Kitchen',
      image: IMAGES.AFRICAN_CHEF_WOMAN,
      experience: '15 years',
      speciality: 'Nigerian Cuisine',
      rating: 4.9,
    },
    calories: 580,
    prepTime: '20-25 min',
    servingSize: '1 portion',
    nutrition: {
      calories: 580,
      protein: '32g',
      carbs: '65g',
      fats: '18g',
      fiber: '4g',
      sodium: '890mg',
    },
    ingredients: [
      { name: 'Premium Basmati Rice', included: true, allergen: false },
      { name: 'Fresh Tomatoes', included: true, allergen: false },
      { name: 'Bell Peppers', included: true, allergen: false },
      { name: 'Grilled Chicken Breast', included: true, allergen: false },
      { name: 'Fried Plantain', included: true, allergen: false },
      { name: 'Coleslaw', included: true, allergen: false },
      { name: 'Aromatic Spices', included: true, allergen: false },
    ],
    customizations: [
      { name: 'Extra Chicken', price: 2000, popular: true },
      { name: 'Extra Plantain', price: 800, popular: false },
      { name: 'Spicy Level (Mild/Medium/Hot)', price: 0, popular: true },
      { name: 'Extra Rice Portion', price: 1000, popular: false },
      { name: 'Add Beef', price: 2500, popular: false },
      { name: 'Extra Vegetables', price: 600, popular: false },
    ],
    allergens: ['None'],
    dietaryInfo: ['Gluten-Free Option Available'],
    location: {
      address: '15 Admiralty Way, Lekki Phase 1, Lagos',
      distance: '2.3 km',
      deliveryTime: '25-35 mins',
      deliveryFee: 1500,
    },
    availability: {
      isAvailable: true,
      availableUntil: '22:00',
      nextAvailable: null,
    },
    tags: ['Popular', 'Nigerian', 'Spicy', 'Comfort Food'],
  },
  2: {
    name: 'Grilled Chicken Deluxe',
    price: 6500,
    originalPrice: 7500,
    description: 'Succulent grilled chicken marinated in a blend of African spices, herbs, and citrus. Served with seasoned rice, grilled vegetables, and our signature pepper sauce.',
    image: IMAGES.GRILLED_CHICKEN,
    rating: 4.9,
    reviews: 892,
    chef: {
      name: 'Chef Emeka Okonkwo',
      restaurant: 'Spice Garden',
      image: IMAGES.NIGERIAN_MALE_CHEF,
      experience: '12 years',
      speciality: 'Grilled Specialties',
      rating: 4.8,
    },
    calories: 520,
    prepTime: '15-20 min',
    servingSize: '1 portion',
    nutrition: {
      calories: 520,
      protein: '45g',
      carbs: '28g',
      fats: '22g',
      fiber: '3g',
      sodium: '720mg',
    },
    ingredients: [
      { name: 'Free-Range Chicken', included: true, allergen: false },
      { name: 'African Spice Blend', included: true, allergen: false },
      { name: 'Seasoned Rice', included: true, allergen: false },
      { name: 'Grilled Vegetables', included: true, allergen: false },
      { name: 'Signature Pepper Sauce', included: true, allergen: true },
      { name: 'Fresh Herbs', included: true, allergen: false },
    ],
    customizations: [
      { name: 'Extra Chicken Piece', price: 3000, popular: true },
      { name: 'Double Vegetables', price: 1200, popular: false },
      { name: 'Extra Spicy Sauce', price: 0, popular: true },
      { name: 'Add Plantain', price: 1000, popular: true },
      { name: 'Substitute Rice with Salad', price: 0, popular: false },
    ],
    allergens: ['Contains Peppers'],
    dietaryInfo: ['High Protein', 'Low Carb Option'],
    location: {
      address: '8 Ozumba Mbadiwe Ave, Victoria Island, Lagos',
      distance: '1.8 km',
      deliveryTime: '20-30 mins',
      deliveryFee: 1200,
    },
    availability: {
      isAvailable: true,
      availableUntil: '23:00',
      nextAvailable: null,
    },
    tags: ['Healthy', 'Protein-Rich', 'Grilled', 'Popular'],
  },
  3: {
    name: 'Traditional Pepper Soup',
    price: 3200,
    originalPrice: 4200,
    description: 'Authentic Nigerian pepper soup with fresh catfish, aromatic spices, and traditional herbs. A warming, flavorful soup perfect for any time of day.',
    image: IMAGES.PEPPER_SOUP,
    rating: 4.7,
    reviews: 567,
    chef: {
      name: 'Chef Kemi Adeyemi',
      restaurant: 'Traditional Taste',
      image: IMAGES.AFRICAN_FEMALE_CHEF_SOUP,
      experience: '20 years',
      speciality: 'Traditional Soups',
      rating: 4.9,
    },
    calories: 320,
    prepTime: '25-30 min',
    servingSize: '1 bowl',
    nutrition: {
      calories: 320,
      protein: '38g',
      carbs: '12g',
      fats: '15g',
      fiber: '2g',
      sodium: '950mg',
    },
    ingredients: [
      { name: 'Fresh Catfish', included: true, allergen: true },
      { name: 'Pepper Soup Spice', included: true, allergen: false },
      { name: 'Scent Leaves', included: true, allergen: false },
      { name: 'Onions', included: true, allergen: false },
      { name: 'Ginger', included: true, allergen: false },
      { name: 'Traditional Herbs', included: true, allergen: false },
    ],
    customizations: [
      { name: 'Extra Fish', price: 2000, popular: true },
      { name: 'Add Goat Meat', price: 2500, popular: false },
      { name: 'Extra Spicy', price: 0, popular: true },
      { name: 'Add Yam', price: 800, popular: true },
      { name: 'Double Portion', price: 2000, popular: false },
    ],
    allergens: ['Fish'],
    dietaryInfo: ['High Protein', 'Low Carb', 'Keto-Friendly'],
    location: {
      address: '22 Allen Avenue, Ikeja, Lagos',
      distance: '3.1 km',
      deliveryTime: '30-40 mins',
      deliveryFee: 1800,
    },
    availability: {
      isAvailable: true,
      availableUntil: '21:30',
      nextAvailable: null,
    },
    tags: ['Traditional', 'Spicy', 'Healthy', 'Comfort Food'],
  },
  // Add more items as needed...
};

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Get food item by ID, fallback to first item if not found
  const foodItem = foodDatabase[Number(id)] || foodDatabase[1];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const toggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const updateQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const getCustomizationPrice = () => {
    return selectedOptions.reduce((sum, option) => {
      const customization = foodItem.customizations.find((c: any) => c.name === option);
      return sum + (customization?.price || 0);
    }, 0);
  };

  const totalPrice = (foodItem.price + getCustomizationPrice()) * quantity;

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart!',
      `${foodItem.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    );
  };

  const handleOrderNow = () => {
    router.push('/auth');
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'chef', name: 'Chef' },
    { id: 'reviews', name: 'Reviews' },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Text style={styles.description}>{foodItem.description}</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Meal Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#666666" />
            <Text style={styles.infoLabel}>Prep Time</Text>
            <Text style={styles.infoValue}>{foodItem.prepTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🔥</Text>
            <Text style={styles.infoLabel}>Calories</Text>
            <Text style={styles.infoValue}>{foodItem.calories}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🍽️</Text>
            <Text style={styles.infoLabel}>Serving</Text>
            <Text style={styles.infoValue}>{foodItem.servingSize}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Ingredients</Text>
        <View style={styles.ingredientsList}>
          {foodItem.ingredients.map((ingredient: any, index: number) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={[
                styles.ingredientIndicator,
                ingredient.included ? styles.includedIndicator : styles.notIncludedIndicator
              ]} />
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              {ingredient.allergen && (
                <View style={styles.allergenBadge}>
                  <Text style={styles.allergenText}>⚠️</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Customize Your Order</Text>
        <View style={styles.customizationsList}>
          {foodItem.customizations.map((customization: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.customizationItem}
              onPress={() => toggleOption(customization.name)}
            >
              <View style={[
                styles.customizationCheckbox,
                selectedOptions.includes(customization.name) && styles.customizationCheckboxActive
              ]}>
                {selectedOptions.includes(customization.name) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <View style={styles.customizationInfo}>
                <View style={styles.customizationHeader}>
                  <Text style={styles.customizationName}>{customization.name}</Text>
                  {customization.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.customizationPrice}>
                  {customization.price > 0 ? `+${formatPrice(customization.price)}` : 'Free'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderNutrition = () => (
    <View style={styles.tabContent}>
      <View style={styles.nutritionGrid}>
        {Object.entries(foodItem.nutrition).map(([key, value]) => (
          <View key={key} style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{value}</Text>
            <Text style={styles.nutritionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Dietary Information</Text>
        <View style={styles.dietaryTags}>
          {foodItem.dietaryInfo.map((info: string, index: number) => (
            <View key={index} style={styles.dietaryTag}>
              <Text style={styles.dietaryTagText}>{info}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Allergen Information</Text>
        <View style={styles.allergensList}>
          {foodItem.allergens.map((allergen: string, index: number) => (
            <View key={index} style={styles.allergenItem}>
              <Text style={styles.allergenItemText}>{allergen}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderChef = () => (
    <View style={styles.tabContent}>
      <View style={styles.chefCard}>
        <ImageWithFallback 
          source={foodItem.chef.image} 
          style={styles.chefImage}
          fallback={IMAGES.DEFAULT_CHEF}
        />
        <View style={styles.chefInfo}>
          <Text style={styles.chefName}>{foodItem.chef.name}</Text>
          <Text style={styles.chefRestaurant}>{foodItem.chef.restaurant}</Text>
          <Text style={styles.chefSpeciality}>{foodItem.chef.speciality}</Text>
          <View style={styles.chefMeta}>
            <View style={styles.chefRating}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.chefRatingText}>{foodItem.chef.rating}</Text>
            </View>
            <Text style={styles.chefExperience}>{foodItem.chef.experience} experience</Text>
          </View>
        </View>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#006400" />
          <Text style={styles.locationTitle}>Restaurant Location</Text>
        </View>
        <Text style={styles.locationAddress}>{foodItem.location.address}</Text>
        <View style={styles.locationMeta}>
          <Text style={styles.locationDistance}>{foodItem.location.distance} away</Text>
          <Text style={styles.deliveryTime}>Delivery: {foodItem.location.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>Fee: {formatPrice(foodItem.location.deliveryFee)}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <Phone size={16} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact Restaurant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <View style={styles.overallRating}>
          <Text style={styles.ratingNumber}>{foodItem.rating}</Text>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, index) => (
              <Star 
                key={index} 
                size={16} 
                color={index < Math.floor(foodItem.rating) ? "#FFD700" : "#D3D3D3"}
                fill={index < Math.floor(foodItem.rating) ? "#FFD700" : "transparent"}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>Based on {foodItem.reviews} reviews</Text>
        </View>
      </View>
      
      <Text style={styles.reviewsComingSoon}>
        Detailed reviews coming soon! We're working on bringing you authentic customer feedback.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Details</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={24}
              color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
              fill={isFavorite ? "#FF6B6B" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Food Image */}
        <ImageWithFallback 
          source={foodItem.image} 
          style={styles.foodImage}
          fallback={IMAGES.DEFAULT_FOOD}
        />

        {/* Food Info */}
        <View style={styles.foodInfo}>
          <View style={styles.foodHeader}>
            <View style={styles.foodTitleSection}>
              <Text style={styles.foodName}>{foodItem.name}</Text>
              <View style={styles.priceSection}>
                <Text style={styles.currentPrice}>{formatPrice(totalPrice)}</Text>
                {foodItem.originalPrice > foodItem.price && (
                  <Text style={styles.originalPrice}>{formatPrice(foodItem.originalPrice)}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.ratingSection}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{foodItem.rating}</Text>
              <Text style={styles.reviews}>({foodItem.reviews}+ ratings)</Text>
            </View>

            <View style={styles.tagsSection}>
              {foodItem.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && styles.activeTab
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText
                  ]}>
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'chef' && renderChef()}
          {activeTab === 'reviews' && renderReviews()}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.quantitySection}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(-1)}
          >
            <Minus size={20} color="#006400" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(1)}
          >
            <Plus size={20} color="#006400" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <ShoppingCart size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.orderNowButton} onPress={handleOrderNow}>
            <Text style={styles.orderNowText}>Order Now - {formatPrice(totalPrice)}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  favoriteButton: {
    padding: 8,
  },
  foodImage: {
    width: '100%',
    height: 250,
  },
  foodInfo: {
    padding: 20,
  },
  foodHeader: {
    marginBottom: 20,
  },
  foodTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    flex: 1,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  reviews: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tab: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#006400',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    lineHeight: 24,
  },
  infoSection: {
    gap: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  includedIndicator: {
    backgroundColor: '#4CAF50',
  },
  notIncludedIndicator: {
    backgroundColor: '#D3D3D3',
  },
  ingredientName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    flex: 1,
  },
  allergenBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 4,
  },
  allergenText: {
    fontSize: 12,
  },
  customizationsList: {
    gap: 15,
  },
  customizationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customizationCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customizationCheckboxActive: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  customizationInfo: {
    flex: 1,
  },
  customizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  customizationName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  popularBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  customizationPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#006400',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  nutritionItem: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    width: '30%',
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#006400',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  dietaryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietaryTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  dietaryTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  allergensList: {
    gap: 8,
  },
  allergenItem: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  allergenItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF8F00',
  },
  chefCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    gap: 15,
  },
  chefImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  chefInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chefName: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  chefRestaurant: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
    marginBottom: 4,
  },
  chefSpeciality: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  chefMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  chefRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chefRatingText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  chefExperience: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  locationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginBottom: 10,
  },
  locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  locationDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  deliveryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  deliveryFee: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006400',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  reviewsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallRating: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#006400',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  reviewsComingSoon: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 20,
    gap: 15,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#006400',
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#006400',
  },
  orderNowButton: {
    flex: 2,
    backgroundColor: '#006400',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNowText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});