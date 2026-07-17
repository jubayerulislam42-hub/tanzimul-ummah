import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { getMyScope } from "@/lib/scope";
import { createClient } from "@/lib/supabase/server";
import TeacherStaffLayout from "../layout";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (!["teacher", "staff", "principal", "regional_supervisor", "super_admin"].includes(profile?.role ?? "")) {
    redirect("/dashboard");
  }

  // Scope: teacher/staff see their own branch's students.
  const scope = await getMyScope();
  const branchIds = scope?.branchIds?.length ? scope.branchIds : [];
  const supabase = createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, name_bn, roll_id, status, branches(name_bn, code)")
    .in("branch_id", branchIds)
    .order("name_bn")
    .limit(500);

  const list = ((students as any[]) ?? []).map((s) => ({
    id: s.id,
    name_bn: s.name_bn,
    roll_id: s.roll_id,
    status: s.status,
    branch_name: s.branches?.name_bn ?? null,
    branch_code: s.branches?.code ?? null,
  }));

  return (
    <TeacherStaffLayout>
      <div className="mb-4 flex items-center gap-2 text-accent-gold">
        <Users size={20} />
        <h1 className="font-serif-bn text-xl font-bold text-primary">আমার শিক্ষার্থীরা</h1>
        <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-sm text-charcoal/60">{list.length} জন</span>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-charcoal/50 shadow-sm">
          এই শাখায় এখনও কোনো ছাত্র যুক্ত হয়নি।
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
              <div>
                <div className="font-serif-bn font-semibold text-primary">{s.name_bn}</div>
                <div className="text-xs text-charcoal/50">
                  {s.roll_id || "রোল নেই"}{s.branch_code ? ` · ${s.branch_code}` : ""}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.status === "active" ? "bg-green-600/10 text-green-700" : "bg-amber-500/10 text-amber-700"}`}>
                {s.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </span>
            </div>
          ))}
        </div>
      )}
    </TeacherStaffLayout>
  );
}
