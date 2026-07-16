import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { requireScope, getScopedStudents } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminStudents() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (!["principal", "regional_supervisor", "super_admin"].includes(profile?.role ?? "")) {
    redirect("/dashboard");
  }
  let scope;
  try {
    scope = await requireScope();
  } catch {
    redirect("/dashboard");
  }
  const students = await getScopedStudents(scope.branchIds);

  return (
    <AdminShell profile={profile!}>
      <h1 className="mb-4 font-serif-bn text-xl font-bold text-primary">ছাত্রবৃন্দ ({students.length})</h1>
      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-charcoal/70">
            <tr>
              <th className="px-4 py-3">কোড</th>
              <th className="px-4 py-3">নাম</th>
              <th className="px-4 py-3">অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s: any) => (
              <tr key={s.id} className="border-t border-primary/5">
                <td className="px-4 py-2.5 text-charcoal/60">{s.roll_id}</td>
                <td className="px-4 py-2.5 font-medium text-charcoal">{s.name_bn}</td>
                <td className="px-4 py-2.5">
                  <span className={s.status === "active" ? "text-green-700" : "text-amber-600"}>
                    {s.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-charcoal/40">কোনো ছাত্র নেই</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
