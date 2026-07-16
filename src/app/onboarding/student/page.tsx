"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BranchSelect from "@/components/BranchSelect";
import PhotoUpload from "@/components/PhotoUpload";
import { CLASS_OPTIONS } from "@/lib/classes";

export default function StudentForm() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [branchId, setBranchId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

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
    const classVal = String(f.get("class_name") || "");
    const fatherPhone = String(f.get("father_phone") || "");
    const motherPhone = String(f.get("mother_phone") || "");
    const rollId = String(f.get("roll_id") || "");

    const { error: insErr } = await supabase.from("students").insert({
      user_id: user.id,
      roll_id: rollId,
      name_bn: nameBn,
      name_en: nameEn || null,
      branch_id: branchId || null,
      class_id: null,
      guardian_phone: fatherPhone || null,
      address: null,
      photo_url: photo || null,
      status: "pending",
    } as any);
    if (insErr) {
      setMsg("ত্রুটি: " + insErr.message);
      setSubmitting(false);
      return;
    }
    const { error: profErr } = await supabase
      .from("user_profiles")
      .update({ role: "student", branch_id: branchId || null, status: "pending", full_name: nameBn })
      .eq("id", user.id);
    if (profErr) {
      setMsg("প্রোফাইল আপডেট ত্রুটি: " + profErr.message);
      setSubmitting(false);
      return;
    }
    router.push("/dashboard?submitted=1");
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex justify-center">
        <PhotoUpload bucket="student-photos" path={`${Date.now()}`} onUploaded={setPhoto} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="নাম (বাংলা)" name="name_bn" required placeholder="আব্দুল্লাহ" />
        <Field label="নাম (ইংরেজি)" name="name_en" placeholder="Abdullah" />
        <Field label="স্টুডেন্ট কোড" name="roll_id" required placeholder="যেমন: 101-S-001" />
        <div>
          <Label text="ক্লাস" />
          <select
            name="class_name"
            required
            className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-accent-gold"
          >
            <option value="">ক্লাস নির্বাচন করুন</option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Field label="পিতার ফোন" name="father_phone" placeholder="01xxxxxxxxx" />
        <Field label="মাতার ফোন" name="mother_phone" placeholder="01xxxxxxxxx" />
        <div className="sm:col-span-2">
          <Label text="শাখা নির্বাচন করুন" />
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
      <p className="text-center text-xs text-charcoal/50">
        জমা দেওয়ার পর আপনার অ্যাকাউন্ট অনুমোদনের অপেক্ষায় থাকবে।
      </p>
    </form>
  );
}

function Label({ text }: { text: string }) {
  return <label className="mb-1.5 block text-sm font-medium text-charcoal">{text}</label>;
}
function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label text={label} />
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-accent-gold"
      />
    </div>
  );
}
