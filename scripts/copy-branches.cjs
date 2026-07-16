const { createClient } = require("@supabase/supabase-js");

const OLD_URL = "https://uvagqlhsrrxixdfymyjq.supabase.co";
const OLD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2YWdxbGhzcnJ4aXhkZnlteWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NTg1MTEsImV4cCI6MjA5OTMzNDUxMX0.iAX3Ph_4JlMnvJMcv30wNzMiMqDj_Ho2zL-4WhBJRxw";
const old = createClient(OLD_URL, OLD_KEY);

function q(v) {
  if (v === null || v === undefined) return "null";
  return "'" + String(v).replace(/'/g, "''") + "'";
}

(async () => {
  let all = [];
  let from = 0;
  while (true) {
    const { data, error } = await old
      .from("branches")
      .select("code,name_bn,name_en,type,division,district,address,phone,email,established_date,status")
      .order("code")
      .range(from, from + 999);
    if (error) { console.error(error); process.exit(1); }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }

  const TYPES = new Set(["Hifz Madrasah","Girls Hifz Madrasah","Girls Madrasah","Alim Madrasah","Hifz School","Pre-Hifz Madrasah"]);
  let sql = "-- Copy branches old -> new (idempotent). Run once.\nINSERT INTO branches (code, name_bn, name_en, type, division, district, address, phone, email, established_date, status)\nVALUES\n";
  const rows = all.map((b) => {
    let t = b.type;
    if (!t || !TYPES.has(t)) {
      t = (b.name_bn && b.name_bn.includes("গার্লস")) ? "Girls Madrasah" : "Hifz Madrasah";
    }
    const div = b.division || "Unknown";
    const dist = b.district || "Unknown";
    return `  (${q(b.code)}, ${q(b.name_bn)}, ${q(b.name_en)}, ${q(t)}::branch_type, ${q(div)}, ${q(dist)}, ${q(b.address)}, ${q(b.phone)}, ${q(b.email)}, ${q(b.established_date)}, ${q(b.status)}::record_status))`;
  });
  sql += rows.join(",\n") + "\nON CONFLICT (code) DO UPDATE SET\n  name_bn = EXCLUDED.name_bn,\n  name_en = EXCLUDED.name_en,\n  type = EXCLUDED.type,\n  division = EXCLUDED.division,\n  district = EXCLUDED.district,\n  address = EXCLUDED.address,\n  phone = EXCLUDED.phone,\n  email = EXCLUDED.email,\n  status = EXCLUDED.status;\n";
  require("fs").writeFileSync("/data/data/com.termux/files/home/tanzimul-ummah/schema/08_copy_branches.sql", sql);
  console.log("Wrote", all.length, "branch rows to 08_copy_branches.sql");
})();
