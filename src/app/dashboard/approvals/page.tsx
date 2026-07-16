import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/app/dashboard/layout";
import ApprovalsList from "@/components/ApprovalsList";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");

  const role = profile?.role;
  if (role !== "principal" && role !== "regional_supervisor" && role !== "super_admin") {
    redirect("/dashboard");
  }

  const supabase = createClient();
  const { data } = await supabase.rpc("get_pending_approvals");
  const items = (data as any[]) ?? [];

  return (
    <DashboardLayout profile={profile!}>
      <h2 className="mb-4 font-serif-bn text-lg font-bold text-primary">অনুমোদনের অপেক্ষায়</h2>
      <ApprovalsList items={items} />
    </DashboardLayout>
  );
}
