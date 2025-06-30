import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, X, RefreshCw } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';

export default function PaymentVerification() {
  const params = useLocalSearchParams();
  const { amount, orderId } = params;
  
  const [verificationStep, setVerificationStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  const formatPrice = (price: string | string[] | number) => {
    const numericPrice = typeof price === 'number' ? price : Number(Array.isArray(price) ? price[0] : price);
    return `₦${numericPrice.toLocaleString()}`;
  };

  const handleVerifyPayment = () => {
    if (!referenceNumber.trim()) {
      Alert.alert('Error', 'Please enter the transaction reference number');
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      
      // For demo purposes, we'll consider the verification successful if the reference number
      // is at least 6 characters long, otherwise it fails
      if (referenceNumber.length >= 6) {
        setVerificationStep(3); // Success
      } else {
        setVerificationStep(2); // Failed
        setVerificationAttempts(verificationAttempts + 1);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setVerificationStep(1);
    setReferenceNumber('');
  };

  const handleSuccess = () => {
    router.replace({
      pathname: '/payment-success',
      params: { orderId, amount }
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Verification',
      'Are you sure you want to cancel? Your order will not be processed.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
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
          <Text style={styles.headerTitle}>Payment Verification</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {verificationStep === 1 && (
          <View style={styles.verificationContainer}>
            <Text style={styles.verificationTitle}>Verify Your Payment</Text>
            <Text style={styles.verificationInstructions}>
              Please enter the transaction reference number from your OPay transfer receipt to verify your payment of {formatPrice(amount || 15500)}.
            </Text>
            
            <View style={styles.referenceInputContainer}>
              <TextInput
                style={styles.referenceInput}
                placeholder="Enter transaction reference"
                value={referenceNumber}
                onChangeText={setReferenceNumber}
                editable={!isVerifying}
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.verifyButton,
                (!referenceNumber.trim() || isVerifying) && styles.verifyButtonDisabled
              ]}
              onPress={handleVerifyPayment}
              disabled={!referenceNumber.trim() || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify Payment</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isVerifying}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.helpText}>
              The reference number can be found in your OPay transaction receipt or bank statement.
            </Text>
          </View>
        )}

        {verificationStep === 2 && (
          <View style={styles.verificationContainer}>
            <View style={styles.failureIconContainer}>
              <X size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.verificationTitle}>Verification Failed</Text>
            <Text style={styles.verificationInstructions}>
              We couldn't verify your payment with the provided reference number. This could be due to:
            </Text>
            
            <View style={styles.reasonsContainer}>
              <View style={styles.reasonItem}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>Incorrect reference number</Text>
              </View>
              <View style={styles.reasonItem}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>Payment is still processing</Text>
              </View>
              <View style={styles.reasonItem}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>Payment was not completed</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetry}
            >
              <RefreshCw size={20} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
            
            <Text style={styles.attemptsText}>
              Verification attempts: {verificationAttempts}/3
            </Text>
          </View>
        )}

        {verificationStep === 3 && (
          <View style={styles.verificationContainer}>
            <View style={styles.successIconContainer}>
              <Check size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.verificationTitle}>Payment Verified!</Text>
            <Text style={styles.verificationInstructions}>
              Your payment of {formatPrice(amount || 15500)} has been successfully verified. Your order is now being processed.
            </Text>
            
            <View style={styles.orderDetailsCard}>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Order ID</Text>
                <Text style={styles.orderDetailValue}>#{orderId || '12345678'}</Text>
              </View>
              
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Payment Method</Text>
                <Text style={styles.orderDetailValue}>OPay Transfer</Text>
              </View>
              
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Reference</Text>
                <Text style={styles.orderDetailValue}>{referenceNumber}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleSuccess}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  verificationContainer: {
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  verificationInstructions: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  referenceInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  referenceInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  verifyButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  verifyButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF6B6B',
  },
  helpText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  failureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  reasonsContainer: {
    width: '100%',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginRight: 10,
  },
  reasonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  retryButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  attemptsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderDetailsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
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
  continueButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});