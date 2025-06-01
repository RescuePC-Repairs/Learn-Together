import { json, error } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const GET: RequestHandler = async () => {
  try {
    // Run the migration endpoint
    const response = await fetch('/api/supabase/migrate');
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Migration failed');
    }
    
    return json({ success: true, message: 'Migration completed successfully' });
  } catch (err) {
    console.error('Migration error:', err);
    throw error(500, 'Failed to run migration: ' + (err as Error).message);
  }
};
