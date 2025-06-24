import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, Filter } from 'lucide-react-native';
import AIAssistant from '@/components/AIAssistant';

export default function Supermarket() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState('');

  const categories = ['All', 'Groceries', 'Beverages', 'Snacks', 'Household', 'Personal Care'];

  const supermarketItems = [
    {
      id: 1,
      name: 'Rice (5kg)',
      category: 'Groceries',
      price: 8500,
      image: 'https://www.shutterstock.com/image-photo/bag-rice-grains-white-background-600nw-1234567890.jpg',
      description: 'Premium quality long grain rice',
      unit: 'bag',
    },
    {
      id: 2,
      name: 'Bread (Loaf)',
      category: 'Groceries',
      price: 800,
      image: 'https://www.shutterstock.com/image-photo/fresh-bread-loaf-sliced-white-600nw-2345678901.jpg',
      description: 'Fresh baked white bread',
      unit: 'loaf',
    },
    {
      id: 3,
      name: 'Milk (1L)',
      category: 'Beverages',
      price: 1200,
      image: 'https://www.shutterstock.com/image-photo/milk-bottle-glass-white-background-600nw-3456789012.jpg',
      description: 'Fresh whole milk',
      unit: 'bottle',
    },
    {
      id: 4,
      name: 'Eggs (12 pieces)',
      category: 'Groceries',
      price: 1800,
      image: 'https://www.shutterstock.com/image-photo/dozen-eggs-carton-white-background-600nw-4567890123.jpg',
      description: 'Farm fresh eggs',
      unit: 'carton',
    },
    {
      id: 5,
      name: 'Cooking Oil (1L)',
      category: 'Groceries',
      price: 2500,
      image: 'https://www.shutterstock.com/image-photo/cooking-oil-bottle-vegetable-oil-600nw-5678901234.jpg',
      description: 'Pure vegetable cooking oil',
      unit: 'bottle',
    },
    {
      id: 6,
      name: 'Soft Drink (500ml)',
      category: 'Beverages',
      price: 400,
      image: 'https://www.shutterstock.com/image-photo/cola-bottle-soft-drink-refreshing-600nw-6789012345.jpg',
      description: 'Refreshing cola drink',
      unit: 'bottle',
    },
    {
      id: 7,
      name: 'Biscuits Pack',
      category: 'Snacks',
      price: 600,
      image: 'https://www.shutterstock.com/image-photo/biscuits-pack-cookies-snack-food-600nw-7890123456.jpg',
      description: 'Crunchy chocolate biscuits',
      unit: 'pack',
    },
    {
      id: 8,
      name: 'Detergent (1kg)',
      category: 'Household',
      price: 1500,
      image: 'https://www.shutterstock.com/image-photo/laundry-detergent-powder-cleaning-product-600nw-8901234567.jpg',
      description: 'Powerful cleaning detergent',
      unit: 'pack',
    },
    {
      id: 9,
      name: 'Toothpaste',
      category: 'Personal Care',
      price: 800,
      image: 'https://www.shutterstock.com/image-photo/toothpaste-tube-dental-care-hygiene-600nw-9012345678.jpg',
      description: 'Fluoride toothpaste for healthy teeth',
      unit: 'tube',
    },
    {
      id: 10,
      name: 'Soap Bar',
      category: 'Personal Care',
      price: 300,
      image: 'https://www.shutterstock.com/image-photo/soap-bar-white-background-hygiene-600nw-0123456789.jpg',
      description: 'Moisturizing bath soap',
      unit: 'bar',
    },
    {
      id: 11,
      name: 'Noodles (Pack)',
      category: 'Groceries',
      price: 200,
      image: 'https://www.shutterstock.com/image-photo/instant-noodles-pack-quick-meal-600nw-1234567890.jpg',
      description: 'Instant noodles - chicken flavor',
      unit: 'pack',
    },
    {
      id: 12,
      name: 'Tissue Paper',
      category: 'Household',
      price: 500,
      image: 'https://www.shutterstock.com/image-photo/tissue-paper-roll-household-essential-600nw-2345678901.jpg',
      description: 'Soft tissue paper roll',
      unit: 'roll',
    },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const filteredItems = supermarketItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = supermarketItems.find(i => i.id === parseInt(itemId));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const addToShoppingList = () => {
    if (newListItem.trim()) {
      setShoppingList(prev => [...prev, newListItem.trim()]);
      setNewListItem('');
    }
  };

  const removeFromShoppingList = (index: number) => {
    setShoppingList(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>🛒</Text>
            <Text style={styles.headerTitle}>Supermarket</Text>
            <Text style={styles.headerSubtitle}>Everything you need in one place</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#9C27B0" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTag,
                selectedCategory === category && styles.categoryTagActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryTagText,
                selectedCategory === category && styles.categoryTagTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Shopping List Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shopping List</Text>
          <View style={styles.shoppingListContainer}>
            <View style={styles.addItemContainer}>
              <TextInput
                style={styles.listInput}
                placeholder="Add item to your list..."
                value={newListItem}
                onChangeText={setNewListItem}
                onSubmitEditing={addToShoppingList}
              />
              <TouchableOpacity style={styles.addButton} onPress={addToShoppingList}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {shoppingList.length > 0 && (
              <View style={styles.listItems}>
                {shoppingList.map((item, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{item}</Text>
                    <TouchableOpacity 
                      style={styles.removeListButton}
                      onPress={() => removeFromShoppingList(index)}
                    >
                      <Minus size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products ({filteredItems.length})</Text>
          <View style={styles.productsGrid}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDescription}>{item.description}</Text>
                  <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                  <Text style={styles.productUnit}>per {item.unit}</Text>
                  
                  <View style={styles.cartControls}>
                    {cart[item.id] ? (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Minus size={16} color="#9C27B0" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{cart[item.id]}</Text>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => addToCart(item.id)}
                        >
                          <Plus size={16} color="#9C27B0" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.addToCartButton}
                        onPress={() => addToCart(item.id)}
                      >
                        <Plus size={16} color="#FFFFFF" />
                        <Text style={styles.addToCartText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Cart Summary */}
      {getCartItemCount() > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <ShoppingCart size={20} color="#FFFFFF" />
            <Text style={styles.cartText}>
              {getCartItemCount()} items • {formatPrice(getCartTotal())}
            </Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

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
  header: {
    backgroundColor: '#9C27B0',
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
    borderColor: '#9C27B0',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  categoryTagActive: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
  },
  categoryTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  categoryTagTextActive: {
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
  shoppingListContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  listInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  addButton: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItems: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    flex: 1,
  },
  removeListButton: {
    padding: 4,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#9C27B0',
    marginBottom: 2,
  },
  productUnit: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    marginBottom: 12,
  },
  cartControls: {
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 6,
    borderWidth: 1,
    borderColor: '#9C27B0',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    paddingHorizontal: 15,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addToCartText: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  cartSummary: {
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  checkoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#9C27B0',
  },
});