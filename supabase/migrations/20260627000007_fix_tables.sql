-- Fix connections table
drop table if exists connections cascade;
create table connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references profiles(id) on delete cascade not null,
  recipient_id uuid references profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending','accepted','declined')),
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(requester_id, recipient_id)
);
alter table connections enable row level security;
create policy "view_own_connections" on connections for select using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "create_connection" on connections for insert with check (auth.uid() = requester_id);
create policy "update_connection" on connections for update using (auth.uid() = recipient_id or auth.uid() = requester_id);

-- Fix messages table
drop table if exists messages cascade;
create table messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  recipient_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);
alter table messages enable row level security;
create policy "view_own_messages" on messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "send_message" on messages for insert with check (auth.uid() = sender_id);
create policy "mark_read" on messages for update using (auth.uid() = recipient_id);

-- Fix opportunities table
drop table if exists opportunities cascade;
create table opportunities (
  id uuid default gen_random_uuid() primary key,
  posted_by uuid references profiles(id) on delete cascade not null,
  title text not null,
  company text,
  type text default 'internship' check (type in ('internship','fulltime','research','contract')),
  description text,
  requirements text[] default '{}',
  location text,
  salary_range text,
  deadline date,
  active boolean default true,
  created_at timestamptz default now()
);
alter table opportunities enable row level security;
create policy "view_opportunities" on opportunities for select using (auth.role() = 'authenticated');
create policy "manage_opportunity" on opportunities for all using (auth.uid() = posted_by);

-- Fix startups table
drop table if exists startups cascade;
create table startups (
  id uuid default gen_random_uuid() primary key,
  founder_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  tagline text,
  description text,
  sector text,
  stage text check (stage in ('idea','pre-seed','seed','series-a','series-b','growth','acquired')),
  website text,
  raising boolean default false,
  funding_target text,
  hiring boolean default false,
  team_size int default 1,
  founded_year int,
  created_at timestamptz default now()
);
alter table startups enable row level security;
create policy "view_startups" on startups for select using (auth.role() = 'authenticated');
create policy "manage_startup" on startups for all using (auth.uid() = founder_id);

-- Fix mentor_sessions table
drop table if exists mentor_sessions cascade;
create table mentor_sessions (
  id uuid default gen_random_uuid() primary key,
  mentor_id uuid references profiles(id) on delete cascade not null,
  mentee_id uuid references profiles(id) on delete cascade not null,
  status text default 'requested' check (status in ('requested','accepted','completed','declined')),
  topic text,
  notes text,
  scheduled_at timestamptz,
  created_at timestamptz default now()
);
alter table mentor_sessions enable row level security;
create policy "view_sessions" on mentor_sessions for select using (auth.uid() = mentor_id or auth.uid() = mentee_id);
create policy "request_session" on mentor_sessions for insert with check (auth.uid() = mentee_id);
create policy "update_session" on mentor_sessions for update using (auth.uid() = mentor_id or auth.uid() = mentee_id);

-- Notifications table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  body text,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
create policy "view_own_notifications" on notifications for select using (auth.uid() = user_id);
create policy "mark_notification_read" on notifications for update using (auth.uid() = user_id);
