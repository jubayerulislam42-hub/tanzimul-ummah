import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, Users, BookOpenText } from "lucide-react";

export const metadata = { title: "রোল নির্বাচন — তানযীমুল উম্মাহ" };

const roles = [
  { icon: GraduationCap, title: "স্টুডেন্ট", desc: "ছাত্র হিসেবে রেজিস্ট্রেশন করুন", href: "/onboarding/student" },
  { icon: BookOpenText, title: "টিচার", desc: "শিক্ষক হিসেবে রেজিস্ট্রেশন করুন", href: "/onboarding/teacher" },
  { icon: Users, title: "স্টাফ", desc: "স্টাফ হিসেবে রেজিস্ট্রেশন করুন", href: "/onboarding/staff" },
];

export default function OnboardingPage() {
  return (
    <>
      <Navbar />
      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h1 className="font-serif-bn text-2xl font-bold text-cream md:text-3xl">
            আপনার ভূমিকা নির্বাচন করুন
          </h1>
          <p className="mt-3 text-sm text-cream/70">
            রেজিস্ট্রেশন সম্পন্ন করতে নিচ থেকে আপনার ভূমিকা বেছে নিন।
          </p>
        </div>
      </section>

      <section className="bg-off-white py-12">
        <div className="mx-auto grid max-w-3xl gap-4 px-4 sm:grid-cols-3">
          {roles.map((r) => (
            <a
              key={r.href}
              href={r.href}
              className="group flex flex-col items-center rounded-2xl border border-primary/10 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-accent-gold hover:shadow-lg"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold transition group-hover:bg-accent-gold/25">
                <r.icon size={26} />
              </div>
              <h3 className="font-serif-bn text-lg font-bold text-primary">{r.title}</h3>
              <p className="mt-1 text-xs text-charcoal/60">{r.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
