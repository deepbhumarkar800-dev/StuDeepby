import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";

/** Call at the top of every admin page. Redirects to the login page unless the user is the admin. */
export async function requireAdmin() {
  const supabase = createServerSupabase();
  if (!supabase) redirect("/admin/login?error=not-configured");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) redirect("/admin/login?error=not-admin");
  return { supabase, user };
}

/** Same check for API routes: returns null instead of redirecting. */
export async function getAdminOrNull() {
  const supabase = createServerSupabase();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { supabase, user } : null;
}
