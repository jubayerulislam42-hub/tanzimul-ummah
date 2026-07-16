import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import BranchExplorer from "@/components/BranchExplorer";
import { type Branch } from "@/components/BranchCard";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;
export const metadata = { title: "শাখাসমূহ — তানযীমুল উম্মাহ হিফয মাদরাসা" };

async function getBranches(): Promise<Branch[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("branches")
    .select("id, code, name_bn, name_en, type, division, district, address")
    .eq("status", "active")
    .order("code");
  return (data as Branch[]) ?? [];
}

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h1 className="font-serif-bn text-3xl font-bold text-cream md:text-4xl">
            আমাদের শাখাসমূহ
          </h1>
          <SectionDivider className="my-4" />
          <p className="mx-auto max-w-2xl text-sm text-cream/75">
            সারা বাংলাদেশে {branches.length}+ শাখায় ছড়িয়ে আছে তানযীমুল উম্মাহর
            শিক্ষা কার্যক্রম। আপনার নিকটস্থ শাখা খুঁজে নিন।
          </p>
        </div>
      </section>

      {/* Explorer */}
      <section className="bg-off-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <BranchExplorer branches={branches} />
        </div>
      </section>

      <Footer />
    </>
  );
}
