"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StudentOption {
  id: string;
  name_bn: string | null;
  roll_id: string | null;
  branch_code: string | null;
}

const STATUS = [
  { v: "present", l: "উপস্থিত" },
  { v: "absent", l: "অনুপস্থিত" },
  { v: "late", l: "বিলম্বিত" },
  { v: "excused", l: "ছুটি" },
];

export default function AttendanceEntryForm({ students }: { students: StudentOption[] }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("present");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => setSelected((p) => ({ ...p, [id]: !p[id] }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (ids.length === 0) {
      setMsg("কমপক্ষে একজন ছাত্র বাছাই করুন।");
      setSaving(false);
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const rows = ids.map((sid) => ({
      student_id: sid,
      date,
      status,
      marked_by: user?.id ?? null,
    }));
    const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "student_id,date" });
    if (error) {
      setMsg("ত্রুটি: " + error.message);
    } else {
      setMsg(`✓ ${ids.length} জন ছাত্রের হাজিরা (${STATUS.find((s) => s.v === status)?.l}) সংরক্ষিত হয়েছে।`);
      setSelected({});
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">তারিখ</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">অবস্থা</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold">
            {STATUS.map((s) => (
              <option key={s.v} value={s.v}>{s.l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto rounded-xl border border-primary/10 bg-white p-2">
        <p className="px-2 py-1 text-xs text-charcoal/50">ছাত্র বাছাই করুন (ট্যাপ করে চিহ্নিত করুন):</p>
        {students.map((s) => (
          <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${selected[s.id] ? "bg-accent-gold/10" : "hover:bg-primary/5"}`}>
            <input type="checkbox" checked={!!selected[s.id]} onChange={() => toggle(s.id)} className="accent-accent-gold" />
            <span className="font-medium text-charcoal">{s.name_bn || "নাম নেই"}</span>
            {s.roll_id && <span className="text-xs text-charcoal/50">({s.roll_id})</span>}
          </label>
        ))}
        {students.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-charcoal/40">এই শাখায় কোনো ছাত্র নেই।</p>
        )}
      </div>

      {msg && <p className={`rounded-lg px-4 py-2 text-sm ${msg.startsWith("✓") ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-600"}`}>{msg}</p>}
      <button type="submit" disabled={saving}
        className="w-full rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 disabled:opacity-60">
        {saving ? "সংরক্ষণ..." : "হাজিরা সংরক্ষণ করুন"}
      </button>
    </form>
  );
}
