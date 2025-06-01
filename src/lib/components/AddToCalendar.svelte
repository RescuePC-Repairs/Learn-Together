<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let event = {
    title: '',
    description: '',
    start: new Date(),
    end: new Date(Date.now() + 3600000), // 1 hour later
    location: '',
    attendees: [] as string[]
  };

  export let loading = false;
  
  const dispatch = createEventDispatcher();
  
  let email = '';
  let showForm = false;
  let error = '';
  
  function addAttendee() {
    if (email && !event.attendees.includes(email)) {
      event.attendees = [...event.attendees, email];
      email = '';
    }
  }
  
  function removeAttendee(emailToRemove: string) {
    event.attendees = event.attendees.filter(e => e !== emailToRemove);
  }
  
  function handleSubmit() {
    if (!event.title || !event.start || !event.end) {
      error = 'Title, start time, and end time are required';
      return;
    }
    
    dispatch('save', {
      ...event,
      startDateTime: event.start.toISOString(),
      endDateTime: event.end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }
</script>

<div class="space-y-4">
  <button
    on:click={() => showForm = !showForm}
    class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    {showForm ? 'Cancel' : 'Add to Google Calendar'}
  </button>

  {#if showForm}
    <div class="p-4 mt-4 space-y-4 bg-gray-50 rounded-md">
      {#if error}
        <div class="p-2 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      {/if}
      
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          type="text"
          bind:value={event.title}
          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Event title"
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          bind:value={event.description}
          rows="3"
          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Event description"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="start" class="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            id="start"
            type="datetime-local"
            bind:value={event.start}
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label for="end" class="block text-sm font-medium text-gray-700">End Time</label>
          <input
            id="end"
            type="datetime-local"
            bind:value={event.end}
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
        <input
          id="location"
          type="text"
          bind:value={event.location}
          class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Event location"
        />
      </div>
      
      <div>
        <label for="attendees" class="block text-sm font-medium text-gray-700">Attendees</label>
        <div class="flex mt-1">
          <input
            id="attendees"
            type="email"
            bind:value={email}
            on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
            class="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add attendee email"
          />
          <button
            type="button"
            on:click={addAttendee}
            class="px-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        
        {#if event.attendees.length > 0}
          <div class="flex flex-wrap gap-2 mt-2">
            {#each event.attendees as attendee}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {attendee}
                <button
                  type="button"
                  on:click={() => removeAttendee(attendee)}
                  class="flex-shrink-0 ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 rounded-full hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                >
                  <span class="sr-only">Remove</span>
                  <svg class="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            {/each}
          </div>
        {/if}
      </div>
      
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          on:click={() => showForm = false}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          on:click={handleSubmit}
          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {#if loading}
            <svg class="w-5 h-5 mr-2 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          {:else}
            Save Event
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>
