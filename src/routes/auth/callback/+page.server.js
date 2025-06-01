import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const load = async ({ url }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/profile';
  
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successfully logged in, redirect to the specified page
      throw redirect(303, next);
    }
  }
  
  // If there's an error or no code, redirect to login
  throw redirect(303, '/login');
};
