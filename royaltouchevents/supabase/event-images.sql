-- Royal Touch Events — event images + real event data
-- Run this once in Supabase Dashboard -> SQL Editor. Safe to re-run.

-- 1) Extra event columns used by the admin event form
alter table public.events add column if not exists lifecycle_state text not null default 'PUBLISHED';
alter table public.events add column if not exists description text;
alter table public.events add column if not exists poster_url text;
alter table public.events add column if not exists organizer_name text;
alter table public.events add column if not exists organizer_email text;
alter table public.events add column if not exists organizer_phone text;
alter table public.events add column if not exists start_time text;
alter table public.events add column if not exists end_time text;
alter table public.events add column if not exists ticket_classes jsonb not null default '[]'::jsonb;

-- 2) Let the public website list published events
grant select on public.events to anon;

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select to anon
  using (coalesce(lifecycle_state, 'PUBLISHED') <> 'DRAFT');

-- 3) Public storage bucket for event posters
insert into storage.buckets (id, name, public, file_size_limit)
values ('event-posters', 'event-posters', true, 5242880)
on conflict (id) do update set public = true, file_size_limit = 5242880;

-- 4) Storage policies: anyone can view, signed-in users can upload/manage
drop policy if exists "event_posters_read" on storage.objects;
create policy "event_posters_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'event-posters');

drop policy if exists "event_posters_insert" on storage.objects;
create policy "event_posters_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-posters');

drop policy if exists "event_posters_update" on storage.objects;
create policy "event_posters_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-posters')
  with check (bucket_id = 'event-posters');

drop policy if exists "event_posters_delete" on storage.objects;
create policy "event_posters_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-posters');
