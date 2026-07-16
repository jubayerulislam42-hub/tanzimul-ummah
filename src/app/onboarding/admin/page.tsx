import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BranchSelect from "@/components/BranchSelect";
import AdminBranchForm from "@/components/AdminBranchForm";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOnboarding() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  const role = profile?.role;
  if (role !== "principal" && role !== "regional_supervisor" && role !== "super_admin") {
    redirect("/onboarding");
  }

  return (
    <>
      <Navbar />
      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="flex items-center gap-2 text-accent-gold">
            <ShieldCheck size={20} />
            <span className="text-sm">
              {role === "super_admin" ? "সুপার অ্যাডমিন" : role === "regional_supervisor" ? "আঞ্চলিক তত্ত্বাবধায়ক" : "অধ্যক্ষ"} সেটআপ
            </span>
          </div>
          <h1 className="mt-2 font-serif-bn text-2xl font-bold text-cream">
            আপনার শাখা নির্বাচন করুন
          </h1>
          <p className="mt-2 text-sm text-cream/70">
            এই শাখা অনুযায়ী আপনার অ্যাডমিন প্যানেল কাজ করবে।
          </p>
        </div>
      </section>

      <section className="bg-off-white py-10">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
            <AdminBranchForm role={role!} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
