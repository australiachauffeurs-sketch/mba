-- Add organisation role to the platform

-- Expand the role check constraint
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('student', 'alumni', 'faculty', 'investor', 'admin', 'organisation'));

-- Organisation profiles table
create table if not exists organisation_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  org_type text check (org_type in ('club', 'company', 'ngo', 'startup', 'association', 'institute', 'government', 'other')),
  description text,
  website text,
  industry text,
  org_size text check (org_size in ('1-10', '11-50', '51-200', '201-500', '500+')),
  founded_year int,
  location text,
  logo_url text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  headline text,
  verified boolean default false,
  updated_at timestamptz default now()
);

alter table organisation_profiles enable row level security;
create policy "org_profiles_select" on organisation_profiles for select using (auth.role() = 'authenticated');
create policy "org_profiles_manage" on organisation_profiles for all using (
  exists (select 1 from profiles where id = profile_id and id = auth.uid())
);
