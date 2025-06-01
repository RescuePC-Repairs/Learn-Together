import { createClient } from '@supabase/supabase-js';
import type { UserProfile, Skill, Match, Session, ApiError } from './types';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Helper function to get the current user's session
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session?.user || null;
};

// Helper function to sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: error as ApiError };
  }
};

// Helper function to sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: { name: string; [key: string]: any }
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.name,
          ...userData,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: error as ApiError };
  }
};

// Helper function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { data: null, error: error as ApiError };
  }
};

// Helper function to sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error as ApiError };
  }
};

// Helper function to get the user's profile
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data: data as UserProfile, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { data: null, error: error as ApiError };
  }
};

// Helper function to update the user's profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { data: data as UserProfile, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { data: null, error: error as ApiError };
  }
};

// Helper function to get user's skills
export const getUserSkills = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*, skill:skills(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return { data: data as Array<{skill: Skill}>, error: null };
  } catch (error) {
    console.error('Get user skills error:', error);
    return { data: null, error: error as ApiError };
  }
};

// Helper function to get user's matches
export const getUserMatches = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user:user_id(*),
        matched_user:matched_user_id(*)
      `)
      .or(`user_id.eq.${userId},matched_user_id.eq.${userId}`);
    
    if (error) throw error;
    return { data: data as Match[], error: null };
  } catch (error) {
    console.error('Get user matches error:', error);
    return { data: null, error: error as ApiError };
  }
};
