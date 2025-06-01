<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { signInWithEmail, signInWithGoogle } from '$lib/supabase';
  import { auth, loading, error as authError } from '$lib/stores/auth';
  
  // Form state
  let email = '';
  let password = '';
  let error = '';
  let isGoogleLoading = false;
  
  // Get redirect URL from query params or default to dashboard
  $: redirectTo = $page.url.searchParams.get('redirectTo') || '/dashboard';
  
  // Subscribe to auth errors from the auth store
  $: error = $authError || '';
  
  // Redirect if user is already logged in
  $: if ($auth.user) {
    goto(redirectTo);
  }
  
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    error = '';
    
    try {
      const { error: signInError } = await signInWithEmail(email, password);
      
      if (signInError) {
        error = signInError.message || 'Invalid email or password';
        return;
      }
      
      // The auth store will handle the redirect
      goto(redirectTo);
    } catch (err) {
      console.error('Login error:', err);
      error = 'An unexpected error occurred. Please try again.';
    }
  }
  
  async function handleGoogleSignIn() {
    try {
      isGoogleLoading = true;
      error = '';
      
      const { error: signInError } = await signInWithGoogle();
      
      if (signInError) {
        error = signInError.message || 'Failed to sign in with Google';
        return;
      }
      
      // The OAuth flow will handle the redirect
    } catch (err) {
      console.error('Google sign in error:', err);
      error = 'An error occurred during Google sign in. Please try again.';
    } finally {
      isGoogleLoading = false;
    }
  }
  
  // Clean up on component destroy
  onDestroy(() => {
    // Reset error state when leaving the page
    if (error) {
      error = '';
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/signup" class="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
          create a new account
        </a>
      </p>
    </div>
    
    {#if error}
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    {/if}
    
    <div class="mt-8 space-y-6">
      <button
        type="button"
        on:click={handleGoogleSignIn}
        class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isGoogleLoading || $loading}
      >
        <span class="sr-only">Sign in with Google</span>
        {#if isGoogleLoading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {:else}
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.88-1.757-4.372-2.797-6.735-2.797-5.522 0-10 4.479-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.167-0.003-0.335-0.008-0.5h-9.992z" />
          </svg>
        {/if}
        <span class="ml-2">
          {isGoogleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
        </span>
      </button>
      
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <form class="mt-6 space-y-6" on:submit|preventDefault={handleSubmit}>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              bind:value={email}
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Email address"
              disabled={$loading}
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              bind:value={password}
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Password"
              disabled={$loading}
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={$loading}
          >
            {#if $loading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            {:else}
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              Sign in
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
