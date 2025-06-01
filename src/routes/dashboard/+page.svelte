<script>
  import { onMount } from 'svelte';
  
  // Mock data - will be replaced with real data from Supabase
  let user = {
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer passionate about teaching and learning new technologies.',
    skillsTeaching: ['JavaScript', 'React', 'Node.js'],
    skillsLearning: ['Machine Learning', 'GraphQL', 'Rust']
  };
  
  let matches = [
    { id: 1, name: 'Jane Smith', skill: 'Machine Learning', matchScore: 95 },
    { id: 2, name: 'Alex Johnson', skill: 'GraphQL', matchScore: 88 },
    { id: 3, name: 'Sam Wilson', skill: 'Rust', matchScore: 82 }
  ];
  
  let isLoading = true;
  
  onMount(() => {
    // TODO: Fetch user data and matches from Supabase
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  });
  
  function handleLogout() {
    // TODO: Implement logout
    console.log('Logout');
    // window.location.href = '/';
  }
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
            <a href="/dashboard" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="/profile" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              My Profile
            </a>
            <a href="/matches" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Matches
            </a>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <button on:click={handleLogout} class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div class="py-10">
    <header>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {#if isLoading}
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        {:else}
          <div class="px-4 py-8 sm:px-0">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h2 class="text-lg font-medium text-gray-900">Welcome back, {user.name}!</h2>
                <p class="mt-1 text-sm text-gray-500">Here are your potential matches based on your skills.</p>
                
                <div class="mt-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Your Skills</h3>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">I can teach:</h4>
                      <div class="mt-2 flex flex-wrap gap-2">
                        {#each user.skillsTeaching as skill}
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {skill}
                          </span>
                        {/each}
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">I want to learn:</h4>
                      <div class="mt-2 flex flex-wrap gap-2">
                        {#each user.skillsLearning as skill}
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        {/each}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-10">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Your Matches</h3>
                  <div class="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul role="list" class="divide-y divide-gray-200">
                      {#each matches as match}
                        <li>
                          <a href={`/matches/${match.id}`} class="block hover:bg-gray-50">
                            <div class="px-4 py-4 sm:px-6">
                              <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-indigo-600 truncate">{match.name}</p>
                                <div class="ml-2 flex-shrink-0 flex">
                                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {match.matchScore}% match
                                  </p>
                                </div>
                              </div>
                              <div class="mt-2 sm:flex sm:justify-between">
                                <div class="sm:flex">
                                  <p class="flex items-center text-sm text-gray-500">
                                    <span>Can teach you: </span>
                                    <span class="ml-1 font-medium text-gray-900">{match.skill}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                      {/each}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>
