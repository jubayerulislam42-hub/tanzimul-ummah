"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import BranchCard, { type Branch } from "./BranchCard";

export default function BranchExplorer({ branches }: { branches: Branch[] }) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("all");

  const divisions = useMemo(
    () =>
      Array.from(
        new Set(branches.map((b) => b.division).filter(Boolean) as string[])
      ).sort(),
    [branches]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((b) => {
      const matchesDiv = division === "all" || b.division === division;
      const matchesQ =
        !q ||
        b.name_bn.toLowerCase().includes(q) ||
        (b.name_en ?? "").toLowerCase().includes(q) ||
        (b.district ?? "").toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q);
      return matchesDiv && matchesQ;
    });
  }, [branches, query, division]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="শাখা, জেলা বা কোড দিয়ে খুঁজুন..."
            className="w-full rounded-full border border-primary/15 bg-white py-3 pl-10 pr-4 text-sm text-charcoal outline-none transition focus:border-accent-gold"
          />
        </div>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="rounded-full border border-primary/15 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-accent-gold"
        >
          <option value="all">সব বিভাগ</option>
          {divisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="mb-4 text-sm text-charcoal/60">
        <span className="font-bold text-primary">{filtered.length}</span> টি শাখা পাওয়া গেছে
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-charcoal/50 shadow-sm">
          কোনো শাখা পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BranchCard key={b.id} branch={b} />
          ))}
        </div>
      )}
    </div>
  );
}
