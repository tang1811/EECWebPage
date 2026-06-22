// Next 16 Proxy (formerly middleware). Refreshes the Supabase auth session
// cookie on admission routes. Guarded: if Supabase env is not configured yet,
// it no-ops so the marketing site keeps working before keys are added.
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  // Only run on admission routes; skip static assets and the marketing site.
  matcher: ['/admission/:path*'],
};
