import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution (Vite browser runtime or Node test environment)
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
    ? process.env
    : {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Checks whether valid Supabase credentials have been supplied.
 * Prevents application crashes when environment variables are empty or placeholders.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey !== 'your-anon-publishable-key-here' &&
  supabaseAnonKey.length > 20
);

/**
 * Supabase client instance.
 * Initialized only when credentials are valid.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  : null;
