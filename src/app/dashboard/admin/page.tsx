import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { requireScope, getScopedStats, getScopedBranches, getBranchOverview } from "@/lib/admin-data";
import { Building2, GraduationCap, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
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

  const stats = await getScopedStats(scope.branchIds);
  const branches = await getScopedBranches(scope.branchIds);
  const overview = await getBranchOverview(scope.branchIds);

  const cards = [
    { icon: Building2, label: "শাখা", value: branches.length },
    { icon: GraduationCap, label: "ছাত্র", value: stats.students },
    { icon: Users, label: "শিক্ষক", value: stats.teachers },
    { icon: Users, label: "স্টাফ", value: stats.staff },
  ];

  const title =
    scope.role === "principal"
      ? "আমার শাখা"
      : scope.role === "regional_supervisor"
      ? "আঞ্চলিক ওভারভিউ"
      : "গ্লোবাল ওভারভিউ";

  return (
    <AdminShell profile={profile!}>
      <h1 className="mb-4 font-serif-bn text-xl font-bold text-primary">{title}</h1>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-primary/10 bg-white p-4 text-center shadow-sm">
            <c.icon className="mx-auto mb-1 text-accent-gold" size={20} />
            <div className="font-serif-bn text-lg font-bold text-primary">{c.value}</div>
            <div className="text-xs text-charcoal/60">{c.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-serif-bn text-lg font-bold text-primary">
        {scope.role === "principal" ? "শাখার তথ্য" : "শাখাভিত্তিক বিবরণ"}
      </h2>

      {overview.length > 1 ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary/5 text-charcoal/70">
              <tr>
                <th className="px-4 py-3">কোড</th>
                <th className="px-4 py-3">শাখা</th>
                <th className="px-4 py-3 text-center">ছাত্র</th>
                <th className="px-4 py-3 text-center">শিক্ষক</th>
                <th className="px-4 py-3 text-center">স্টাফ</th>
              </tr>
            </thead>
            <tbody>
              {overview.map((b) => (
                <tr key={b.id} className="border-t border-primary/5">
                  <td className="px-4 py-2.5 text-charcoal/60">{b.code}</td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-charcoal">{b.name_bn}</div>
                    <div className="text-xs text-charcoal/40">{b.district || ""}</div>
                  </td>
                  <td className="px-4 py-2.5 text-center text-charcoal/80">{b.students}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal/80">{b.teachers}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal/80">{b.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-2">
          {branches.map((b: any) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <div className="font-serif-bn font-semibold text-primary">{b.name_bn}</div>
                <div className="text-xs text-charcoal/50">{b.code} · {b.district || ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
