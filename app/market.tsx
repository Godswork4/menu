import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, Filter, MapPin } from 'lucide-react-native';
import AIAssistant from '@/components/AIAssistant';

export default function Market() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [newListItem, setNewListItem] = useState('');

  const categories = ['All', 'Grains', 'Proteins', 'Spices', 'Oils', 'Vegetables', 'Seafood'];

  const marketItems = [
    {
      id: 1,
      name: 'Palm Oil (1L)',
      category: 'Oils',
      price: 3500,
      image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
      description: 'Fresh red palm oil from local farms',
      unit: 'bottle',
      vendor: 'Mama Kemi',
      location: 'Mile 12 Market',
    },
    {
      id: 2,
      name: 'Fresh Fish (Tilapia)',
      category: 'Seafood',
      price: 2800,
      image: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg',
      description: 'Fresh tilapia fish, cleaned and ready',
      unit: 'kg',
      vendor: 'Fish Seller John',
      location: 'Alaba Market',
    },
    {
      id: 3,
      name: 'Crayfish (Ground)',
      category: 'Spices',
      price: 1500,
      image: 'https://images.pexels.com/photos/6941042/pexels-photo-6941042.jpeg',
      description: 'Freshly ground crayfish for seasoning',
      unit: 'cup',
      vendor: 'Spice Mama',
      location: 'Oshodi Market',
    },
    {
      id: 4,
      name: 'Local Rice (5kg)',
      category: 'Grains',
      price: 12000,
      image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg',
      description: 'Premium local Ofada rice',
      unit: 'bag',
      vendor: 'Rice Merchant',
      location: 'Mushin Market',
    },
    {
      id: 5,
      name: 'Beans (Brown)',
      category: 'Grains',
      price: 4500,
      image: 'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg',
      description: 'Quality brown honey beans',
      unit: 'kg',
      vendor: 'Grain Seller',
      location: 'Oyingbo Market',
    },
    {
      id: 6,
      name: 'Stockfish',
      category: 'Proteins',
      price: 8500,
      image: 'https://images.pexels.com/photos/8472647/pexels-photo-8472647.jpeg',
      description: 'Premium dried stockfish',
      unit: 'piece',
      vendor: 'Fish Vendor',
      location: 'Lagos Island',
    },
    {
      id: 7,
      name: 'Pepper (Scotch Bonnet)',
      category: 'Spices',
      price: 800,
      image: 'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg',
      description: 'Fresh hot scotch bonnet peppers',
      unit: 'cup',
      vendor: 'Pepper Seller',
      location: 'Ikeja Market',
    },
    {
      id: 8,
      name: 'Groundnut Oil (1L)',
      category: 'Oils',
      price: 2200,
      image: 'https://images.pexels.com/photos/5946083/pexels-photo-5946083.jpeg',
      description: 'Pure groundnut oil, locally processed',
      unit: 'bottle',
      vendor: 'Oil Merchant',
      location: 'Ketu Market',
    },
    {
      id: 9,
      name: 'Dried Fish (Panla)',
      category: 'Seafood',
      price: 3200,
      image: 'https://images.pexels.com/photos/8472647/pexels-photo-8472647.jpeg',
      description: 'Smoked and dried panla fish',
      unit: 'piece',
      vendor: 'Dried Fish Seller',
      location: 'Agege Market',
    },
    {
      id: 10,
      name: 'Locust Beans (Iru)',
      category: 'Spices',
      price: 600,
      image: 'https://images.pexels.com/photos/6941042/pexels-photo-6941042.jpeg',
      description: 'Traditional locust beans seasoning',
      unit: 'wrap',
      vendor: 'Traditional Seller',
      location: 'Balogun Market',
    },
    {
      id: 11,
      name: 'Yam (Tuber)',
      category: 'Vegetables',
      price: 1800,
      image: 'https://images.pexels.com/photos/5945748/pexels-photo-5945748.jpeg',
      description: 'Fresh yam tuber, medium size',
      unit: 'tuber',
      vendor: 'Yam Seller',
      location: 'Tejuosho Market',
    },
    {
      id: 12,
      name: 'Garri (White)',
      category: 'Grains',
      price: 1200,
      image: 'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg',
      description: 'Quality white garri from cassava',
      unit: 'kg',
      vendor: 'Garri Seller',
      location: 'Computer Village',
    },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const filteredItems = marketItems.filter(item => {
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
      const item = marketItems.find(i => i.id === parseInt(itemId));
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
            <Text style={styles.headerIcon}>🏪</Text>
            <Text style={styles.headerTitle}>Local Market</Text>
            <Text style={styles.headerSubtitle}>Fresh ingredients from local vendors</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search local products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#FF5722" />
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
          <Text style={styles.sectionTitle}>Market List</Text>
          <View style={styles.shoppingListContainer}>
            <View style={styles.addItemContainer}>
              <TextInput
                style={styles.listInput}
                placeholder="Add item to your market list..."
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
          <Text style={styles.sectionTitle}>Fresh Products ({filteredItems.length})</Text>
          <View style={styles.productsGrid}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDescription}>{item.description}</Text>
                  <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                  <Text style={styles.productUnit}>per {item.unit}</Text>
                  
                  <View style={styles.vendorInfo}>
                    <Text style={styles.vendorName}>{item.vendor}</Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color="#666666" />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cartControls}>
                    {cart[item.id] ? (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => removeFromCart(item.id)}
                        >
                          <Minus size={16} color="#FF5722" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{cart[item.id]}</Text>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => addToCart(item.id)}
                        >
                          <Plus size={16} color="#FF5722" />
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
    backgroundColor: '#FF5722',
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
    borderColor: '#FF5722',
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
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
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
    backgroundColor: '#FFF3E0',
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
    backgroundColor: '#FF5722',
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
    color: '#FF5722',
    marginBottom: 2,
  },
  productUnit: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    marginBottom: 8,
  },
  vendorInfo: {
    marginBottom: 12,
  },
  vendorName: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#333333',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#666666',
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
    borderColor: '#FF5722',
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
    backgroundColor: '#FF5722',
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
    backgroundColor: '#FF5722',
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
    color: '#FF5722',
  },
});