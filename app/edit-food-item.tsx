import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Clock, DollarSign, Package, FileText, Image as ImageIcon, Save } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import * as ImagePicker from 'expo-image-picker';
import { supabase, uploadFoodImage, deleteFoodImage } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import { IMAGES } from '@/constants/Images';

export default function EditFoodItem() {
  const { id } = useLocalSearchParams();
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('main-course');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { user } = useAuth();

  const categories = [
    { id: 'main-course', name: 'Main Course', icon: '🍽️' },
    { id: 'appetizer', name: 'Appetizer', icon: '🥗' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' },
    { id: 'beverage', name: 'Beverage', icon: '🥤' },
    { id: 'snack', name: 'Snack', icon: '🍿' },
  ];

  useEffect(() => {
    if (id) {
      fetchFoodItem();
    }
  }, [id]);

  const fetchFoodItem = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setFoodName(data.name);
        setDescription(data.description || '');
        setPrice(String(data.price / 100)); // Convert from kobo to naira
        setCategory(data.category);
        setPrepTime(data.prep_time || '');
        setIngredients(data.ingredients || '');
        setImageUri(data.image_url);
        setOriginalImageUrl(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching food item:', error);
      Alert.alert('Error', 'Failed to load food item details');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!foodName || !description || !price || !prepTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    if (!imageUri) {
      Alert.alert('Error', 'Please add an image of your food item');
      return false;
    }

    return true;
  };

  const handleImagePicker = async () => {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need camera roll permissions to upload images');
          return;
        }
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
        setIsImageChanged(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request permissions
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need camera permissions to take photos');
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setIsImageChanged(true);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const handleUpdateItem = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update food items');
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = originalImageUrl;
      
      // If image was changed, upload the new one
      if (isImageChanged && imageUri) {
        setIsUploading(true);
        
        // Delete the old image if it exists
        if (originalImageUrl) {
          await deleteFoodImage(originalImageUrl);
        }
        
        // Upload the new image
        const fileName = `food_${Date.now()}`;
        const { url, error: uploadError } = await uploadFoodImage(
          imageUri,
          category,
          fileName
        );
        
        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        imageUrl = url;
        setIsUploading(false);
      }

      // Update the food item data
      const { error } = await supabase
        .from('food_items')
        .update({
          name: foodName,
          description: description,
          price: parseInt(price) * 100, // Convert to kobo
          category: category,
          image_url: imageUrl,
          prep_time: prepTime,
          ingredients: ingredients,
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to update food item: ${error.message}`);
      }
      
      Alert.alert(
        'Success!',
        'Food item has been updated successfully.',
        [{ text: 'OK', onPress: () => router.push('/vendor-dashboard') }]
      );
    } catch (error) {
      console.error('Error updating food item:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update food item. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <CustomLogo size="medium" color="#FFFFFF" />
            <Text style={styles.headerTitle}>Edit Food Item</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Loading food item details...</Text>
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
          <Text style={styles.headerTitle}>Edit Food Item</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Food Item</Text>
        <Text style={styles.subtitle}>Update the details of your menu item</Text>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Image</Text>
          <TouchableOpacity 
            style={styles.imageUpload} 
            onPress={() => {
              Alert.alert(
                'Update Image',
                'Choose an option',
                [
                  { text: 'Take Photo', onPress: handleCameraCapture },
                  { text: 'Choose from Gallery', onPress: handleImagePicker },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
          >
            {imageUri ? (
              <ImageWithFallback 
                source={imageUri} 
                style={styles.uploadedImage}
                fallback={IMAGES.DEFAULT_FOOD}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon size={32} color="#666666" />
                <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
              </View>
            )}
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.uploadingText}>Uploading...</Text>
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
              editable={!isSaving}
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
              editable={!isSaving}
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
              editable={!isSaving}
            />
          </View>

          <View style={styles.inputContainer}>
            <Clock size={20} color="#666666" />
            <TextInput
              style={styles.input}
              placeholder="Preparation time (e.g., 20 minutes)"
              value={prepTime}
              onChangeText={setPrepTime}
              editable={!isSaving}
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
                disabled={isSaving}
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
              editable={!isSaving}
            />
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity 
          style={[styles.updateButton, isSaving && styles.updateButtonDisabled]} 
          onPress={handleUpdateItem}
          disabled={isSaving}
        >
          {isSaving ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingText}>Updating Item...</Text>
            </View>
          ) : (
            <View style={styles.updateButtonContent}>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.updateButtonText}>Update Item</Text>
            </View>
          )}
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
    position: 'relative',
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
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
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
  updateButton: {
    backgroundColor: '#006400',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});