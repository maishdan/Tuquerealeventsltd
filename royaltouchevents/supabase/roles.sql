-- Royal Touch Events — role management
-- Run this once in the Supabase SQL Editor.

-- 1. Make sure every profile has a role
alter table public.profiles alter column role set default 'customer';
update public.profiles set role = 'customer' where role is null;

-- 2. Helper: is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _user_id and role = 'admin'
  )
$$;

grant execute on function public.is_admin(uuid) to authenticated;

-- 3. Grants for the Data API
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

-- 4. Policies: admins can read everyone and change roles
drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()))
  with check (id = auth.uid() or public.is_admin(auth.uid()));

-- 5. Make your own account an admin (change the email if needed)
update public.profiles set role = 'admin'
where email = 'eventsroyaltouch7@gmail.com';
