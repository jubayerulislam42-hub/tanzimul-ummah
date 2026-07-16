import { Building2, MapPin } from "lucide-react";

export interface Branch {
  id: string;
  code: string;
  name_bn: string;
  name_en: string | null;
  type: string | null;
  division: string | null;
  district: string | null;
  address: string | null;
}

export default function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent-gold hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition group-hover:bg-accent-gold/15">
          <Building2 size={20} />
        </div>
        <span className="rounded-full bg-accent-gold/10 px-2.5 py-1 text-[11px] font-semibold text-accent-gold-dark">
          {branch.code}
        </span>
      </div>

      <h3 className="font-serif-bn text-base font-bold leading-snug text-primary">
        {branch.name_bn}
      </h3>
      {branch.type && (
        <p className="mt-1 text-xs text-charcoal/50">{branch.type}</p>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-xs text-charcoal/60">
        <MapPin size={13} className="text-accent-gold" />
        <span>
          {[branch.district, branch.division].filter(Boolean).join(", ") || "—"}
        </span>
      </div>
    </div>
  );
}
