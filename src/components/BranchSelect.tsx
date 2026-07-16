"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Branch { id: string; code: string; name_bn: string; district: string | null; }

export default function BranchSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("branches")
      .select("id, code, name_bn, district")
      .eq("status", "active")
      .order("code")
      .then(({ data }) => {
        setBranches((data as Branch[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-accent-gold"
    >
      <option value="">শাখা নির্বাচন করুন</option>
      {branches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.code} — {b.name_bn}
        </option>
      ))}
      {loading && <option>লোড হচ্ছে...</option>}
    </select>
  );
}
