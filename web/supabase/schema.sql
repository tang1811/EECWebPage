-- ════════════════════════════════════════════════════════════════
-- EEC Admission — Supabase schema
-- Run in Supabase Studio → SQL Editor (paste whole file, Run).
-- Idempotent-ish: safe to re-run (uses IF NOT EXISTS / OR REPLACE).
-- ════════════════════════════════════════════════════════════════

-- ── Status enum ─────────────────────────────────────────────────
do $$ begin
  create type application_status as enum (
    'submitted',       -- ส่งใบสมัครแล้ว
    'reviewing',       -- กำลังตรวจสอบเอกสาร
    'docs_incomplete', -- เอกสารไม่ครบ
    'accepted',        -- ผ่านการคัดเลือก
    'rejected',        -- ไม่ผ่าน
    'enrolled'         -- มอบตัว/ลงทะเบียนแล้ว
  );
exception when duplicate_object then null; end $$;

-- ── applications ────────────────────────────────────────────────
-- One row per applicant. PK = auth user id (1 applicant : 1 application).
create table if not exists public.applications (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  app_no         text unique not null,
  national_id    text not null,                 -- 13 digits, no dashes
  dob            date,
  -- program
  level          text,
  round          text,
  major          text,
  -- personal
  title          text,
  first_name     text,
  last_name      text,
  phone          text,
  email          text,
  address        text,
  -- guardian
  guardian_name  text,
  guardian_rel   text,
  guardian_phone text,
  -- education
  prev_school    text,
  prev_level     text,
  gpa            text,
  knew           text,
  note           text,
  -- full form snapshot (apply + portal share this; extra fields live here)
  form_data      jsonb not null default '{}'::jsonb,
  -- workflow
  status         application_status not null default 'submitted',
  paid           boolean not null default false,
  submitted_at   timestamptz,                   -- set when applicant finalizes
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists applications_national_id_idx on public.applications (national_id);
create index if not exists applications_status_idx on public.applications (status);

-- ── status timeline events ──────────────────────────────────────
create table if not exists public.application_status_events (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.applications(user_id) on delete cascade,
  status      application_status not null,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists status_events_user_idx on public.application_status_events (user_id, created_at);

-- ── document metadata (files live in Storage bucket 'application-docs') ──
create table if not exists public.application_documents (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.applications(user_id) on delete cascade,
  doc_type    text not null,                    -- e.g. 'idcard','transcript','photo','house'
  file_path   text not null,                    -- storage path: {user_id}/{doc_type}/{filename}
  file_name   text,
  uploaded_at timestamptz not null default now(),
  unique (user_id, doc_type)
);

-- ════════════════════════════════════════════════════════════════
-- Triggers — keep updated_at fresh + log status changes to timeline
-- ════════════════════════════════════════════════════════════════
create or replace function public.tg_applications_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists applications_touch on public.applications;
create trigger applications_touch
  before update on public.applications
  for each row execute function public.tg_applications_touch();

create or replace function public.tg_log_status()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') or (new.status is distinct from old.status) then
    insert into public.application_status_events (user_id, status)
    values (new.user_id, new.status);
  end if;
  return new;
end $$;

drop trigger if exists applications_log_status on public.applications;
create trigger applications_log_status
  after insert or update of status on public.applications
  for each row execute function public.tg_log_status();

-- ════════════════════════════════════════════════════════════════
-- Row Level Security — applicants see/edit ONLY their own row
-- ════════════════════════════════════════════════════════════════
alter table public.applications            enable row level security;
alter table public.application_status_events enable row level security;
alter table public.application_documents   enable row level security;

-- applications: owner full access to own row
drop policy if exists app_select_own on public.applications;
create policy app_select_own on public.applications
  for select using (auth.uid() = user_id);

drop policy if exists app_insert_own on public.applications;
create policy app_insert_own on public.applications
  for insert with check (auth.uid() = user_id);

drop policy if exists app_update_own on public.applications;
create policy app_update_own on public.applications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- NOTE: applicants can update their own row incl. status. For production,
-- lock status changes to staff via a separate admin role/service_role and
-- drop status from the applicant-updatable columns (use a column grant).

-- status events: owner can read own timeline (inserts happen via trigger as definer)
drop policy if exists evt_select_own on public.application_status_events;
create policy evt_select_own on public.application_status_events
  for select using (auth.uid() = user_id);

-- documents: owner full access to own metadata rows
drop policy if exists doc_all_own on public.application_documents;
create policy doc_all_own on public.application_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════
-- Storage — private bucket for uploaded documents
-- ════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('application-docs', 'application-docs', false)
on conflict (id) do nothing;

-- owner can manage files under their own {user_id}/... prefix
drop policy if exists docs_owner_rw on storage.objects;
create policy docs_owner_rw on storage.objects
  for all to authenticated
  using (bucket_id = 'application-docs' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'application-docs' and (storage.foldername(name))[1] = auth.uid()::text);
