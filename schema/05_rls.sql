-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table branches enable row level security;
alter table students enable row level security;
alter table teachers enable row level security;
alter table staff enable row level security;
alter table income enable row level security;
alter table expenses enable row level security;
alter table user_profiles enable row level security;
alter table classes enable row level security;
alter table notices enable row level security;
alter table lesson_updates enable row level security;
alter table holidays enable row level security;
alter table awards enable row level security;
alter table notifications enable row level security;
alter table contact_messages enable row level security;
alter table admin_whitelist enable row level security;
alter table regional_supervisors enable row level security;

-- ---------- BRANCHES: public read ----------
drop policy if exists "public_read_branches" on branches;
create policy "public_read_branches" on branches for select using (true);
drop policy if exists "admin_write_branches" on branches;
create policy "admin_write_branches" on branches for all to authenticated
  using (is_admin_role(array['super_admin','principal'])) with check (is_admin_role(array['super_admin','principal']));

-- ---------- USER_PROFILES ----------
drop policy if exists "user_profiles_self_insert" on user_profiles;
create policy "user_profiles_self_insert" on user_profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "user_profiles_self_select" on user_profiles;
create policy "user_profiles_self_select" on user_profiles for select to authenticated using (id = auth.uid());
drop policy if exists "user_profiles_self_update" on user_profiles;
create policy "user_profiles_self_update" on user_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "user_profiles_admin_select" on user_profiles;
create policy "user_profiles_admin_select" on user_profiles for select to authenticated using (is_super_admin());
drop policy if exists "user_profiles_admin_update" on user_profiles;
create policy "user_profiles_admin_update" on user_profiles for update to authenticated using (is_super_admin()) with check (is_super_admin());

-- ---------- STUDENTS ----------
drop policy if exists "public_read_approved_students" on students;
create policy "public_read_approved_students" on students for select using (status = 'active');
drop policy if exists "students_self_select" on students;
create policy "students_self_select" on students for select to authenticated using (user_id = auth.uid());
drop policy if exists "students_self_insert" on students;
create policy "students_self_insert" on students for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "teachers_read_branch_students" on students;
create policy "teachers_read_branch_students" on students for select to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'teacher' and up.status = 'approved' and up.branch_id = students.branch_id));
drop policy if exists "principal_read_branch_students" on students;
create policy "principal_read_branch_students" on students for select to authenticated
  using (exists (select 1 from user_profiles up where up.id = auth.uid() and up.role = 'principal' and up.branch_id = students.branch_id));

-- ---------- TEACHERS ----------
drop policy if exists "teachers_self_select" on teachers;
create policy "teachers_self_select" on teachers for select to authenticated using (user_id = auth.uid());
drop policy if exists "teachers_self_insert" on teachers;
create policy "teachers_self_insert" on teachers for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "teachers_public_dir" on teachers;
create policy "teachers_public_dir" on teachers for select using (status = 'active');

-- ---------- STAFF ----------
drop policy if exists "staff_self_select" on staff;
create policy "staff_self_select" on staff for select to authenticated using (user_id = auth.uid());
drop policy if exists "staff_self_insert" on staff;
create policy "staff_self_insert" on staff for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "staff_public_dir" on staff;
create policy "staff_public_dir" on staff for select using (status = 'active');
