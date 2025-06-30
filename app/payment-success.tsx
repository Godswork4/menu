import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Package, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';

export default function PaymentSuccess() {
  const params = useLocalSearchParams();
  const { orderId, amount } = params;

  const formatPrice = (price: string | string[] | number) => {
    const numericPrice = typeof price === 'number' ? price : Number(Array.isArray(price) ? price[0] : price);
    return `₦${numericPrice.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const currentDate = new Date();
  const estimatedDelivery = new Date(currentDate.getTime() + 30 * 60000); // 30 minutes later

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Check size={60} color="#FFFFFF" />
        </View>
        
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successMessage}>
          Your order has been confirmed and is being prepared.
        </Text>
        
        {/* Order Details */}
        <View style={styles.orderDetailsCard}>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Order ID</Text>
            <Text style={styles.orderDetailValue}>#{orderId || '12345678'}</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Amount Paid</Text>
            <Text style={styles.orderDetailValue}>{formatPrice(amount || 15500)}</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Payment Method</Text>
            <Text style={styles.orderDetailValue}>OPay Transfer</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Date & Time</Text>
            <Text style={styles.orderDetailValue}>
              {formatDate(currentDate)}, {formatTime(currentDate)}
            </Text>
          </View>
        </View>
        
        {/* Delivery Status */}
        <View style={styles.deliveryStatusCard}>
          <View style={styles.deliveryStatusHeader}>
            <Package size={20} color="#006400" />
            <Text style={styles.deliveryStatusTitle}>Delivery Status</Text>
          </View>
          
          <View style={styles.statusSteps}>
            <View style={[styles.statusStep, styles.statusStepActive]}>
              <View style={[styles.statusDot, styles.statusDotActive]}>
                <Check size={12} color="#FFFFFF" />
              </View>
              <Text style={[styles.statusText, styles.statusTextActive]}>Order Confirmed</Text>
            </View>
            
            <View style={styles.statusConnector} />
            
            <View style={styles.statusStep}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Being Prepared</Text>
            </View>
            
            <View style={styles.statusConnector} />
            
            <View style={styles.statusStep}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>On the Way</Text>
            </View>
            
            <View style={styles.statusConnector} />
            
            <View style={styles.statusStep}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Delivered</Text>
            </View>
          </View>
          
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryInfoItem}>
              <MapPin size={16} color="#666666" />
              <Text style={styles.deliveryInfoText}>
                Delivery to: Home - 15 Admiralty Way, Lekki Phase 1
              </Text>
            </View>
            
            <View style={styles.deliveryInfoItem}>
              <Clock size={16} color="#666666" />
              <Text style={styles.deliveryInfoText}>
                Estimated delivery: {formatTime(estimatedDelivery)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.trackOrderButton}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.trackOrderText}>Track Order</Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backToHomeButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <CustomLogo size="medium" color="#006400" />
        <Text style={styles.logoText}>Menu - Food Explorer</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  orderDetailsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderDetailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  orderDetailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  deliveryStatusCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  deliveryStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  deliveryStatusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  statusSteps: {
    marginBottom: 20,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusStepActive: {
    opacity: 1,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusDotActive: {
    backgroundColor: '#32CD32',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  statusTextActive: {
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  statusConnector: {
    width: 2,
    height: 15,
    backgroundColor: '#E0E0E0',
    marginLeft: 11,
    marginBottom: 8,
  },
  deliveryInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    gap: 10,
  },
  deliveryInfoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  deliveryInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    flex: 1,
  },
  actionsContainer: {
    marginTop: 30,
    gap: 15,
  },
  trackOrderButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  trackOrderText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  backToHomeButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  backToHomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  logoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 5,
  },
});