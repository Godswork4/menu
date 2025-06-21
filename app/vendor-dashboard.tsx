import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit3, Trash2, Eye, ChartBar as BarChart3, DollarSign, Package, Users, Camera, MapPin, Clock, Star } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  
  const { user, profile } = useAuth();

  // Mock data for vendor dashboard
  const dashboardStats = {
    totalOrders: 156,
    totalRevenue: 2450000,
    activeMenuItems: 24,
    averageRating: 4.7,
  };

  const recentOrders = [
    {
      id: 1,
      customerName: 'John Doe',
      items: 'Jollof Rice, Grilled Chicken',
      amount: 8500,
      status: 'preparing',
      time: '10 mins ago',
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      items: 'Fried Rice, Fish',
      amount: 6750,
      status: 'delivered',
      time: '25 mins ago',
    },
    {
      id: 3,
      customerName: 'Mike Wilson',
      items: 'Pepper Soup, Bread',
      amount: 4200,
      status: 'confirmed',
      time: '1 hour ago',
    },
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      price: 4500,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      status: 'active',
      orders: 45,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Grilled Chicken',
      price: 6500,
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      status: 'active',
      orders: 32,
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Pepper Soup',
      price: 3200,
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      status: 'inactive',
      orders: 18,
      rating: 4.6,
    },
  ];

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

  const handleEditFood = (itemId: number) => {
    router.push({
      pathname: '/edit-food-item',
      params: { id: itemId }
    });
  };

  const handleDeleteFood = (itemId: number) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Handle delete logic here
          Alert.alert('Success', 'Menu item deleted successfully');
        }}
      ]
    );
  };

  const renderOverview = () => (
    <View>
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
        
        {recentOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderInfo}>
              <Text style={styles.customerName}>{order.customerName}</Text>
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
        ))}
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
        
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItemCard}>
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
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
              <View style={[
                styles.menuItemStatus,
                { backgroundColor: item.status === 'active' ? '#4CAF50' : '#FF6B6B' }
              ]}>
                <Text style={styles.menuItemStatusText}>{item.status}</Text>
              </View>
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
        ))}
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
});