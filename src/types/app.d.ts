// Type definitions for the Learn Together application

type UserRole = 'student' | 'tutor' | 'admin';

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: number; // 1-5
  is_teaching: boolean;
  is_learning: boolean;
  created_at: string;
  updated_at: string;
  skill: Skill;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  skill_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  skill: Skill;
  user1: UserProfile;
  user2: UserProfile;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender: UserProfile;
  receiver: UserProfile;
}

interface Session {
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  expires_at: number;
}

declare namespace App {
  interface Locals {
    session: Session | null;
    user: UserProfile | null;
  }

  interface PageData {
    session: Session | null;
    user: UserProfile | null;
  }
}
