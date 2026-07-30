-- Royal Touch Events — full database setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- Safe to re-run (idempotent).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- TABLES

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  city text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  event_type text not null,
  event_date date,
  guests text,
  budget text not null,
  services jsonb not null default '[]'::jsonb,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'planning', 'inquiry', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  name text not null,
  event_type text not null,
  event_date date,
  venue text,
  budget numeric,
  status text not null default 'upcoming' check (status in ('in-progress', 'upcoming', 'completed', 'delayed', 'confirmed', 'planning', 'inquiry')),
  team_count int default 0,
  vendor_count int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  from_name text not null,
  from_role text,
  subject text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  record_type text not null check (record_type in ('revenue', 'expense', 'invoice')),
  label text not null,
  amount numeric not null default 0,
  client_name text,
  due_date date,
  month_key text,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  performance_score int default 0 check (performance_score between 0 and 100),
  events_managed int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  item_name text not null,
  order_date date not null default current_date,
  total_amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------- DATA API GRANTS

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.contact_inquiries to authenticated;
grant select, insert, update, delete on public.events to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.financial_records to authenticated;
grant select, insert, update, delete on public.team_members to authenticated;
grant select, insert, update, delete on public.orders to authenticated;

-- public website forms (not signed in)
grant insert on public.bookings to anon;
grant insert on public.contact_inquiries to anon;

grant all on public.profiles, public.bookings, public.contact_inquiries,
  public.events, public.messages, public.financial_records, public.team_members,
  public.orders
  to service_role;

-- ------------------------------------------------- TRIGGERS / HELPERS

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- security definer role check (avoids recursive RLS on profiles)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------- RLS

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.events enable row level security;
alter table public.messages enable row level security;
alter table public.financial_records enable row level security;
alter table public.team_members enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "bookings_insert_public" on public.bookings;
create policy "bookings_insert_public" on public.bookings
  for insert to anon, authenticated with check (true);

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings
  for select to authenticated using (
    user_id = auth.uid()
    or email = (select email from public.profiles where id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "bookings_update_admin" on public.bookings;
create policy "bookings_update_admin" on public.bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings_delete_admin" on public.bookings;
create policy "bookings_delete_admin" on public.bookings
  for delete to authenticated using (public.is_admin());

drop policy if exists "contact_insert_public" on public.contact_inquiries;
create policy "contact_insert_public" on public.contact_inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "contact_select_admin" on public.contact_inquiries;
create policy "contact_select_admin" on public.contact_inquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "contact_update_admin" on public.contact_inquiries;
create policy "contact_update_admin" on public.contact_inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "events_admin_all" on public.events;
create policy "events_admin_all" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "messages_insert_admin" on public.messages;
create policy "messages_insert_admin" on public.messages
  for insert to authenticated with check (public.is_admin());

drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages
  for update to authenticated using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "financial_admin" on public.financial_records;
create policy "financial_select_own" on public.financial_records
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy "financial_admin_all" on public.financial_records
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "team_select" on public.team_members;
create policy "team_select" on public.team_members
  for select to authenticated using (true);

drop policy if exists "team_admin" on public.team_members;
create policy "team_admin" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- --------------------------------------------------------- SEED DATA

insert into public.team_members (full_name, role, performance_score, events_managed)
select * from (values
  ('Brian Ouma', 'Head of Production', 98, 24),
  ('Aisha Hassan', 'Lead Planner', 96, 31),
  ('David Mwangi', 'Technical Director', 94, 18),
  ('Wanjiru Karanja', 'Creative Director', 92, 22)
) as v(full_name, role, performance_score, events_managed)
where not exists (select 1 from public.team_members);

-- Seed some orders for demonstration (linked to potential admin email)
-- In a real scenario, these would be created via the dashboard or website.
insert into public.orders (item_name, order_date, total_amount, status)
select * from (values
  ('Premium Lighting Rig - Concert setup', current_date - interval '2 days', 45000, 'confirmed'),
  ('Luxury Floral Architecture - Wedding Package', current_date - interval '5 days', 120000, 'shipped')
) as v(item_name, order_date, total_amount, status)
where not exists (select 1 from public.orders);

-- ------------------------------------------------------ MAKE ADMIN
-- After you register your account, run this once with your email:
-- update public.profiles set role = 'admin' where email = 'eventsroyaltouch7@gmail.com';
