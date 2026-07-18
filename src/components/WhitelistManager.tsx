"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import BranchSelect from "@/components/BranchSelect";

export default function WhitelistManager() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("principal");
  const [branchId, setBranchId] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("admin_whitelist")
      .select("id, email, role, branch_id")
      .order("email");
    setRows((data as any[]) ?? []);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase
      .from("admin_whitelist")
      .upsert(
        { email: email.toLowerCase(), full_name: name || null, role, branch_id: branchId || null },
        { onConflict: "email" }
      );
    setBusy(false);
    if (error) setMsg("ত্রুটি: " + error.message);
    else {
      setEmail("");
      setName("");
      setBranchId("");
      setMsg("যোগ করা হয়েছে ✓");
      await load();
    }
  };

  const needsBranch = role === "principal" || role === "regional_supervisor";

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="ইমেইল (যেমন: a@b.com)"
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="নাম"
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex-1 rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
          >
            <option value="principal">প্রিন্সিপাল (শাখা-স্কোপ)</option>
            <option value="regional_supervisor">সুপারভাইজার (বিভাগ-স্কোপ)</option>
            <option value="super_admin">সুপার অ্যাডমিন (সব)</option>
          </select>
          {needsBranch ? (
            <div className="flex-1">
              <BranchSelect value={branchId} onChange={setBranchId} />
            </div>
          ) : (
            <div className="flex-1 rounded-xl border border-dashed border-primary/15 px-4 py-3 text-sm text-charcoal/40">
              সুপার অ্যাডমিন: শাখা লাগে না
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "যোগ হচ্ছে..." : "অ্যাড করুন"}
        </button>
      </form>
      {msg && <p className={`text-sm ${msg.includes("ত্রুটি") ? "text-red-600" : "text-green-700"}`}>{msg}</p>}

      <div className="pt-2">
        <button onClick={load} className="text-sm text-accent-gold underline">
          তালিকা রিফ্রেশ করুন
        </button>
        {rows.length > 0 && (
          <div className="overflow-x-auto">
          <table className="mt-3 w-full text-left text-sm">
            <thead className="text-charcoal/60"><tr><th className="py-2">ইমেইল</th><th>রোল</th><th>শাখা</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-primary/5">
                  <td className="py-2 text-charcoal">{r.email}</td>
                  <td className="text-charcoal/70">{r.role}</td>
                  <td className="text-charcoal/50">{r.branch_id ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
