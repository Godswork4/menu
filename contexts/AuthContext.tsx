import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { Alert } from 'react-native';
import { router } from 'expo-router';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing auth state...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ AuthProvider: Error getting initial session:', {
          message: error.message,
          details: error.details || 'No details',
          hint: error.hint || 'No hint',
          status: error.status || 'No status'
        });
      } else {
        console.log('✅ AuthProvider: Initial session retrieved:', session?.user?.email || 'No session');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
        
        // Handle navigation based on auth events
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          // Redirect based on user role after a short delay to ensure profile is loaded
          setTimeout(() => {
            if (profile?.role === 'vendor') {
              router.replace('/vendor-dashboard');
            } else {
              router.replace('/(tabs)');
            }
          }, 500);
        }
      } else {
        setProfile(null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          router.replace('/auth');
        }
      }
    });

    return () => {
      console.log('🧹 AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('📋 AuthProvider: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthProvider: Error fetching profile:', {
          message: error.message,
          details: error.details || 'No details',
          hint: error.hint || 'No hint',
          code: error.code || 'No code'
        });
      } else if (data) {
        console.log('✅ AuthProvider: Profile fetched successfully:', {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role
        });
        setProfile(data);
      } else {
        console.log('⚠️ AuthProvider: No profile found for user');
      }
    } catch (error) {
      console.error('💥 AuthProvider: Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'customer') => {
    try {
      setLoading(true);
      console.log('📝 AuthProvider: Starting sign up process for:', email, 'with role:', role);
      
      // Sign up with email and password directly (no email confirmation required)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          // Disable email confirmation
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('❌ AuthProvider: Sign up error:', {
          message: error.message,
          details: error.details || 'No details',
          hint: error.hint || 'No hint',
          status: error.status || 'No status'
        });
        return { error };
      }

      console.log('✅ AuthProvider: Sign up successful:', {
        user_id: data.user?.id,
        email: data.user?.email,
        email_confirmed: data.user?.email_confirmed_at ? 'Yes' : 'No'
      });

      // Create profile if user was created successfully
      if (data.user) {
        console.log('📋 AuthProvider: Creating profile for new user...');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            role: role as 'customer' | 'delivery' | 'vendor',
            total_orders: 0,
            points: 0,
            rating: 0,
            member_since: new Date().toISOString(),
          });

        if (profileError) {
          console.error('❌ AuthProvider: Error creating profile:', {
            message: profileError.message,
            details: profileError.details || 'No details',
            hint: profileError.hint || 'No hint',
            code: profileError.code || 'No code'
          });
          
          // Even if profile creation fails, we still want to return success for the signup
          // The profile will be created by the trigger function in the database
        } else {
          console.log('✅ AuthProvider: Profile created successfully');
        }
        
        // Automatically sign in the user after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('❌ AuthProvider: Auto sign-in error after signup:', signInError);
          // We don't return this error as the signup was successful
        } else {
          console.log('✅ AuthProvider: Auto sign-in successful after signup');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('💥 AuthProvider: Unexpected sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 AuthProvider: Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AuthProvider: Sign in error:', {
          message: error.message,
          details: error.details || 'No details',
          hint: error.hint || 'No hint',
          status: error.status || 'No status'
        });
        return { error };
      }

      console.log('✅ AuthProvider: Sign in successful:', {
        user_id: data.user?.id,
        email: data.user?.email,
        session_expires: data.session?.expires_at
      });
      
      // Fetch the user profile to determine the role
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      
      return { error: null };
    } catch (error) {
      console.error('💥 AuthProvider: Unexpected sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 AuthProvider: Starting sign out process...');
      
      await supabase.auth.signOut();
      setProfile(null);
      
      console.log('✅ AuthProvider: Sign out successful');
      
      // Navigate to auth screen after sign out
      router.replace('/auth');
    } catch (error) {
      console.error('❌ AuthProvider: Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        console.error('❌ AuthProvider: Cannot update profile - no user found');
        return { error: 'No user found' };
      }

      console.log('📝 AuthProvider: Updating profile for user:', user.id);

      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (!error) {
        console.log('✅ AuthProvider: Profile updated successfully');
        await refreshProfile();
      } else {
        console.error('❌ AuthProvider: Error updating profile:', {
          message: error.message,
          details: error.details || 'No details',
          hint: error.hint || 'No hint',
          code: error.code || 'No code'
        });
      }

      return { error };
    } catch (error) {
      console.error('💥 AuthProvider: Unexpected error updating profile:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 AuthProvider: Refreshing profile...');
      await fetchProfile(user.id);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}