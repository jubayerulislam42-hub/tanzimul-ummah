"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import BranchSelect from "@/components/BranchSelect";

export default function NoticeForm({
  global,
  defaultBranchId,
}: {
  global: boolean;
  defaultBranchId: string | null;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [branchId, setBranchId] = useState(defaultBranchId ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.from("notices").insert({
      title,
      description: desc || null,
      branch_id: global ? null : branchId || null,
      published_at: new Date().toISOString(),
      is_published: true,
    } as any);
    setSubmitting(false);
    if (error) setMsg("ত্রুটি: " + error.message);
    else {
      setTitle("");
      setDesc("");
      setMsg("নোটিশ প্রকাশিত হয়েছে ✓");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">শিরোনাম</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
          placeholder="যেমন: ঈদের ছুটির নোটিশ"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">বিবরণ</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
        />
      </div>
      {!global && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">শাখা</label>
          <BranchSelect value={branchId} onChange={setBranchId} />
        </div>
      )}
      {msg && (
        <p className={`text-sm ${msg.includes("ত্রুটি") ? "text-red-600" : "text-green-700"}`}>{msg}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "পোস্ট হচ্ছে..." : "নোটিশ পোস্ট করুন"}
      </button>
    </form>
  );
}
