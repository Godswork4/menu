import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Star, Clock, MapPin, ChefHat, Heart, Menu, X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const mainCategories = [
    {
      id: 1,
      name: 'Restaurants',
      icon: '🍽️',
      itemCount: 156,
      image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      color: '#FF6B6B',
    },
    {
      id: 2,
      name: 'Street Food',
      icon: '🌮',
      itemCount: 89,
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
      color: '#4ECDC4',
    },
    {
      id: 3,
      name: 'Desserts',
      icon: '🍰',
      itemCount: 234,
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      color: '#45B7D1',
    },
    {
      id: 4,
      name: 'Bakery',
      icon: '🥖',
      itemCount: 178,
      image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg',
      color: '#FFA726',
    },
    {
      id: 5,
      name: 'Foreign',
      icon: '🌍',
      itemCount: 98,
      image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
      color: '#AB47BC',
    },
    {
      id: 6,
      name: 'Budget Meals',
      icon: '💰',
      itemCount: 203,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      color: '#FFD54F',
    },
  ];

  const subcategories = [
    'All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegetarian', 'Vegan', 'Gluten-Free'
  ];

  const hamburgerMenuItems = [
    { id: 1, name: 'Nigerian Cuisine', icon: '🇳🇬', description: 'Traditional Nigerian dishes' },
    { id: 2, name: 'Continental', icon: '🍽️', description: 'International cuisine' },
    { id: 3, name: 'Fast Food', icon: '🍔', description: 'Quick bites and snacks' },
    { id: 4, name: 'Healthy Options', icon: '🥗', description: 'Nutritious and fresh meals' },
    { id: 5, name: 'Beverages', icon: '🥤', description: 'Drinks and refreshments' },
    { id: 6, name: 'Seafood', icon: '🐟', description: 'Fresh fish and seafood' },
    { id: 7, name: 'Grilled Items', icon: '🔥', description: 'BBQ and grilled specialties' },
    { id: 8, name: 'Soups & Stews', icon: '🍲', description: 'Traditional soups and stews' },
    { id: 9, name: 'Rice Dishes', icon: '🍚', description: 'Jollof, fried rice, and more' },
    { id: 10, name: 'Pastries & Snacks', icon: '🥐', description: 'Meat pies, chin chin, and treats' },
  ];

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-detail',
      params: { category: categoryName.toLowerCase().replace(' ', '-') }
    });
  };

  const toggleHamburgerMenu = () => {
    if (showHamburgerMenu) {
      // Close menu
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowHamburgerMenu(false);
      });
    } else {
      // Open menu
      setShowHamburgerMenu(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleHamburgerItemPress = (itemName: string) => {
    toggleHamburgerMenu();
    // Navigate to specific category or handle the selection
    handleCategoryPress(itemName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Hamburger Menu */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Food Categories</Text>
            <Text style={styles.headerSubtitle}>Explore by cuisine type, ingredients, or dietary needs</Text>
          </View>
          <TouchableOpacity style={styles.hamburgerButton} onPress={toggleHamburgerMenu}>
            <Menu size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Main Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {mainCategories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <View style={[styles.categoryOverlay, { backgroundColor: category.color + '90' }]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.itemCount} items</Text>
                  <View style={styles.categoryArrow}>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Filters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.subcategoriesContainer}>
              {subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={[
                    styles.subcategoryTag,
                    selectedCategory === subcategory && styles.subcategoryTagActive
                  ]}
                  onPress={() => setSelectedCategory(subcategory)}
                >
                  <Text style={[
                    styles.subcategoryText,
                    selectedCategory === subcategory && styles.subcategoryTextActive
                  ]}>
                    {subcategory}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <View style={styles.dietaryGrid}>
            <TouchableOpacity 
              style={styles.dietaryCard}
              onPress={() => handleCategoryPress('vegetarian')}
            >
              <Text style={styles.dietaryIcon}>🌱</Text>
              <Text style={styles.dietaryTitle}>Vegetarian</Text>
              <Text style={styles.dietaryDescription}>Plant-based options</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dietaryCard}
              onPress={() => handleCategoryPress('vegan')}
            >
              <Text style={styles.dietaryIcon}>🥗</Text>
              <Text style={styles.dietaryTitle}>Vegan</Text>
              <Text style={styles.dietaryDescription}>100% plant-based</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dietaryCard}
              onPress={() => handleCategoryPress('gluten-free')}
            >
              <Text style={styles.dietaryIcon}>🌾</Text>
              <Text style={styles.dietaryTitle}>Gluten-Free</Text>
              <Text style={styles.dietaryDescription}>No gluten ingredients</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dietaryCard}
              onPress={() => handleCategoryPress('keto')}
            >
              <Text style={styles.dietaryIcon}>🥩</Text>
              <Text style={styles.dietaryTitle}>Keto-Friendly</Text>
              <Text style={styles.dietaryDescription}>Low-carb options</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#006400" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.popularList}>
            {mainCategories.slice(0, 4).map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.popularItem}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Image source={{ uri: category.image }} style={styles.popularImage} />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{category.name}</Text>
                  <Text style={styles.popularCount}>{category.itemCount} restaurants</Text>
                  <View style={styles.popularMeta}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.popularRating}>4.{Math.floor(Math.random() * 3) + 6}</Text>
                    <Text style={styles.popularReviews}>({Math.floor(Math.random() * 500) + 100}+ reviews)</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#666666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={showHamburgerMenu}
        transparent={true}
        animationType="none"
        onRequestClose={toggleHamburgerMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            onPress={toggleHamburgerMenu}
            activeOpacity={1}
          />
          <Animated.View 
            style={[
              styles.hamburgerMenu,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Food Categories</Text>
              <TouchableOpacity onPress={toggleHamburgerMenu} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
              {hamburgerMenuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleHamburgerItemPress(item.name)}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
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
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  hamburgerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginLeft: 15,
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
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  categoryCard: {
    width: '47%',
    height: 140,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
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
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  subcategoriesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  subcategoryTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  subcategoryTagActive: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  subcategoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  subcategoryTextActive: {
    color: '#FFFFFF',
  },
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dietaryCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dietaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  dietaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  dietaryDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  popularList: {
    gap: 12,
  },
  popularItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  popularImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  popularInfo: {
    flex: 1,
    marginLeft: 12,
  },
  popularName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  popularCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  popularMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularRating: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  popularReviews: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  // Hamburger Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  hamburgerMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  menuHeader: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  menuContent: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});