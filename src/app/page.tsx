import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import MosqueSilhouette from "@/components/MosqueSilhouette";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Users,
  BookOpenText,
  Bell,
  CalendarDays,
  MapPin,
  ArrowLeft,
} from "lucide-react";

export const revalidate = 300;

async function getStats() {
  const supabase = createClient();
  const { count: branchCount } = await supabase
    .from("branches")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  const { data: divisions } = await supabase
    .from("branches")
    .select("division")
    .eq("status", "active");
  const divisionCount = new Set((divisions ?? []).map((d) => d.division)).size;
  return { branchCount: branchCount ?? 0, divisionCount };
}

export default async function Home() {
  const { branchCount, divisionCount } = await getStats();

  const quickLinks = [
    { icon: Building2, label: "শাখাসমূহ", href: "/branches", desc: "১২৫+ শাখা" },
    { icon: BookOpenText, label: "ভর্তি তথ্য", href: "/admission", desc: "আবেদন করুন" },
    { icon: Bell, label: "নোটিশ", href: "/notices", desc: "সর্বশেষ আপডেট" },
    { icon: Users, label: "লগইন", href: "/login", desc: "ড্যাশবোর্ড" },
  ];

  const stats = [
    { icon: Building2, value: `${branchCount}+`, label: "শাখা" },
    { icon: MapPin, value: `${divisionCount}`, label: "বিভাগ" },
    { icon: GraduationCap, value: "১০,০০০+", label: "শিক্ষার্থী" },
    { icon: Users, value: "১,৫০০+", label: "শিক্ষক-কর্মকর্তা" },
  ];

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-primary islamic-pattern">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center md:py-28">
          <span className="mb-4 rounded-full border border-accent-gold/30 bg-accent-gold/10 px-4 py-1.5 text-xs font-medium text-accent-gold">
            بسم الله الرحمن الرحيم
          </span>
          <h1 className="font-serif-bn text-3xl font-bold leading-tight text-cream md:text-5xl">
            ইলমের আলো ছড়াক
            <span className="block text-accent-gold">প্রতিটি হৃদয়ে</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cream/75 md:text-base">
            কুরআনের হিফয ও আধুনিক শিক্ষার সমন্বয়ে দেশব্যাপী {branchCount}+ শাখায়
            পরিচালিত একটি আদর্শ দ্বীনি শিক্ষা প্রতিষ্ঠান।
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/branches"
              className="rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110"
            >
              শাখা খুঁজুন
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-cream/25 px-6 py-3 font-semibold text-cream transition hover:border-accent-gold hover:text-accent-gold"
            >
              আমাদের সম্পর্কে
            </Link>
          </div>
        </div>
        <MosqueSilhouette className="h-14 w-full text-off-white md:h-20" />
      </section>

      {/* QUICK LINKS */}
      <section className="bg-off-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="group rounded-2xl border border-primary/10 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-accent-gold hover:shadow-lg"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary transition group-hover:bg-accent-gold/15">
                  <q.icon size={22} />
                </div>
                <div className="font-serif-bn font-bold text-primary">{q.label}</div>
                <div className="mt-1 text-xs text-charcoal/60">{q.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary-light py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif-bn text-2xl font-bold text-cream">
            এক নজরে তানযীমুল উম্মাহ
          </h2>
          <SectionDivider className="mb-8 mt-3" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-accent-gold/15 bg-primary p-6 text-center"
              >
                <s.icon className="mx-auto mb-2 text-accent-gold" size={26} />
                <div className="font-serif-bn text-2xl font-bold text-cream">{s.value}</div>
                <div className="mt-1 text-xs text-cream/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QURANIC QUOTE */}
      <section className="bg-off-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-serif text-2xl leading-loose text-primary md:text-3xl" dir="rtl">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>
          <p className="mt-4 font-serif-bn text-base text-charcoal/70">
            “পড়ো তোমার রবের নামে, যিনি সৃষ্টি করেছেন।”
          </p>
          <p className="mt-2 text-xs text-accent-gold">— সূরা আল-আলাক, আয়াত ১</p>
        </div>
      </section>

      {/* NOTICES + EVENTS placeholder (data-driven later) */}
      <section className="bg-off-white pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Bell size={20} className="text-accent-gold" />
              <h3 className="font-serif-bn text-lg font-bold">সর্বশেষ নোটিশ</h3>
            </div>
            <p className="rounded-lg bg-primary/5 px-4 py-6 text-center text-sm text-charcoal/50">
              এখনও কোনো নোটিশ প্রকাশ করা হয়নি।
            </p>
          </div>
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <CalendarDays size={20} className="text-accent-gold" />
              <h3 className="font-serif-bn text-lg font-bold">আসন্ন কার্যক্রম</h3>
            </div>
            <p className="rounded-lg bg-primary/5 px-4 py-6 text-center text-sm text-charcoal/50">
              শীঘ্রই আসছে।
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
