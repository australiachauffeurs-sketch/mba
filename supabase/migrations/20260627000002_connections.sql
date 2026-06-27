create table if not exists connections (
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
create policy "Users can view their own connections" on connections
  for select using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "Users can create connection requests" on connections
  for insert with check (auth.uid() = requester_id);
create policy "Recipient can update connection status" on connections
  for update using (auth.uid() = recipient_id or auth.uid() = requester_id);
