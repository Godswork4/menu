import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Calendar, Clock, ChevronRight, ChevronLeft, X, Search, MapPin, Star, Heart, DollarSign } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

interface MealPlan {
  id: number;
  date: string;
  mealType: string;
  foodName: string;
  restaurant: string;
  price: number;
  image: string;
  time: string;
}

export default function MealPlanning() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMealType, setSelectedMealType] = useState('');
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showFoodSelectionModal, setShowFoodSelectionModal] = useState(false);
  const [showRestaurantSelectionModal, setShowRestaurantSelectionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Meal plans state
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  // Sample data
  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
    { id: 'lunch', name: 'Lunch', icon: '🍱' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️' },
    { id: 'snack', name: 'Snack', icon: '🍿' },
  ];

  const foodItems = [
    {
      id: 1,
      name: 'Jollof Rice Special',
      restaurant: 'Lagos Kitchen',
      price: 4500,
      image: 'https://images.pexels.com/photos/5695880/pexels-photo-5695880.jpeg',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Grilled Chicken Deluxe',
      restaurant: 'Spice Garden',
      price: 6500,
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Pepper Soup',
      restaurant: 'Traditional Taste',
      price: 3200,
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Fried Rice',
      restaurant: 'Rice Haven',
      price: 4800,
      image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
      rating: 4.7,
    },
    {
      id: 5,
      name: 'Suya Platter',
      restaurant: 'Suya Spot',
      price: 6500,
      image: 'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg',
      rating: 4.8,
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Lagos Kitchen',
      cuisine: 'Nigerian',
      rating: 4.8,
      deliveryTime: '20-30 min',
      image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
    },
    {
      id: 2,
      name: 'Spice Garden',
      cuisine: 'Continental',
      rating: 4.6,
      deliveryTime: '25-35 min',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    },
    {
      id: 3,
      name: 'Traditional Taste',
      cuisine: 'Nigerian',
      rating: 4.9,
      deliveryTime: '30-40 min',
      image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
    },
    {
      id: 4,
      name: 'Rice Haven',
      cuisine: 'Rice Dishes',
      rating: 4.6,
      deliveryTime: '20-30 min',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    },
    {
      id: 5,
      name: 'Suya Spot',
      cuisine: 'Grilled',
      rating: 4.7,
      deliveryTime: '15-25 min',
      image: 'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg',
    },
  ];

  // Get week days for calendar
  const getWeekDays = () => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const firstDayOfWeek = new Date(currentDate);
    const day = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Set to the first day of the week (Sunday)
    firstDayOfWeek.setDate(currentDate.getDate() - day);
    
    // Get 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleMealTypeSelect = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowAddMealModal(true);
  };

  const handleAddMeal = () => {
    if (!selectedFood || !selectedRestaurant || !scheduledTime) {
      Alert.alert('Missing Information', 'Please select food, restaurant, and scheduled time');
      return;
    }

    const newMeal: MealPlan = {
      id: Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      mealType: selectedMealType,
      foodName: selectedFood.name,
      restaurant: selectedRestaurant.name,
      price: selectedFood.price,
      image: selectedFood.image,
      time: scheduledTime,
    };

    setMealPlans([...mealPlans, newMeal]);
    
    // Reset form
    setSelectedFood(null);
    setSelectedRestaurant(null);
    setScheduledTime('');
    setSpecialInstructions('');
    setShowAddMealModal(false);
    
    Alert.alert('Success', 'Meal has been added to your plan');
  };

  const getMealsForSelectedDate = () => {
    return mealPlans.filter(meal => {
      const mealDate = new Date(meal.date);
      return isSameDay(mealDate, selectedDate);
    });
  };

  const getMealsForSelectedDateAndType = (mealType: string) => {
    return mealPlans.filter(meal => {
      const mealDate = new Date(meal.date);
      return isSameDay(mealDate, selectedDate) && meal.mealType === mealType;
    });
  };

  const handleDeleteMeal = (mealId: number) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to remove this meal from your plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMealPlans(mealPlans.filter(meal => meal.id !== mealId));
          }
        }
      ]
    );
  };

  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Text style={styles.headerTitle}>Meal Planning</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/scheduled-orders')}>
          <Calendar size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>This Week</Text>
            <View style={styles.calendarControls}>
              <TouchableOpacity style={styles.calendarControl} onPress={handlePreviousWeek}>
                <ChevronLeft size={20} color="#006400" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarControl} onPress={handleNextWeek}>
                <ChevronRight size={20} color="#006400" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.daysContainer}>
              {getWeekDays().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCard,
                    isSameDay(date, selectedDate) && styles.selectedDayCard,
                    isToday(date) && styles.todayCard
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text style={[
                    styles.dayName,
                    isSameDay(date, selectedDate) && styles.selectedDayText,
                    isToday(date) && styles.todayText
                  ]}>
                    {formatDayName(date)}
                  </Text>
                  <Text style={[
                    styles.dayNumber,
                    isSameDay(date, selectedDate) && styles.selectedDayText,
                    isToday(date) && styles.todayText
                  ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Meal Types */}
        <View style={styles.mealTypesContainer}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypesGrid}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.mealTypeCard}
                onPress={() => handleMealTypeSelect(type.id)}
              >
                <Text style={styles.mealTypeIcon}>{type.icon}</Text>
                <Text style={styles.mealTypeName}>{type.name}</Text>
                {getMealsForSelectedDateAndType(type.id).length > 0 && (
                  <View style={styles.mealTypeBadge}>
                    <Text style={styles.mealTypeBadgeText}>
                      {getMealsForSelectedDateAndType(type.id).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Planned Meals */}
        <View style={styles.plannedMealsContainer}>
          <Text style={styles.sectionTitle}>
            {formatDate(selectedDate)} - {selectedMealType ? mealTypes.find(t => t.id === selectedMealType)?.name : 'All Meals'}
          </Text>
          
          {getMealsForSelectedDate().length === 0 ? (
            <View style={styles.emptyState}>
              <Image 
                source={require('../assets/images/menulogo copy copy.webp')} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>No meals planned</Text>
              <Text style={styles.emptyStateText}>
                Add a meal to your {formatDate(selectedDate)} plan
              </Text>
            </View>
          ) : (
            getMealsForSelectedDate().map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <ImageWithFallback 
                  source={meal.image} 
                  style={styles.mealImage}
                  fallback={IMAGES.DEFAULT_FOOD}
                />
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.foodName}</Text>
                  <Text style={styles.mealRestaurant}>{meal.restaurant}</Text>
                  <View style={styles.mealMeta}>
                    <View style={styles.mealTypeTag}>
                      <Text style={styles.mealTypeTagText}>
                        {mealTypes.find(t => t.id === meal.mealType)?.name}
                      </Text>
                    </View>
                    <View style={styles.mealTimeTag}>
                      <Clock size={12} color="#006400" />
                      <Text style={styles.mealTimeText}>{meal.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.mealPrice}>{formatPrice(meal.price)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteMealButton}
                  onPress={() => handleDeleteMeal(meal.id)}
                >
                  <X size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))
          )}
          
          <TouchableOpacity 
            style={styles.addMealButton}
            onPress={() => setShowAddMealModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addMealText}>Add Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Meal Planning Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🍽️</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Balance Your Meals</Text>
              <Text style={styles.tipText}>
                Include proteins, carbs, and vegetables in each meal for balanced nutrition.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💰</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Budget-Friendly Options</Text>
              <Text style={styles.tipText}>
                Plan meals around sales and seasonal ingredients to save money.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddMealModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddMealModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Meal</Text>
              <TouchableOpacity onPress={() => setShowAddMealModal(false)}>
                <X size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Selected Date and Meal Type */}
              <View style={styles.selectedInfo}>
                <View style={styles.selectedDate}>
                  <Calendar size={16} color="#006400" />
                  <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
                </View>
                <View style={styles.selectedMealType}>
                  <Text style={styles.selectedMealTypeText}>
                    {selectedMealType ? mealTypes.find(t => t.id === selectedMealType)?.name : 'Select Meal Type'}
                  </Text>
                </View>
              </View>

              {/* Food Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Food</Text>
                <TouchableOpacity 
                  style={styles.selectionButton}
                  onPress={() => setShowFoodSelectionModal(true)}
                >
                  {selectedFood ? (
                    <View style={styles.selectedItem}>
                      <ImageWithFallback 
                        source={selectedFood.image} 
                        style={styles.selectedItemImage}
                        fallback={IMAGES.DEFAULT_FOOD}
                      />
                      <View style={styles.selectedItemInfo}>
                        <Text style={styles.selectedItemName}>{selectedFood.name}</Text>
                        <Text style={styles.selectedItemPrice}>{formatPrice(selectedFood.price)}</Text>
                      </View>
                      <ChevronRight size={20} color="#666666" />
                    </View>
                  ) : (
                    <Text style={styles.selectionPlaceholder}>Choose a food item</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Restaurant Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Restaurant</Text>
                <TouchableOpacity 
                  style={styles.selectionButton}
                  onPress={() => setShowRestaurantSelectionModal(true)}
                >
                  {selectedRestaurant ? (
                    <View style={styles.selectedItem}>
                      <ImageWithFallback 
                        source={selectedRestaurant.image} 
                        style={styles.selectedItemImage}
                        fallback={IMAGES.DEFAULT_RESTAURANT}
                      />
                      <View style={styles.selectedItemInfo}>
                        <Text style={styles.selectedItemName}>{selectedRestaurant.name}</Text>
                        <Text style={styles.selectedItemSubtext}>{selectedRestaurant.cuisine}</Text>
                      </View>
                      <ChevronRight size={20} color="#666666" />
                    </View>
                  ) : (
                    <Text style={styles.selectionPlaceholder}>Choose a restaurant</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Time Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Scheduled Time</Text>
                <View style={styles.timeInputContainer}>
                  <Clock size={20} color="#666666" />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="e.g., 12:30 PM"
                    value={scheduledTime}
                    onChangeText={setScheduledTime}
                  />
                </View>
              </View>

              {/* Special Instructions */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Special Instructions (Optional)</Text>
                <TextInput
                  style={styles.instructionsInput}
                  placeholder="Any special requests or notes"
                  value={specialInstructions}
                  onChangeText={setSpecialInstructions}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Add Button */}
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddMeal}
              >
                <Text style={styles.addButtonText}>Add to Meal Plan</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Food Selection Modal */}
      <Modal
        visible={showFoodSelectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFoodSelectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Food</Text>
              <TouchableOpacity onPress={() => setShowFoodSelectionModal(false)}>
                <X size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={20} color="#666666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for food..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <ScrollView style={styles.selectionList}>
              {filteredFoodItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.selectionItem}
                  onPress={() => {
                    setSelectedFood(item);
                    setShowFoodSelectionModal(false);
                    // Auto-select the restaurant if it matches
                    const matchingRestaurant = restaurants.find(r => r.name === item.restaurant);
                    if (matchingRestaurant) {
                      setSelectedRestaurant(matchingRestaurant);
                    }
                  }}
                >
                  <ImageWithFallback 
                    source={item.image} 
                    style={styles.selectionItemImage}
                    fallback={IMAGES.DEFAULT_FOOD}
                  />
                  <View style={styles.selectionItemInfo}>
                    <Text style={styles.selectionItemName}>{item.name}</Text>
                    <Text style={styles.selectionItemSubtext}>{item.restaurant}</Text>
                    <View style={styles.selectionItemMeta}>
                      <Text style={styles.selectionItemPrice}>{formatPrice(item.price)}</Text>
                      <View style={styles.ratingContainer}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Restaurant Selection Modal */}
      <Modal
        visible={showRestaurantSelectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRestaurantSelectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Restaurant</Text>
              <TouchableOpacity onPress={() => setShowRestaurantSelectionModal(false)}>
                <X size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Search size={20} color="#666666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for restaurants..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <ScrollView style={styles.selectionList}>
              {filteredRestaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.selectionItem}
                  onPress={() => {
                    setSelectedRestaurant(restaurant);
                    setShowRestaurantSelectionModal(false);
                  }}
                >
                  <ImageWithFallback 
                    source={restaurant.image} 
                    style={styles.selectionItemImage}
                    fallback={IMAGES.DEFAULT_RESTAURANT}
                  />
                  <View style={styles.selectionItemInfo}>
                    <Text style={styles.selectionItemName}>{restaurant.name}</Text>
                    <Text style={styles.selectionItemSubtext}>{restaurant.cuisine}</Text>
                    <View style={styles.selectionItemMeta}>
                      <View style={styles.ratingContainer}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                      </View>
                      <View style={styles.deliveryTimeContainer}>
                        <Clock size={12} color="#666666" />
                        <Text style={styles.deliveryTimeText}>{restaurant.deliveryTime}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  calendarControls: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarControl: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dayCard: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedDayCard: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  todayCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: '#000000',
  },
  mealTypesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  mealTypesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  mealTypeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  mealTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  mealTypeName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  mealTypeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#32CD32',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTypeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  plannedMealsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyState: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    width: 60,
    height: 60,
    marginBottom: 15,
    opacity: 0.5,
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
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mealImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mealTypeTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  mealTypeTagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  mealTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTimeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  mealPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  deleteMealButton: {
    padding: 8,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006400',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 10,
  },
  addMealText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#333333',
    marginBottom: 4,
  },
  tipText: {
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
  modalBody: {
    padding: 20,
  },
  selectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  selectedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedDateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  selectedMealType: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedMealTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
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
  selectionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectionPlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  selectedItemPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  selectedItemSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 10,
  },
  timeInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  instructionsInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  addButton: {
    backgroundColor: '#006400',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  selectionList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  selectionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectionItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  selectionItemInfo: {
    flex: 1,
  },
  selectionItemName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  selectionItemSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 6,
  },
  selectionItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionItemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});