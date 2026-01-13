import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Project ID: xvicydrqtddctywkvyge
const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'xvicydrqtddctywkvyge';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Export types for TypeScript
export type SupabaseClient = typeof supabase;

// Export configuration for reference
export const SUPABASE_CONFIG = {
  projectId: SUPABASE_PROJECT_ID,
  url: SUPABASE_URL,
  hasAnonKey: !!SUPABASE_ANON_KEY,
} as const;

