import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "./layout";
import { GraduationCap, Users, BookOpenText, Bell, Building2, ShieldCheck, CalendarDays } from "lucide-react";

const tilesByRole: Record<string, { icon: any; label: string; href: string }[]> = {
  student: [
    { icon: GraduationCap, label: "আমার হিফয অগ্রগতি", href: "#" },
    { icon: BookOpenText, label: "পরীক্ষার ফল", href: "#" },
    { icon: Bell, label: "নোটিশ", href: "/notices" },
  ],
  staff: [
    { icon: Users, label: "শিক্ষার্থী ব্যবস্থাপনা", href: "#" },
    { icon: Bell, label: "নোটিশ", href: "/notices" },
    { icon: CalendarDays, label: "হাজিরা", href: "#" },
  ],
  teacher: [
    { icon: Users, label: "আমার ক্লাস", href: "#" },
    { icon: GraduationCap, label: "শিক্ষার্থী অগ্রগতি", href: "#" },
    { icon: CalendarDays, label: "হাজিরা", href: "#" },
  ],
  principal: [
    { icon: ShieldCheck, label: "অ্যাডমিন প্যানেল", href: "/dashboard/admin" },
    { icon: Building2, label: "শাখা ওভারভিউ", href: "#" },
    { icon: Users, label: "শিক্ষক-কর্মচারী", href: "#" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
  ],
  regional_supervisor: [
    { icon: ShieldCheck, label: "অ্যাডমিন প্যানেল", href: "/dashboard/admin" },
    { icon: Building2, label: "আঞ্চলিক শাখাসমূহ", href: "/branches" },
    { icon: Users, label: "প্রতিবেদন", href: "#" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
  ],
  super_admin: [
    { icon: ShieldCheck, label: "অ্যাডমিন প্যানেল", href: "/dashboard/admin" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
    { icon: Building2, label: "সব শাখা", href: "/branches" },
    { icon: Users, label: "ব্যবহারকারী ব্যবস্থাপনা", href: "#" },
  ],
};

export default async function DashboardPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");

  // Safety net: ensure a profile row exists (handles sessions created before provisioning ran)
  let finalProfile = profile;
  if (!finalProfile) {
    const supabase = createClient();
    await supabase.rpc("provision_user_on_login");
    const { data } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, photo_url, role, branch_id, status")
      .eq("id", user.id)
      .single();
    finalProfile = (data as any) ?? null;
  }

  const role = finalProfile?.role ?? "student";
  const isAdmin = role === "principal" || role === "regional_supervisor" || role === "super_admin";

  // New users: admins pick branch via /onboarding/admin; others via /onboarding role select
  if (finalProfile && (!role || !finalProfile.branch_id)) {
    redirect(isAdmin ? "/onboarding/admin" : "/onboarding");
  }

  const tiles = tilesByRole[role] ?? tilesByRole.student;

  return (
    <DashboardLayout profile={finalProfile}>
      <h2 className="mb-4 font-serif-bn text-lg font-bold text-primary">দ্রুত কাজ</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <a
            key={t.label}
            href={t.href}
            className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent-gold hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold">
              <t.icon size={20} />
            </div>
            <span className="font-medium text-charcoal">{t.label}</span>
          </a>
        ))}
      </div>

      <p className="mt-8 rounded-2xl bg-primary/5 px-4 py-6 text-center text-sm text-charcoal/50">
        বিস্তারিত মডিউলগুলো পর্যায়ক্রমে যুক্ত করা হবে।
      </p>
    </DashboardLayout>
  );
}
