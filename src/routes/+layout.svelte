<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import { auth } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { User } from '@supabase/supabase-js';
  
  // Helper to safely map Supabase user to our User type
  const mapSupabaseUser = (user: User | null) => {
    if (!user) return null;
    return {
      ...user,
      email: user.email || '',
      user_metadata: {
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        ...user.user_metadata
      },
      app_metadata: {
        provider: user.app_metadata?.provider,
        ...user.app_metadata
      }
    };
  };

  // Initialize auth store
  onMount(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        const user = mapSupabaseUser(session?.user || null);
        auth.update(state => ({
          ...state,
          user,
          loading: false,
          error: null,
          profile: user?.user_metadata || null
        }));
      }
    });
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = mapSupabaseUser(session?.user || null);
      auth.update(state => ({
        ...state,
        user,
        loading: false,
        error: null,
        profile: user?.user_metadata || null
      }));
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <Nav />
  
  <main class="flex-1">
    <slot />
  </main>
  
  <footer class="bg-white border-t border-gray-200 mt-8">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <p class="text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} LearnTogether. All rights reserved.
      </p>
    </div>
  </footer>
</div>

<!-- Toast notifications -->
{#if $auth.error}
  <div class="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <p>{$auth.error}</p>
  </div>
{/if}
