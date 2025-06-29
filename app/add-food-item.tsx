import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Clock, DollarSign, Package, FileText } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

export default function AddFoodItem() {
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('main-course');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const categories = [
    { id: 'main-course', name: 'Main Course', icon: '🍽️' },
    { id: 'appetizer', name: 'Appetizer', icon: '🥗' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
    { id: 'beverage', name: 'Beverage', icon: '🥤' },
    { id: 'snack', name: 'Snack', icon: '🍿' },
  ];

  const validateForm = () => {
    if (!foodName || !description || !price || !prepTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    return true;
  };

  const handleImagePicker = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      
      // For demo purposes, set a placeholder image
      setImageUri(IMAGES.DEFAULT_FOOD);
    }
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add food items');
      return;
    }

    setIsLoading(true);

    try {
      // Convert price to integer (kobo)
      const priceInKobo = Math.round(parseFloat(price) * 100);
      
      // Add food item to database
      const { data, error } = await supabase
        .from('food_items')
        .insert({
          vendor_id: user.id,
          name: foodName,
          description: description,
          price: priceInKobo,
          category: category,
          image_url: imageUri || IMAGES.DEFAULT_FOOD,
          prep_time: prepTime,
          ingredients: ingredients,
          status: 'active'
        })
        .select();
      
      if (error) {
        console.error('Error adding food item:', error);
        Alert.alert('Error', 'Failed to add food item: ' + error.message);
        return;
      }
      
      Alert.alert(
        'Success!',
        'Food item has been added to your menu successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'Failed to add food item. Please try again.');
    } finally {
      setIsLoading(false);
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
          <Text style={styles.headerTitle}>Add Food Item</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add New Food Item</Text>
        <Text style={styles.subtitle}>Fill in the details to add a new item to your menu</Text>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Image</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={handleImagePicker}>
            {imageUri ? (
              <ImageWithFallback 
                source={imageUri} 
                style={styles.uploadedImage}
                fallback={IMAGES.DEFAULT_FOOD}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={32} color="#666666" />
                <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Package size={20} color="#666666" />
            <TextInput
              style={styles.input}
              placeholder="Food name (e.g., Jollof Rice Special)"
              value={foodName}
              onChangeText={setFoodName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <FileText size={20} color="#666666" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (ingredients, taste, etc.)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#666666" />
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.input}
              placeholder="Price (e.g., 4500)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Clock size={20} color="#666666" />
            <TextInput
              style={styles.input}
              placeholder="Preparation time (e.g., 20 minutes)"
              value={prepTime}
              onChangeText={setPrepTime}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  category === cat.id && styles.categoryCardActive
                ]}
                onPress={() => setCategory(cat.id)}
                disabled={isLoading}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  category === cat.id && styles.categoryNameActive
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients (Optional)</Text>
          <View style={styles.inputContainer}>
            <FileText size={20} color="#666666" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="List main ingredients (e.g., Rice, Chicken, Tomatoes, Onions)"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={2}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSaveItem}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingText}>Adding Item...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Add to Menu</Text>
          )}
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for better sales:</Text>
          <Text style={styles.tipText}>• Use high-quality, appetizing photos</Text>
          <Text style={styles.tipText}>• Write detailed, mouth-watering descriptions</Text>
          <Text style={styles.tipText}>• Price competitively based on your area</Text>
          <Text style={styles.tipText}>• Keep preparation times realistic</Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  imageUpload: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderStyle: 'dashed',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 8,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#006400',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  categoryCardActive: {
    borderColor: '#006400',
    backgroundColor: '#E8F5E8',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#006400',
    fontFamily: 'Inter-Semibold',
  },
  saveButton: {
    backgroundColor: '#006400',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  tipsContainer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FF8F00',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 20,
  },
});