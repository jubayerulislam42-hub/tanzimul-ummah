import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { createClient } from "@/lib/supabase/server";
import { BookOpenText, Target, Heart, Users } from "lucide-react";
import { CrescentMoon } from "@/components/IslamicArt";

export const revalidate = 300;
export const metadata = { title: "পরিচিতি — তানযীমুল উম্মাহ হিফয মাদরাসা" };

async function getStats() {
  const supabase = createClient();
  const { count } = await supabase
    .from("branches")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");
  return count ?? 0;
}

export default async function AboutPage() {
  const branchCount = await getStats();

  const pillars = [
    { icon: BookOpenText, title: "কুরআনের হিফয", desc: "সঠিক তাজবীদ-তারতীলসহ পূর্ণ কুরআন মুখস্থ করানোর ব্যবস্থা।" },
    { icon: Target, title: "আধুনিক শিক্ষা", desc: "দ্বীনি শিক্ষার পাশাপাশি আধুনিক বিজ্ঞান ও ভাষার সমন্বয়।" },
    { icon: Heart, title: "আখলাক গঠন", desc: "ইসলামি শিষ্টাচার ও চরিত্রের সুষ্ঠু বিকাশ।" },
    { icon: Users, title: "সমাজ গঠন", desc: "দ্বীনের দাওয়াত ও মানবসেবায় নিবেদিত প্রজন্ম।" },
  ];

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="hero-bg relative" style={{ backgroundImage: "url('/hero-makkah.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-primary" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
          <CrescentMoon className="animate-floaty mx-auto mb-4 h-12 w-12 text-accent-gold/80" />
          <h1 className="font-serif-bn text-3xl font-bold text-cream md:text-4xl drop-shadow-lg">
            আমাদের পরিচিতি
          </h1>
          <SectionDivider className="my-4" />
        </div>
      </section>

      {/* Intro */}
      <section className="bg-off-white py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-base leading-relaxed text-charcoal/80 md:text-lg">
            তানযীমুল উম্মাহ হিফয মাদরাসা{' '}
            <span className="font-semibold text-primary">
              গ্লোবাল ইসলামিক দাওয়াহ ফাউন্ডেশন
            </span>{' '}
            এর অধীনে পরিচালিত একটি দ্বীনি শিক্ষা প্রতিষ্ঠান। সারা দেশে{' '}
            <span className="font-bold text-accent-gold-dark">{branchCount}+</span> শাখায়
            আমরা কুরআনের আলোয় প্রজন্ম গড়ার প্রত্যয়ে কাজ করে যাচ্ছি।
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-off-white pb-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-6 text-center font-serif-bn text-xl font-bold text-primary">
            আমাদের মূলনীতি
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-primary/10 bg-white p-5 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold">
                  <p.icon size={22} />
                </div>
                <h3 className="font-serif-bn font-bold text-primary">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
