create table if not exists opportunities (
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table opportunities enable row level security;
create policy "Authenticated users can view active opportunities" on opportunities
  for select using (auth.role() = 'authenticated' and active = true);
create policy "Poster can manage their opportunities" on opportunities
  for all using (auth.uid() = posted_by);
