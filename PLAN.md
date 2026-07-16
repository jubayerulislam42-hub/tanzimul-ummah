# তানযীমুল উম্মাহ হিফয মাদরাসা — Website Master Plan

> Single source of truth for the fresh build. Replaces the old scattered `.txt` prompt files.
> Built by Hermes Agent with real shell + Supabase MCP access. Status legend: ⬜ todo · 🔄 in progress · ✅ done · ⚠️ needs decision

---

## 0. Project Snapshot

- **Org:** তানযীমুল উম্মাহ হিফয মাদরাসা — 125+ branches, Bangladesh
- **Type:** Public informational site + role-based dashboards
- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind 3.4 + Supabase (DB/Auth/Storage) + Google OAuth
- **Key libs:** `@supabase/ssr` 0.5, `@supabase/supabase-js` 2.x, `lucide-react`, `cheerio` (scraping only)
- **Env:** Termux/Android, Node v26, npm 11 (working — agent runs install/dev/build directly). ~1.5 GB free RAM (builds slower).
- **Project dir:** `~/tanzimul-ummah`
- **Database:** NEW empty project `nztzqkirvohrdunkybcl`. 126 branches copied from old project `uvagqlhsrrxixdfymyjq` via MCP.

### Agent capabilities / limits
- ✅ Real shell — runs `npm install`, `npm run dev`, `npm run build`, git; checks exit codes & logs.
- ✅ Supabase MCP — runs SQL directly (`apply_migration`, `execute_sql`) against both projects.
- ❌ No visual rendering — every visual checkpoint requires user to view on phone browser & report back.
- ✅ Can `curl localhost:3000` to confirm HTTP 200 + inspect server logs for errors.

---

## 1. Theme & Design System (LOCKED)

**Direction:** *Refined Dark Chrome + Warm Light Content* — dark luxurious where impact matters (nav/hero/footer/accent cards), warm off-white where reading matters (content, tables, forms). Premium + readable.

### Colors
| Token | Hex | Use |
|---|---|---|
| green-black | `#0A1F16` | dark chrome background (nav, hero base, footer) |
| primary | `#0F6B3C` | primary green |
| primary-dark | `#122A20` | dark green surfaces |
| primary-light | `#15884D` | hover/active green |
| gold | `#D4A537` | accent (matte→bright gradient), highlights, active nav |
| gold-light | `#E6C067` | gold hover |
| navy | `#1B2A4A` | secondary accent |
| cream | `#F5F1E8` | text on dark |
| off-white | `#FAF8F3` | content background (NOT pure white) |
| charcoal | `#2D2D2D` | body text on light |

### Typography
- **বাংলা heading:** Noto Serif Bengali (gravitas)
- **বাংলা body:** Hind Siliguri
- **English heading:** Cormorant / Fraunces (serif, premium)
- **English body:** Inter
- Strict weight hierarchy, letter-spacing, line-height for premium feel.

### Texture / depth / motion
- Subtle Islamic geometric pattern overlay (3–4% opacity) on dark sections
- Gold accents as subtle gradient (matte→bright), never flat-everywhere (cheap look)
- Soft layered shadows, consistent 16px card radius
- Cinematic hero gradient overlay (text always readable)
- Scroll-reveal (fade + rise), gold hover glow, card lift — subtle, no heavy JS

### Reusable core components
`Section`, `PillButton`, `ImageWithFallback` (themed gradient+icon placeholder), `Card`, `SectionDivider` (geometric gold), `Skeleton`, `Badge`, `MosqueSilhouette` (SVG footer), `IslamicPattern` (SVG overlay).

### Premium extras (beyond old build)
- হিজরি + বাংলা তারিখ display
- Animated stat counters (১২৫+ শাখা / শিক্ষার্থী / শিক্ষক)
- Custom SVG mosque silhouette footer (crisp, scalable)
- Geometric gold section dividers
- Loading skeletons everywhere (no blank flashes)
- SEO + Open Graph tags (nice share previews)
- Daily-rotating হাদিস/আয়াত quote card
- Full accessibility (keyboard nav, focus states, contrast)

---

## 2. Database Schema (consolidated + fixed)

**Decision: ONE master idempotent `schema.sql`** — no more "run 4 files in order" fragility. All enums in exception-handled `DO` blocks, `if not exists`, `drop policy if exists`, `on conflict do nothing`.

### Tables
`branches`, `user_profiles`, `students`, `teachers`, `staff`, `regional_supervisors`, `admin_whitelist`, `classes`, `notices`, `lesson_updates`, `holidays`, `awards`, `income`, `expenses`, `income_categories`, `expense_categories`.

### Enums
`branch_type`, `user_role` (student/staff/teacher/principal/regional_supervisor/super_admin), `profile_status` (pending/approved/rejected), `record_status` (active/inactive/completed/transferred), `class_category` (হিফজ/সাধারণ).

### Fixes applied vs old build
1. ✅ **`income` insert policy added** (old build only had it on `expenses` — Principals couldn't add income). Also add income/expense UPDATE policies.
2. ✅ **Counts via live VIEWS** not phantom columns: `branch_public_stats` (branch_id, student_count, teacher_count) computed from real rows. Always accurate.
3. ✅ **Public directory VIEWS** — `public_teachers_directory` / `public_staff_directory` exposing ONLY name_bn/name_en/designation/photo/branch — NEVER salary/phone. Public reads the view, not the raw table.
4. ✅ **`public_branch_student_counts`** view — aggregate only, no individual student PII public.
5. ✅ **`updated_at` + `updated_by`** audit columns on mutable tables (user_profiles, income, expenses, notices, branches) + trigger to auto-set updated_at.
6. ✅ **RLS recursion guard** — `is_super_admin()` and `is_admin_role(text[])` as SECURITY DEFINER (never subquery user_profiles from within its own policy).
7. ✅ **admin_whitelist.branch_id** column from day one (for principals).
8. ✅ **Onboarding self-insert order** — profile row inserted before role-specific row; RLS checks handle the transaction correctly.
9. ✅ Storage `profile-photos` bucket + owner-scoped write policy (`{user_id}/...`).

### RLS policy matrix (enforced in Postgres, not just UI)
| Table | Public read | Self | Teacher (own branch) | Principal (own branch) | Reg. Supervisor | Super Admin |
|---|---|---|---|---|---|---|
| branches | ✅ | — | — | edit own | view all | full |
| user_profiles | ❌ | own r/w | — | approve own branch | view | full r/w |
| students | count view only | own | read+manage own branch | full own branch | view all | full |
| teachers | directory view only | own | read own branch | full own branch | view all | full |
| staff | directory view only | own | — | full own branch | view all | full |
| income | ❌ | — | ❌ | view+add own branch | view all | full |
| expenses | ❌ | — | ❌ | view+add own branch | view all | full |
| notices | ✅ | — | insert own branch | full own branch | view | full |
| lesson_updates | ✅ | — | insert own branch | full own branch | view | full |
| classes | ✅ | — | read own branch | manage own branch | view | full |
| holidays/awards | ✅ | — | — | manage own branch | view | full |

---

## 3. Auth & Onboarding Flow

### Google OAuth (`@supabase/ssr`, not deprecated auth-helpers)
- Browser client (`src/lib/supabase/client.ts`)
- Server client (`src/lib/supabase/server.ts`)
- `middleware.ts` — session refresh each request
- `/auth/callback` route
- `AuthButton` — login (Google) / avatar+dropdown (logout, role-based dashboard links)

### First-login decision logic (middleware/layout)
```
on authenticated request:
  profile = user_profiles where id = auth.uid()
  if profile exists:
     if status == 'approved' → normal access (NEVER force onboarding, regardless of branch_id)
     if status == 'pending'  → allow browsing + show pending banner
     if status == 'rejected' → allow browsing, no dashboard
  else (no profile):
     wl = admin_whitelist where email = auth email
     if wl matched:
        auto-create profile: role=wl.role, branch_id=wl.branch_id, status='approved'
        → redirect Home / role dashboard (skip onboarding entirely)
     else:
        → redirect /onboarding
```
**Fixes the old bug:** approved super_admin (branch_id=null) was wrongly redirected to onboarding. Rule: `status='approved'` ⇒ never onboarding.

### Onboarding (`/onboarding`) — non-whitelisted only
Welcome (Google name/photo) → photo (Google default, optional upload to `profile-photos/{uid}/`) → role (Student/Staff/Teacher ONLY) → searchable branch dropdown (125) → class dropdown (student only, graceful empty state) → optional role fields → submit ⇒ status='pending'.

---

## 4. Page / Route Map

### Public
| Route | Page | Phase |
|---|---|---|
| `/` | Home (hero, quick links, latest notices, events, quote, stats) | 1 |
| `/branches` | Branch list (search/filter/pagination) | 2 |
| `/branches/[code]` | Branch detail (hero, info, stats, map, gallery) | 2 |
| `/directory` | Teachers/Staff directory (public-safe view) | 3 |
| `/notices` | Notices listing | 3 |
| `/notices/[id]` | Notice detail | 3 |
| `/holidays` | Holidays / calendar | 3 |
| `/awards` | Awards | 3 |
| `/admission` | Admission guide (NEW badge) | 3 |
| `/contact` | Contact / About | 3 |
| `/student-lookup` | Roll-based student lookup (limited public) | 3 (optional) |

### Auth / protected
| Route | Access | Phase |
|---|---|---|
| `/onboarding` | logged-in, no profile | 1 |
| `/profile` | any approved user | 4 |
| `/dashboard/admin` | super_admin | 4 |
| `/dashboard/teacher` | teacher (approved) | 5 |
| `/dashboard/principal` | principal (approved) | 6 |
| `/dashboard/principal/finance` | principal | 6 |
| `/dashboard/supervisor` | regional_supervisor | 7 |
| `/dashboard/student` | student (approved) | 7 |

---

## 5. Build Phases (execution order)

### Phase 1 — Foundation ⬜
1. Scaffold Next.js 14 + TS + Tailwind, install deps.
2. Design system: tailwind theme, fonts, core components (Section, PillButton, ImageWithFallback, Card, Divider, Skeleton, MosqueSilhouette, IslamicPattern).
3. `.env.local` (new project URL + anon key — user provides).
4. Master `schema.sql` written + run via MCP against new project.
5. Copy 126 branches old→new project via MCP.
6. Google OAuth (client/server/middleware/callback/AuthButton).
7. Navbar (8 items, icons, "..." overflow, active gold) + top header (logo, auth pills).
8. Home page (hero + lanterns, quick links, latest notices, upcoming events, quote card, stats counter, mosque footer).
9. Onboarding flow + whitelist auto-provisioning.
**Checkpoint:** `npm run dev` clean, curl 200, user visual-checks home + login + onboarding on phone.

### Phase 2 — Branches ⬜
Branch list (`/branches`) + detail (`/branches/[code]`), BranchPlaceholder, search/filter/pagination, generateMetadata, stats from view.

### Phase 3 — Public content pages ⬜
Directory (safe view), Notices (list+detail), Holidays/Calendar, Awards, Admission Guide, Contact/About. Apply theme consistently.

### Phase 4 — Profile + Admin ⬜
`/profile` (view/edit own), `/dashboard/admin` (approve/reject pending, whitelist mgmt, mobile card layout).

### Phase 5 — Teacher Dashboard ⬜
Overview (my classes/branch), Send Notice (branch/class/student target), Lesson Update (hifz vs general fields). Seed test classes.

### Phase 6 — Principal Dashboard ⬜
Branch management, approve branch users, class CRUD, **finance module** (income/expense entry, category dropdowns, monthly report, charts, deficit alert).

### Phase 7 — Supervisor + Student Dashboards ⬜
Regional Supervisor (multi-branch view-only + view-only finance). Student (own notices/lessons/profile).

### Phase 8 — Polish & production ⬜
Full responsive audit (375/768/1280), micro-interactions, favicon/OG, loading states, accessibility, performance, final visual QA per page. Deploy guidance (Vercel).

---

## 6. What the USER must do manually (running list)
1. ⬜ Provide new Supabase project URL + anon key → `.env.local`.
2. ⬜ Create Google Cloud OAuth client with redirect URI (agent will specify exact URI).
3. ⬜ Configure Supabase Auth: Google Client ID/Secret, Site URL, Redirect URLs.
4. ⬜ Provide assets: `public/logo.png`, `public/images/hero-bg.jpg`, `hero-decoration.png` (or agent uses themed placeholders until then).
5. ⬜ Provide own email → agent adds to `admin_whitelist` as super_admin via MCP.
6. ⬜ Visual-check each phase checkpoint on phone browser & report back.

---

## 7. Decisions (locked) ✅
- [x] **Deployment:** Vercel.
- [x] **Domain:** none yet → use Vercel default subdomain (`*.vercel.app`) for now; add custom domain later. OAuth redirect URLs will target the Vercel URL + `localhost:3000` for dev.
- [x] **Prayer-times widget:** YES, include in Phase 1 home. Times computed from user location via a free prayer-times API (e.g. Aladhan) — no data needed from user.
- [x] **Charts (finance, Phase 6):** recharts.

## 7b. Still to plan (before "start building") 🔄
- [ ] Full site information architecture / content for each public page (About, Admission Guide, Contact).
- [ ] Exact Home page section order & content (hero copy, stats numbers, which notices/events show).
- [ ] Component-level design details (nav overflow behavior, mobile menu, footer columns).
- [ ] Finance module detailed spec (report types, PDF/Excel export, monthly/yearly views).
- [ ] Dashboard layouts per role (sidebar vs tabs, what widgets) — EXPLAINING NOW.
- [x] **Data seeding plan** — see §9.
- [x] **Image/asset strategy** — see §10.
- [x] **Notification/approval flow** — YES, in-app notifications. See §11.

---

## 9. Data Seeding Plan ✅
"Seeding" = putting realistic sample rows into empty tables so pages don't look broken/empty during dev, and so features can be tested before real data exists.
- **branches:** 126 real branches copied from old project (real data, not seed).
- **classes:** seed 3–4 per demo branch (mix হিফজ/সাধারণ) so onboarding class-dropdown & teacher dashboard are testable.
- **notices:** 4–5 sample notices (some branch-specific, some all-branch) so Home "সর্বশেষ নোটিশ" and /notices aren't empty.
- **holidays:** ~6 (Eid, national, exam breaks) so calendar has content.
- **awards:** 3–4 sample so /awards renders.
- **income/expenses:** sample month for 1 branch (from old dummy data) so finance charts render.
- **users/students/teachers:** NOT seeded blindly — created via real Google login + onboarding during testing (avoids fake auth rows). A few test classes seeded so the flow works.
- All seed data clearly marked & removable later. Seed via MCP SQL, idempotent (`on conflict do nothing`).

## 10. Image / Asset Strategy ✅
- **Branch photos:** ALL 126 branches get ONE shared standard madrasah photo now (`public/images/branch-standard.jpg`), shown as cover everywhere until real per-branch photos are uploaded later (one by one). If even the standard is missing → themed gradient+icon `ImageWithFallback`.
- **Other images (hero, decorations, icons, section art):** agent chooses tasteful, theme-appropriate assets/placeholders wherever needed (agent's judgment) — royalty-free or generated, matching the dark-green/gold premium theme.
- **Profile photos:** Google account photo by default; optional upload to `profile-photos/{uid}/`.
- **Logo:** user provides `public/logo.png`; until then agent uses a clean SVG placeholder logo.
- Never show a broken/empty image anywhere — always a themed fallback.

## 11. Notification / Approval Flow ✅
In-app notifications (no email dependency for now).
- New `notifications` table: (id, user_id, type, title, body, link, is_read, created_at) with RLS (user reads own).
- **Onboarding submit** → notify branch's Principal/Teacher + Super Admin: "নতুন প্রোফাইল অনুমোদনের অপেক্ষায়".
- **Approve/Reject** → notify the applicant: "আপনার প্রোফাইল অনুমোদিত হয়েছে / প্রত্যাখ্যাত".
- **New notice targeting a user's branch/class** → notify relevant users.
- Navbar bell icon with unread count + dropdown list. Mark-as-read on click.
- (Email/SMS can be added later; out of scope for v1.)

---

## 12. CORE PRINCIPLE — Everything must be WORKABLE (functional), not fake ⭐
**Non-negotiable rule for the entire build:** every feature must actually work against the real database — not a static mockup that only *looks* like it works.
- Teacher sends a notice → row really inserted into `notices`, really visible to targets.
- Teacher posts lesson update → really saved to `lesson_updates`, really shown in history.
- Admin approves/rejects → `user_profiles.status` really changes, real notification fires.
- Principal adds income/expense → real row, charts recompute from real data.
- Onboarding submit → real `user_profiles` + role row created.
- Where the USER does NOT provide materials (photos, real content, real people) → use tasteful DUMMY DATA, but wired through the real DB so the feature is fully functional and testable end-to-end. Dummy = the *content*, never the *plumbing*.
- No "coming soon" fake buttons, no hardcoded lists pretending to be live data. If it's shown, it's real.

---

## 13. Dashboard Layouts per Role ✅
Pattern: **desktop = left sidebar (icon+label) + content area; mobile = top tabs / hamburger menu**. Theme-consistent, no heavy UI. All fully workable against DB. **Extensible: more options can be added later without restructuring (sidebar is data-driven).**

### Principal — full control of OWN single branch
- **ড্যাশবোর্ড (Overview):** own branch stats (students/teachers/staff counts), this-month income/expense summary + deficit alert, pending-approval count, recent notices.
- **ইউজার অনুমোদন:** pending student/teacher/staff of own branch → real Approve/Reject (status change + notification).
- **ব্রাঞ্চ ম্যানেজ:** edit own branch info (address/phone/photo/dates), view & manage teacher/staff list.
- **ক্লাস ম্যানেজ (CRUD):** create/edit/delete classes (হিফজ/সাধারণ), assign class-teacher.
- **আয়-ব্যয় (Finance):** income/expense entry, monthly bar + category pie charts, deficit alert, PDF/Excel export.
- **নোটিশ:** create/send branch notices.

### Regional Supervisor — multiple branches, VIEW-ONLY
Same sidebar shell as Principal but no edit/add buttons.
- **ড্যাশবোর্ড:** combined stats of accessible branches, branch-wise comparison.
- **শাখাসমূহ (view):** each branch detail (students/teachers/staff) — read only.
- **আয়-ব্যয় (view):** all accessible branches' finance reports/charts + export; no add/edit.
- **নোটিশ/রিপোর্ট (view):** monitor notices & activity across branches.

### Super Admin — everything, all branches
- **ড্যাশবোর্ড:** org-wide stats (125+ branches, totals), combined finance, system-wide pending.
- **ইউজার ও রোল ম্যানেজমেন্ট:** view all users, approve/reject anyone, change roles, **manage whitelist** (add Principal/Supervisor/Admin by email+role+branch).
- **শাখা ম্যানেজমেন্ট:** create/edit/delete any branch, assign principals.
- **আয়-ব্যয় (all):** view + add/edit all branches' finance, create/edit categories (e.g. "কোরবানির খরচ"), full reports/export.
- **কন্টেন্ট ম্যানেজমেন্ট:** notices/holidays/awards for any branch, read contact-form messages.
- **সেটিংস:** site-wide settings, category management.

### Student / Staff / Teacher (per earlier spec)
- **Student:** tabs — নোটিশ / পড়া আপডেট / আমার প্রোফাইল (read-only real data).
- **Staff:** own profile only.
- **Teacher:** 3 tabs — আমার শাখা / নোটিশ পাঠান / পড়া আপডেট (real writes, own branch).

> Role permission summary matrix lives in §2. Sidebar is intentionally data-driven so new menu options can be appended later per role without a rewrite.

## 14. Finance Module (detailed spec) ✅
Principal writes; Super Admin + Reg. Supervisor read. All real DB-backed.
- **Income form:** category (from `income_categories`) + amount + date + note + optional receipt upload. → real `income` row.
- **Expense form:** category (from `expense_categories`) + amount + date + note + optional receipt + added_by(auto). → real `expenses` row.
- **Reports (recharts):** monthly bar (income vs expense), category pie, yearly comparison — all computed from real rows.
- **Deficit alert:** if expense > income for month → red "ঘাটতি ৳X" banner.
- **Export:** PDF + Excel buttons (real data export).
- Categories editable from UI (Super Admin/Principal can add new, e.g. "কোরবানির খরচ") — no code change.

## 15. Home Page — section order & content ✅
1. Header: logo + org name/tagline + Login / My Profile pills (real auth state) + notification bell.
2. Nav: 8 items with icons, "..." overflow on narrow, active = gold.
3. Hero: Kaaba night bg + hanging gold lanterns + "ইলমের আলো ছড়াক প্রতিটি হৃদয়ে" (one word gold) + subtitle + white "আরও জানুন" pill → /branches. Prayer-times widget (from Aladhan API, user location).
4. Quick Links: 7 circular icon shortcuts (Branches, Directory, Notices, Holidays, Awards, Admission[NEW], Contact).
5. সর্বশেষ নোটিশ: dark card, real latest notice from DB.
6. আসন্ন কার্যক্রম: real upcoming events/holidays list + daily-rotating হাদিস/আয়াত quote card.
7. Stats counter (animated): live counts — ১২৫+ শাখা (real), শিক্ষার্থী, শিক্ষক (from views).
8. Footer: custom SVG mosque silhouette + links + contact.

## 16. Public Pages — content spec ✅
- **/about:** org history, mission, vision, leadership, photos. (dummy content until user provides real, but real page.)
- **/admission:** eligibility, step-by-step process, required documents, fees, apply CTA.
- **/contact:** address, phone, email, embedded map, working contact form (real submit → DB `contact_messages` table + admin notification).
- **/directory:** public teacher/staff (safe view — name/designation/photo/branch only).
- **/notices, /notices/[id]:** real notices from DB, filterable by branch.
- **/holidays:** calendar/list from real `holidays`.
- **/awards:** real awards from DB.

---

## 17. Responsive — two distinct polished versions ⭐
Both breakpoints must be individually beautiful, not one squished into the other. Match (or exceed) the two reference screenshots.
- **Desktop mode:** single-row nav (8 items, "..." overflow), side-by-side hero text + decoration, multi-column grids, sidebar dashboards, wide cards.
- **Portrait / mobile mode:** the reference mobile shot is the gold standard — 2-row nav, circular quick-link icons grid, stacked full-width cards (latest notice, events, quote), vertical rhythm, large tap targets, mosque-silhouette footer. Make it feel hand-crafted for phone, not a shrunk desktop.
- Tablet (768px) handled gracefully in between.
- Agent may improve on the references where it makes it more premium, keeping the same spirit.
- Test/verify at 375px, 768px, 1280px+ (user does visual check on phone).

## 18. Dashboard entry button (elevated roles) ✅
- When a logged-in user's role is **principal, regional_supervisor, or super_admin**, show a prominent **"Dashboard" (ড্যাশবোর্ড) button in the top header/navbar** (near the profile pill).
- Clicking routes to their role-appropriate panel:
  - super_admin → `/dashboard/admin`
  - principal → `/dashboard/principal`
  - regional_supervisor → `/dashboard/supervisor`
- Hidden for student/staff/teacher (teacher gets its dashboard link inside the profile dropdown instead, per §13).
- Button styled in gold accent to stand out as the "power user" entry point.

---

## 8. Progress log
- 2026-07-15: Planning. Read all old-build files, analyzed theme from 2 screenshots, locked theme + schema-fix strategy. Nothing built yet (awaiting user "start building").
