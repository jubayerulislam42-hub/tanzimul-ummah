import { createClient } from "@/lib/supabase/server";
import { getMyScope } from "@/lib/scope";

export interface ScopeData {
  role: string;
  branchIds: string[];
  branchId: string | null;
  division: string | null;
}

export async function requireScope(): Promise<ScopeData> {
  const scope = await getMyScope();
  if (!scope || !["principal", "regional_supervisor", "super_admin"].includes(scope.profile.role)) {
    throw new Error("forbidden");
  }
  let division: string | null = null;
  if (scope.profile.role === "regional_supervisor" && scope.profile.branch_id) {
    const supabase = createClient();
    const { data } = await supabase
      .from("branches")
      .select("division")
      .eq("id", scope.profile.branch_id)
      .single();
    division = data?.division ?? null;
  }
  return {
    role: scope.profile.role,
    branchIds: scope.branchIds,
    branchId: scope.profile.branch_id,
    division,
  };
}

export async function getScopedStats(branchIds: string[]) {
  const supabase = createClient();
  const [{ count: students }, { count: teachers }, { count: staff }] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }).in("branch_id", branchIds),
    supabase.from("teachers").select("*", { count: "exact", head: true }).in("branch_id", branchIds),
    supabase.from("staff").select("*", { count: "exact", head: true }).in("branch_id", branchIds),
  ]);
  return { students: students ?? 0, teachers: teachers ?? 0, staff: staff ?? 0 };
}

export async function getScopedBranches(branchIds: string[]) {
  const supabase = createClient();
  const { data } = await supabase
    .from("branches")
    .select("id, code, name_bn, name_en, district, division")
    .in("id", branchIds)
    .order("code");
  return (data as any[]) ?? [];
}

export async function getScopedStudents(branchIds: string[], limit = 200) {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("id, roll_id, name_bn, name_en, class_id, branch_id, status")
    .in("branch_id", branchIds)
    .order("name_bn")
    .limit(limit);
  return (data as any[]) ?? [];
}

export async function getScopedStaff(branchIds: string[], limit = 300) {
  const supabase = createClient();
  const { data: teachers } = await supabase
    .from("teachers")
    .select("id, employee_id, name_bn, branch_id, status")
    .in("branch_id", branchIds)
    .order("name_bn")
    .limit(limit);
  const { data: staff } = await supabase
    .from("staff")
    .select("id, employee_id, name_bn, branch_id, status")
    .in("branch_id", branchIds)
    .order("name_bn")
    .limit(limit);
  return {
    teachers: (teachers as any[]) ?? [],
    staff: (staff as any[]) ?? [],
  };
}
