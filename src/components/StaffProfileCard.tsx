import ImageWithFallback from "@/components/ImageWithFallback";
import { Building2, Briefcase, Hash, Phone } from "lucide-react";
import type { StaffRecord } from "@/lib/auth";

export default function StaffProfileCard({ record }: { record: StaffRecord }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-accent-gold/10">
          <ImageWithFallback
            src={record.photo_url}
            alt={record.name_bn || "স্টাফ"}
            className="h-full w-full object-cover"
            fallbackClassName="flex h-full w-full items-center justify-center text-2xl text-accent-gold"
            fallbackText={(record.name_bn || "স্টা").slice(0, 1)}
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-serif-bn text-lg font-bold text-primary">
            {record.name_bn || "নাম নেই"}
          </h3>
          <p className="text-xs text-charcoal/50">{record.name_en || ""}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-charcoal/70">
          <Hash size={15} className="text-accent-gold" />
          <span>কোড: {record.employee_id || "—"}</span>
        </div>
        {record.designation && (
          <div className="flex items-center gap-2 text-charcoal/70">
            <Briefcase size={15} className="text-accent-gold" />
            <span>{record.designation}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-charcoal/70">
          <Building2 size={15} className="text-accent-gold" />
          <span className="truncate">
            {record.branch_name || "শাখা নেই"}
            {record.branch_code ? ` (${record.branch_code})` : ""}
            {record.branch_district ? ` · ${record.branch_district}` : ""}
          </span>
        </div>
        {record.phone && (
          <div className="flex items-center gap-2 text-charcoal/70">
            <Phone size={15} className="text-accent-gold" />
            <span>{record.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-3 border-t border-primary/5 pt-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            record.status === "active"
              ? "bg-green-600/10 text-green-700"
              : "bg-amber-500/10 text-amber-700"
          }`}
        >
          {record.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </span>
      </div>
    </div>
  );
}
