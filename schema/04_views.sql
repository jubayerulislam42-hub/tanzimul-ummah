-- ============================================================
-- VIEWS (computed/aggregate — never store counts, no PII leaks)
-- ============================================================

-- branch public stats (live counts)
create or replace view branch_public_stats as
select
  b.id as branch_id,
  (select count(*) from students s where s.branch_id = b.id and s.status = 'active') as student_count,
  (select count(*) from teachers t where t.branch_id = b.id and t.status = 'active')
   + (select count(*) from staff f where f.branch_id = b.id and f.status = 'active') as teacher_count
from branches b;

-- public student counts only (no individual rows)
create or replace view public_branch_student_counts as
select branch_id, count(*) as student_count
from students where status = 'active' group by branch_id;

-- PUBLIC teacher/staff directory — ONLY safe columns (no salary/phone)
create or replace view public_teachers_directory as
select id, name_bn, name_en, designation, photo_url, branch_id, status
from teachers where status = 'active';

create or replace view public_staff_directory as
select id, name_bn, name_en, designation, photo_url, branch_id, status
from staff where status = 'active';

-- ============================================================
-- HELPER FUNCTIONS (SECURITY DEFINER — avoid RLS recursion)
-- ============================================================
create or replace function is_super_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from user_profiles where id = auth.uid() and role = 'super_admin');
$$;
revoke all on function is_super_admin() from public;
grant execute on function is_super_admin() to authenticated;

create or replace function is_admin_role(required_roles text[])
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from user_profiles where id = auth.uid() and role = any(required_roles));
$$;
revoke all on function is_admin_role(text[]) from public;
grant execute on function is_admin_role(text[]) to authenticated;
