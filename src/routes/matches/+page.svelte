<script>
  import { onMount } from 'svelte';
  
  // Mock data - will be replaced with real data from Supabase
  let matches = [
    {
      id: 1,
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Data scientist with a passion for teaching Python and machine learning concepts.',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'Pandas', 'Scikit-learn'],
      matchScore: 95,
      availability: ['Mon 2-4pm', 'Wed 3-5pm', 'Fri 10am-12pm']
    },
    {
      id: 2,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Frontend developer specializing in React and TypeScript. Love to share knowledge!',
      skills: ['React', 'TypeScript', 'GraphQL', 'Next.js', 'Tailwind CSS'],
      matchScore: 88,
      availability: ['Tue 1-3pm', 'Thu 2-4pm', 'Sat 11am-1pm']
    },
    {
      id: 3,
      name: 'Sam Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      bio: 'Rust enthusiast and systems programmer. Excited to help others learn low-level concepts.',
      skills: ['Rust', 'Systems Programming', 'WebAssembly', 'C++'],
      matchScore: 82,
      availability: ['Mon 10am-12pm', 'Wed 2-4pm', 'Fri 1-3pm']
    },
    {
      id: 4,
      name: 'Taylor Brown',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'UX/UI designer who loves to teach design principles and Figma.',
      skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping', 'Design Systems'],
      matchScore: 76,
      availability: ['Tue 9-11am', 'Thu 10am-12pm', 'Sun 2-4pm']
    }
  ];
  
  let selectedMatch = null;
  let isLoading = true;
  let searchQuery = '';
  
  onMount(() => {
    // TODO: Fetch matches from Supabase
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  });
  
  function selectMatch(match) {
    selectedMatch = match;
    // On mobile, scroll to details when a match is selected
    if (window.innerWidth < 1024) {
      document.getElementById('match-details')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function handleMessage(matchId) {
    // TODO: Implement messaging
    console.log('Message match:', matchId);
  }
  
  function handleSchedule(matchId) {
    // TODO: Implement scheduling
    console.log('Schedule with match:', matchId);
  }
  
  // Filter matches based on search query
  $: filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );
</script>

<div class="min-h-screen bg-gray-100">
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-indigo-600">LearnTogether</h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="/dashboard" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="/profile" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              My Profile
            </a>
            <a href="/matches" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Matches
            </a>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <button on:click={() => {}} class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Matches List */}
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Your Matches</h2>
              <div class="mt-2">
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" 
                    placeholder="Search matches..."
                    bind:value={searchQuery}
                  >
                </div>
              </div>
            </div>
            
            {#if isLoading}
              <div class="flex justify-center items-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            {:else}
              <div class="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
                {#each filteredMatches as match}
                  <div 
                    class="p-4 hover:bg-gray-50 cursor-pointer transition-colors {selectedMatch?.id === match.id ? 'bg-indigo-50' : ''}"
                    on:click={() => selectMatch(match)}
                  >
                    <div class="flex items-center">
                      <img class="h-12 w-12 rounded-full" src={match.avatar} alt={match.name}>
                      <div class="ml-4">
                        <h3 class="text-sm font-medium text-gray-900">{match.name}</h3>
                        <div class="mt-1 flex flex-wrap gap-1">
                          {#each match.skills.slice(0, 2) as skill}
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {skill}
                            </span>
                          {/each}
                          {#if match.skills.length > 2}
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{match.skills.length - 2} more
                            </span>
                          {/if}
                        </div>
                      </div>
                      <div class="ml-auto">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {match.matchScore}% match
                        </span>
                      </div>
                    </div>
                  </div>
                {/each}
                
                {#if filteredMatches.length === 0}
                  <div class="text-center p-8 text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      {searchQuery ? 'Try a different search term' : 'Update your profile to get better matches'}
                    </p>
                    <div class="mt-6">
                      <a href="/profile" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        Update Profile
                      </a>
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
        
        {/* Match Details */}
        <div id="match-details" class="mt-6 lg:mt-0 lg:col-span-7 xl:col-span-8">
          {#if !selectedMatch}
            <div class="bg-white shadow overflow-hidden sm:rounded-lg h-full flex items-center justify-center">
              <div class="text-center p-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No match selected</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Select a match from the list to view details
                </p>
              </div>
            </div>
          {:else}
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img class="h-12 w-12 rounded-full" src={selectedMatch.avatar} alt={selectedMatch.name}>
                    <div class="ml-4">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        {selectedMatch.name}
                        <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {selectedMatch.matchScore}% match
                        </span>
                      </h3>
                      <p class="text-sm text-gray-500">
                        {selectedMatch.skills.length} skills in common
                      </p>
                    </div>
                  </div>
                  <div class="flex space-x-3">
                    <button 
                      type="button" 
                      on:click={() => handleMessage(selectedMatch.id)}
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
                      </svg>
                      Message
                    </button>
                    <button 
                      type="button" 
                      on:click={() => handleSchedule(selectedMatch.id)}
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      Schedule Session
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="px-4 py-5 sm:p-6">
                <div class="mb-6">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">About</h4>
                  <p class="text-sm text-gray-900">{selectedMatch.bio}</p>
                </div>
                
                <div class="mb-6">
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                  <div class="flex flex-wrap gap-2">
                    {#each selectedMatch.skills as skill}
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {skill}
                      </span>
                    {/each}
                  </div>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-2">Availability</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {#each selectedMatch.availability as slot}
                      <div class="relative flex items-center px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
                        <div class="flex-1 min-w-0 flex items-center">
                          <span class="ml-2 block truncate">
                            {slot}
                          </span>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 1023px) {
    #match-details {
      margin-top: 1.5rem;
    }
  }
</style>
