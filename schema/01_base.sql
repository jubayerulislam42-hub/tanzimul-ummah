-- ============================================================
-- তানযীমুল উম্মাহ হিফয মাদরাসা — Master Schema (idempotent)
-- Apply via Supabase SQL editor / MCP. Safe to re-run.
-- Consolidates: base + onboarding + admin + teacher-dashboard, with fixes.
-- ============================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";

-- ---------- ENUM TYPES ----------
do $$ begin create type branch_type as enum ('Hifz Madrasah','Girls Hifz Madrasah','Girls Madrasah','Alim Madrasah','Hifz School','Pre-Hifz Madrasah'); exception when duplicate_object then null; end $$;
do $$ begin create type user_role as enum ('student','staff','teacher','principal','regional_supervisor','super_admin'); exception when duplicate_object then null; end $$;
do $$ begin create type profile_status as enum ('pending','approved','rejected'); exception when duplicate_object then null; end $$;
do $$ begin create type record_status as enum ('active','inactive','completed','transferred'); exception when duplicate_object then null; end $$;
do $$ begin create type class_category as enum ('হিফজ','সাধারণ'); exception when duplicate_object then null; end $$;

-- ---------- BRANCHES ----------
create table if not exists branches (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name_bn text not null,
  name_en text not null,
  type branch_type not null,
  division text not null,
  district text not null,
  address text,
  phone text,
  email text,
  established_date date,
  cover_photo_url text,
  gallery_urls text[] default '{}',
  latitude numeric,
  longitude numeric,
  status record_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- USER_PROFILES ----------
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  photo_url text,
  role user_role not null default 'student',
  branch_id uuid references branches(id),
  status profile_status default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
