-- Royal Touch Events — run this in Supabase SQL Editor
-- Then create Storage buckets in Dashboard: event-assets (public), profile-avatars (public)

-- Extensions
create extension if not exists "pgcrypto";

-- Profiles (linked to auth.users)
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

-- Bookings (public booking form + customer dashboard)
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

-- Contact form inquiries
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

-- Production events (admin command center + customer events)
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

-- Client messages
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

-- Financial records (admin finance hub)
create table if not exists public.financial_records (
  id uuid primary key default gen_random_uuid(),
  record_type text not null check (record_type in ('revenue', 'expense', 'invoice')),
  label text not null,
  amount numeric not null default 0,
  client_name text,
  due_date date,
  month_key text,
  created_at timestamptz not null default now()
);

-- Team members (admin team page)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  performance_score int default 0 check (performance_score between 0 and 100),
  events_managed int default 0,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
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
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at helper
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

-- RLS
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.events enable row level security;
alter table public.messages enable row level security;
alter table public.financial_records enable row level security;
alter table public.team_members enable row level security;

-- Helper: is admin
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

-- Profiles policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Bookings: anyone can insert (public form), users see own, admin sees all
create policy "bookings_insert_public" on public.bookings for insert with check (true);
create policy "bookings_select_own" on public.bookings for select using (
  user_id = auth.uid() or email = (select email from public.profiles where id = auth.uid()) or public.is_admin()
);
create policy "bookings_update_admin" on public.bookings for update using (public.is_admin());

-- Contact inquiries: public insert, admin read/update
create policy "contact_insert_public" on public.contact_inquiries for insert with check (true);
create policy "contact_select_admin" on public.contact_inquiries for select using (public.is_admin());
create policy "contact_update_admin" on public.contact_inquiries for update using (public.is_admin());

-- Events
create policy "events_select" on public.events for select using (user_id = auth.uid() or public.is_admin());
create policy "events_admin_all" on public.events for all using (public.is_admin());

-- Messages
create policy "messages_select_own" on public.messages for select using (user_id = auth.uid() or public.is_admin());
create policy "messages_insert_admin" on public.messages for insert with check (public.is_admin());

-- Financial + team: admin only
create policy "financial_admin" on public.financial_records for all using (public.is_admin());
create policy "team_admin" on public.team_members for all using (public.is_admin());

-- Storage buckets (run in SQL or Dashboard)
-- insert into storage.buckets (id, name, public) values ('event-assets', 'event-assets', true);
-- insert into storage.buckets (id, name, public) values ('profile-avatars', 'profile-avatars', true);

-- Promote your account to admin after first signup:
-- update public.profiles set role = 'admin' where email = 'your@email.com';

-- Optional seed data for dashboards (run after tables exist)
insert into public.team_members (full_name, role, performance_score, events_managed) values
  ('Brian Ouma', 'Head of Production', 98, 24),
  ('Aisha Hassan', 'Lead Planner', 96, 31),
  ('David Mwangi', 'Technical Director', 94, 18),
  ('Wanjiru Karanja', 'Creative Director', 92, 22);
