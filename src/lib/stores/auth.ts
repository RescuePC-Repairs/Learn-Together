import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { User, UserProfile, AuthState, ApiError } from '$lib/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Helper function to map Supabase user to our User type
const mapSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    ...supabaseUser,
    email: supabaseUser.email || '', // Ensure email is always a string
    user_metadata: {
      full_name: supabaseUser.user_metadata?.full_name || '',
      avatar_url: supabaseUser.user_metadata?.avatar_url || '',
      ...supabaseUser.user_metadata
    },
    app_metadata: {
      provider: supabaseUser.app_metadata?.provider,
      ...supabaseUser.app_metadata
    }
  };
};

// Create the initial auth state
const initialState: AuthState = {
  user: null,
  profile: null,
  loading: true,
  error: null
};

// Create the auth store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Helper function to set the user and profile
  const setUser = (user: User | null) => {
    update(state => {
      // If user is being set to null, also clear the profile
      if (!user) {
        return {
          ...state,
          user: null,
          profile: null,
          loading: false,
          error: null
        };
      }
      return {
        ...state,
        user,
        loading: false,
        error: null
      };
    });
  };

  // Helper function to set the profile
  const setProfile = (profile: UserProfile | null) => {
    update(state => ({
      ...state,
      profile,
      loading: false,
      error: null,
    }));
  };

  // Helper function to set an error
  const setError = (error: string) => {
    update(state => ({
      ...state,
      error,
      loading: false,
    }));
  };

  // Initialize the auth state
  const initialize = async () => {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      // Map the Supabase user to our User type
      const user = mapSupabaseUser(session?.user || null);
      setUser(user);
      
      if (user) {
        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) {
          console.warn('No profile found for user, creating one...');
          // Create a new profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url || ''
              }
            ])
            .select()
            .single();
            
          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const user = mapSupabaseUser(session?.user || null);
          setUser(user);
          
          if (user) {
            // Fetch the user's profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();
            
            if (profileError) {
              console.warn('No profile found for user, creating one...');
              // Create a new profile if it doesn't exist
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([
                  {
                    user_id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.email.split('@')[0],
                    avatar_url: user.user_metadata?.avatar_url || ''
                  }
                ])
                .select()
                .single();
                
              if (createError) throw createError;
              setProfile(newProfile);
            } else {
              setProfile(profileData);
            }
          } else {
            setProfile(null);
          }
        }
      );

      // Return the unsubscribe function
      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize authentication');
      return () => {};
    }
  };

  // Initialize the auth state when the store is first used
  let unsubscribeAuth: (() => void) | null = null;
  
  const init = async () => {
    if (unsubscribeAuth) return;
    unsubscribeAuth = await initialize();
  };

  init();

  // Manually refresh the auth state
  const refresh = async () => {
    if (unsubscribeAuth) {
      await unsubscribeAuth();
      unsubscribeAuth = null;
    }
    unsubscribeAuth = await initialize();
  };

  // Sign out the user
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      
      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  // Check if the user is authenticated
  const isAuthenticated = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const unsubscribe = subscribe((state) => {
        resolve(!!state.user);
        unsubscribe();
      });
    });
  };

  return {
    subscribe,
    set,
    update,
    refresh,
    signOut,
    isAuthenticated,
  };
}

// Create and export the auth store
export const auth = createAuthStore();

// Export individual stores for convenience
export const user = {
  subscribe(run: (value: User | null) => void) {
    return auth.subscribe((state: AuthState) => run(state.user));
  }
};

export const profile = {
  subscribe(run: (value: UserProfile | null) => void) {
    return auth.subscribe((state: AuthState) => run(state.profile));
  }
};

export const loading = {
  subscribe(run: (value: boolean) => void) {
    return auth.subscribe((state: AuthState) => run(state.loading));
  }
};

export const error = {
  subscribe(run: (value: string | null) => void) {
    return auth.subscribe((state: AuthState) => run(state.error));
  }
};
