import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const { user } = await getSessionProfile();
  if (!user) redirect("/login");
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/15 text-accent-gold">
          <CalendarDays size={26} />
        </div>
        <h1 className="font-serif-bn text-xl font-bold text-primary">হাজিরা</h1>
        <p className="mt-3 rounded-2xl bg-white px-6 py-10 text-sm text-charcoal/50 shadow-sm">
          হাজিরা মডিউলটি শীঘ্রই যুক্ত করা হবে।
        </p>
      </div>
      <Footer />
    </>
  );
}
