import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import WhitelistManager from "@/components/WhitelistManager";

export const dynamic = "force-dynamic";

export default async function AdminWhitelist() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (profile?.role !== "super_admin") redirect("/dashboard");

  return (
    <AdminShell profile={profile}>
      <h1 className="mb-4 font-serif-bn text-xl font-bold text-primary">হোয়াইটলিস্ট ব্যবস্থাপনা</h1>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
        <WhitelistManager />
      </div>
    </AdminShell>
  );
}
