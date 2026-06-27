create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  recipient_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "Users can view their messages" on messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send messages" on messages
  for insert with check (auth.uid() = sender_id);
create policy "Recipient can mark read" on messages
  for update using (auth.uid() = recipient_id);
