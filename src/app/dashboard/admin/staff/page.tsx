import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { requireScope, getScopedStaff } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminStaff() {
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
  const { teachers, staff } = await getScopedStaff(scope.branchIds);

  const renderRow = (r: any) => (
    <tr key={r.id} className="border-t border-primary/5">
      <td className="px-4 py-2.5 text-charcoal/60">{r.employee_id}</td>
      <td className="px-4 py-2.5 font-medium text-charcoal">{r.name_bn}</td>
      <td className="px-4 py-2.5">
        <span className={r.status === "active" ? "text-green-700" : "text-amber-600"}>
          {r.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </span>
      </td>
    </tr>
  );

  return (
    <AdminShell profile={profile!}>
      <h1 className="mb-4 font-serif-bn text-xl font-bold text-primary">শিক্ষক ও স্টাফ</h1>

      <h2 className="mb-2 font-serif-bn text-base font-bold text-primary">শিক্ষক ({teachers.length})</h2>
      <div className="mb-6 overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-charcoal/70"><tr><th className="px-4 py-3">কোড</th><th className="px-4 py-3">নাম</th><th className="px-4 py-3">অবস্থা</th></tr></thead>
          <tbody>{teachers.map(renderRow)}{teachers.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-charcoal/40">কোনো শিক্ষক নেই</td></tr>}</tbody>
        </table>
      </div>

      <h2 className="mb-2 font-serif-bn text-base font-bold text-primary">স্টাফ ({staff.length})</h2>
      <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-charcoal/70"><tr><th className="px-4 py-3">কোড</th><th className="px-4 py-3">নাম</th><th className="px-4 py-3">অবস্থা</th></tr></thead>
          <tbody>{staff.map(renderRow)}{staff.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-charcoal/40">কোনো স্টাফ নেই</td></tr>}</tbody>
        </table>
      </div>
    </AdminShell>
  );
}
