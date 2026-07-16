import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

export const revalidate = 120;
export const metadata = { title: "নোটিশ — তানযীমুল উম্মাহ হিফয মাদরাসা" };

interface Notice {
  id: string;
  title: string;
  description: string | null;
  branch_id: string | null;
  published_at: string | null;
}

async function getNotices(): Promise<Notice[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("notices")
    .select("id, title, description, branch_id, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(50);
  return (data as Notice[]) ?? [];
}

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <>
      <Navbar />

      <section className="bg-primary islamic-pattern">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h1 className="font-serif-bn text-3xl font-bold text-cream md:text-4xl">
            নোটিশ বোর্ড
          </h1>
          <SectionDivider className="my-4" />
        </div>
      </section>

      <section className="bg-off-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          {notices.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-charcoal/50 shadow-sm">
              এখনও কোনো নোটিশ প্রকাশ করা হয়নি।
            </p>
          ) : (
            <div className="space-y-4">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif-bn font-bold text-primary">{n.title}</h3>
                    {n.description && (
                      <p className="mt-1 text-sm text-charcoal/70">{n.description}</p>
                    )}
                    {n.published_at && (
                      <p className="mt-2 text-xs text-charcoal/40">
                        {new Date(n.published_at).toLocaleDateString("bn-BD")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
