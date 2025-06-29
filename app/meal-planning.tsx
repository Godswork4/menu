import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Plus, Clock, ChefHat, Star, MapPin, CreditCard as Edit3, Trash2, Bell } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMealPlans, createMealPlan, updateMealPlan, deleteMealPlan, MealPlan } from '@/lib/mealPlanning';

export default function MealPlanning() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<string>('lunch');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new meal plan
  const [newMealName, setNewMealName] = useState('');
  const [newMealRestaurant, setNewMealRestaurant] = useState('');
  const [newMealPrice, setNewMealPrice] = useState('');
  const [newMealTime, setNewMealTime] = useState('12:00');
  const [newMealNotes, setNewMealNotes] = useState('');
  const [newMealRecurring, setNewMealRecurring] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMealPlans();
    }
  }, [user, selectedDate]);

  const loadMealPlans = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await fetchMealPlans(user.id, { date: selectedDate });
      
      if (error) throw error;
      
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error loading meal plans:', error);
      Alert.alert('Error', 'Failed to load your meal plans. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMealPlans();
  };

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅', color: '#FFD700' },
    { id: 'lunch', name: 'Lunch', icon: '☀️', color: '#FF6B6B' },
    { id: 'dinner', name: 'Dinner', icon: '🌙', color: '#4ECDC4' },
    { id: 'snack', name: 'Snack', icon: '🍿', color: '#FFA726' },
  ];

  const formatPrice = (price: number) => {
    return `₦${(price / 100).toLocaleString()}`; // Convert from kobo to naira
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    
    return week;
  };

  const getMealsForDate = (date: string) => {
    return mealPlans.filter(meal => meal.date === date);
  };

  const getMealsForDateAndType = (date: string, mealType: string) => {
    return mealPlans.filter(meal => meal.date === date && meal.meal_type === mealType);
  };

  const handleScheduleOrder = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setShowScheduleModal(true);
  };

  const handleDeleteMealPlan = async (mealPlanId: string) => {
    Alert.alert(
      'Delete Meal Plan',
      'Are you sure you want to remove this meal from your plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await deleteMealPlan(mealPlanId);
              
              if (error) throw error;
              
              setMealPlans(mealPlans.filter(m => m.id !== mealPlanId));
              Alert.alert('Success', 'Meal plan deleted successfully');
            } catch (error) {
              console.error('Error deleting meal plan:', error);
              Alert.alert('Error', 'Failed to delete meal plan. Please try again.');
            }
          },
        },
      ]
    );
  };

  const confirmScheduleOrder = async () => {
    if (!selectedMealPlan || !user) return;

    setIsSubmitting(true);

    try {
      // Update the meal plan to mark it as ordered
      const { error } = await updateMealPlan(selectedMealPlan.id, {
        is_ordered: true
      });
      
      if (error) throw error;
      
      // Update local state
      setMealPlans(mealPlans.map(plan => 
        plan.id === selectedMealPlan.id 
          ? { ...plan, is_ordered: true } 
          : plan
      ));
      
      setShowScheduleModal(false);
      setSelectedMealPlan(null);
      
      Alert.alert('Success', 'Order has been scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling order:', error);
      Alert.alert('Error', 'Failed to schedule order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMealPlan = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add meal plans');
      return;
    }
    
    if (!newMealName || !newMealRestaurant || !newMealPrice || !newMealTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const price = parseFloat(newMealPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newMealTime)) {
      Alert.alert('Error', 'Please enter a valid time in HH:MM format');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createMealPlan(user.id, {
        date: selectedDate,
        meal_type: selectedMealType,
        food_name: newMealName,
        restaurant: newMealRestaurant,
        price: Math.round(price * 100), // Convert to kobo
        image_url: null, // We could add image selection in the future
        scheduled_time: newMealTime,
        is_ordered: false,
        is_recurring: newMealRecurring,
        notes: newMealNotes || undefined,
      });
      
      if (error) throw error;
      
      setMealPlans([...mealPlans, data]);
      resetForm();
      setShowAddModal(false);
      
      Alert.alert('Success', 'Meal plan added successfully!');
    } catch (error) {
      console.error('Error adding meal plan:', error);
      Alert.alert('Error', 'Failed to add meal plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewMealName('');
    setNewMealRestaurant('');
    setNewMealPrice('');
    setNewMealTime('12:00');
    setNewMealNotes('');
    setNewMealRecurring(false);
  };

  const getUpcomingOrders = () => {
    return mealPlans
      .filter(plan => plan.is_ordered)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.scheduled_time}`);
        const dateB = new Date(`${b.date}T${b.scheduled_time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <CustomLogo size="medium" color="#FFFFFF" />
            <Text style={styles.headerTitle}>Meal Planning</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Loading your meal plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.headerTitle}>Meal Planning</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
        {/* Week Calendar */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getWeekDates().map((date) => {
              const isSelected = date === selectedDate;
              const isToday = date === new Date().toISOString().split('T')[0];
              const mealsCount = getMealsForDate(date).length;

              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                    isToday && styles.dateCardToday,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[
                    styles.dateDay,
                    isSelected && styles.dateDaySelected,
                  ]}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    isSelected && styles.dateNumberSelected,
                  ]}>
                    {new Date(date).getDate()}
                  </Text>
                  {mealsCount > 0 && (
                    <View style={styles.mealIndicator}>
                      <Text style={styles.mealCount}>{mealsCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Meal Type Filter */}
        <View style={styles.mealTypeSection}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mealTypes.map((mealType) => {
              const isSelected = mealType.id === selectedMealType;
              const mealsCount = getMealsForDateAndType(selectedDate, mealType.id).length;

              return (
                <TouchableOpacity
                  key={mealType.id}
                  style={[
                    styles.mealTypeCard,
                    isSelected && styles.mealTypeCardSelected,
                    { borderColor: mealType.color },
                  ]}
                  onPress={() => setSelectedMealType(mealType.id)}
                >
                  <Text style={styles.mealTypeIcon}>{mealType.icon}</Text>
                  <Text style={[
                    styles.mealTypeName,
                    isSelected && styles.mealTypeNameSelected,
                  ]}>
                    {mealType.name}
                  </Text>
                  {mealsCount > 0 && (
                    <View style={[styles.mealTypeBadge, { backgroundColor: mealType.color }]}>
                      <Text style={styles.mealTypeBadgeText}>{mealsCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Planned Meals */}
        <View style={styles.plannedMealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {formatDate(selectedDate)} - {mealTypes.find(m => m.id === selectedMealType)?.name}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(true)}>
              <Plus size={20} color="#006400" />
            </TouchableOpacity>
          </View>

          {getMealsForDateAndType(selectedDate, selectedMealType).map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <ImageWithFallback 
                source={meal.image_url} 
                style={styles.mealImage}
                fallback={IMAGES.DEFAULT_FOOD}
              />
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.food_name}</Text>
                <Text style={styles.mealRestaurant}>{meal.restaurant}</Text>
                <View style={styles.mealMeta}>
                  <View style={styles.mealTime}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.mealTimeText}>{formatTime(meal.scheduled_time)}</Text>
                  </View>
                  <Text style={styles.mealPrice}>{formatPrice(meal.price)}</Text>
                </View>
                {meal.notes && (
                  <Text style={styles.mealNotes}>Note: {meal.notes}</Text>
                )}
                <View style={styles.mealBadges}>
                  {meal.is_recurring && (
                    <View style={styles.recurringBadge}>
                      <Text style={styles.recurringText}>Recurring</Text>
                    </View>
                  )}
                  {meal.is_ordered && (
                    <View style={styles.orderedBadge}>
                      <Text style={styles.orderedText}>Ordered</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.mealActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleScheduleOrder(meal)}
                  disabled={meal.is_ordered}
                >
                  <Calendar size={16} color={meal.is_ordered ? "#CCCCCC" : "#006400"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Edit3 size={16} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteMealPlan(meal.id)}
                >
                  <Trash2 size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {getMealsForDateAndType(selectedDate, selectedMealType).length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🍽️</Text>
              <Text style={styles.emptyStateTitle}>No meals planned</Text>
              <Text style={styles.emptyStateText}>
                Add a meal to your {mealTypes.find(m => m.id === selectedMealType)?.name.toLowerCase()} plan
              </Text>
              <TouchableOpacity 
                style={styles.addMealButton}
                onPress={() => setShowAddModal(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addMealButtonText}>Add Meal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Upcoming Scheduled Orders */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Orders</Text>
            <TouchableOpacity onPress={() => router.push('/scheduled-orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {getUpcomingOrders().length > 0 ? (
            getUpcomingOrders().map((order) => (
              <View key={order.id} style={styles.upcomingCard}>
                <View style={styles.upcomingTime}>
                  <Text style={styles.upcomingDate}>
                    {formatDate(order.date)}
                  </Text>
                  <Text style={styles.upcomingTimeText}>
                    {formatTime(order.scheduled_time)}
                  </Text>
                </View>
                <View style={styles.upcomingInfo}>
                  <Text style={styles.upcomingMeal}>{order.food_name}</Text>
                  <Text style={styles.upcomingRestaurant}>{order.restaurant}</Text>
                  <Text style={styles.upcomingPrice}>{formatPrice(order.price)}</Text>
                </View>
                <View style={styles.upcomingActions}>
                  <View style={[styles.statusBadge, { backgroundColor: '#4CAF5020' }]}>
                    <Text style={[styles.statusText, { color: '#4CAF50' }]}>Scheduled</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyUpcoming}>
              <Text style={styles.emptyUpcomingText}>No upcoming orders scheduled</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>Add Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/meal-templates')}
            >
              <ChefHat size={24} color="#FF6B6B" />
              <Text style={styles.quickActionText}>Templates</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/scheduled-orders')}
            >
              <Calendar size={24} color="#FFA726" />
              <Text style={styles.quickActionText}>Scheduled</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/meal-history')}
            >
              <Clock size={24} color="#3F51B5" />
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Meal</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Meal Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Jollof Rice Special"
                  value={newMealName}
                  onChangeText={setNewMealName}
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Restaurant</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Lagos Kitchen"
                  value={newMealRestaurant}
                  onChangeText={setNewMealRestaurant}
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price (₦)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., 4500"
                  value={newMealPrice}
                  onChangeText={setNewMealPrice}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Scheduled Time</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="HH:MM (e.g., 12:30)"
                  value={newMealTime}
                  onChangeText={setNewMealTime}
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Any special instructions or notes"
                  value={newMealNotes}
                  onChangeText={setNewMealNotes}
                  multiline
                  numberOfLines={3}
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setNewMealRecurring(!newMealRecurring)}
                  disabled={isSubmitting}
                >
                  <View style={[
                    styles.checkbox,
                    newMealRecurring && styles.checkboxChecked
                  ]}>
                    {newMealRecurring && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Make this a recurring meal</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
                onPress={handleAddMealPlan}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.addButtonText}>Add Meal</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Schedule Order Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Order</Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedMealPlan && (
              <View style={styles.modalBody}>
                <View style={styles.scheduleInfo}>
                  <ImageWithFallback 
                    source={selectedMealPlan.image_url} 
                    style={styles.scheduleImage}
                    fallback={IMAGES.DEFAULT_FOOD}
                  />
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleName}>{selectedMealPlan.food_name}</Text>
                    <Text style={styles.scheduleRestaurant}>{selectedMealPlan.restaurant}</Text>
                    <Text style={styles.schedulePrice}>{formatPrice(selectedMealPlan.price)}</Text>
                  </View>
                </View>

                <View style={styles.scheduleOptions}>
                  <Text style={styles.scheduleOptionTitle}>Order will be placed:</Text>
                  <Text style={styles.scheduleOptionText}>
                    30 minutes before meal time ({formatTime(selectedMealPlan.scheduled_time)})
                  </Text>
                  <Text style={styles.scheduleOptionSubtext}>
                    You'll receive a notification before the order is placed
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowScheduleModal(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
                onPress={confirmScheduleOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Schedule Order</Text>
                )}
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
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calendarSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  dateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  dateCardSelected: {
    borderColor: '#006400',
    backgroundColor: '#E8F5E8',
  },
  dateCardToday: {
    backgroundColor: '#FFF3E0',
  },
  dateDay: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  dateDaySelected: {
    color: '#006400',
    fontFamily: 'Inter-Semibold',
  },
  dateNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  dateNumberSelected: {
    color: '#006400',
  },
  mealIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  mealTypeSection: {
    marginBottom: 25,
  },
  mealTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    position: 'relative',
  },
  mealTypeCardSelected: {
    backgroundColor: '#E8F5E8',
  },
  mealTypeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  mealTypeName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  mealTypeNameSelected: {
    color: '#006400',
    fontFamily: 'Inter-Semibold',
  },
  mealTypeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTypeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  plannedMealsSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 15,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  mealRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  mealPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  mealNotes: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  mealBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  recurringBadge: {
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recurringText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
    color: '#4CAF50',
  },
  orderedBadge: {
    backgroundColor: '#FF6B6B20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  orderedText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
    color: '#FF6B6B',
  },
  mealActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  addMealButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  upcomingSection: {
    marginBottom: 25,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  upcomingTime: {
    marginRight: 15,
    alignItems: 'center',
  },
  upcomingDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  upcomingTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingMeal: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  upcomingRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  upcomingPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  upcomingActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
  },
  emptyUpcoming: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyUpcomingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
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
    color: '#000000',
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
  checkboxContainer: {
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
  checkboxChecked: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  scheduleInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scheduleImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  scheduleDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  scheduleName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  scheduleRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  schedulePrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  scheduleOptions: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  scheduleOptionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 6,
  },
  scheduleOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginBottom: 4,
  },
  scheduleOptionSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
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
  confirmButton: {
    flex: 1,
    backgroundColor: '#006400',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});