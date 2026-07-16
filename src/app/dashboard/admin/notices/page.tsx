import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import { requireScope } from "@/lib/admin-data";
import NoticeForm from "@/components/NoticeForm";

export const dynamic = "force-dynamic";

export default async function AdminNotices() {
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

  const isGlobal = scope.role === "super_admin";

  return (
    <AdminShell profile={profile!}>
      <h1 className="mb-4 font-serif-bn text-xl font-bold text-primary">নোটিশ পোস্ট</h1>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
        <NoticeForm
          global={isGlobal}
          defaultBranchId={scope.role === "principal" ? scope.branchId : null}
        />
      </div>
      <p className="mt-3 text-xs text-charcoal/50">
        {isGlobal
          ? "এই নোটিশটি সব শাখায় প্রদর্শিত হবে।"
          : scope.role === "principal"
          ? "এই নোটিশটি আপনার শাখায় প্রদর্শিত হবে।"
          : "এই নোটিশটি আপনার বিভাগের শাখায় প্রদর্শিত হবে।"}
      </p>
    </AdminShell>
  );
}
