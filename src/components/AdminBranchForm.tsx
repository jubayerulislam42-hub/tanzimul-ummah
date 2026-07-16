"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BranchSelect from "@/components/BranchSelect";

export default function AdminBranchForm({ role }: { role: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMsg("লগইন করা নেই।");
      setSubmitting(false);
      return;
    }
    const { error } = await supabase
      .from("user_profiles")
      .update({ full_name: name || null, branch_id: branchId || null, status: "active" })
      .eq("id", user.id);
    if (error) {
      setMsg("ত্রুটি: " + error.message);
      setSubmitting(false);
      return;
    }
    router.push("/dashboard/admin");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">নাম</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="আপনার নাম"
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">শাখা নির্বাচন করুন</label>
        <BranchSelect value={branchId} onChange={setBranchId} />
      </div>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "সেভ হচ্ছে..." : "সেভ করুন ও প্যানেলে যান"}
      </button>
    </form>
  );
}
