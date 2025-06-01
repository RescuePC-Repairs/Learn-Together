import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const { data: tutorials, error } = await locals.supabase
      ?.from('tutorials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching tutorials:', error);
      return { tutorials: [] };
    }
    
    return {
      tutorials: tutorials || []
    };
  } catch (error) {
    console.error('Unexpected error in tutorials page:', error);
    return { tutorials: [] };
  }
};
