import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Phone, Mail, ArrowLeft, Hash, Users, GraduationCap } from "lucide-react";

export const revalidate = 300;

async function getBranch(code: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("branches")
    .select("id, code, name_bn, name_en, type, division, district, address, phone, email, established_date, status")
    .eq("code", decodeURIComponent(code))
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: { code: string } }) {
  const branch = await getBranch(params.code);
  return { title: branch ? `${branch.name_bn} — তানযীমুল উম্মাহ` : "শাখা" };
}

export default async function BranchDetail({ params }: { params: { code: string } }) {
  const branch = await getBranch(params.code);
  if (!branch) notFound();

  const info = [
    { icon: Hash, label: "শাখা কোড", value: branch.code },
    { icon: Building2, label: "ধরন", value: branch.type || "—" },
    { icon: MapPin, label: "জেলা", value: branch.district || "—" },
    { icon: MapPin, label: "বিভাগ", value: branch.division || "—" },
    { icon: Phone, label: "ফোন", value: branch.phone || "—" },
    { icon: Mail, label: "ইমেইল", value: branch.email || "—" },
  ];

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Link
            href="/branches"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-cream/70 transition hover:text-accent-gold"
          >
            <ArrowLeft size={16} /> সব শাখায় ফিরে যান
          </Link>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-gold/15 text-accent-gold">
              <Building2 size={30} />
            </div>
            <div>
              <span className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-semibold text-accent-gold">
                {branch.code}
              </span>
              <h1 className="mt-2 font-serif-bn text-2xl font-bold leading-snug text-cream md:text-3xl">
                {branch.name_bn}
              </h1>
              {branch.name_en && (
                <p className="mt-1 text-sm text-cream/60">{branch.name_en}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="bg-off-white py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif-bn text-lg font-bold text-primary">শাখার তথ্য</h2>
          <SectionDivider className="my-4 !justify-start" />
          <div className="grid gap-4 sm:grid-cols-2">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-accent-gold">
                  <i.icon size={18} />
                </div>
                <div>
                  <div className="text-xs text-charcoal/50">{i.label}</div>
                  <div className="font-medium text-charcoal">{i.value}</div>
                </div>
              </div>
            ))}
          </div>

          {branch.address && (
            <div className="mt-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin size={16} className="text-accent-gold" /> ঠিকানা
              </div>
              <p className="text-sm text-charcoal/70">{branch.address}</p>
            </div>
          )}

          {/* Public stats placeholder — aggregate only, per privacy rules */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-primary/10 bg-white p-5 text-center shadow-sm">
              <GraduationCap className="mx-auto mb-1 text-accent-gold" size={22} />
              <div className="text-xs text-charcoal/50">শিক্ষার্থী</div>
              <div className="font-serif-bn text-lg font-bold text-primary">—</div>
            </div>
            <div className="rounded-2xl border border-primary/10 bg-white p-5 text-center shadow-sm">
              <Users className="mx-auto mb-1 text-accent-gold" size={22} />
              <div className="text-xs text-charcoal/50">শিক্ষক</div>
              <div className="font-serif-bn text-lg font-bold text-primary">—</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
