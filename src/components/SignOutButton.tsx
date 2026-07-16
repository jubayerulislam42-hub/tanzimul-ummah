"use client";

import { LogOut } from "lucide-react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  const signOut = async () => {
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <button
      onClick={signOut}
      className={`inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-3 py-1.5 text-sm text-cream/80 transition hover:border-accent-gold hover:text-accent-gold ${className}`}
    >
      <LogOut size={16} /> লগআউট
    </button>
  );
}
