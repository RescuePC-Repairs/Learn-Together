<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import GoogleCalendarConnect from '$lib/components/GoogleCalendarConnect.svelte';
  import AddToCalendar from '$lib/components/AddToCalendar.svelte';
  
  let events = [];
  let loading = false;
  let error = '';
  
  async function loadEvents() {
    try {
      loading = true;
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeMin: now.toISOString(),
          timeMax: thirtyDaysFromNow.toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      
      const data = await response.json();
      events = data.events || [];
    } catch (err) {
      console.error('Error loading events:', err);
      error = 'Failed to load calendar events';
    } finally {
      loading = false;
    }
  }
  
  async function handleSave(event: CustomEvent) {
    try {
      loading = true;
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event.detail),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      await loadEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      error = 'Failed to create calendar event';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    loadEvents();
  });
</script>

<div class="py-8">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Google Calendar</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage your Google Calendar events and sync them with your learning schedule.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <GoogleCalendarConnect />
      </div>
    </div>
    
    <div class="mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium text-gray-900">Upcoming Events</h2>
        <AddToCalendar on:save={handleSave} />
      </div>
      
      {#if error}
        <div class="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      {/if}
      
      {#if loading && events.length === 0}
        <div class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      {:else if events.length === 0}
        <div class="text-center py-12 bg-white shadow rounded-lg">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No events</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new event or connecting your Google Calendar.
          </p>
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each events as event}
              <li>
                <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" class="block hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-blue-600 truncate">
                        {event.summary}
                      </p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {new Date(event.start.dateTime || event.start.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          <svg
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {new Date(event.start.dateTime || `${event.start.date}T00:00:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {event.end && (
                            <>
                              <span class="mx-1">-</span>
                              {new Date(event.end.dateTime || `${event.end.date}T23:59:59`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </>
                          )}
                        </p>
                      </div>
                      {event.location && (
                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</div>
