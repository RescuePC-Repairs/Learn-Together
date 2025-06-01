import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCalendarEvent, listCalendarEvents } from '$lib/server/googleCalendar';
import { supabase } from '$lib/supabaseClient';

interface EventRequest {
  summary: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone?: string;
  location?: string;
  attendees?: string[];
}

interface ListRequest {
  timeMin: string;
  timeMax: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.getSession();
    if (!session) {
      throw error(401, 'Unauthorized');
    }

    const data = await request.json();
    
    // Check if this is a list request
    if ('timeMin' in data && 'timeMax' in data) {
      const { timeMin, timeMax } = data as ListRequest;
      
      // Get user's access token
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_tokens')
        .select('access_token')
        .eq('user_id', session.user.id)
        .eq('provider', 'google')
        .single();

      if (tokenError || !tokenData) {
        console.error('Error fetching access token:', tokenError);
        throw error(400, 'Google account not connected');
      }

      const events = await listCalendarEvents(tokenData.access_token, timeMin, timeMax);
      return json({ events });
    }
    
    // Otherwise, it's an event creation request
    const eventData = data as EventRequest;
    
    // Get user's access token
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_tokens')
      .select('access_token')
      .eq('user_id', session.user.id)
      .eq('provider', 'google')
      .single();

    if (tokenError || !tokenData) {
      console.error('Error fetching access token:', tokenError);
      throw error(400, 'Google account not connected');
    }

    const event = await createCalendarEvent(tokenData.access_token, {
      summary: eventData.summary,
      description: eventData.description,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      timeZone: eventData.timeZone,
      location: eventData.location,
      attendees: eventData.attendees
    });

    return json({ event });
  } catch (err) {
    console.error('Error in calendar events endpoint:', err);
    throw error(500, 'Failed to process calendar request');
  }
};
