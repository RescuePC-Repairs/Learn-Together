<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';

  let tutorials: Array<{
    id: string;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    user_email: string;
    created_at: string;
  }> = [];
  
  let isLoading = true;
  let error = '';

  onMount(async () => {
    await loadTutorials();
  });

  async function loadTutorials() {
    try {
      isLoading = true;
      const { data, error: fetchError } = await supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      tutorials = data || [];
    } catch (err) {
      console.error('Error loading tutorials:', err);
      error = 'Failed to load tutorials';
    } finally {
      isLoading = false;
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Video Tutorials</h1>
    {#if $auth.user}
      <button 
        on:click={() => goto('/tutorials/new')}
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Upload Tutorial
      </button>
    {/if}
  </div>

  {#if error}
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  {/if}

  {#if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(6) as _}
        <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="bg-gray-200 h-48 w-full"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each tutorials as tutorial}
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="relative pt-[56.25%] bg-black">
            <video 
              src={tutorial.video_url}
              class="absolute inset-0 w-full h-full object-cover"
              controls
              preload="metadata"
              poster={tutorial.thumbnail_url}
            ></video>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {tutorial.title}
            </h3>
            <p class="text-sm text-gray-500 mb-2">
              {tutorial.user_email} • {formatDate(tutorial.created_at)}
            </p>
            <p class="text-sm text-gray-600 line-clamp-2">
              {tutorial.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
