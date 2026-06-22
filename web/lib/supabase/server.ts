// Server Supabase client — for Server Components, Server Actions, Route
// Handlers. Next 16: cookies() is async, so this factory is async too.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Called from a Server Component (read-only cookie store) will throw;
          // that's fine when middleware refreshes the session. Swallow it.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* setAll from a Server Component — ignored, middleware handles refresh */
          }
        },
      },
    },
  );
}

// Service-role client — bypasses RLS. SERVER ONLY (admin/staff actions).
// Never import this into a client component.
import { createClient as createSbClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createSbClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
