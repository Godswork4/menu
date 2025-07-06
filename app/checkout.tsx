import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  X,
  DollarSign,
  Truck,
  Smartphone,
  Copy,
} from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

export default function Checkout() {
  const { user, profile } = useAuth();
  const params = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('opay');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState('standard');
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showTransferDetails, setShowTransferDetails] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);

  // Mock cart data - in a real app, this would come from a cart context or API
  const cartItems = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      price: 4500,
      quantity: 2,
      image: IMAGES.JOLLOF_RICE,
    },
    {
      id: 2,
      name: 'Grilled Chicken',
      restaurant: 'Spice Garden',
      price: 6500,
      quantity: 1,
      image: IMAGES.GRILLED_CHICKEN,
    },
  ];

  // Mock saved addresses
  const savedAddresses = [
    {
      id: 1,
      title: 'Home',
      address: '15 Admiralty Way, Lekki Phase 1, Lagos',
      isDefault: true,
    },
    {
      id: 2,
      title: 'Office',
      address: '8 Ozumba Mbadiwe Ave, Victoria Island, Lagos',
      isDefault: false,
    },
  ];

  // Delivery options
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      time: '30-45 min',
      fee: 1500,
    },
    {
      id: 'express',
      name: 'Express Delivery',
      time: '15-25 min',
      fee: 2500,
    },
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: 'opay',
      name: 'OPay Transfer',
      icon: Smartphone,
      color: '#4CAF50',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      color: '#3F51B5',
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: DollarSign,
      color: '#FF9800',
    },
  ];

  // OPay account details
  const opayDetails = {
    accountName: 'Menus Food Explorer',
    accountNumber: '8012345678',
    bankName: 'OPay',
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getDeliveryFee = () => {
    const option = deliveryOptions.find(
      (opt) => opt.id === selectedDeliveryOption
    );
    return option ? option.fee : 0;
  };

  const getDiscount = () => {
    return isPromoApplied ? Math.round(getSubtotal() * 0.1) : 0; // 10% discount
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() - getDiscount();
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);

    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'MENU10') {
        setIsPromoApplied(true);
        Alert.alert(
          'Success',
          'Promo code applied successfully! 10% discount added.'
        );
      } else {
        Alert.alert(
          'Invalid Code',
          'The promo code you entered is invalid or expired.'
        );
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleCopyAccountNumber = () => {
    // In a real app, this would use Clipboard.setString(opayDetails.accountNumber)
    Alert.alert('Copied', `${opayDetails.accountNumber} copied to clipboard`);
  };

  const handlePaymentConfirmation = () => {
    if (selectedPaymentMethod === 'opay') {
      setShowTransferDetails(true);
    } else {
      processPayment();
    }
  };

  const handleTransferConfirmation = () => {
    setPaymentStep(2);
    // Simulate payment verification
    setTimeout(() => {
      setPaymentStep(3);
    }, 2000);
  };

  const processPayment = () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been confirmed and will be delivered soon.',
        [
          {
            text: 'View Order',
            onPress: () => router.push('/orders'),
          },
        ]
      );
    }, 2000);
  };

  const renderTransferDetails = () => {
    if (paymentStep === 1) {
      return (
        <View style={styles.transferContainer}>
          <Text style={styles.transferTitle}>Make Transfer to OPay</Text>
          <Text style={styles.transferInstructions}>
            Please transfer {formatPrice(getTotal())} to the account details
            below:
          </Text>

          <View style={styles.accountDetailsCard}>
            <View style={styles.accountDetail}>
              <Text style={styles.accountDetailLabel}>Bank Name:</Text>
              <Text style={styles.accountDetailValue}>
                {opayDetails.bankName}
              </Text>
            </View>

            <View style={styles.accountDetail}>
              <Text style={styles.accountDetailLabel}>Account Name:</Text>
              <Text style={styles.accountDetailValue}>
                {opayDetails.accountName}
              </Text>
            </View>

            <View style={styles.accountDetail}>
              <Text style={styles.accountDetailLabel}>Account Number:</Text>
              <View style={styles.accountNumberContainer}>
                <Text style={styles.accountDetailValue}>
                  {opayDetails.accountNumber}
                </Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyAccountNumber}
                >
                  <Copy size={16} color="#006400" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.transferNote}>
            After making the transfer, click the button below to confirm.
          </Text>

          <TouchableOpacity
            style={styles.confirmTransferButton}
            onPress={handleTransferConfirmation}
          >
            <Text style={styles.confirmTransferText}>
              I've Made the Transfer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowTransferDetails(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (paymentStep === 2) {
      return (
        <View style={styles.transferContainer}>
          <Text style={styles.transferTitle}>Verifying Payment</Text>
          <View style={styles.verifyingContainer}>
            <ActivityIndicator size="large" color="#006400" />
            <Text style={styles.verifyingText}>
              We're confirming your payment with OPay. This may take a moment...
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.transferContainer}>
          <View style={styles.successIconContainer}>
            <Check size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.transferTitle}>Payment Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your payment has been confirmed and your order is being processed.
          </Text>

          <TouchableOpacity
            style={styles.viewOrderButton}
            onPress={() => router.push('/orders')}
          >
            <Text style={styles.viewOrderText}>View Order</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          {savedAddresses.map((address, index) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === index && styles.selectedAddressCard,
              ]}
              onPress={() => setSelectedAddress(index)}
            >
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressTitle}>{address.title}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
              </View>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedAddress === index && styles.radioOuterSelected,
                  ]}
                >
                  {selectedAddress === index && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => router.push('/settings/addresses')}
          >
            <Text style={styles.addNewText}>+ Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <ImageWithFallback
                source={item.image}
                style={styles.itemImage}
                fallback={IMAGES.DEFAULT_FOOD}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price)}
                  </Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.editCartButton}
            onPress={() => router.back()}
          >
            <Text style={styles.editCartText}>Edit Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>

          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.deliveryOption,
                selectedDeliveryOption === option.id &&
                  styles.selectedDeliveryOption,
              ]}
              onPress={() => setSelectedDeliveryOption(option.id)}
            >
              <View style={styles.deliveryOptionInfo}>
                <View style={styles.deliveryOptionHeader}>
                  <Text style={styles.deliveryOptionName}>{option.name}</Text>
                  <Text style={styles.deliveryFee}>
                    {formatPrice(option.fee)}
                  </Text>
                </View>
                <View style={styles.deliveryMeta}>
                  <Truck size={14} color="#666666" />
                  <Text style={styles.deliveryTime}>{option.time}</Text>
                </View>
              </View>
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedDeliveryOption === option.id &&
                      styles.radioOuterSelected,
                  ]}
                >
                  {selectedDeliveryOption === option.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>

          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              editable={!isPromoApplied}
            />
            {isPromoApplied ? (
              <TouchableOpacity
                style={styles.removePromoButton}
                onPress={() => {
                  setPromoCode('');
                  setIsPromoApplied(false);
                }}
              >
                <X size={16} color="#FFFFFF" />
                <Text style={styles.removePromoText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  (!promoCode.trim() || isApplyingPromo) &&
                    styles.applyButtonDisabled,
                ]}
                onPress={handleApplyPromo}
                disabled={!promoCode.trim() || isApplyingPromo}
              >
                {isApplyingPromo ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.applyButtonText}>Apply</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {isPromoApplied && (
            <View style={styles.appliedPromo}>
              <Check size={16} color="#32CD32" />
              <Text style={styles.appliedPromoText}>
                10% discount applied with code MENU10
              </Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method.id &&
                    styles.selectedPaymentMethod,
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View style={styles.paymentMethodInfo}>
                  <View
                    style={[
                      styles.paymentIcon,
                      { backgroundColor: method.color + '20' },
                    ]}
                  >
                    <IconComponent size={20} color={method.color} />
                  </View>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                </View>
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioOuter,
                      selectedPaymentMethod === method.id &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {selectedPaymentMethod === method.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Total */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>

          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatPrice(getSubtotal())}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery Fee</Text>
              <Text style={styles.totalValue}>
                {formatPrice(getDeliveryFee())}
              </Text>
            </View>

            {isPromoApplied && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={[styles.totalValue, styles.discountValue]}>
                  -{formatPrice(getDiscount())}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatPrice(getTotal())}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutButtonContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handlePaymentConfirmation}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.checkoutButtonText}>
              Place Order - {formatPrice(getTotal())}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Transfer Details Modal */}
      {showTransferDetails && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>{renderTransferDetails()}</View>
        </View>
      )}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedAddressCard: {
    borderColor: '#006400',
    backgroundColor: '#F0FFF0',
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  radioContainer: {
    marginLeft: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#006400',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#006400',
  },
  addNewButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#006400',
    borderStyle: 'dashed',
  },
  addNewText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  itemRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  editCartButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  editCartText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedDeliveryOption: {
    borderColor: '#006400',
    backgroundColor: '#F0FFF0',
  },
  deliveryOptionInfo: {
    flex: 1,
  },
  deliveryOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  deliveryOptionName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  deliveryFee: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  deliveryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  promoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  applyButton: {
    backgroundColor: '#006400',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  removePromoButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  removePromoText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  appliedPromoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#32CD32',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPaymentMethod: {
    borderColor: '#006400',
    backgroundColor: '#F0FFF0',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  totalValue: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  discountValue: {
    color: '#32CD32',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  grandTotalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  checkoutButtonContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  checkoutButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  transferContainer: {
    alignItems: 'center',
  },
  transferTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  transferInstructions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  accountDetailsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  accountDetail: {
    marginBottom: 12,
  },
  accountDetailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  accountDetailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyButton: {
    padding: 8,
  },
  transferNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmTransferButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmTransferText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  verifyingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  verifyingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginTop: 15,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  viewOrderButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  viewOrderText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});
