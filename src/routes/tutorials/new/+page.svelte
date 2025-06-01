<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { supabase } from '$lib/supabase';
  import type { AuthError } from '@supabase/supabase-js';

  // Form state
  let title = '';
  let description = '';
  let videoFile: File | null = null;
  let thumbnailFile: File | null = null;
  let isUploading = false;
  let error = '';
  let success = '';
  
  // Get the current user
  const user = $auth.user;
  
  // Redirect if not authenticated
  onMount(() => {
    if (!user) {
      goto('/login?redirectTo=/tutorials/new');
    }
  });
  
  // Ensure user is defined before proceeding
  if (!user) {
    goto('/login?redirectTo=/tutorials/new');
  }

  function handleVideoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.[0]) {
      videoFile = target.files[0];
    }
  }

  function handleThumbnailChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.[0]) {
      thumbnailFile = target.files[0];
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (!user) {
      error = 'You must be logged in to upload a tutorial';
      return;
    }
    
    if (!title.trim()) {
      error = 'Please enter a title';
      return;
    }
    
    if (!description.trim()) {
      error = 'Please enter a description';
      return;
    }
    
    if (!videoFile) {
      error = 'Please select a video file';
      return;
    }
    
    if (!thumbnailFile) {
      error = 'Please select a thumbnail image';
      return;
    }

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validVideoTypes.includes(videoFile.type)) {
      error = 'Please upload a valid video file (MP4, WebM, or QuickTime)';
      return;
    }
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImageTypes.includes(thumbnailFile.type)) {
      error = 'Please upload a valid image (JPEG, PNG, or WebP)';
      return;
    }

    try {
      isUploading = true;
      error = '';
      success = '';

      // Upload video
      const videoExt = videoFile.name.split('.').pop()?.toLowerCase();
      const videoFileName = `${crypto.randomUUID()}.${videoExt}`;
      const videoPath = `tutorials/${user.id}/${videoFileName}`;
      
      const { error: videoUploadError } = await supabase.storage
        .from('videos')
        .upload(videoPath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (videoUploadError) throw videoUploadError;
      
      // Get public URL for video
      const { data: videoData } = supabase.storage
        .from('videos')
        .getPublicUrl(videoPath);
      
      // Upload thumbnail
      const thumbnailExt = thumbnailFile.name.split('.').pop()?.toLowerCase();
      const thumbnailFileName = `${crypto.randomUUID()}.${thumbnailExt}`;
      const thumbnailPath = `thumbnails/${user.id}/${thumbnailFileName}`;
      
      const { error: thumbnailUploadError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbnailPath, thumbnailFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (thumbnailUploadError) throw thumbnailUploadError;
      
      // Get public URL for thumbnail
      const { data: thumbnailData } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbnailPath);
      
      // Save tutorial metadata to database
      const { error: dbError } = await supabase
        .from('tutorials')
        .insert([{
          title: title.trim(),
          description: description.trim(),
          video_url: videoData.publicUrl,
          thumbnail_url: thumbnailData.publicUrl,
          user_id: user.id,
          user_email: user.email || '',
          created_at: new Date().toISOString()
        }]);
      
      if (dbError) throw dbError;
      
      success = 'Tutorial uploaded successfully!';
      
      // Reset form
      title = '';
      description = '';
      videoFile = null;
      thumbnailFile = null;
      
      // Redirect after a short delay
      setTimeout(() => {
        goto('/tutorials');
      }, 1500);
      
    } catch (err) {
      const uploadError = err as AuthError | Error;
      console.error('Error uploading tutorial:', uploadError);
      error = uploadError.message || 'Failed to upload tutorial. Please try again.';
    } finally {
      isUploading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900">Upload New Tutorial</h1>
      <p class="mt-2 text-sm text-gray-600">Share your knowledge with the community</p>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        {#if error}
          <div class="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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
          <div class="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
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

        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              bind:value={title}
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="How to..."
              disabled={isUploading}
              aria-required="true"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              bind:value={description}
              rows={4}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="What will people learn from this tutorial?"
              disabled={isUploading}
              aria-required="true"
            ></textarea>
          </div>

          <!-- Video Upload -->
          <div class="space-y-1">
            <span class="block text-sm font-medium text-gray-700">Video</span>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="video-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a video</span>
                    <input 
                      id="video-upload" 
                      name="video-upload" 
                      type="file" 
                      class="sr-only" 
                      accept="video/mp4,video/webm,video/quicktime" 
                      on:change={handleVideoChange} 
                      disabled={isUploading}
                      aria-describedby="video-upload-help"
                      required
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p id="video-upload-help" class="text-xs text-gray-500">MP4, WebM, or QuickTime up to 100MB</p>
                {#if videoFile}
                  <p class="text-sm text-gray-900 mt-2">{videoFile.name}</p>
                {/if}
              </div>
            </div>
          </div>

          <!-- Thumbnail Upload -->
          <div class="space-y-1">
            <span class="block text-sm font-medium text-gray-700">Thumbnail</span>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="thumbnail-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a thumbnail</span>
                    <input 
                      id="thumbnail-upload" 
                      name="thumbnail-upload" 
                      type="file" 
                      class="sr-only" 
                      accept="image/jpeg,image/png,image/webp" 
                      on:change={handleThumbnailChange} 
                      disabled={isUploading}
                      aria-describedby="thumbnail-upload-help"
                      required
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p id="thumbnail-upload-help" class="text-xs text-gray-500">JPG, PNG, or WebP up to 5MB</p>
                {#if thumbnailFile}
                  <p class="text-sm text-gray-900 mt-2">{thumbnailFile.name}</p>
                {/if}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-4">
            <button
              type="button"
              on:click={() => goto('/tutorials')}
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Tutorial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
