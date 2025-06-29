import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Bell, Trash2, CreditCard as Edit3, Check, X, Filter } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

interface ScheduledOrder {
  id: number;
  foodName: string;
  restaurant: string;
  image: string;
  price: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'processing' | 'delivered' | 'cancelled';
  reminderSet: boolean;
  notes?: string;
}

export default function ScheduledOrders() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>([
    {
      id: 1,
      foodName: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      image: IMAGES.JOLLOF_RICE,
      price: 4500,
      scheduledDate: '2024-04-25',
      scheduledTime: '13:00',
      status: 'scheduled',
      reminderSet: true,
      notes: 'Extra spicy, no plantain',
    },
    {
      id: 2,
      foodName: 'Grilled Chicken',
      restaurant: 'Spice Garden',
      image: IMAGES.GRILLED_CHICKEN,
      price: 6500,
      scheduledDate: '2024-04-25',
      scheduledTime: '19:30',
      status: 'scheduled',
      reminderSet: true,
    },
    {
      id: 3,
      foodName: 'Pepper Soup',
      restaurant: 'Traditional Taste',
      image: IMAGES.PEPPER_SOUP,
      price: 3200,
      scheduledDate: '2024-04-26',
      scheduledTime: '12:00',
      status: 'scheduled',
      reminderSet: false,
    },
    {
      id: 4,
      foodName: 'Akara & Bread',
      restaurant: 'Lagos Street Food',
      image: IMAGES.AKARA_BREAD,
      price: 2995,
      scheduledDate: '2024-04-22',
      scheduledTime: '08:00',
      status: 'delivered',
      reminderSet: true,
    },
    {
      id: 5,
      foodName: 'Suya Platter',
      restaurant: 'Suya Spot',
      image: IMAGES.SUYA_PLATTER,
      price: 6500,
      scheduledDate: '2024-04-23',
      scheduledTime: '19:00',
      status: 'cancelled',
      reminderSet: true,
    },
  ]);

  const filters = [
    { id: 'all', name: 'All Orders' },
    { id: 'scheduled', name: 'Scheduled' },
    { id: 'delivered', name: 'Delivered' },
    { id: 'cancelled', name: 'Cancelled' },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#4CAF50';
      case 'processing': return '#FFA726';
      case 'delivered': return '#3F51B5';
      case 'cancelled': return '#FF6B6B';
      default: return '#666666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'processing': return 'Processing';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleCancelOrder = (id: number) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this scheduled order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setScheduledOrders(scheduledOrders.map(order => 
              order.id === id 
                ? { ...order, status: 'cancelled' } 
                : order
            ));
          },
        },
      ]
    );
  };

  const handleToggleReminder = (id: number) => {
    setScheduledOrders(scheduledOrders.map(order => 
      order.id === id 
        ? { ...order, reminderSet: !order.reminderSet } 
        : order
    ));
  };

  const getFilteredOrders = () => {
    if (selectedFilter === 'all') return scheduledOrders;
    return scheduledOrders.filter(order => order.status === selectedFilter);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.headerTitle}>Scheduled Orders</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                selectedFilter === filter.id && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.id && styles.filterTabTextActive
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        <View style={styles.ordersSection}>
          {getFilteredOrders().length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>No Orders Found</Text>
              <Text style={styles.emptyStateText}>
                No {selectedFilter !== 'all' ? selectedFilter : ''} orders to display
              </Text>
              <TouchableOpacity 
                style={styles.scheduleButton}
                onPress={() => router.push('/meal-planning')}
              >
                <Calendar size={20} color="#FFFFFF" />
                <Text style={styles.scheduleButtonText}>Schedule New Order</Text>
              </TouchableOpacity>
            </View>
          ) : (
            getFilteredOrders().map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.dateTimeInfo}>
                    <Calendar size={14} color="#666666" />
                    <Text style={styles.dateText}>{formatDate(order.scheduledDate)}</Text>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.timeText}>{formatTime(order.scheduledTime)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderContent}>
                  <ImageWithFallback 
                    source={order.image} 
                    style={styles.foodImage}
                    fallback={IMAGES.DEFAULT_FOOD}
                  />
                  <View style={styles.orderInfo}>
                    <Text style={styles.foodName}>{order.foodName}</Text>
                    <Text style={styles.restaurantName}>{order.restaurant}</Text>
                    <Text style={styles.orderPrice}>{formatPrice(order.price)}</Text>
                    {order.notes && (
                      <Text style={styles.orderNotes}>Note: {order.notes}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.orderActions}>
                  {order.status === 'scheduled' && (
                    <>
                      <TouchableOpacity 
                        style={styles.reminderButton}
                        onPress={() => handleToggleReminder(order.id)}
                      >
                        <Bell size={16} color={order.reminderSet ? "#FFA726" : "#666666"} />
                        <Text style={[
                          styles.reminderText,
                          order.reminderSet && styles.reminderTextActive
                        ]}>
                          {order.reminderSet ? 'Reminder On' : 'Set Reminder'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => router.push('/meal-planning')}
                      >
                        <Edit3 size={16} color="#006400" />
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cancelOrderButton}
                        onPress={() => handleCancelOrder(order.id)}
                      >
                        <X size={16} color="#FF6B6B" />
                        <Text style={styles.cancelOrderText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {order.status === 'delivered' && (
                    <TouchableOpacity 
                      style={styles.reorderButton}
                      onPress={() => router.push('/meal-planning')}
                    >
                      <Calendar size={16} color="#FFFFFF" />
                      <Text style={styles.reorderButtonText}>Schedule Again</Text>
                    </TouchableOpacity>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <TouchableOpacity 
                      style={styles.reorderButton}
                      onPress={() => router.push('/meal-planning')}
                    >
                      <Calendar size={16} color="#FFFFFF" />
                      <Text style={styles.reorderButtonText}>Schedule Again</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Scheduled Orders</Text>
          <Text style={styles.infoText}>
            Scheduled orders are automatically placed at the specified time. You'll receive a notification before the order is placed, giving you time to make any changes if needed.
          </Text>
        </View>
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
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  filterTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#006400',
  },
  filterTabText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  ordersSection: {
    marginBottom: 25,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginRight: 10,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-Semibold',
  },
  orderContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
    marginBottom: 4,
  },
  orderNotes: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    fontStyle: 'italic',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  reminderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  reminderTextActive: {
    color: '#FFA726',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  cancelOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  cancelOrderText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF6B6B',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  reorderButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
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
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#333333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
});