import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://qosqokjkcsiyoepfclii.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsImtpZCI6InpxT0NtZXQwVjhCMWNQUGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Fvc3Fva2prY3NpeW9lcGZjbGlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4YjU2ZmIyNS0xMDU0LTRiYzItOWYwZC05MWMxNzJkNGQzMjMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUxMjUzMDQ3LCJpYXQiOjE3NTEyNDk0NDcsImVtYWlsIjoiaXNlb2x1d2Fha2ludHVuZGUwMDRAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImlzZW9sdXdhYWtpbnR1bmRlMDA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJBa2ludHVuZGUgSXNlb2x1d2EiLCJwaG9uZSI6IjkxNTQ2ODkzNjAiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInJvbGUiOiJjdXN0b21lciIsInN1YiI6IjhiNTZmYjI1LTEwNTQtNGJjMi05ZjBkLTkxYzE3MmQ0ZDMyMyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im90cCIsInRpbWVzdGFtcCI6MTc1MTI0OTQ0N31dLCJzZXNzaW9uX2lkIjoiZDQ0NzliM2QtZmExZC00ZGMyLWJhYjItNzBlNzY0MTI5YTI5IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.Hdq1f7yW0gf2dLy7tzvlFcrsKQ0WD2eGzynZptVm73Y';

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