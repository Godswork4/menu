import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, User, Heart, ShoppingCart, Plus, Minus } from 'lucide-react-native';

// Food items database with proper mapping and high-quality images
const foodDatabase: { [key: number]: any } = {
  1: {
    name: 'Jollof Rice Special',
    price: 4500,
    originalPrice: 5500,
    description: 'Authentic Nigerian jollof rice cooked with premium ingredients, served with grilled chicken and fried plantain.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 1245,
    chef: {
      name: 'Chef Adunni Okafor',
      restaurant: 'Lagos Kitchen',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
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
    name: 'Margherita Pizza',
    price: 7495,
    originalPrice: 9495,
    description: 'Classic Italian pizza with fresh mozzarella, basil, and tomato sauce on a crispy thin crust.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 892,
    chef: {
      name: 'Chef Marco Romano',
      restaurant: 'Pizza Corner',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    },
    calories: 420,
    prepTime: '15 min',
    nutrition: {
      calories: 420,
      protein: '18g',
      carbs: '48g',
      fats: '16g',
    },
    ingredients: [
      { name: 'Pizza Dough', included: true },
      { name: 'Tomato Sauce', included: true },
      { name: 'Fresh Mozzarella', included: true },
      { name: 'Fresh Basil', included: true },
      { name: 'Olive Oil', included: true },
    ],
    customizations: [
      { name: 'Extra Cheese', price: 1500 },
      { name: 'Pepperoni', price: 2000 },
      { name: 'Mushrooms', price: 1000 },
      { name: 'Olives', price: 800 },
    ],
  },
  3: {
    name: 'Salmon Teriyaki',
    price: 9995,
    originalPrice: 12995,
    description: 'Grilled salmon glazed with teriyaki sauce, served with steamed vegetables and jasmine rice.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 567,
    chef: {
      name: 'Chef Hiroshi Tanaka',
      restaurant: 'Ocean Fresh',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    calories: 450,
    prepTime: '25 min',
    nutrition: {
      calories: 450,
      protein: '35g',
      carbs: '28g',
      fats: '22g',
    },
    ingredients: [
      { name: 'Fresh Salmon', included: true },
      { name: 'Teriyaki Sauce', included: true },
      { name: 'Steamed Vegetables', included: true },
      { name: 'Jasmine Rice', included: true },
      { name: 'Sesame Seeds', included: true },
    ],
    customizations: [
      { name: 'Extra Salmon', price: 4000 },
      { name: 'Brown Rice', price: 500 },
      { name: 'Extra Vegetables', price: 1200 },
      { name: 'Spicy Mayo', price: 600 },
    ],
  },
  4: {
    name: 'Truffle Pasta',
    price: 12499,
    originalPrice: 16499,
    description: 'Luxurious handmade pasta with black truffle shavings, wild mushrooms, and aged parmesan cheese in a creamy white wine sauce.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 1887,
    chef: {
      name: 'Chef Marco Romano',
      restaurant: 'Bella Vista',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    calories: 680,
    prepTime: '25 min',
    nutrition: {
      calories: 680,
      protein: '28g',
      carbs: '65g',
      fats: '35g',
    },
    ingredients: [
      { name: 'Fresh Pasta', included: true },
      { name: 'Black Truffle', included: true },
      { name: 'Wild Mushrooms', included: true },
      { name: 'Parmesan Cheese', included: true },
      { name: 'White Wine Sauce', included: true },
    ],
    customizations: [
      { name: 'Extra Truffle', price: 4250 },
      { name: 'Gluten-Free Pasta', price: 1750 },
      { name: 'Extra Parmesan', price: 1250 },
      { name: 'Add Chicken', price: 3000 },
    ],
  },
  5: {
    name: 'Wagyu Burger',
    price: 9250,
    originalPrice: 12500,
    description: 'Premium Wagyu beef patty with aged cheddar, caramelized onions, arugula, and truffle aioli on a brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 1245,
    chef: {
      name: 'Chef Robert Johnson',
      restaurant: 'Gourmet House',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    },
    calories: 750,
    prepTime: '15 min',
    nutrition: {
      calories: 750,
      protein: '45g',
      carbs: '42g',
      fats: '48g',
    },
    ingredients: [
      { name: 'Wagyu Beef Patty', included: true },
      { name: 'Aged Cheddar', included: true },
      { name: 'Caramelized Onions', included: true },
      { name: 'Arugula', included: true },
      { name: 'Brioche Bun', included: true },
    ],
    customizations: [
      { name: 'Extra Patty', price: 6000 },
      { name: 'Bacon', price: 1750 },
      { name: 'Avocado', price: 1250 },
      { name: 'Sweet Potato Fries', price: 2000 },
    ],
  },
  6: {
    name: 'Dragon Roll Sushi',
    price: 8495,
    originalPrice: 11495,
    description: 'Fresh eel and cucumber inside, topped with avocado, eel sauce, and sesame seeds. Served with wasabi and pickled ginger.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 892,
    chef: {
      name: 'Chef Hiroshi Tanaka',
      restaurant: 'Tokyo Kitchen',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    calories: 420,
    prepTime: '20 min',
    nutrition: {
      calories: 420,
      protein: '22g',
      carbs: '48g',
      fats: '18g',
    },
    ingredients: [
      { name: 'Fresh Eel', included: true },
      { name: 'Cucumber', included: true },
      { name: 'Avocado', included: true },
      { name: 'Sushi Rice', included: true },
      { name: 'Nori Seaweed', included: true },
    ],
    customizations: [
      { name: 'Extra Eel', price: 2750 },
      { name: 'Spicy Mayo', price: 750 },
      { name: 'Tempura Flakes', price: 1000 },
      { name: 'Extra Avocado', price: 1250 },
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
              color={isFavorite ? "#B8860B" : "#FFFFFF"}
              fill={isFavorite ? "#B8860B" : "transparent"}
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
    backgroundColor: '#32CD32',
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
    color: '#006400',
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
    backgroundColor: '#B8860B',
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