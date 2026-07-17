# তানযীমুল উম্মাহ — বিল্ড প্ল্যান (Phase 4+)

> স্ট্যাটাস: Auth + Admin panels + Approvals + Branches ✅ কাজ করছে।
> পরবর্তী ফেজ: রোল-বেসড ড্যাশবোর্ড মডিউল + Onboarding E2E টেস্ট।

## ✅ শেষ হয়েছে (verified)
- Google OAuth (LAN IP সাপোর্ট, `/auth/callback` allow-list)
- `provision_user_on_login()` RPC (enum 'approved' fixed)
- পেন্ডিং স্টুডেন্ট → "অনুমোদনের অপেক্ষায়" স্ক্রিন
- সুপার অ্যাডমিন ড্যাশবোর্ড + ৪ বাটন (অ্যাডমিন প্যানেল / অনুমোদন / সব শাখা / ব্যবহারকারী)
- `approve_user()` RPC (enum fixed, DB-level test passed)
- `/branches` (125 active শাখা; 1 inactive বগুড়া গার্লস — ইচ্ছাকৃত)
- Admin: scoped stats, students/staff lists, notices post, whitelist manager

## ⏳ বাকি কাজ (প্রায়োরিটি অনুযায়ী)

### P1 — Onboarding E2E টেস্ট + ফিক্স
- [ ] স্টুডেন্ট সাইন-আপ ফ্লো (ফটো আপলোড + ফর্ম → students টেবিল → profile pending)
- [ ] স্টাফ/টিচার ফ্লো
- [ ] অ্যাডমিন অনবোর্ডিং (`/onboarding/admin` → branch select)
- [ ] রেকর্ড টেবিলে এন্ট্রি ছাড়া pending ইউজার লিস্টে না আসার গ্যাপ (get_pending_approvals শুধু students/teachers/staff join করে)

### P2 — রোল-বেসড ড্যাশবোর্ড মডিউল (placeholder → real)
- [ ] স্টুডেন্ট: "আমার হিফয অগ্রগতি" (sura/ayah progress), "পরীক্ষার ফল" (exam results)
- [ ] স্টাফ: "শিক্ষার্থী ব্যবস্থাপনা", "হাজিরা"
- [ ] টিচার: "আমার ক্লাস", "শিক্ষার্থী অগ্রগতি"
- [ ] প্রিন্সিপাল: শাখা ওভারভিউ (real data), শিক্ষক-কর্মচারী লিস্ট
- [ ] সুপারভাইজার: আঞ্চলিক শাখা কম্প্যারিজন

### P3 — ব্রাঞ্চ ডিটেইল পেজ
- [ ] `/branches/[code]` রিয়েল ডাটা (ঠিকানা, শিক্ষক, ছাত্র সংখ্যা)
- [ ] ফোন টেস্ট

### P4 — পাবলিক পেজ পোলিশ
- [ ] /about, /contact, /notices (real notices from DB)
- [ ] ফুটার টেক্সট ঠিক করা ("বিস্তারিত মতিউল্লাহে" → সঠিক)

### P5 — ডিপ্লয় প্রস্তুতি
- [ ] Production env (vercel + supabase prod)
- [ ] LAN IP → domain swap for OAuth

## নোট
- ফোন টেস্ট প্রতিটা স্টেপে জরুরি (এজেন্টের নো ভিজ্যুয়াল রেন্ডার)
- চেকপয়েন্ট: প্রতি স্টেপ শেষে `git commit`
- ফাইল রাইট < 8K tokens
