import { createClient } from "@/lib/supabase/server";

// Returns the caller's role + the list of branch ids they're allowed to manage.
export async function getMyScope() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role, branch_id, status")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  let branchIds: string[] = [];
  if (profile.role === "principal" && profile.branch_id) {
    branchIds = [profile.branch_id];
  } else if (profile.role === "regional_supervisor" && profile.branch_id) {
    const { data: myBranch } = await supabase
      .from("branches")
      .select("division")
      .eq("id", profile.branch_id)
      .single();
    if (myBranch) {
      const { data: branches } = await supabase
        .from("branches")
        .select("id")
        .eq("division", myBranch.division)
        .eq("status", "active");
      branchIds = (branches ?? []).map((b: any) => b.id);
    }
  } else if (profile.role === "super_admin") {
    const { data: branches } = await supabase
      .from("branches")
      .select("id")
      .eq("status", "active");
    branchIds = (branches ?? []).map((b: any) => b.id);
  } else if ((profile.role === "teacher" || profile.role === "staff") && profile.branch_id) {
    // Teacher/staff are scoped to their own branch.
    branchIds = [profile.branch_id];
  }

  return { profile, branchIds };
}
