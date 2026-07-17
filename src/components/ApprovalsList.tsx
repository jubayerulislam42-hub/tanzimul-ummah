"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

interface Pending {
  user_id: string;
  email: string;
  full_name: string | null;
  role: string;
  branch_id: string;
  record_name: string | null;
  submitted_at: string;
  kind: string;
}

const roleLabel: Record<string, string> = {
  student: "ছাত্র",
  teacher: "শিক্ষক",
  staff: "স্টাফ",
  profile: "নিবন্ধন",
};

const kindLabel: Record<string, string> = {
  student: "ছাত্র রেকর্ড",
  teacher: "শিক্ষক রেকর্ড",
  staff: "স্টাফ রেকর্ড",
  profile: "অসম্পূর্ণ নিবন্ধন",
};

export default function ApprovalsList({ items }: { items: Pending[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  const approve = async (id: string) => {
    setBusy(id);
    const supabase = createClient();
    const { error } = await supabase.rpc("approve_user", { p_user_id: id });
    if (!error) {
      setDone((d) => new Set(d).add(id));
    } else {
      alert("অনুমোদন ব্যর্থ: " + error.message);
    }
    setBusy(null);
  };

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-charcoal/50 shadow-sm">
        অনুমোদনের জন্য কোনো অপেক্ষমান আবেদন নেই।
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div
          key={it.user_id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm"
        >
          <div>
            <div className="font-serif-bn font-bold text-primary">
              {it.record_name || it.full_name || it.email}
            </div>
            <div className="mt-0.5 text-xs text-charcoal/60">
              {roleLabel[it.role] ?? it.role} · {kindLabel[it.kind] ?? it.kind} · {it.email}
            </div>
          </div>
          {done.has(it.user_id) ? (
            <span className="rounded-full bg-green-600/15 px-3 py-1.5 text-xs font-semibold text-green-700">
              অনুমোদিত
            </span>
          ) : (
            <button
              onClick={() => approve(it.user_id)}
              disabled={busy === it.user_id}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold px-4 py-2 text-xs font-semibold text-primary transition hover:brightness-110 disabled:opacity-60"
            >
              <Check size={14} /> অনুমোদন
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
