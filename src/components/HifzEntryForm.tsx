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
  { v: "not_started", l: "শুরু হয়নি" },
  { v: "in_progress", l: "চলমান" },
  { v: "memorized", l: "মুখস্থ" },
  { v: "revised", l: "রিভিশন" },
];

export default function HifzEntryForm({ students }: { students: StudentOption[] }) {
  const [studentId, setStudentId] = useState("");
  const [surahId, setSurahId] = useState("1");
  const [status, setStatus] = useState("memorized");
  const [ayahFrom, setAyahFrom] = useState("");
  const [ayahTo, setAyahTo] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    if (!studentId) {
      setMsg("ছাত্র বাছাই করুন।");
      setSaving(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("hifz_progress").upsert(
      {
        student_id: studentId,
        surah_id: parseInt(surahId, 10),
        status,
        ayah_from: ayahFrom ? parseInt(ayahFrom, 10) : null,
        ayah_to: ayahTo ? parseInt(ayahTo, 10) : null,
      },
      { onConflict: "student_id,surah_id" }
    );
    if (error) {
      setMsg("ত্রুটি: " + error.message);
    } else {
      setMsg("✓ সংরক্ষিত হয়েছে।");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">ছাত্র</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
        >
          <option value="">— বাছাই করুন —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name_bn || "নাম নেই"} {s.roll_id ? `(${s.roll_id})` : ""} {s.branch_code ? `[${s.branch_code}]` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">সূরা নং</label>
          <input
            type="number" min={1} max={114} value={surahId}
            onChange={(e) => setSurahId(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">অবস্থা</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
          >
            {STATUS.map((s) => (
              <option key={s.v} value={s.v}>{s.l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">আয়াত হতে</label>
          <input type="number" value={ayahFrom} onChange={(e) => setAyahFrom(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">আয়াত পর্যন্ত</label>
          <input type="number" value={ayahTo} onChange={(e) => setAyahTo(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
      </div>
      {msg && <p className={`rounded-lg px-4 py-2 text-sm ${msg.startsWith("✓") ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-600"}`}>{msg}</p>}
      <button type="submit" disabled={saving}
        className="w-full rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 disabled:opacity-60">
        {saving ? "সংরক্ষণ..." : "সংরক্ষণ করুন"}
      </button>
    </form>
  );
}
