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
  status: "pending" | "approved" | "rejected";
}

export interface StudentRecord {
  id: string;
  roll_id: string | null;
  name_bn: string | null;
  name_en: string | null;
  branch_id: string | null;
  guardian_phone: string | null;
  photo_url: string | null;
  status: string | null;
  branch_name: string | null;
  branch_code: string | null;
  branch_district: string | null;
}

/** Returns the logged-in student's record (with branch info) or null. Server-only. */
export async function getMyStudentRecord(userId: string): Promise<StudentRecord | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("id, roll_id, name_bn, name_en, branch_id, guardian_phone, photo_url, status, branches(name_bn, code, district)")
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  const b: any = (data as any).branches ?? {};
  return {
    id: data.id,
    roll_id: data.roll_id,
    name_bn: data.name_bn,
    name_en: data.name_en,
    branch_id: data.branch_id,
    guardian_phone: data.guardian_phone,
    photo_url: data.photo_url,
    status: data.status,
    branch_name: b.name_bn ?? null,
    branch_code: b.code ?? null,
    branch_district: b.district ?? null,
  };
}

export interface StaffRecord {
  id: string;
  employee_id: string | null;
  name_bn: string | null;
  name_en: string | null;
  designation: string | null;
  branch_id: string | null;
  qualification: string | null;
  phone: string | null;
  photo_url: string | null;
  status: string | null;
  branch_name: string | null;
  branch_code: string | null;
  branch_district: string | null;
}

/** Returns the logged-in teacher/staff record (with branch info) or null. Server-only. */
export async function getMyStaffRecord(
  userId: string,
  table: "teachers" | "staff"
): Promise<StaffRecord | null> {
  const supabase = createClient();
  const selectCols =
    table === "teachers"
      ? "id, employee_id, name_bn, name_en, branch_id, qualification, phone, photo_url, status, branches(name_bn, code, district)"
      : "id, employee_id, name_bn, name_en, branch_id, designation, phone, photo_url, status, branches(name_bn, code, district)";
  const { data } = await supabase
    .from(table)
    .select(selectCols)
    .eq("user_id", userId)
    .single();
  if (!data) return null;
  const b: any = (data as any).branches ?? {};
  return {
    id: data.id,
    employee_id: data.employee_id,
    name_bn: data.name_bn,
    name_en: data.name_en,
    designation: data.designation ?? data.qualification ?? null,
    branch_id: data.branch_id,
    qualification: data.qualification ?? null,
    phone: data.phone ?? null,
    photo_url: data.photo_url,
    status: data.status,
    branch_name: b.name_bn ?? null,
    branch_code: b.code ?? null,
    branch_district: b.district ?? null,
  };
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
