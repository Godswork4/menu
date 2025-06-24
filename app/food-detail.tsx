import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, User, Heart, ShoppingCart, Plus, Minus } from 'lucide-react-native';

// Food items database with proper mapping and high-quality Shutterstock images
const foodDatabase: { [key: number]: any } = {
  1: {
    name: 'Jollof Rice Special',
    price: 4500,
    originalPrice: 5500,
    description: 'Authentic Nigerian jollof rice cooked with premium ingredients, served with grilled chicken and fried plantain.',
    image: 'https://www.shutterstock.com/image-photo/jollof-rice-nigerian-dish-tomato-600nw-1518358448.jpg',
    rating: 4.8,
    reviews: 1245,
    chef: {
      name: 'Chef Adunni Okafor',
      restaurant: 'Lagos Kitchen',
      image: 'https://www.shutterstock.com/image-photo/african-chef-woman-kitchen-cooking-600nw-1847392967.jpg',
    },
    calories: 580,
    prepTime: '20 min',
    nutrition: {
      calories: 580,
      protein: '32g',
      carbs: '65g',
      fats: '18g',
    },
    ingredients: [
      { name: 'Premium Rice', included: true },
      { name: 'Chicken Stock', included: true },
      { name: 'Tomatoes', included: true },
      { name: 'Grilled Chicken', included: true },
      { name: 'Fried Plantain', included: true },
    ],
    customizations: [
      { name: 'Extra Chicken', price: 2000 },
      { name: 'Extra Plantain', price: 800 },
      { name: 'Spicy Level', price: 0 },
      { name: 'Extra Rice', price: 1000 },
    ],
  },
  2: {
    name: 'Amala & Ewedu',
    price: 3800,
    originalPrice: 4800,
    description: 'Traditional Yoruba dish with smooth amala served with nutritious ewedu soup and assorted meat.',
    image: 'https://www.shutterstock.com/image-photo/amala-ewedu-beef-stew-white-ceramic-1518358448.jpg',
    rating: 4.9,
    reviews: 892,
    chef: {
      name: 'Chef Bola Adebisi',
      restaurant: 'Yoruba Kitchen',
      image: 'https://www.shutterstock.com/image-photo/nigerian-chef-traditional-kitchen-cooking-600nw-1847392971.jpg',
    },
    calories: 420,
    prepTime: '25 min',
    nutrition: {
      calories: 420,
      protein: '28g',
      carbs: '48g',
      fats: '16g',
    },
    ingredients: [
      { name: 'Yam Flour', included: true },
      { name: 'Ewedu Leaves', included: true },
      { name: 'Assorted Meat', included: true },
      { name: 'Palm Oil', included: true },
      { name: 'Locust Beans', included: true },
    ],
    customizations: [
      { name: 'Extra Meat', price: 1500 },
      { name: 'Fish Addition', price: 2000 },
      { name: 'Extra Ewedu', price: 800 },
      { name: 'Stockfish', price: 1200 },
    ],
  },
  3: {
    name: 'Pounded Yam & Egusi',
    price: 5200,
    originalPrice: 6500,
    description: 'Smooth pounded yam served with rich egusi soup made with melon seeds, vegetables, and assorted meat.',
    image: 'https://www.shutterstock.com/image-photo/pounded-yam-egusi-soup-nigerian-600nw-1847392847.jpg',
    rating: 4.7,
    reviews: 567,
    chef: {
      name: 'Chef Emeka Okonkwo',
      restaurant: 'Traditional Taste',
      image: 'https://www.shutterstock.com/image-photo/nigerian-male-chef-traditional-attire-600nw-1847392975.jpg',
    },
    calories: 650,
    prepTime: '30 min',
    nutrition: {
      calories: 650,
      protein: '35g',
      carbs: '78g',
      fats: '22g',
    },
    ingredients: [
      { name: 'Fresh Yam', included: true },
      { name: 'Melon Seeds', included: true },
      { name: 'Spinach', included: true },
      { name: 'Assorted Meat', included: true },
      { name: 'Stockfish', included: true },
    ],
    customizations: [
      { name: 'Extra Yam', price: 1000 },
      { name: 'Extra Meat', price: 2000 },
      { name: 'Fish Addition', price: 1800 },
      { name: 'Extra Vegetables', price: 600 },
    ],
  },
  4: {
    name: 'Pepper Soup',
    price: 3200,
    originalPrice: 4200,
    description: 'Spicy Nigerian pepper soup with fresh fish, aromatic spices, and traditional herbs.',
    image: 'https://www.shutterstock.com/image-photo/nigerian-pepper-soup-fish-spicy-600nw-1847392856.jpg',
    rating: 4.9,
    reviews: 1887,
    chef: {
      name: 'Chef Kemi Adeyemi',
      restaurant: 'Traditional Taste',
      image: 'https://www.shutterstock.com/image-photo/african-female-chef-cooking-traditional-600nw-1847392979.jpg',
    },
    calories: 320,
    prepTime: '25 min',
    nutrition: {
      calories: 320,
      protein: '38g',
      carbs: '12g',
      fats: '15g',
    },
    ingredients: [
      { name: 'Fresh Fish', included: true },
      { name: 'Pepper Soup Spice', included: true },
      { name: 'Scent Leaves', included: true },
      { name: 'Onions', included: true },
      { name: 'Ginger', included: true },
    ],
    customizations: [
      { name: 'Extra Fish', price: 2000 },
      { name: 'Goat Meat', price: 2500 },
      { name: 'Extra Spicy', price: 0 },
      { name: 'Yam Addition', price: 800 },
    ],
  },
  5: {
    name: 'Suya Platter',
    price: 6500,
    originalPrice: 8000,
    description: 'Grilled spiced beef skewers with traditional suya spice, served with onions, tomatoes, and cucumber.',
    image: 'https://www.shutterstock.com/image-photo/suya-nigerian-grilled-meat-spices-600nw-1847392863.jpg',
    rating: 4.8,
    reviews: 1245,
    chef: {
      name: 'Chef Musa Ibrahim',
      restaurant: 'Suya Spot',
      image: 'https://www.shutterstock.com/image-photo/nigerian-suya-chef-grilling-meat-600nw-1847392983.jpg',
    },
    calories: 450,
    prepTime: '15 min',
    nutrition: {
      calories: 450,
      protein: '45g',
      carbs: '8g',
      fats: '28g',
    },
    ingredients: [
      { name: 'Beef', included: true },
      { name: 'Suya Spice', included: true },
      { name: 'Onions', included: true },
      { name: 'Tomatoes', included: true },
      { name: 'Cucumber', included: true },
    ],
    customizations: [
      { name: 'Extra Meat', price: 3000 },
      { name: 'Chicken Option', price: 1000 },
      { name: 'Extra Spicy', price: 0 },
      { name: 'Yam Chips', price: 1200 },
    ],
  },
  6: {
    name: 'Fried Rice',
    price: 3800,
    originalPrice: 4800,
    description: 'Nigerian-style fried rice with mixed vegetables, chicken, and aromatic spices.',
    image: 'https://www.shutterstock.com/image-photo/fried-rice-nigerian-style-vegetables-600nw-1847392851.jpg',
    rating: 4.7,
    reviews: 892,
    chef: {
      name: 'Chef Grace Okafor',
      restaurant: 'Asian Fusion',
      image: 'https://www.shutterstock.com/image-photo/african-chef-cooking-fried-rice-600nw-1847392987.jpg',
    },
    calories: 520,
    prepTime: '15 min',
    nutrition: {
      calories: 520,
      protein: '22g',
      carbs: '68g',
      fats: '18g',
    },
    ingredients: [
      { name: 'Parboiled Rice', included: true },
      { name: 'Mixed Vegetables', included: true },
      { name: 'Chicken', included: true },
      { name: 'Curry Powder', included: true },
      { name: 'Green Beans', included: true },
    ],
    customizations: [
      { name: 'Extra Chicken', price: 1500 },
      { name: 'Shrimp Addition', price: 2000 },
      { name: 'Extra Vegetables', price: 800 },
      { name: 'Plantain Side', price: 1000 },
    ],
  },
};

export default function FoodDetail() {
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const totalPrice = foodItem.price * quantity + 
    selectedOptions.reduce((sum, option) => {
      const customization = foodItem.customizations.find((c: any) => c.name === option);
      return sum + (customization?.price || 0);
    }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food Explorer</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={24}
              color={isFavorite ? "#7CB342" : "#FFFFFF"}
              fill={isFavorite ? "#7CB342" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Food Image */}
        <Image source={{ uri: foodItem.image }} style={styles.foodImage} />

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
          </View>

          {/* Chef Info */}
          <View style={styles.chefSection}>
            <Image source={{ uri: foodItem.chef.image }} style={styles.chefImage} />
            <View style={styles.chefInfo}>
              <Text style={styles.chefName}>{foodItem.chef.name}</Text>
              <Text style={styles.restaurantName}>{foodItem.chef.restaurant}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{foodItem.description}</Text>
          </View>

          {/* Nutrition Facts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>{foodItem.nutrition.calories}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>{foodItem.nutrition.protein}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>{foodItem.nutrition.carbs}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fats</Text>
                <Text style={styles.nutritionValue}>{foodItem.nutrition.fats}</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {foodItem.ingredients.map((ingredient: any, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={[
                    styles.ingredientIndicator,
                    ingredient.included ? styles.includedIndicator : styles.notIncludedIndicator
                  ]} />
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Customizations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customize Your Order</Text>
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
                    <Text style={styles.customizationName}>{customization.name}</Text>
                    <Text style={styles.customizationPrice}>
                      {customization.price > 0 ? `+${formatPrice(customization.price)}` : 'Free'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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

        <TouchableOpacity style={styles.addToCartButton}>
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart - {formatPrice(totalPrice)}</Text>
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
    color: '#7CB342',
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
  chefSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  chefImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chefInfo: {
    flex: 1,
  },
  chefName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  restaurantName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 24,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#006400',
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
    backgroundColor: '#7CB342',
  },
  notIncludedIndicator: {
    backgroundColor: '#D3D3D3',
  },
  ingredientName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
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
    backgroundColor: '#7CB342',
    borderColor: '#7CB342',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  customizationInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customizationName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  customizationPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#7CB342',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#D3D3D3',
    gap: 15,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7CB342',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});