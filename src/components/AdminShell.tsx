import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignOutButton from "@/components/SignOutButton";
import { type Profile } from "@/lib/auth";
import { Users, ShieldCheck, Bell, Building2, GraduationCap, ListChecks } from "lucide-react";

const roleLabels: Record<string, string> = {
  principal: "অধ্যক্ষ",
  regional_supervisor: "আঞ্চলিক তত্ত্বাবধায়ক",
  super_admin: "সুপার অ্যাডমিন",
};

const navByRole: Record<string, { icon: any; label: string; href: string }[]> = {
  principal: [
    { icon: Building2, label: "আমার শাখা", href: "/dashboard/admin" },
    { icon: GraduationCap, label: "ছাত্রবৃন্দ", href: "/dashboard/admin/students" },
    { icon: Users, label: "শিক্ষক ও স্টাফ", href: "/dashboard/admin/staff" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
    { icon: Bell, label: "নোটিশ", href: "/dashboard/admin/notices" },
  ],
  regional_supervisor: [
    { icon: Building2, label: "বিভাগের শাখাসমূহ", href: "/dashboard/admin" },
    { icon: ListChecks, label: "অনুমোদন", href: "/dashboard/approvals" },
    { icon: Bell, label: "নোটিশ", href: "/dashboard/admin/notices" },
  ],
  super_admin: [
    { icon: Building2, label: "শাখা ব্যবস্থাপনা", href: "/dashboard/admin" },
    { icon: GraduationCap, label: "সব ছাত্র", href: "/dashboard/admin/students" },
    { icon: Users, label: "সব ইউজার", href: "/dashboard/admin/staff" },
    { icon: ShieldCheck, label: "অনুমোদন", href: "/dashboard/approvals" },
    { icon: Bell, label: "নোটিশ", href: "/dashboard/admin/notices" },
    { icon: ListChecks, label: "হোয়াইটলিস্ট", href: "/dashboard/admin/whitelist" },
  ],
};

export default function AdminShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const nav = navByRole[profile.role] ?? navByRole.principal;
  return (
    <>
      <Navbar />
      <section className="bg-off-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
          {/* Sidebar */}
          <aside className="md:w-64 md:shrink-0">
            <div className="rounded-2xl border border-primary/10 bg-primary p-4 text-cream">
              <p className="text-xs text-accent-gold">{roleLabels[profile.role] ?? profile.role}</p>
              <h2 className="font-serif-bn text-base font-bold">{profile.full_name || profile.email}</h2>
              <SignOutButton className="mt-3" />
            </div>
            <nav className="mt-3 space-y-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/80 transition hover:bg-accent-gold/10 hover:text-accent-gold-dark"
                >
                  <n.icon size={17} className="text-accent-gold" /> {n.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </section>
      <Footer />
    </>
  );
}
