-- Run this in your Supabase SQL editor at:
-- https://supabase.com/dashboard/project/_/sql

create extension if not exists "uuid-ossp";

-- Companies
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  website text,
  industry text,
  location text,
  logo_url text,
  created_at timestamptz default now()
);

-- Applications
create table if not exists applications (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade,
  role_title text not null,
  stage text not null default 'wishlist',
  applied_date date,
  salary_min integer,
  salary_max integer,
  job_url text,
  description text,
  priority text not null default 'medium',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references applications(id) on delete cascade,
  name text not null,
  email text,
  linkedin text,
  role text,
  notes text,
  created_at timestamptz default now()
);

-- Notes
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references applications(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Follow-ups
create table if not exists follow_ups (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references applications(id) on delete cascade,
  due_date date not null,
  message text,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger applications_updated_at
  before update on applications
  for each row execute function update_updated_at();

-- Enable Row Level Security (optional — disable for personal use)
-- alter table companies enable row level security;
-- alter table applications enable row level security;
-- alter table contacts enable row level security;
-- alter table notes enable row level security;
-- alter table follow_ups enable row level security;
