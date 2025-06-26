import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://qosqokjkcsiyoepfclii.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvc3Fva2prY3NpeW9lcGZjbGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODkzODQsImV4cCI6MjA2NTg2NTM4NH0.U2toIKLOJUSCdU0d3-knot658OBw3hQ_9rP9Q5lavQU';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your configuration.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});