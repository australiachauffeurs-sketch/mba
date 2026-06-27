create table if not exists mentor_sessions (
  id uuid default gen_random_uuid() primary key,
  mentor_id uuid references profiles(id) on delete cascade not null,
  mentee_id uuid references profiles(id) on delete cascade not null,
  status text default 'requested' check (status in ('requested','accepted','completed','declined')),
  topic text,
  notes text,
  scheduled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table mentor_sessions enable row level security;
create policy "Participants can view their sessions" on mentor_sessions
  for select using (auth.uid() = mentor_id or auth.uid() = mentee_id);
create policy "Mentee can request a session" on mentor_sessions
  for insert with check (auth.uid() = mentee_id);
create policy "Participants can update session" on mentor_sessions
  for update using (auth.uid() = mentor_id or auth.uid() = mentee_id);
