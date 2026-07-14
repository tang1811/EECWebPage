// Browser Supabase client — for use inside 'use client' components.
// Singleton per tab; reads the public anon key (RLS-protected).
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
  );
}
