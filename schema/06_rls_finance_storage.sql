-- ---------- FINANCE (income + expenses) ----------
-- read
drop policy if exists "finance_view" on income;
create policy "finance_view" on income for select to authenticated
  using (is_admin_role(array['super_admin','regional_supervisor'])
    or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role='principal' and up.branch_id = income.branch_id));
drop policy if exists "finance_view_expenses" on expenses;
create policy "finance_view_expenses" on expenses for select to authenticated
  using (is_admin_role(array['super_admin','regional_supervisor'])
    or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role='principal' and up.branch_id = expenses.branch_id));
-- insert (FIX: income was missing before)
drop policy if exists "finance_insert_income" on income;
create policy "finance_insert_income" on income for insert to authenticated with check (
  is_super_admin() or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role='principal' and up.branch_id = income.branch_id));
drop policy if exists "finance_insert_expenses" on expenses;
create policy "finance_insert_expenses" on expenses for insert to authenticated with check (
  is_super_admin() or exists (select 1 from user_profiles up where up.id = auth.uid() and up.role='principal' and up.branch_id = expenses.branch_id));

-- ---------- CLASSES ----------
drop policy if exists "public_read_classes" on classes;
create policy "public_read_classes" on classes for select using (true);
drop policy if exists "classes_admin_write" on classes;
create policy "classes_admin_write" on classes for all to authenticated
  using (is_admin_role(array['super_admin','principal'])) with check (is_admin_role(array['super_admin','principal']));

-- ---------- NOTICES ----------
drop policy if exists "public_read_notices" on notices;
create policy "public_read_notices" on notices for select using (true);
drop policy if exists "teachers_insert_branch_notices" on notices;
create policy "teachers_insert_branch_notices" on notices for insert to authenticated with check (
  sent_by = auth.uid()
  and exists (select 1 from user_profiles up where up.id = auth.uid() and up.role='teacher' and up.status='approved' and up.branch_id = notices.branch_id));
drop policy if exists "admin_insert_notices" on notices;
create policy "admin_insert_notices" on notices for insert to authenticated with check (
  is_admin_role(array['super_admin','principal']));

-- ---------- LESSON UPDATES ----------
drop policy if exists "public_read_lesson_updates" on lesson_updates;
create policy "public_read_lesson_updates" on lesson_updates for select using (true);
drop policy if exists "teachers_insert_lesson" on lesson_updates;
create policy "teachers_insert_lesson" on lesson_updates for insert to authenticated with check (
  created_by = auth.uid()
  and exists (select 1 from user_profiles up join classes c on c.id = lesson_updates.class_id
    where up.id = auth.uid() and up.role='teacher' and up.status='approved' and up.branch_id = c.branch_id));

-- ---------- HOLIDAYS / AWARDS ----------
drop policy if exists "public_read_holidays" on holidays;
create policy "public_read_holidays" on holidays for select using (true);
drop policy if exists "admin_write_holidays" on holidays;
create policy "admin_write_holidays" on holidays for all to authenticated
  using (is_super_admin()) with check (is_super_admin());
drop policy if exists "public_read_awards" on awards;
create policy "public_read_awards" on awards for select using (true);

-- ---------- NOTIFICATIONS ----------
drop policy if exists "notifications_self" on notifications;
create policy "notifications_self" on notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists "notifications_insert" on notifications;
create policy "notifications_insert" on notifications for insert to authenticated with check (true);

-- ---------- CONTACT MESSAGES ----------
drop policy if exists "contact_insert" on contact_messages;
create policy "contact_insert" on contact_messages for insert to authenticated with check (true);
drop policy if exists "contact_admin_read" on contact_messages;
create policy "contact_admin_read" on contact_messages for select to authenticated using (is_super_admin());

-- ---------- ADMIN_WHITELIST ----------
drop policy if exists "admin_whitelist_self_check" on admin_whitelist;
create policy "admin_whitelist_self_check" on admin_whitelist for select to authenticated using (email = (auth.jwt() ->> 'email'));
drop policy if exists "admin_whitelist_admin_read" on admin_whitelist;
create policy "admin_whitelist_admin_read" on admin_whitelist for select to authenticated using (is_super_admin());
drop policy if exists "admin_whitelist_admin_write" on admin_whitelist;
create policy "admin_whitelist_admin_write" on admin_whitelist for all to authenticated
  using (is_super_admin()) with check (is_super_admin());

-- ---------- REGIONAL SUPERVISORS ----------
drop policy if exists "reg_supervisor_self" on regional_supervisors;
create policy "reg_supervisor_self" on regional_supervisors for select to authenticated using (user_id = auth.uid());
drop policy if exists "reg_supervisor_admin" on regional_supervisors;
create policy "reg_supervisor_admin" on regional_supervisors for all to authenticated using (is_super_admin()) with check (is_super_admin());

-- ============================================================
-- STORAGE: profile-photos bucket (owner-scoped)
-- ============================================================
insert into storage.buckets (id, name, public) values ('profile-photos','profile-photos', true)
on conflict (id) do nothing;
drop policy if exists "profile_photos_public_read" on storage.objects;
create policy "profile_photos_public_read" on storage.objects for select using (bucket_id = 'profile-photos');
drop policy if exists "profile_photos_owner_write" on storage.objects;
create policy "profile_photos_owner_write" on storage.objects for insert to authenticated with check (
  bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql security definer set search_path = public;
drop trigger if exists trg_user_profiles_updated on user_profiles;
create trigger trg_user_profiles_updated before update on user_profiles for each row execute function set_updated_at();
drop trigger if exists trg_income_updated on income;
create trigger trg_income_updated before update on income for each row execute function set_updated_at();
drop trigger if exists trg_expenses_updated on expenses;
create trigger trg_expenses_updated before update on expenses for each row execute function set_updated_at();
