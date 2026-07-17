import { redirect } from "next/navigation";
import { getSessionProfile, getMyStudentRecord } from "@/lib/auth";
import { getMyHifz, getHifzSummary } from "@/lib/student-data";
import StudentLayout from "../layout";

export const dynamic = "force-dynamic";

const statusMeta: Record<string, { label: string; cls: string }> = {
  not_started: { label: "শুরু হয়নি", cls: "bg-charcoal/10 text-charcoal/50" },
  in_progress: { label: "চলমান", cls: "bg-amber-500/15 text-amber-700" },
  memorized: { label: "মুখস্থ", cls: "bg-green-600/15 text-green-700" },
  revised: { label: "রিভিশন হয়েছে", cls: "bg-accent-gold/20 text-accent-gold-dark" },
};

export default async function HifzPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (profile?.role !== "student") redirect("/dashboard");

  const [rows, summary] = await Promise.all([
    getMyHifz(user.id),
    getHifzSummary(user.id),
  ]);

  return (
    <StudentLayout>
      <div className="mb-6 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-serif-bn text-xl font-bold text-primary">হিফয অগ্রগতি</h1>
          <span className="font-serif-bn text-2xl font-bold text-accent-gold-dark">{summary.percent}%</span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-primary/10">
          <div
            className="h-full rounded-full bg-accent-gold transition-all"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-charcoal/60">
          <span>মুখস্থ: <b className="text-green-700">{summary.memorized}</b>/{summary.total}</span>
          <span>চলমান: <b className="text-amber-700">{summary.in_progress}</b></span>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r) => {
          const meta = statusMeta[r.status];
          return (
            <div
              key={r.surah_id}
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5 text-xs font-bold text-primary">
                {r.surah_id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif-bn font-semibold text-primary">{r.surah_name_bn}</span>
                  {r.surah_name_ar && (
                    <span className="text-sm text-charcoal/40" dir="rtl">{r.surah_name_ar}</span>
                  )}
                </div>
                <div className="text-xs text-charcoal/50">
                  {r.ayah_count} আয়াত
                  {r.ayah_from && r.ayah_to ? ` · ${r.ayah_from}–${r.ayah_to}` : ""}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
    </StudentLayout>
  );
}
