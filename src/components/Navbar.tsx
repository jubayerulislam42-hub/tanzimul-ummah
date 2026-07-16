"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/branches", label: "শাখাসমূহ" },
  { href: "/about", label: "পরিচিতি" },
  { href: "/notices", label: "নোটিশ" },
  { href: "/contact", label: "যোগাযোগ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-accent-gold/15 bg-primary/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/15 text-xl">
            🕌
          </span>
          <span className="font-serif-bn text-base font-bold leading-tight text-cream sm:text-lg">
            তানযীমুল উম্মাহ
            <span className="block text-[10px] font-normal text-accent-gold sm:text-xs">
              হিফয মাদরাসা
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/80 transition hover:text-accent-gold"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold px-4 py-2 text-sm font-semibold text-primary transition hover:brightness-110"
          >
            <LogIn size={16} /> লগইন
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-cream md:hidden"
          aria-label="মেনু"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-accent-gold/15 bg-primary px-4 py-3 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-cream/80 transition hover:text-accent-gold"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-gold px-4 py-2 text-sm font-semibold text-primary"
          >
            <LogIn size={16} /> লগইন
          </Link>
        </div>
      )}
    </header>
  );
}
