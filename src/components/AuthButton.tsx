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
  const signIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
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
