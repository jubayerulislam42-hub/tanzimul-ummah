import AuthButton from "@/components/AuthButton";
import SectionDivider from "@/components/SectionDivider";
import Logo from "@/components/Logo";
import { Suspense } from "react";

export const metadata = { title: "লগইন — তানযীমুল উম্মাহ" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-16 islamic-pattern">
      <div className="w-full max-w-md rounded-3xl border border-accent-gold/20 bg-primary-light p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold/10 ring-1 ring-accent-gold/25">
          <Logo size={64} />
        </div>
        <h1 className="font-serif-bn text-2xl font-bold text-cream">
          তানযীমুল উম্মাহ হিফয মাদরাসা
        </h1>
        <p className="mt-2 text-sm text-cream/70">
          আপনার অ্যাকাউন্টে প্রবেশ করতে Google দিয়ে লগইন করুন
        </p>

        <SectionDivider className="my-6" />

        {searchParams?.error && (
          <p className="mb-4 rounded-lg bg-red-500/15 px-4 py-2 text-sm text-red-300">
            লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।
          </p>
        )}

        <Suspense fallback={<div className="h-12 w-full rounded-full bg-accent-gold/40" />}>
          <AuthButton next="/dashboard" className="w-full justify-center" />
        </Suspense>

        <p className="mt-6 text-xs text-cream/50">
          অনুমোদিত ব্যবহারকারীরা স্বয়ংক্রিয়ভাবে তাদের ড্যাশবোর্ডে প্রবেশ করবেন।
        </p>
      </div>
    </main>
  );
}
