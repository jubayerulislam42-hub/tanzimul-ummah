"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import BranchSelect from "@/components/BranchSelect";
import PhotoUpload from "@/components/PhotoUpload";

export default function TeacherForm() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [branchId, setBranchId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl bg-accent-gold/10 px-6 py-10 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/20 text-2xl">✓</div>
        <h3 className="font-serif-bn text-lg font-bold text-primary">আবেদন জমা হয়েছে</h3>
        <p className="mt-2 text-sm text-charcoal/70">আপনার তথ্য অনুমোদনের অপেক্ষায় আছে। অনুমোদন হলে ড্যাশবোর্ডে প্রবেশের অনুমতি দেওয়া হবে।</p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    const f = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMsg("লগইন করা নেই।");
      setSubmitting(false);
      return;
    }
    const nameBn = String(f.get("name_bn") || "");
    const nameEn = String(f.get("name_en") || "");
    const designation = String(f.get("designation") || "");
    const phone = String(f.get("phone") || "");
    const qualification = String(f.get("qualification") || "");
    const joining = String(f.get("joining_date") || "");

    const { error: insErr } = await supabase.from("teachers").insert({
      user_id: user.id,
      employee_id: String(f.get("employee_id") || ""),
      name_bn: nameBn,
      name_en: nameEn || null,
      designation: designation || null,
      branch_id: branchId || null,
      joining_date: joining || null,
      qualification: qualification || null,
      phone: phone || null,
      photo_url: photo || null,
      status: "active",
    } as any);
    if (insErr) {
      setMsg("ত্রুটি: " + insErr.message);
      setSubmitting(false);
      return;
    }
    await supabase
      .from("user_profiles")
      .update({ role: "teacher", branch_id: branchId || null, status: "pending", full_name: nameBn })
      .eq("id", user.id);
    setSubmitted(true);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex justify-center">
        <PhotoUpload bucket="teacher-photos" path={`${Date.now()}`} onUploaded={setPhoto} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="নাম (বাংলা)" name="name_bn" required />
        <Field label="নাম (ইংরেজি)" name="name_en" />
        <Field label="এমপ্লয়ি কোড" name="employee_id" required />
        <Field label="পদবি" name="designation" placeholder="সহকারী শিক্ষক" />
        <Field label="ফোন" name="phone" />
        <Field label="যোগ্যতা" name="qualification" />
        <Field label="যোগদানের তারিখ" name="joining_date" type="date" />
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-charcoal">শাখা নির্বাচন করুন</label>
          <BranchSelect value={branchId} onChange={setBranchId} />
        </div>
      </div>
      {msg && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600">{msg}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-accent-gold px-6 py-3 font-semibold text-primary shadow-gold transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "জমা হচ্ছে..." : "তথ্য জমা দিন"}
      </button>
      <p className="text-center text-xs text-charcoal/50">জমা দেওয়ার পর অ্যাকাউন্ট অনুমোদনের অপেক্ষায় থাকবে।</p>
    </form>
  );
}

function Field({ label, name, required, placeholder, type = "text" }: { label: string; name: string; required?: boolean; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-charcoal">{label}</label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        type={type}
        className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-accent-gold"
      />
    </div>
  );
}
