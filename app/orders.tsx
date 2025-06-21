import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Star, Phone, MessageCircle } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('active');
  const { user, profile } = useAuth();

  // Mock orders data
  const orders = {
    active: [
      {
        id: 1,
        restaurant: 'Lagos Kitchen',
        items: ['Jollof Rice Special', 'Grilled Chicken'],
        total: 11000,
        status: 'preparing',
        estimatedTime: '15-20 mins',
        orderTime: '2:30 PM',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        address: '123 Victoria Island, Lagos',
        phone: '+234 801 234 5678',
      },
      {
        id: 2,
        restaurant: 'Spice Garden',
        items: ['Chicken Tikka Bowl', 'Naan Bread'],
        total: 8750,
        status: 'confirmed',
        estimatedTime: '25-30 mins',
        orderTime: '1:45 PM',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        address: '456 Lekki Phase 1, Lagos',
        phone: '+234 802 345 6789',
      },
    ],
    completed: [
      {
        id: 3,
        restaurant: 'Ocean Fresh',
        items: ['Salmon Teriyaki', 'Miso Soup'],
        total: 15500,
        status: 'delivered',
        deliveredTime: 'Yesterday, 7:30 PM',
        orderTime: 'Yesterday, 6:45 PM',
        image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
        rating: 5,
      },
      {
        id: 4,
        restaurant: 'Pizza Corner',
        items: ['Margherita Pizza', 'Garlic Bread'],
        total: 9250,
        status: 'delivered',
        deliveredTime: '2 days ago, 8:15 PM',
        orderTime: '2 days ago, 7:30 PM',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        rating: 4,
      },
    ],
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#FF8F00';
      case 'confirmed': return '#2196F3';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#FF6B6B';
      default: return '#666666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Being Prepared';
      case 'confirmed': return 'Order Confirmed';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleContactRestaurant = (phone: string) => {
    // In a real app, this would open the phone dialer
    console.log('Calling:', phone);
  };

  const handleTrackOrder = (orderId: number) => {
    router.push({
      pathname: '/track-order',
      params: { id: orderId }
    });
  };

  const handleReorder = (orderId: number) => {
    // Handle reorder logic
    console.log('Reordering:', orderId);
  };

  const handleRateOrder = (orderId: number) => {
    // Handle rating logic
    console.log('Rating order:', orderId);
  };

  const renderActiveOrders = () => (
    <View>
      {orders.active.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Active Orders</Text>
          <Text style={styles.emptyStateText}>You don't have any active orders right now</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.browseButtonText}>Browse Food</Text>
          </TouchableOpacity>
        </View>
      ) : (
        orders.active.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Image source={{ uri: order.image }} style={styles.restaurantImage} />
              <View style={styles.orderInfo}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <Text style={styles.orderTime}>Ordered at {order.orderTime}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
            </View>

            <View style={styles.orderItems}>
              <Text style={styles.itemsLabel}>Items:</Text>
              {order.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>• {item}</Text>
              ))}
            </View>

            <View style={styles.orderMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color="#666666" />
                <Text style={styles.metaText}>{order.estimatedTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <MapPin size={16} color="#666666" />
                <Text style={styles.metaText}>{order.address}</Text>
              </View>
            </View>

            <View style={styles.orderActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleTrackOrder(order.id)}
              >
                <Text style={styles.actionButtonText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.contactButton]}
                onPress={() => handleContactRestaurant(order.phone)}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderCompletedOrders = () => (
    <View>
      {orders.completed.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Order History</Text>
          <Text style={styles.emptyStateText}>Your completed orders will appear here</Text>
        </View>
      ) : (
        orders.completed.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Image source={{ uri: order.image }} style={styles.restaurantImage} />
              <View style={styles.orderInfo}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <Text style={styles.orderTime}>Delivered {order.deliveredTime}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, index) => (
                    <Star 
                      key={index} 
                      size={14} 
                      color={index < order.rating ? "#FFD700" : "#D3D3D3"}
                      fill={index < order.rating ? "#FFD700" : "transparent"}
                    />
                  ))}
                  <Text style={styles.ratingText}>({order.rating}/5)</Text>
                </View>
              </View>
              <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
            </View>

            <View style={styles.orderItems}>
              <Text style={styles.itemsLabel}>Items:</Text>
              {order.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>• {item}</Text>
              ))}
            </View>

            <View style={styles.orderActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleReorder(order.id)}
              >
                <Text style={styles.actionButtonText}>Reorder</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rateButton]}
                onPress={() => handleRateOrder(order.id)}
              >
                <Star size={16} color="#FFFFFF" />
                <Text style={styles.rateButtonText}>Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* User Info */}
      <View style={styles.userSection}>
        <Text style={styles.welcomeText}>Hello, {profile?.full_name?.split(' ')[0] || 'User'}!</Text>
        <Text style={styles.userSubtext}>Track and manage your food orders</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Orders ({orders.active.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Order History ({orders.completed.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'active' && renderActiveOrders()}
        {activeTab === 'completed' && renderCompletedOrders()}
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
  userSection: {
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
  userSubtext: {
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 4,
    alignItems: 'center',
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
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
  },
  orderTotal: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  orderItems: {
    marginBottom: 15,
  },
  itemsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  orderMeta: {
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#006400',
  },
  contactButton: {
    backgroundColor: '#006400',
    flexDirection: 'row',
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  rateButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    gap: 6,
  },
  rateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#006400',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});