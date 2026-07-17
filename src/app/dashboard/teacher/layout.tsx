import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, GraduationCap, ClipboardList } from "lucide-react";

export default function TeacherStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = [
    { icon: GraduationCap, label: "ড্যাশবোর্ড", href: "/dashboard" },
    { icon: Users, label: "আমার শিক্ষার্থীরা", href: "/dashboard/teacher/students" },
    { icon: ClipboardList, label: "হিফয এন্ট্রি", href: "/dashboard/admin/hifz" },
  ];
  const isStaff = nav[1].href.includes("teacher") === false;
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
