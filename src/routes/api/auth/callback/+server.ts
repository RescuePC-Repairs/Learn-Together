import { redirect } from '@sveltejs/kit';
import { getToken } from '$lib/server/googleAuth';
import { supabase } from '$lib/supabaseClient';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

export const GET = async ({ url, locals }) => {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    throw redirect(303, '/?error=' + encodeURIComponent(error));
  }

  if (!code) {
    throw redirect(303, '/?error=no_code');
  }

  try {
    const tokens = await getToken(code) as TokenResponse;
    const { data: { user } } = await locals.supabase.auth.getUser();

    if (user) {
      // Store tokens in your database
      const { error } = await supabase
        .from('user_tokens')
        .upsert({
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
          provider: 'google',
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing tokens:', error);
        throw redirect(303, '/?error=token_storage_failed');
      }
    }

    throw redirect(303, '/dashboard?success=google_connected');
  } catch (err) {
    console.error('Error during Google OAuth callback:', err);
    throw redirect(303, `/?error=${encodeURIComponent((err as Error).message)}`);
  }
};
