import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * SERVER ONLY. Uses the secret service-role key, which bypasses Row Level Security.
 * Never import this file from a client component.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
