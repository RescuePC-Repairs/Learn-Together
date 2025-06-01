// Import Supabase User type
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the base Supabase User type with our custom fields
export interface User extends Omit<SupabaseUser, 'user_metadata' | 'app_metadata'> {
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
}

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  availability?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Skill type
export interface Skill {
  id: string;
  name: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// User Skill type
export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
  updated_at: string;
  skill: Skill;
}

// Match type
export interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  match_score: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  user: UserProfile;
  matched_user: UserProfile;
}

// Session type
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

// Error type
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
  code?: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Supabase types
declare global {
  interface Window {
    env: {
      PUBLIC_SUPABASE_URL: string;
      PUBLIC_SUPABASE_ANON_KEY: string;
    };
  }
}

// Generic response type for API calls
export interface ApiResponse<T = any> {
  data: T | null;
  error: ApiError | null;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
