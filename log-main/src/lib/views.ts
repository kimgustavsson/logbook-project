import { supabase } from './supabase';

// View-count data access. All Supabase calls related to views live here so
// the UI components never touch the database directly — they just call
// getViews() / addView(). Swap the backend later (e.g. to a different table
// or service) by editing only this file.

// Read the current view count for a post. Returns 0 if unavailable.
export async function getViews(slug: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('post_views')
    .select('count')
    .eq('slug', slug)
    .single();
  if (error || !data) return 0;
  return data.count ?? 0;
}

// Increment the view count for a post, then return the new total.
// Uses a Postgres function (increment_view) so the read-modify-write happens
// atomically on the server — see SETUP.md for the SQL definition.
export async function addView(slug: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase.rpc('increment_view', { page_slug: slug });
  if (error) return getViews(slug); // fall back to a plain read on failure
  return data ?? 0;
}
