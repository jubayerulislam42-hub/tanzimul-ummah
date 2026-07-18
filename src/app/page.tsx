import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import MosqueSilhouette from "@/components/MosqueSilhouette";
import Reveal from "@/components/Reveal";
import { CrescentMoon, Lantern, OrnateDivider } from "@/components/IslamicArt";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
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

interface MiniNotice {
  id: string;
  title: string;
  description: string | null;
  published_at: string | null;
}

async function getRecentNotices(): Promise<MiniNotice[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("notices")
    .select("id, title, description, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data as MiniNotice[]) ?? [];
}

export default async function Home({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  // OAuth safety net: if a provider redirects a code to the root (stale tab / fallback),
  // forward it to the callback route so the session exchange still happens.
  if (searchParams?.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(searchParams.code)}&next=${encodeURIComponent("/dashboard")}`);
  }

  const { branchCount, divisionCount } = await getStats();
  const recentNotices = await getRecentNotices();
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
      <section
        className="relative overflow-hidden hero-bg"
        style={{ backgroundImage: "url('/hero-makkah.jpg')" }}
      >
        {/* dark green overlay for legibility + theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary" />
        <div className="absolute inset-0 islamic-pattern opacity-40" />

        {/* floating decorative accents */}
        <CrescentMoon className="animate-floaty absolute right-6 top-8 h-14 w-14 text-accent-gold/80 md:h-20 md:w-20" />
        <Lantern className="animate-floaty absolute left-4 top-10 h-24 w-14 text-accent-gold/70 md:h-32 md:w-20" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center md:py-32">
          <Reveal>
            <span className="mb-5 inline-block rounded-full border border-accent-gold/40 bg-accent-gold/10 px-5 py-1.5 text-xs font-medium tracking-wide text-accent-gold backdrop-blur-sm">
              بسم الله الرحمن الرحيم
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-serif-bn text-4xl font-bold leading-tight text-cream drop-shadow-lg md:text-6xl">
              ইলমের আলো ছড়াক
              <span className="block text-gold-gradient">প্রতিটি হৃদয়ে</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-cream/85 md:text-lg">
              কুরআনের হিফয ও আধুনিক শিক্ষার সমন্বয়ে দেশব্যাপী {branchCount}+ শাখায়
              পরিচালিত একটি আদর্শ দ্বীনি শিক্ষা প্রতিষ্ঠান।
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/branches"
                className="rounded-full bg-accent-gold px-7 py-3.5 font-semibold text-primary shadow-gold transition hover:brightness-110"
              >
                শাখা খুঁজুন
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-cream/30 bg-white/10 px-7 py-3.5 font-semibold text-cream backdrop-blur-sm transition hover:border-accent-gold hover:text-accent-gold"
              >
                আমাদের সম্পর্কে
              </Link>
            </div>
          </Reveal>
        </div>
        <MosqueSilhouette className="relative h-14 w-full text-off-white/90 md:h-20" />
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
          <Reveal>
            <h2 className="text-center font-serif-bn text-2xl font-bold text-cream">
              এক নজরে তানযীমুল উম্মাহ
            </h2>
            <SectionDivider className="mb-8 mt-3" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-accent-gold/15 bg-primary p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-accent-gold"
                >
                  <s.icon className="mx-auto mb-2 text-accent-gold" size={26} />
                  <div className="font-serif-bn text-2xl font-bold text-cream">{s.value}</div>
                  <div className="mt-1 text-xs text-cream/60">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* QURANIC QUOTE */}
      <section className="bg-off-white py-16">
        <Reveal>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="font-serif text-2xl leading-loose text-primary md:text-3xl" dir="rtl">
              اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
            </p>
            <p className="mt-4 font-serif-bn text-base text-charcoal/70">
              “পড়ো তোমার রবের নামে, যিনি সৃষ্টি করেছেন।”
            </p>
            <p className="mt-2 text-xs text-accent-gold">— সূরা আল-আলাক, আয়াত ১</p>
            <OrnateDivider className="mx-auto mt-6 h-5 w-40 text-accent-gold" />
          </div>
        </Reveal>
      </section>

      {/* NOTICES + EVENTS */}
      <section className="bg-off-white pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Bell size={20} className="text-accent-gold" />
                <h3 className="font-serif-bn text-lg font-bold">সর্বশেষ নোটিশ</h3>
              </div>
              <Link href="/notices" className="text-xs text-accent-gold hover:underline">সব দেখুন</Link>
            </div>
            {recentNotices.length === 0 ? (
              <p className="rounded-lg bg-primary/5 px-4 py-6 text-center text-sm text-charcoal/50">
                এখনও কোনো নোটিশ প্রকাশ করা হয়নি।
              </p>
            ) : (
              <ul className="space-y-3">
                {recentNotices.map((n) => (
                  <li key={n.id} className="border-b border-primary/5 pb-3 last:border-0 last:pb-0">
                    <h4 className="font-medium text-charcoal">{n.title}</h4>
                    {n.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-charcoal/60">{n.description}</p>
                    )}
                    {n.published_at && (
                      <p className="mt-1 text-[11px] text-charcoal/40">
                        {new Date(n.published_at).toLocaleDateString("bn-BD")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
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
