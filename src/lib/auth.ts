import { createClient } from "@/lib/supabase/server";

export type UserRole =
  | "student"
  | "staff"
  | "teacher"
  | "principal"
  | "regional_supervisor"
  | "super_admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  photo_url: string | null;
  role: UserRole;
  branch_id: string | null;
  status: "pending" | "active" | "suspended";
}

/** Returns the auth user + their profile row (or null). Server-only. */
export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, photo_url, role, branch_id, status")
    .eq("id", user.id)
    .single();

  return { user, profile: (profile as Profile) ?? null };
}
