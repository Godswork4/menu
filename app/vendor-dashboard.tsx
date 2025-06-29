import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit3, Trash2, Eye, ChartBar as BarChart3, DollarSign, Package, Users, Camera, MapPin, Clock, Star } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  status: 'active' | 'inactive';
  orders?: number;
  rating?: number;
  description?: string;
}

interface Order {
  id: string;
  customer_name: string;
  items: string;
  amount: number;
  status: string;
  time: string;
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, profile } = useAuth();

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeMenuItems: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (user) {
      fetchMenuItems();
      fetchOrders();
    }
  }, [user]);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('vendor_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching menu items:', error);
        return;
      }
      
      // Transform data to match the expected format
      const transformedItems = data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price / 100, // Convert from kobo to naira
        image_url: item.image_url || IMAGES.DEFAULT_FOOD,
        status: item.status,
        orders: Math.floor(Math.random() * 50) + 1, // Mock data for now
        rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
        description: item.description
      }));
      
      setMenuItems(transformedItems);
      
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        activeMenuItems: transformedItems.filter(item => item.status === 'active').length
      }));
      
    } catch (error) {
      console.error('Unexpected error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      // For now, we'll use mock data since the orders table might not be fully implemented
      // In a real app, you would fetch from the vendor_orders table
      
      const mockOrders = [
        {
          id: '1',
          customer_name: 'John Doe',
          items: 'Jollof Rice, Grilled Chicken',
          amount: 8500,
          status: 'preparing',
          time: '10 mins ago',
        },
        {
          id: '2',
          customer_name: 'Sarah Johnson',
          items: 'Fried Rice, Fish',
          amount: 6750,
          status: 'delivered',
          time: '25 mins ago',
        },
        {
          id: '3',
          customer_name: 'Mike Wilson',
          items: 'Pepper Soup, Bread',
          amount: 4200,
          status: 'confirmed',
          time: '1 hour ago',
        },
      ];
      
      setRecentOrders(mockOrders);
      
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        totalOrders: mockOrders.length,
        totalRevenue: mockOrders.reduce((sum, order) => sum + order.amount, 0),
        averageRating: 4.7 // Mock average rating
      }));
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#FF8F00';
      case 'confirmed': return '#2196F3';
      case 'delivered': return '#4CAF50';
      default: return '#666666';
    }
  };

  const handleAddFood = () => {
    router.push('/add-food-item');
  };

  const handleEditFood = (itemId: string) => {
    router.push({
      pathname: '/edit-food-item',
      params: { id: itemId }
    });
  };

  const handleDeleteFood = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              setIsLoading(true);
              
              const { error } = await supabase
                .from('food_items')
                .delete()
                .eq('id', itemId);
              
              if (error) {
                console.error('Error deleting food item:', error);
                Alert.alert('Error', 'Failed to delete menu item: ' + error.message);
                return;
              }
              
              // Update local state
              setMenuItems(prev => prev.filter(item => item.id !== itemId));
              
              // Update dashboard stats
              setDashboardStats(prev => ({
                ...prev,
                activeMenuItems: prev.activeMenuItems - 1
              }));
              
              Alert.alert('Success', 'Menu item deleted successfully');
            } catch (error) {
              console.error('Unexpected error deleting food item:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleItemStatus = async (itemId: string, currentStatus: 'active' | 'inactive') => {
    try {
      setIsLoading(true);
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('food_items')
        .update({ status: newStatus })
        .eq('id', itemId);
      
      if (error) {
        console.error('Error updating food item status:', error);
        Alert.alert('Error', 'Failed to update item status: ' + error.message);
        return;
      }
      
      // Update local state
      setMenuItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      
      // Update dashboard stats
      const statusChange = newStatus === 'active' ? 1 : -1;
      setDashboardStats(prev => ({
        ...prev,
        activeMenuItems: prev.activeMenuItems + statusChange
      }));
      
    } catch (error) {
      console.error('Unexpected error updating food item status:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      ) : (
        <>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Package size={24} color="#006400" />
              <Text style={styles.statNumber}>{dashboardStats.totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statCard}>
              <DollarSign size={24} color="#FFD700" />
              <Text style={styles.statNumber}>{formatPrice(dashboardStats.totalRevenue)}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#3F51B5" />
              <Text style={styles.statNumber}>{dashboardStats.activeMenuItems}</Text>
              <Text style={styles.statLabel}>Menu Items</Text>
            </View>
            <View style={styles.statCard}>
              <Star size={24} color="#FF6B6B" />
              <Text style={styles.statNumber}>{dashboardStats.averageRating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Recent Orders */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.customerName}>{order.customer_name}</Text>
                    <Text style={styles.orderItems}>{order.items}</Text>
                    <Text style={styles.orderTime}>{order.time}</Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>{formatPrice(order.amount)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Package size={48} color="#CCCCCC" />
                <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
                <Text style={styles.emptyStateText}>
                  Your orders will appear here once customers start placing them
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );

  const renderMenu = () => (
    <View>
      {/* Add New Item Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Food Item</Text>
      </TouchableOpacity>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Menu ({menuItems.length} items)</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006400" />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : menuItems.length > 0 ? (
          menuItems.map((item) => (
            <View key={item.id} style={styles.menuItemCard}>
              <ImageWithFallback 
                source={item.image_url} 
                style={styles.menuItemImage}
                fallback={IMAGES.DEFAULT_FOOD}
              />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>{formatPrice(item.price)}</Text>
                <View style={styles.menuItemMeta}>
                  <Text style={styles.menuItemOrders}>{item.orders} orders</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.menuItemRating}>{item.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => toggleItemStatus(item.id, item.status)}
                  style={[
                    styles.menuItemStatus,
                    { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FF6B6B' }
                  ]}
                >
                  <Text style={styles.menuItemStatusText}>{item.status}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.menuItemActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditFood(item.id)}
                >
                  <Edit3 size={16} color="#006400" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteFood(item.id)}
                >
                  <Trash2 size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Package size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No Menu Items</Text>
            <Text style={styles.emptyStateText}>
              Add your first food item to start selling
            </Text>
            <TouchableOpacity style={styles.addFirstItemButton} onPress={handleAddFood}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addFirstItemText}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Analytics</Text>
      <View style={styles.analyticsCard}>
        <BarChart3 size={48} color="#006400" />
        <Text style={styles.analyticsTitle}>Detailed Analytics</Text>
        <Text style={styles.analyticsDescription}>
          Coming soon! Track your sales, customer preferences, and business growth.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.headerTitle}>Vendor Dashboard</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome back, {profile?.full_name || 'Vendor'}!</Text>
        <Text style={styles.welcomeSubtext}>Manage your food business efficiently</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { id: 'overview', name: 'Overview', icon: BarChart3 },
          { id: 'menu', name: 'Menu', icon: Package },
          { id: 'analytics', name: 'Analytics', icon: BarChart3 },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconComponent 
                size={20} 
                color={activeTab === tab.id ? '#FFFFFF' : '#666666'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'menu' && renderMenu()}
        {activeTab === 'analytics' && renderAnalytics()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  welcomeSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
    gap: 6,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    textTransform: 'capitalize',
  },
  addButton: {
    backgroundColor: '#006400',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  menuItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
    marginBottom: 4,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 8,
  },
  menuItemOrders: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuItemRating: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  menuItemStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuItemStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  menuItemActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analyticsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginTop: 15,
    marginBottom: 8,
  },
  analyticsDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addFirstItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  addFirstItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});