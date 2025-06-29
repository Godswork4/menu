import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
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
  image_url: string | null;
  status: 'active' | 'inactive';
  category: string;
  description: string | null;
  prep_time: string | null;
  created_at: string;
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeMenuItems: 0,
    averageRating: 0,
  });
  
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMenuItems();
      fetchStats();
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
        Alert.alert('Error', 'Failed to load menu items');
      } else {
        setMenuItems(data || []);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          activeMenuItems: data?.filter(item => item.status === 'active').length || 0
        }));
      }
    } catch (error) {
      console.error('Unexpected error fetching menu items:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    // In a real app, this would fetch actual stats from the backend
    // For now, we'll use mock data with some randomization
    
    try {
      // Get order count
      const { count: orderCount, error: orderError } = await supabase
        .from('vendor_orders')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', user?.id);
      
      if (orderError) throw orderError;
      
      // Get revenue
      const { data: orderData, error: revenueError } = await supabase
        .from('vendor_orders')
        .select('total_amount')
        .eq('vendor_id', user?.id);
      
      if (revenueError) throw revenueError;
      
      const totalRevenue = orderData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      
      // Set stats
      setStats({
        totalOrders: orderCount || Math.floor(Math.random() * 200) + 50,
        totalRevenue: totalRevenue || Math.floor(Math.random() * 3000000) + 1000000,
        activeMenuItems: menuItems.filter(item => item.status === 'active').length,
        averageRating: 4.5 + (Math.random() * 0.4),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data
      setStats({
        totalOrders: Math.floor(Math.random() * 200) + 50,
        totalRevenue: Math.floor(Math.random() * 3000000) + 1000000,
        activeMenuItems: menuItems.filter(item => item.status === 'active').length,
        averageRating: 4.5 + (Math.random() * 0.4),
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMenuItems();
    fetchStats();
  };

  const formatPrice = (price: number) => {
    return `₦${(price / 100).toLocaleString()}`; // Convert from kobo to naira
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

  const handleToggleStatus = async (itemId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('food_items')
        .update({ status: newStatus })
        .eq('id', itemId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setMenuItems(menuItems.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeMenuItems: newStatus === 'active' 
          ? prev.activeMenuItems + 1 
          : prev.activeMenuItems - 1
      }));
      
      Alert.alert(
        'Status Updated', 
        `Item is now ${newStatus === 'active' ? 'visible to customers' : 'hidden from customers'}`
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update item status');
    }
  };

  const handleDeleteFood = (itemId: string, imageUrl: string | null) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Delete the item from the database
              const { error } = await supabase
                .from('food_items')
                .delete()
                .eq('id', itemId);
              
              if (error) {
                throw error;
              }
              
              // Update local state
              setMenuItems(menuItems.filter(item => item.id !== itemId));
              
              // Update stats
              const deletedItem = menuItems.find(item => item.id === itemId);
              if (deletedItem?.status === 'active') {
                setStats(prev => ({
                  ...prev,
                  activeMenuItems: prev.activeMenuItems - 1
                }));
              }
              
              Alert.alert('Success', 'Menu item deleted successfully');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete menu item');
            }
          }
        }
      ]
    );
  };

  const renderOverview = () => (
    <View>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Package size={24} color="#006400" />
          <Text style={styles.statNumber}>{stats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <DollarSign size={24} color="#FFD700" />
          <Text style={styles.statNumber}>{formatPrice(stats.totalRevenue)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Users size={24} color="#3F51B5" />
          <Text style={styles.statNumber}>{stats.activeMenuItems}</Text>
          <Text style={styles.statLabel}>Active Items</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={24} color="#FF6B6B" />
          <Text style={styles.statNumber}>{stats.averageRating.toFixed(1)}</Text>
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
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006400" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : (
          <View>
            {/* Mock orders for now */}
            <View style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.customerName}>John Doe</Text>
                <Text style={styles.orderItems}>Jollof Rice, Grilled Chicken</Text>
                <Text style={styles.orderTime}>10 mins ago</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>{formatPrice(850000)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#FF8F0020' }]}>
                  <Text style={[styles.statusText, { color: '#FF8F00' }]}>
                    preparing
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.customerName}>Sarah Johnson</Text>
                <Text style={styles.orderItems}>Fried Rice, Fish</Text>
                <Text style={styles.orderTime}>25 mins ago</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>{formatPrice(675000)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#4CAF5020' }]}>
                  <Text style={[styles.statusText, { color: '#4CAF50' }]}>
                    delivered
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Orders</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
        ) : menuItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No Menu Items</Text>
            <Text style={styles.emptyStateText}>
              Start adding delicious food items to your menu
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddFood}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyStateButtonText}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
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
                <Text style={styles.menuItemCategory}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')}
                </Text>
                <View style={[
                  styles.menuItemStatus,
                  { backgroundColor: item.status === 'active' ? '#4CAF5020' : '#FF6B6B20' }
                ]}>
                  <Text style={[
                    styles.menuItemStatusText,
                    { color: item.status === 'active' ? '#4CAF50' : '#FF6B6B' }
                  ]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.menuItemActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleToggleStatus(item.id, item.status)}
                >
                  <Eye size={16} color={item.status === 'active' ? '#FF6B6B' : '#4CAF50'} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditFood(item.id)}
                >
                  <Edit3 size={16} color="#006400" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteFood(item.id, item.image_url)}
                >
                  <Trash2 size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
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
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#006400']}
            tintColor={'#006400'}
          />
        }
      >
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
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
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
  viewAllButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
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
  menuItemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
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
  },
  menuItemActions: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});