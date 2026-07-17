import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { getMyScope } from "@/lib/scope";
import { getScopedStudents } from "@/lib/admin-data";
import ExamEntryForm from "@/components/ExamEntryForm";
import AdminShell from "@/components/AdminShell";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/login");
  if (!["principal", "regional_supervisor", "super_admin", "teacher"].includes(profile?.role ?? "")) {
    redirect("/dashboard");
  }
  const scope = await getMyScope();
  const branchIds = scope?.branchIds ?? [];
  const students = await getScopedStudents(branchIds);

  return (
    <AdminShell profile={profile!}>
      <div className="mb-4 flex items-center gap-2 text-accent-gold">
        <ClipboardList size={20} />
        <h1 className="font-serif-bn text-xl font-bold text-primary">পরীক্ষার ফল এন্ট্রি</h1>
      </div>
      <p className="mb-5 text-sm text-charcoal/50">
        এই ফর্ম থেকে ছাত্রদের পরীক্ষার ফল যুক্ত করুন।
      </p>
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
        <ExamEntryForm students={students} />
      </div>
    </AdminShell>
  );
}
