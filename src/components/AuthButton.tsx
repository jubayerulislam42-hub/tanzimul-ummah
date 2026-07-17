"use client";

import { createClient } from "@/lib/supabase/client";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthButton({
  next = "/dashboard",
  className = "",
  label = "Google দিয়ে লগইন করুন",
}: {
  next?: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If we arrived at the root with a ?code=... (provider fallback to site_url),
  // forward it to the callback route so the session still exchanges.
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      router.replace(`/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`);
    }
  }, [searchParams, next, router]);

  const signIn = async () => {
    const supabase = createClient();
    // Pass `next` via a cookie (not the redirectTo query string) so redirectTo is a
    // clean path that matches Supabase's uri_allow_list exactly.
    document.cookie = `next_url=${encodeURIComponent(next)}; path=/; max-age=600; samesite=lax`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signIn}
      className={`inline-flex items-center gap-2 rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 ${className}`}
    >
      <LogIn size={18} />
      {label}
    </button>
  );
}
