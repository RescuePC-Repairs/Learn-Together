import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession?.();
  if (!session) {
    throw redirect(303, '/login?redirectTo=/tutorials/new');
  }
  return {};
};

// Add this type to handle form actions
export const actions = {
  default: async ({ request, locals }) => {
    const session = await locals.getSession?.();
    if (!session) {
      throw redirect(303, '/login?redirectTo=/tutorials/new');
    }
    
    // Form submission will be handled client-side
    return { success: true };
  }
};
