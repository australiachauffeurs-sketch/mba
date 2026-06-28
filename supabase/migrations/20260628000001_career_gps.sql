-- Career GPS: roadmap storage + enrichment updates table

-- Add roadmap columns to student_profiles
alter table student_profiles
  add column if not exists career_roadmap jsonb,
  add column if not exists career_roadmap_at timestamptz,
  add column if not exists ai_enriched_at timestamptz;

-- Career GPS updates: cron job appends here, never touches the original roadmap
create table if not exists career_gps_updates (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('opportunity','connection','event','mentor','research')),
  title text not null,
  description text,
  why_relevant text,
  reference_id uuid,
  reference_type text check (reference_type in ('opportunity','event','profile')),
  created_at timestamptz default now()
);

alter table career_gps_updates enable row level security;

-- Students can read their own updates
create policy "gps_updates_select_own" on career_gps_updates
  for select using (auth.uid() = student_id);

-- Service role (cron) can insert for any student
create policy "gps_updates_service_insert" on career_gps_updates
  for insert with check (true);
