"use client";

import { createClient } from "@/lib/supabase/client";
import { LogIn } from "lucide-react";

export default function AuthButton({
  next = "/dashboard",
  className = "",
  label = "Google দিয়ে লগইন করুন",
}: {
  next?: string;
  className?: string;
  label?: string;
}) {
  // NOTE: We do NOT auto-forward a stray ?code= to /auth/callback here.
  // A stale code from a previous (desktop-view) login re-triggered bad_oauth_state
  // on mobile view. The provider always redirects to the exact redirectTo, which
  // handles the exchange.

  const signIn = async () => {
    // Clear any stale Supabase auth cookies so each OAuth attempt is a fresh PKCE flow.
    // Prevents "state already used / bad_oauth_state" when switching between
    // desktop and mobile view (which share the same browser storage).
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const name = c.split("=")[0].trim();
      if (
        name.startsWith("sb-") ||
        name.startsWith("supabase") ||
        name === "next_url"
      ) {
        document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
        document.cookie = `${name}=; path=/; max-age=0; samesite=lax; domain=${window.location.hostname}`;
      }
    }

    const supabase = createClient();
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
