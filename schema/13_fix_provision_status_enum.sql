-- profile_status enum is {pending, approved, rejected} (NOT 'active'/'inactive').
-- The provision_user_on_login() function originally inserted 'active', which failed silently
-- (enum error) so whitelisted admin profiles (incl. super_admin) were NEVER created.
-- Fixed to use 'approved' for whitelisted roles and 'pending' for others.
-- Applied via MCP apply_migration 13_fix_provision_status_enum on 2026-07-17.

CREATE OR REPLACE FUNCTION public.provision_user_on_login()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_uid uuid := auth.uid();
  v_email text := auth.jwt() ->> 'email';
  v_name text := coalesce(auth.jwt() -> 'user_metadata' ->> 'full_name', auth.jwt() -> 'user_metadata' ->> 'name');
  v_photo text := auth.jwt() -> 'user_metadata' ->> 'avatar_url';
  w record;
begin
  if v_uid is null then
    return;
  end if;

  select role, branch_id into w from admin_whitelist where lower(email) = lower(v_email) limit 1;

  if found then
    insert into user_profiles (id, email, full_name, photo_url, role, branch_id, status)
    values (v_uid, v_email, v_name, v_photo, w.role, w.branch_id, 'approved')
    on conflict (id) do update set
      role = excluded.role,
      branch_id = excluded.branch_id,
      status = 'approved',
      full_name = coalesce(user_profiles.full_name, excluded.full_name),
      photo_url = coalesce(excluded.photo_url, user_profiles.photo_url),
      updated_at = now();
  else
    insert into user_profiles (id, email, full_name, photo_url, role, status)
    values (v_uid, v_email, v_name, v_photo, 'student', 'pending')
    on conflict (id) do update set
      full_name = coalesce(user_profiles.full_name, excluded.full_name),
      photo_url = coalesce(excluded.photo_url, user_profiles.photo_url),
      updated_at = now();
  end if;
end;
$function$;
