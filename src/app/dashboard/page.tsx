import { redirect } from "next/navigation";
import { getSessionProfile, getMyStudentRecord, getMyStaffRecord } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentProfileCard from "@/components/StudentProfileCard";
import StaffProfileCard from "@/components/StaffProfileCard";
import { GraduationCap, Users, BookOpenText, Bell, Building2, ShieldCheck, CalendarDays, Clock, ClipboardList } from "lucide-react";

const tilesByRole: Record<string, { icon: any; label: string; href: string }[]> = {
  student: [
    { icon: GraduationCap, label: "আমার হিফয অগ্রগতি", href: "/dashboard/student/hifz" },
    { icon: BookOpenText, label: "পরীক্ষার ফল", href: "/dashboard/student/exams" },
    { icon: Bell, label: "নোটিশ", href: "/notices" },
  ],
  staff: [
    { icon: Users, label: "শিক্ষার্থী ব্যবস্থাপনা", href: "/dashboard/teacher/students" },
    { icon: Bell, label: "নোটিশ", href: "/notices" },
    { icon: CalendarDays, label: "হাজিরা", href: "/dashboard/attendance" },
  ],
  teacher: [
    { icon: Users, label: "আমার শিক্ষার্থীরা", href: "/dashboard/teacher/students" },
    { icon: GraduationCap, label: "শিক্ষার্থী অগ্রগতি", href: "/dashboard/admin/hifz" },
    { icon: CalendarDays, label: "হাজিরা", href: "/dashboard/attendance" },
  ],
  principal: [
    { icon: ShieldCheck, label: "অ্যাডমিন প্যানেল", href: "/dashboard/admin" },
    { icon: Building2, label: "শাখা ওভারভিউ", href: "/dashboard/admin" },
    { icon: BookOpenText, label: "হিফয এন্ট্রি", href: "/dashboard/admin/hifz" },
    { icon: ClipboardList, label: "পরীক্ষার ফল এন্ট্রি", href: "/dashboard/admin/exams" },
  ],
  regional_supervisor: [
    { icon: ShieldCheck, label: "অ্যাডমিন প্যানেল", href: "/dashboard/admin" },
    { icon: Building2, label: "আঞ্চলিক শাখাসমূহ", href: "/branches" },
    { icon: BookOpenText, label: "হিফয এন্ট্রি", href: "/dashboard/admin/hifz" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
  ],
  super_admin: [
    { icon: ShieldCheck, label: "অ্যাডমিন প্যানেল", href: "/dashboard/admin" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
    { icon: Building2, label: "সব শাখা", href: "/branches" },
    { icon: Users, label: "ব্যবহারকারী ব্যবস্থাপনা", href: "/dashboard/admin/whitelist" },
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
  const status = finalProfile?.status ?? "pending";

  // Pending (not-yet-approved) non-admins must NOT reach the dashboard.
  // Show an "awaiting approval" notice instead.
  if (finalProfile && status === "pending" && !isAdmin) {
    return (
      <main className="min-h-screen bg-off-white">
        <Navbar />
        <div className="mx-auto flex max-w-md flex-col px-4 py-16">
          <div className="rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Clock size={28} />
            </div>
            <h2 className="font-serif-bn text-xl font-bold text-primary">অনুমোদনের অপেক্ষায়</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              আপনার আবেদনটি পর্যালোচনাধীন। শাখা প্রশাসন বা আঞ্চলিক তত্ত্বাবধায়ক অনুমোদন দিলে
              আপনি ড্যাশবোর্ডে প্রবেশ করতে পারবেন।
            </p>
            <p className="mt-4 text-xs text-charcoal/40">ইমেইল: {finalProfile.email}</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // New users: admins pick branch via /onboarding/admin; others via /onboarding role select.
  // NOTE: super_admin intentionally has NO branch_id (governs all branches) and must NOT be
  // bounced to onboarding forever. Only non-admins require a branch to proceed.
  if (finalProfile && !isAdmin && !finalProfile.branch_id) {
    redirect("/onboarding");
  }

  const tiles = tilesByRole[role] ?? tilesByRole.student;

  // Load the signed-in user's own record to show a profile card.
  const studentRecord =
    role === "student" && user?.id ? await getMyStudentRecord(user.id) : null;
  const staffRecord =
    (role === "staff" || role === "teacher") && user?.id
      ? await getMyStaffRecord(user.id, role === "teacher" ? "teachers" : "staff")
      : null;

  return (
    <main className="min-h-screen bg-off-white">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-4 font-serif-bn text-lg font-bold text-primary">দ্রুত কাজ</h2>

        {studentRecord && (
          <div className="mb-6">
            <StudentProfileCard record={studentRecord} />
          </div>
        )}
        {staffRecord && (
          <div className="mb-6">
            <StaffProfileCard record={staffRecord} />
          </div>
        )}

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

        {(role === "student" || role === "staff" || role === "teacher") && (
          <p className="mt-8 rounded-2xl bg-primary/5 px-4 py-6 text-center text-sm text-charcoal/50">
            আপনার মডিউলগুলো শীঘ্রই যুক্ত করা হবে।
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}
