import { createClient } from "@supabase/supabase-js";

// Supabase client, created once and reused across the app.
//
// These two values are PUBLIC by design — the anon key is safe to expose in
// the browser AS LONG AS Row Level Security (RLS) is enabled on your tables
// (see SETUP.md for the SQL). The anon key can only do what your RLS policies
// allow — here, just increment and read a view count.
//
// Vite exposes env vars prefixed with PUBLIC_ to client code.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// If keys are missing (e.g. first local run before .env is set up), we export
// null and the view counter degrades gracefully instead of crashing the build.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
