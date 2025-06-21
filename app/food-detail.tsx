import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, User, Heart, ShoppingCart, Plus, Minus } from 'lucide-react-native';

// Food items database
const foodDatabase: { [key: number]: any } = {
  1: {
    name: 'Truffle Pasta',
    price: 12499,
    originalPrice: 16499,
    description: 'Luxurious handmade pasta with black truffle shavings, wild mushrooms, and aged parmesan cheese in a creamy white wine sauce.',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
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
  2: {
    name: 'Wagyu Burger',
    price: 9250,
    originalPrice: 12500,
    description: 'Premium Wagyu beef patty with aged cheddar, caramelized onions, arugula, and truffle aioli on a brioche bun.',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
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
  3: {
    name: 'Dragon Roll Sushi',
    price: 8495,
    originalPrice: 11495,
    description: 'Fresh eel and cucumber inside, topped with avocado, eel sauce, and sesame seeds. Served with wasabi and pickled ginger.',
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg',
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
  4: {
    name: 'BBQ Ribs Platter',
    price: 11495,
    originalPrice: 14495,
    description: 'Slow-smoked pork ribs with house BBQ sauce, served with coleslaw, baked beans, and cornbread.',
    image: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg',
    rating: 4.7,
    reviews: 567,
    chef: {
      name: 'Chef Billy Thompson',
      restaurant: 'Smoky Joe\'s',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    },
    calories: 920,
    prepTime: '45 min',
    nutrition: {
      calories: 920,
      protein: '52g',
      carbs: '38g',
      fats: '65g',
    },
    ingredients: [
      { name: 'Pork Ribs', included: true },
      { name: 'BBQ Sauce', included: true },
      { name: 'Coleslaw', included: true },
      { name: 'Baked Beans', included: true },
      { name: 'Cornbread', included: true },
    ],
    customizations: [
      { name: 'Extra Ribs', price: 4000 },
      { name: 'Spicy BBQ Sauce', price: 500 },
      { name: 'Mac & Cheese', price: 2250 },
      { name: 'Onion Rings', price: 1750 },
    ],
  },
  5: {
    name: 'Chocolate Lava Cake',
    price: 4495,
    originalPrice: 6495,
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream and fresh berries.',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    rating: 4.8,
    reviews: 734,
    chef: {
      name: 'Pastry Chef Maria Santos',
      restaurant: 'Sweet Dreams',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    calories: 580,
    prepTime: '15 min',
    nutrition: {
      calories: 580,
      protein: '8g',
      carbs: '72g',
      fats: '32g',
    },
    ingredients: [
      { name: 'Dark Chocolate', included: true },
      { name: 'Butter', included: true },
      { name: 'Eggs', included: true },
      { name: 'Vanilla Ice Cream', included: true },
      { name: 'Fresh Berries', included: true },
    ],
    customizations: [
      { name: 'Extra Ice Cream', price: 1250 },
      { name: 'Whipped Cream', price: 750 },
      { name: 'Caramel Sauce', price: 1000 },
      { name: 'Nuts', price: 1000 },
    ],
  },
  6: {
    name: 'Thai Green Curry',
    price: 8250,
    originalPrice: 10750,
    description: 'Authentic Thai green curry with chicken, Thai eggplant, bamboo shoots, and basil in coconut milk.',
    image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg',
    rating: 4.6,
    reviews: 445,
    chef: {
      name: 'Chef Siriporn Nakamura',
      restaurant: 'Bangkok Street',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    calories: 520,
    prepTime: '30 min',
    nutrition: {
      calories: 520,
      protein: '35g',
      carbs: '28g',
      fats: '32g',
    },
    ingredients: [
      { name: 'Chicken Breast', included: true },
      { name: 'Green Curry Paste', included: true },
      { name: 'Coconut Milk', included: true },
      { name: 'Thai Eggplant', included: true },
      { name: 'Thai Basil', included: true },
    ],
    customizations: [
      { name: 'Extra Spicy', price: 250 },
      { name: 'Tofu Instead', price: 0 },
      { name: 'Extra Vegetables', price: 1500 },
      { name: 'Jasmine Rice', price: 1250 },
    ],
  },
  7: {
    name: 'Caesar Salad',
    price: 5995,
    originalPrice: 7995,
    description: 'Crisp romaine lettuce with house-made Caesar dressing, parmesan cheese, and garlic croutons.',
    image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
    rating: 4.5,
    reviews: 623,
    chef: {
      name: 'Chef Emily Rodriguez',
      restaurant: 'Garden Fresh',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    calories: 380,
    prepTime: '10 min',
    nutrition: {
      calories: 380,
      protein: '12g',
      carbs: '18g',
      fats: '28g',
    },
    ingredients: [
      { name: 'Romaine Lettuce', included: true },
      { name: 'Caesar Dressing', included: true },
      { name: 'Parmesan Cheese', included: true },
      { name: 'Garlic Croutons', included: true },
      { name: 'Anchovies', included: false },
    ],
    customizations: [
      { name: 'Grilled Chicken', price: 2750 },
      { name: 'Grilled Shrimp', price: 3750 },
      { name: 'Extra Parmesan', price: 1000 },
      { name: 'Anchovies', price: 750 },
    ],
  },
  8: {
    name: 'Fish & Chips',
    price: 7995,
    originalPrice: 9995,
    description: 'Beer-battered cod with crispy chips, mushy peas, and tartar sauce. A British classic done right.',
    image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg',
    rating: 4.4,
    reviews: 389,
    chef: {
      name: 'Chef James Mitchell',
      restaurant: 'British Pub',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    },
    calories: 720,
    prepTime: '20 min',
    nutrition: {
      calories: 720,
      protein: '38g',
      carbs: '65g',
      fats: '35g',
    },
    ingredients: [
      { name: 'Fresh Cod', included: true },
      { name: 'Beer Batter', included: true },
      { name: 'Hand-Cut Chips', included: true },
      { name: 'Mushy Peas', included: true },
      { name: 'Tartar Sauce', included: true },
    ],
    customizations: [
      { name: 'Extra Fish', price: 3250 },
      { name: 'Curry Sauce', price: 1000 },
      { name: 'Onion Rings', price: 1750 },
      { name: 'Malt Vinegar', price: 250 },
    ],
  },
  9: {
    name: 'Beef Tacos',
    price: 6750,
    originalPrice: 8750,
    description: 'Three soft corn tortillas filled with seasoned ground beef, lettuce, tomatoes, cheese, and sour cream.',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
    rating: 4.7,
    reviews: 512,
    chef: {
      name: 'Chef Carlos Mendoza',
      restaurant: 'Mexican Cantina',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
    },
    calories: 560,
    prepTime: '12 min',
    nutrition: {
      calories: 560,
      protein: '32g',
      carbs: '45g',
      fats: '28g',
    },
    ingredients: [
      { name: 'Ground Beef', included: true },
      { name: 'Corn Tortillas', included: true },
      { name: 'Lettuce', included: true },
      { name: 'Tomatoes', included: true },
      { name: 'Cheese', included: true },
    ],
    customizations: [
      { name: 'Extra Meat', price: 1750 },
      { name: 'Guacamole', price: 1250 },
      { name: 'Jalapeños', price: 500 },
      { name: 'Extra Cheese', price: 750 },
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
              color={isFavorite ? "#FFD700" : "#FFFFFF"}
              fill={isFavorite ? "#FFD700" : "transparent"}
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
                    <Text style={styles.customizationPrice}>+{formatPrice(customization.price)}</Text>
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
    backgroundColor: '#32CD32',
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