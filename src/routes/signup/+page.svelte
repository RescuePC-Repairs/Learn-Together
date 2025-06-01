<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { signUpWithEmail, signInWithGoogle } from '$lib/supabase';
  import { user } from '$lib/stores/auth';
  
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let isLoading = false;
  
  onMount(() => {
    // Check if user is already logged in
    const unsubscribe = user.subscribe(($user) => {
      if ($user) {
        goto('/profile');
      }
    });
    
    return () => unsubscribe();
  });
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }
    
    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }
    
    isLoading = true;
    error = '';
    
    try {
      const { error: signUpError } = await signUpWithEmail(email, password, { name });
      
      if (signUpError) throw signUpError;
      
      // Redirect to profile setup
      goto('/profile');
    } catch (err: any) {
      console.error('Signup error:', err);
      error = err.message || 'Failed to create account. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  async function handleGoogleSignup() {
    try {
      isLoading = true;
      const { error: googleError } = await signInWithGoogle();
      
      if (googleError) throw googleError;
      
      // The OAuth flow will redirect to the callback URL
    } catch (err: any) {
      console.error('Google signup error:', err);
      error = err.message || 'Failed to sign up with Google. Please try again.';
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Create your account
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Or{' '}
      <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
        sign in to your account
      </a>
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {#if error}
        <div class="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      {/if}

      <form class="space-y-6" on:submit={handleSubmit}>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div class="mt-1">
            <input id="name" name="name" type="text" autocomplete="name" required bind:value={name}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div class="mt-1">
            <input id="email" name="email" type="email" autocomplete="email" required bind:value={email}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1">
            <input id="password" name="password" type="password" autocomplete="new-password" required bind:value={password}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div class="mt-1">
            <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required bind:value={confirmPassword}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div class="flex items-center">
          <input id="terms" name="terms" type="checkbox" required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the <a href="/terms" class="text-indigo-600 hover:text-indigo-500">Terms</a> and <a href="/privacy" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button type="submit" disabled={isLoading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            {:else}
              Create account
            {/if}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3">
          <div>
            <button on:click={handleGoogleSignup} disabled={isGoogleLoading}
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              {#if isGoogleLoading}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {:else}
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              {/if}
              <span class="ml-2">Sign up with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
