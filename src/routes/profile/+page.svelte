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
  
  let name = user.name;
  let email = user.email;
  let bio = user.bio;
  let teachingSkill = '';
  let learningSkill = '';
  let skillsTeaching = [...user.skillsTeaching];
  let skillsLearning = [...user.skillsLearning];
  let isLoading = false;
  let isSaving = false;
  let error = '';
  let success = '';
  
  function addTeachingSkill() {
    if (teachingSkill && !skillsTeaching.includes(teachingSkill)) {
      skillsTeaching = [...skillsTeaching, teachingSkill];
      teachingSkill = '';
    }
  }
  
  function removeTeachingSkill(skill) {
    skillsTeaching = skillsTeaching.filter(s => s !== skill);
  }
  
  function addLearningSkill() {
    if (learningSkill && !skillsLearning.includes(learningSkill)) {
      skillsLearning = [...skillsLearning, learningSkill];
      learningSkill = '';
    }
  }
  
  function removeLearningSkill(skill) {
    skillsLearning = skillsLearning.filter(s => s !== skill);
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!name || !email) {
      error = 'Name and email are required';
      return;
    }
    
    isSaving = true;
    error = '';
    
    try {
      // TODO: Update user profile in Supabase
      console.log('Updating profile:', { name, email, bio, skillsTeaching, skillsLearning });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success = 'Profile updated successfully!';
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = err.message || 'Failed to update profile';
    } finally {
      isSaving = false;
    }
  }
  
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
            <a href="/dashboard" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="/profile" class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-12">
          <form on:submit={handleSubmit} class="space-y-8 divide-y divide-gray-200">
            <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div>
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>

                {#if error}
                  <div class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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

                {#if success}
                  <div class="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-green-700">{success}</p>
                      </div>
                    </div>
                  </div>
                {/if}

                <div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="name" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Full name
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <input type="text" id="name" bind:value={name} class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
                    </div>
                  </div>

                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="email" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Email address
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <input type="email" id="email" bind:value={email} class="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md">
                    </div>
                  </div>

                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label for="bio" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Bio
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <textarea id="bio" rows="3" bind:value={bio} class="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"></textarea>
                      <p class="mt-2 text-sm text-gray-500">Write a few sentences about yourself and what you're interested in learning/teaching.</p>
                    </div>
                  </div>

                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      I can teach
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="mt-1 flex rounded-md shadow-sm">
                        <input type="text" bind:value={teachingSkill} on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTeachingSkill())} class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" placeholder="Add a skill you can teach">
                        <button type="button" on:click={addTeachingSkill} class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Add
                        </button>
                      </div>
                      <div class="mt-2 flex flex-wrap gap-2">
                        {#each skillsTeaching as skill}
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {skill}
                            <button type="button" on:click={() => removeTeachingSkill(skill)} class="flex-shrink-0 ml-1.5 inline-flex text-green-400 hover:text-green-600 focus:outline-none">
                              <span class="sr-only">Remove skill</span>
                              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        {/each}
                      </div>
                    </div>
                  </div>

                  <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      I want to learn
                    </label>
                    <div class="mt-1 sm:mt-0 sm:col-span-2">
                      <div class="mt-1 flex rounded-md shadow-sm">
                        <input type="text" bind:value={learningSkill} on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningSkill())} class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" placeholder="Add a skill you want to learn">
                        <button type="button" on:click={addLearningSkill} class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Add
                        </button>
                      </div>
                      <div class="mt-2 flex flex-wrap gap-2">
                        {#each skillsLearning as skill}
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {skill}
                            <button type="button" on:click={() => removeLearningSkill(skill)} class="flex-shrink-0 ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none">
                              <span class="sr-only">Remove skill</span>
                              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        {/each}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-5">
              <div class="flex justify-end">
                <button type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {#if isSaving}
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  {:else}
                    Save
                  {/if}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
