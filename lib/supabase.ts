import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import * as FileSystem from 'expo-file-system';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://qosqokjkcsiyoepfclii.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvc3Fva2prY3NpeW9lcGZjbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODkzODQsImV4cCI6MjA2NTg2NTM4NH0.U2toIKLOJUSCdU0d3-knot658OBw3hQ_9rP9Q5lavQU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Image upload helper functions
export const uploadFoodImage = async (
  uri: string, 
  category: string, 
  fileName: string
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    console.log('📤 Starting image upload process...');
    
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      console.error('❌ File does not exist:', uri);
      return { url: null, error: new Error('File does not exist') };
    }

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Convert to blob
    const blob = Buffer.from(base64, 'base64');
    
    // Generate a unique file path
    const timestamp = new Date().getTime();
    const filePath = `${category}/${fileName}_${timestamp}`;
    
    console.log('📁 Uploading to path:', filePath);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('food-images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg', // Adjust based on your image type
        upsert: true,
      });
    
    if (error) {
      console.error('❌ Upload error:', error.message);
      return { url: null, error };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(data.path);
    
    console.log('✅ Upload successful, public URL:', publicUrl);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('💥 Unexpected upload error:', error);
    return { url: null, error: error as Error };
  }
};

export const deleteFoodImage = async (url: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketName = pathParts[1]; // Assuming URL format: /storage/v1/object/public/bucket-name/path
    
    // The actual path in storage is everything after the bucket name
    const filePath = pathParts.slice(2).join('/');
    
    console.log('🗑️ Deleting image from path:', filePath);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('❌ Delete error:', error.message);
      return { success: false, error };
    }
    
    console.log('✅ Image deleted successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('💥 Unexpected delete error:', error);
    return { success: false, error: error as Error };
  }
};