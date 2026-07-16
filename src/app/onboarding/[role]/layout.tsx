import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const titles: Record<string, string> = {
  student: "স্টুডেন্ট রেজিস্ট্রেশন",
  teacher: "টিচার রেজিস্ট্রেশন",
  staff: "স্টাফ রেজিস্ট্রেশন",
};

export default function OnboardingRoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { role: string };
}) {
  const title = titles[params.role] ?? "রেজিস্ট্রেশন";
  return (
    <>
      <Navbar />
      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link
            href="/onboarding"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-cream/70 transition hover:text-accent-gold"
          >
            <ArrowLeft size={16} /> ফিরে যান
          </Link>
          <h1 className="font-serif-bn text-2xl font-bold text-cream">{title}</h1>
        </div>
      </section>
      <section className="bg-off-white py-10">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
            {children}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
