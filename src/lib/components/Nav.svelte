<script lang="ts">
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import DonateButton from './DonateButton.svelte';
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Matches', href: '/matches' },
    { name: 'Profile', href: '/profile' },
  ];
  
  function isActive(href: string) {
    return $page.url.pathname === href;
  }
</script>

<nav class="bg-white shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="flex items-center space-x-2">
            <img 
              src="/images/learn-together-logo.png" 
              alt="Learn Together Logo" 
              class="h-10 w-auto"
              on:error="{(e: Event) => {
                const img = e.target as HTMLImageElement;
                img.onerror = null;
                img.src = '/images/learn-together-logo.png';
                img.alt = 'Learn Together Logo';
              }}"
            />
            <span class="text-xl font-bold text-indigo-600 hidden md:inline-block">LearnTogether</span>
          </a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {#each navItems as item}
            <a
              href={item.href}
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isActive(item.href) ? 'border-indigo-500 text-gray-900' : ''}"
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
        <DonateButton />
        {#if $auth.user}
          <div class="ml-3 relative">
            <div>
              <button
                type="button"
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {$auth.user.email?.charAt(0).toUpperCase()}
                </div>
              </button>
            </div>
          </div>
          <a
            href="/auth/signout"
            class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign out
          </a>
        {:else}
          <a
            href="/login"
            class="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
          >
            Sign in
          </a>
          <a
            href="/signup"
            class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>
