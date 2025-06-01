import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const GET: RequestHandler = async () => {
  try {
    // Enable required extensions
    await supabaseAdmin.rpc('create_extension_if_not_exists', { extension_name: 'uuid-ossp' });
    
    // Create users table (extending auth.users)
    const { error: usersError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'users',
      table_definition: `
        id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
        full_name TEXT,
        email TEXT UNIQUE,
        bio TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      `
    });

    if (usersError) throw usersError;

    // Create skills table
    const { error: skillsError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'skills',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      `
    });

    if (skillsError) throw skillsError;

    // Create user_skills table
    const { error: userSkillsError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'user_skills',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('learn', 'teach')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        UNIQUE(user_id, skill_id, role)
      `
    });

    if (userSkillsError) throw userSkillsError;

    // Create matches table
    const { error: matchesError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'matches',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_a UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_b UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
        matched_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        UNIQUE(user_a, user_b, skill_id),
        CHECK (user_a < user_b)
      `
    });

    if (matchesError) throw matchesError;

    // Create calendar_tokens table
    const { error: calendarTokensError } = await supabaseAdmin.rpc('create_table_if_not_exists', {
      table_name: 'calendar_tokens',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMP WITH TIME ZONE,
        provider TEXT DEFAULT 'google',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        UNIQUE(user_id, provider)
      `
    });

    if (calendarTokensError) throw calendarTokensError;

    // Create indexes
    const { error: indexError } = await supabaseAdmin.rpc('create_index_if_not_exists', {
      index_name: 'idx_user_skills_user_role',
      table_name: 'user_skills',
      columns: 'user_id, role'
    });

    if (indexError) throw indexError;

    // Set up RLS policies
    await supabaseAdmin.rpc('create_policy_if_not_exists', {
      policy_name: 'Users can view their own profile',
      table_name: 'users',
      using_expression: 'auth.uid() = id'
    });

    await supabaseAdmin.rpc('create_policy_if_not_exists', {
      policy_name: 'Users can update their own profile',
      table_name: 'users',
      using_expression: 'auth.uid() = id',
      with_check: 'auth.uid() = id'
    });

    // Add similar policies for other tables...

    return json({ success: true, message: 'Database schema initialized successfully' });
  } catch (err) {
    console.error('Migration error:', err);
    throw error(500, 'Failed to initialize database schema');
  }
};
