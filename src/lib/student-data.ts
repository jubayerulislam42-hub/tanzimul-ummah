import { createClient } from "@/lib/supabase/server";

export interface HifzRow {
  surah_id: number;
  surah_name_bn: string;
  surah_name_ar: string | null;
  ayah_count: number;
  status: "not_started" | "in_progress" | "memorized" | "revised";
  ayah_from: number | null;
  ayah_to: number | null;
}

// Returns the signed-in student's hifz progress joined with surah info.
export async function getMyHifz(userId: string): Promise<HifzRow[]> {
  const supabase = createClient();
  // Find the student record id for this user.
  const { data: stu } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", userId)
    .single();
  if (!stu) return [];
  const { data } = await supabase
    .from("hifz_progress")
    .select("surah_id, status, ayah_from, ayah_to, quran_surahs(id, name_bn, name_ar, ayah_count)")
    .eq("student_id", (stu as any).id)
    .order("surah_id");
  const rows = (data as any[]) ?? [];
  // Build a map of existing progress.
  const map = new Map<number, any>();
  for (const r of rows) map.set(r.surah_id, r);
  // Always return all 114 surahs, with progress (or not_started) for each.
  const { data: allSurahs } = await supabase
    .from("quran_surahs")
    .select("id, name_bn, name_ar, ayah_count")
    .order("id");
  return ((allSurahs as any[]) ?? []).map((s) => {
    const p = map.get(s.id);
    return {
      surah_id: s.id,
      surah_name_bn: s.name_bn,
      surah_name_ar: s.name_ar,
      ayah_count: s.ayah_count,
      status: (p?.status ?? "not_started") as HifzRow["status"],
      ayah_from: p?.ayah_from ?? null,
      ayah_to: p?.ayah_to ?? null,
    };
  });
}

export interface ExamRow {
  id: string;
  exam_name: string;
  subject: string | null;
  marks_obtained: number | null;
  marks_total: number | null;
  grade: string | null;
  exam_date: string | null;
}

export async function getMyExams(userId: string): Promise<ExamRow[]> {
  const supabase = createClient();
  const { data: stu } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", userId)
    .single();
  if (!stu) return [];
  const { data } = await supabase
    .from("exams")
    .select("id, exam_name, subject, marks_obtained, marks_total, grade, exam_date")
    .eq("student_id", (stu as any).id)
    .order("exam_date", { ascending: false });
  return (data as ExamRow[]) ?? [];
}

// Aggregate hifz progress for the dashboard summary.
export async function getHifzSummary(userId: string): Promise<{
  memorized: number;
  in_progress: number;
  total: number;
  percent: number;
}> {
  const rows = await getMyHifz(userId);
  const memorized = rows.filter((r) => r.status === "memorized" || r.status === "revised").length;
  const in_progress = rows.filter((r) => r.status === "in_progress").length;
  const total = rows.length || 114;
  return {
    memorized,
    in_progress,
    total,
    percent: Math.round((memorized / total) * 100),
  };
}
