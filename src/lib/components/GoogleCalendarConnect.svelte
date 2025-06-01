<script lang="ts">
  import { generateAuthUrl } from '$lib/server/googleAuth';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let isConnecting = false;
  let error = '';
  let success = '';

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    error = urlParams.get('error') || '';
    success = urlParams.get('success') || '';
  });

  async function connectGoogleCalendar() {
    isConnecting = true;
    try {
      const authUrl = await fetch('/api/auth/google/url').then(res => res.json());
      window.location.href = authUrl.url;
    } catch (err) {
      console.error('Error initiating Google OAuth:', err);
      error = 'Failed to connect to Google Calendar. Please try again.';
      isConnecting = false;
    }
  }
</script>

<div class="space-y-4">
  {#if error}
    <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      {error}
    </div>
  {/if}

  {#if success === 'google_connected'}
    <div class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
      Successfully connected to Google Calendar!
    </div>
  {/if}

  <button
    on:click={connectGoogleCalendar}
    disabled={isConnecting}
    class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isConnecting}
      <svg class="w-5 h-5 mr-2 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Connecting...
    {:else}
      <svg class="w-5 h-5 mr-2 -ml-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
      Connect Google Calendar
    {/if}
  </button>
</div>
