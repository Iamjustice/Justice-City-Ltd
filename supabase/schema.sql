-- Justice City - Supabase schema bootstrap
-- Run this in the Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Generic trigger function to maintain updated_at timestamps.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -------------------------------------------------------------------
-- USERS TABLE
-- -------------------------------------------------------------------
-- Mirrors the shape consumed by server/storage.ts
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- -------------------------------------------------------------------
-- VERIFICATIONS TABLE
-- -------------------------------------------------------------------
-- Stores Smile ID verification jobs submitted from the API.
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  mode text not null check (mode in ('kyc', 'biometric')),
  provider text not null check (provider in ('smile-id', 'mock')),
  status text not null check (status in ('approved', 'pending', 'failed')),
  job_id text not null unique,
  smile_job_id text,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_verifications_user_id on public.verifications (user_id);
create index if not exists idx_verifications_status on public.verifications (status);
create index if not exists idx_verifications_created_at on public.verifications (created_at desc);

create trigger trg_verifications_updated_at
before update on public.verifications
for each row
execute function public.set_updated_at();

-- -------------------------------------------------------------------
-- HELPER FUNCTION FOR CALLBACK HANDLING
-- -------------------------------------------------------------------
-- Optional helper your API can call via rpc() if needed later.
create or replace function public.update_verification_status(
  p_job_id text,
  p_status text,
  p_message text default null
)
returns void
language plpgsql
as $$
begin
  if p_status not in ('approved', 'pending', 'failed') then
    raise exception 'Invalid verification status: %', p_status;
  end if;

  update public.verifications
  set status = p_status,
      message = coalesce(p_message, message),
      updated_at = now()
  where job_id = p_job_id;
end;
$$;

-- -------------------------------------------------------------------
-- OPTIONAL VIEW FOR DASHBOARDING
-- -------------------------------------------------------------------
create or replace view public.verification_summary as
select
  status,
  count(*) as total
from public.verifications
group by status;
