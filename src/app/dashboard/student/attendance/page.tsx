import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { getMyAttendance, getAttendanceSummary } from "@/lib/student-data";
import StudentLayout from "../layout";

export const dynamic = "force-dynamic";

const statusMeta: Record<string, { label: string; cls: string }> = {
  present: { label: "উপস্থিত", cls: "bg-green-600/15 text-green-700" },
  absent: { label: "অনুপস্থিত", cls: "bg-red-500/15 text-red-700" },
  late: { label: "বিলম্বিত", cls: "bg-amber-500/15 text-amber-700" },
  excused: { label: "ছুটি", cls: "bg-primary/10 text-primary" },
};

export default async function StudentAttendancePage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (profile?.role !== "student") redirect("/dashboard");

  const [rows, summary] = await Promise.all([
    getMyAttendance(user.id),
    getAttendanceSummary(user.id),
  ]);

  return (
    <StudentLayout>
      <div className="mb-6 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-serif-bn text-xl font-bold text-primary">আমার হাজিরা</h1>
          <span className="font-serif-bn text-2xl font-bold text-accent-gold-dark">{summary.percent}%</span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-primary/10">
          <div className="h-full rounded-full bg-accent-gold transition-all" style={{ width: `${summary.percent}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-charcoal/60">
          <span>উপস্থিত: <b className="text-green-700">{summary.present}</b></span>
          <span>বিলম্বিত: <b className="text-amber-700">{summary.late}</b></span>
          <span>অনুপস্থিত: <b className="text-red-700">{summary.absent}</b></span>
          <span>মোট: {summary.total} দিন</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-charcoal/50 shadow-sm">
          এখনও কোনো হাজিরা রেকর্ড যুক্ত করা হয়নি।
        </p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const meta = statusMeta[r.status];
            return (
              <div key={r.date} className="flex items-center justify-between rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
                <span className="text-sm text-charcoal">{new Date(r.date).toLocaleDateString("bn-BD")}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
}
