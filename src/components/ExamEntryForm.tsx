"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StudentOption {
  id: string;
  name_bn: string | null;
  roll_id: string | null;
  branch_code: string | null;
}

export default function ExamEntryForm({ students }: { students: StudentOption[] }) {
  const [studentId, setStudentId] = useState("");
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const [grade, setGrade] = useState("");
  const [examDate, setExamDate] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    if (!studentId || !examName) {
      setMsg("ছাত্র ও পরীক্ষার নাম বাধ্যতামূলক।");
      setSaving(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("exams").insert({
      student_id: studentId,
      exam_name: examName,
      subject: subject || null,
      marks_obtained: obtained ? parseFloat(obtained) : null,
      marks_total: total ? parseFloat(total) : null,
      grade: grade || null,
      exam_date: examDate || null,
    } as any);
    if (error) {
      setMsg("ত্রুটি: " + error.message);
    } else {
      setMsg("✓ সংরক্ষিত হয়েছে।");
      setExamName(""); setSubject(""); setObtained(""); setTotal(""); setGrade(""); setExamDate("");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">ছাত্র</label>
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}
          className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold">
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
          <label className="mb-1.5 block text-sm font-medium text-charcoal">পরীক্ষার নাম</label>
          <input value={examName} onChange={(e) => setExamName(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">বিষয়</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">প্রাপ্ত নম্বর</label>
          <input type="number" step="0.01" value={obtained} onChange={(e) => setObtained(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">মোট নম্বর</label>
          <input type="number" step="0.01" value={total} onChange={(e) => setTotal(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">গ্রেড</label>
          <input value={grade} onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">তারিখ</label>
          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
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
