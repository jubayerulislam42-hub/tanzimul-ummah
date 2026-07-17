import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { getMyExams } from "@/lib/student-data";
import StudentLayout from "../layout";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (profile?.role !== "student") redirect("/dashboard");

  const exams = await getMyExams(user.id);

  return (
    <StudentLayout>
      <h1 className="mb-5 font-serif-bn text-xl font-bold text-primary">পরীক্ষার ফল</h1>

      {exams.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-charcoal/50 shadow-sm">
          এখনও কোনো পরীক্ষার ফল যুক্ত করা হয়নি।
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary/5 text-charcoal/70">
              <tr>
                <th className="px-4 py-3">পরীক্ষা</th>
                <th className="px-4 py-3">বিষয়</th>
                <th className="px-4 py-3 text-center">প্রাপ্ত</th>
                <th className="px-4 py-3 text-center">গ্রেড</th>
                <th className="px-4 py-3">তারিখ</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e) => (
                <tr key={e.id} className="border-t border-primary/5">
                  <td className="px-4 py-2.5 font-medium text-charcoal">{e.exam_name}</td>
                  <td className="px-4 py-2.5 text-charcoal/70">{e.subject || "—"}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal/80">
                    {e.marks_obtained != null && e.marks_total != null
                      ? `${e.marks_obtained}/${e.marks_total}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {e.grade ? (
                      <span className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-semibold text-accent-gold-dark">
                        {e.grade}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-charcoal/50">
                    {e.exam_date ? new Date(e.exam_date).toLocaleDateString("bn-BD") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StudentLayout>
  );
}
