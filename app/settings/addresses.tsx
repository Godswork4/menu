import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Plus, Edit3, Trash2, Home, Briefcase, MapPinOff, Check } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';

interface Address {
  id: number;
  title: string;
  address: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export default function AddressSettings() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: 'Home',
      address: '15 Admiralty Way, Lekki Phase 1, Lagos',
      type: 'home',
      isDefault: true,
    },
    {
      id: 2,
      title: 'Office',
      address: '8 Ozumba Mbadiwe Ave, Victoria Island, Lagos',
      type: 'work',
      isDefault: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newType, setNewType] = useState<'home' | 'work' | 'other'>('home');
  const [newIsDefault, setNewIsDefault] = useState(false);

  const handleAddAddress = () => {
    if (!newTitle || !newAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newAddressObj: Address = {
      id: Date.now(),
      title: newTitle,
      address: newAddress,
      type: newType,
      isDefault: newIsDefault,
    };

    // If new address is default, update other addresses
    let updatedAddresses = [...addresses];
    if (newIsDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false,
      }));
    }

    setAddresses([...updatedAddresses, newAddressObj]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditAddress = () => {
    if (!selectedAddress || !newTitle || !newAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // If edited address is being set as default, update other addresses
    let updatedAddresses = [...addresses];
    if (newIsDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false,
      }));
    }

    updatedAddresses = updatedAddresses.map(addr => 
      addr.id === selectedAddress.id 
        ? { 
            ...addr, 
            title: newTitle, 
            address: newAddress, 
            type: newType, 
            isDefault: newIsDefault 
          }
        : addr
    );

    setAddresses(updatedAddresses);
    resetForm();
    setShowEditModal(false);
  };

  const handleDeleteAddress = (id: number) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const addressToDelete = addresses.find(addr => addr.id === id);
            
            // If deleting the default address, make another one default
            if (addressToDelete?.isDefault && addresses.length > 1) {
              const otherAddresses = addresses.filter(addr => addr.id !== id);
              otherAddresses[0].isDefault = true;
            }
            
            setAddresses(addresses.filter(addr => addr.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const openEditModal = (address: Address) => {
    setSelectedAddress(address);
    setNewTitle(address.title);
    setNewAddress(address.address);
    setNewType(address.type);
    setNewIsDefault(address.isDefault);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewAddress('');
    setNewType('home');
    setNewIsDefault(false);
    setSelectedAddress(null);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home size={20} color="#006400" />;
      case 'work':
        return <Briefcase size={20} color="#3F51B5" />;
      default:
        return <MapPin size={20} color="#FF6B6B" />;
    }
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
          <Text style={styles.headerTitle}>Delivery Addresses</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address List */}
        <View style={styles.addressesSection}>
          <Text style={styles.sectionTitle}>Your Addresses</Text>
          
          {addresses.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPinOff size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>No Addresses Found</Text>
              <Text style={styles.emptyStateText}>
                Add your delivery addresses to make ordering faster
              </Text>
              <TouchableOpacity 
                style={styles.addAddressButton}
                onPress={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addAddressText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTitleRow}>
                    {getAddressIcon(address.type)}
                    <Text style={styles.addressTitle}>{address.title}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditModal(address)}
                    >
                      <Edit3 size={16} color="#666666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
                {!address.isDefault && (
                  <TouchableOpacity 
                    style={styles.setDefaultButton}
                    onPress={() => handleSetDefault(address.id)}
                  >
                    <Text style={styles.setDefaultText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        {/* Add Address Button */}
        {addresses.length > 0 && (
          <TouchableOpacity 
            style={styles.addNewButton}
            onPress={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addNewText}>Add New Address</Text>
          </TouchableOpacity>
        )}

        {/* Address Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why add multiple addresses?</Text>
          <Text style={styles.infoText}>
            Save time by adding addresses for home, work, and other locations you frequently order to.
            Set a default address to make checkout faster.
          </Text>
        </View>
      </ScrollView>

      {/* Add Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Title</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Home, Office, Friend's Place"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Enter complete address with landmarks"
                  value={newAddress}
                  onChangeText={setNewAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newType === 'home' && styles.typeOptionActive
                    ]}
                    onPress={() => setNewType('home')}
                  >
                    <Home size={16} color={newType === 'home' ? "#FFFFFF" : "#006400"} />
                    <Text style={[
                      styles.typeText,
                      newType === 'home' && styles.typeTextActive
                    ]}>
                      Home
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newType === 'work' && styles.typeOptionActive
                    ]}
                    onPress={() => setNewType('work')}
                  >
                    <Briefcase size={16} color={newType === 'work' ? "#FFFFFF" : "#3F51B5"} />
                    <Text style={[
                      styles.typeText,
                      newType === 'work' && styles.typeTextActive
                    ]}>
                      Work
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newType === 'other' && styles.typeOptionActive
                    ]}
                    onPress={() => setNewType('other')}
                  >
                    <MapPin size={16} color={newType === 'other' ? "#FFFFFF" : "#FF6B6B"} />
                    <Text style={[
                      styles.typeText,
                      newType === 'other' && styles.typeTextActive
                    ]}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.defaultCheckbox}
                  onPress={() => setNewIsDefault(!newIsDefault)}
                >
                  <View style={[
                    styles.checkbox,
                    newIsDefault && styles.checkboxActive
                  ]}>
                    {newIsDefault && <Check size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Set as default address</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddAddress}
              >
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Address</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Title</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Home, Office, Friend's Place"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Enter complete address with landmarks"
                  value={newAddress}
                  onChangeText={setNewAddress}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newType === 'home' && styles.typeOptionActive
                    ]}
                    onPress={() => setNewType('home')}
                  >
                    <Home size={16} color={newType === 'home' ? "#FFFFFF" : "#006400"} />
                    <Text style={[
                      styles.typeText,
                      newType === 'home' && styles.typeTextActive
                    ]}>
                      Home
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newType === 'work' && styles.typeOptionActive
                    ]}
                    onPress={() => setNewType('work')}
                  >
                    <Briefcase size={16} color={newType === 'work' ? "#FFFFFF" : "#3F51B5"} />
                    <Text style={[
                      styles.typeText,
                      newType === 'work' && styles.typeTextActive
                    ]}>
                      Work
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newType === 'other' && styles.typeOptionActive
                    ]}
                    onPress={() => setNewType('other')}
                  >
                    <MapPin size={16} color={newType === 'other' ? "#FFFFFF" : "#FF6B6B"} />
                    <Text style={[
                      styles.typeText,
                      newType === 'other' && styles.typeTextActive
                    ]}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.defaultCheckbox}
                  onPress={() => setNewIsDefault(!newIsDefault)}
                >
                  <View style={[
                    styles.checkbox,
                    newIsDefault && styles.checkboxActive
                  ]}>
                    {newIsDefault && <Check size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Set as default address</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleEditAddress}
              >
                <Text style={styles.saveButtonText}>Update Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addressesSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  defaultBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginBottom: 15,
    lineHeight: 20,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  setDefaultText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
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
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  addAddressText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 25,
    gap: 8,
  },
  addNewText: {
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  modalClose: {
    fontSize: 20,
    color: '#666666',
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  typeOptionActive: {
    backgroundColor: '#006400',
  },
  typeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333333',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  defaultCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#006400',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});