create table if not exists startups (
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
  logo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table startups enable row level security;
create policy "Anyone authenticated can view startups" on startups
  for select using (auth.role() = 'authenticated');
create policy "Founder can manage their startup" on startups
  for all using (auth.uid() = founder_id);
