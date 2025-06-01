import { redirect } from '@sveltejs/kit';
import { isAuthenticated } from './lib/stores/auth';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/auth/callback'];

export const handle = async ({ event, resolve }) => {
  // Get the pathname
  const pathname = event.url.pathname;
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // If it's not a public route, check authentication
  if (!isPublicRoute) {
    const isAuth = await isAuthenticated();
    
    // If not authenticated, redirect to login
    if (!isAuth) {
      throw redirect(303, `/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }
  
  // Resolve the event
  return resolve(event);
};
