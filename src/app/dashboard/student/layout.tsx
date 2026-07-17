import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { GraduationCap, BookOpenText, ClipboardList } from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = [
    { icon: GraduationCap, label: "ড্যাশবোর্ড", href: "/dashboard" },
    { icon: BookOpenText, label: "হিফয অগ্রগতি", href: "/dashboard/student/hifz" },
    { icon: ClipboardList, label: "পরীক্ষার ফল", href: "/dashboard/student/exams" },
  ];
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm text-charcoal shadow-sm transition hover:border-accent-gold hover:text-primary"
            >
              <n.icon size={15} className="text-accent-gold" />
              {n.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
