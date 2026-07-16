import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignOutButton from "@/components/SignOutButton";
import { type Profile } from "@/lib/auth";

const roleLabels: Record<string, string> = {
  student: "শিক্ষার্থী",
  staff: "স্টাফ",
  teacher: "শিক্ষক",
  principal: "অধ্যক্ষ",
  regional_supervisor: "আঞ্চলিক তত্ত্বাবধায়ক",
  super_admin: "সুপার অ্যাডমিন",
};

export default function DashboardLayout({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <section className="min-h-[70vh] bg-off-white py-10">
        <div className="mx-auto max-w-5xl px-4">
          {/* Header card */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary/10 bg-primary p-6 text-cream sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-accent-gold">
                {roleLabels[profile.role] ?? profile.role}
              </p>
              <h1 className="font-serif-bn text-xl font-bold">
                {profile.full_name || profile.email}
              </h1>
              <p className="mt-1 text-sm text-cream/60">{profile.email}</p>
            </div>
            <SignOutButton />
          </div>

          {children}
        </div>
      </section>
      <Footer />
    </>
  );
}
