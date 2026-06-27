-- Applications table
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  opportunity_id uuid references opportunities(id) on delete cascade not null,
  applicant_id uuid references profiles(id) on delete cascade not null,
  status text default 'applied' check (status in ('applied','reviewed','shortlisted','rejected','offered')),
  cover_note text,
  created_at timestamptz default now(),
  unique(opportunity_id, applicant_id)
);
alter table applications enable row level security;
create policy "app_select_own" on applications for select using (auth.uid() = applicant_id or auth.uid() in (select posted_by from opportunities where id = opportunity_id));
create policy "app_insert" on applications for insert with check (auth.uid() = applicant_id);
create policy "app_update_poster" on applications for update using (auth.uid() in (select posted_by from opportunities where id = opportunity_id));

-- Events / clubs table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date timestamptz,
  location text,
  type text default 'event' check (type in ('event','club','competition','conference','scholarship','workshop')),
  organizer_id uuid references profiles(id),
  link text,
  active boolean default true,
  created_at timestamptz default now()
);
alter table events enable row level security;
create policy "events_select" on events for select using (auth.role() = 'authenticated');
create policy "events_manage" on events for all using (auth.uid() = organizer_id);

-- Platform settings
create table if not exists platform_settings (
  id text primary key default 'global',
  min_match_threshold int default 70,
  max_intros_per_week int default 5,
  email_notifications bool default true,
  weekly_digest bool default true,
  require_admin_approval bool default false,
  from_name text default 'UniConnect',
  reply_to text default 'hello@uniconnect.ai',
  updated_at timestamptz default now()
);
insert into platform_settings (id) values ('global') on conflict do nothing;
alter table platform_settings enable row level security;
create policy "settings_read" on platform_settings for select using (auth.role() = 'authenticated');
create policy "settings_write" on platform_settings for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Notification trigger: connection request/accept
create or replace function notify_on_connection()
returns trigger language plpgsql security definer as $$
declare
  requester_name text;
  recipient_name text;
begin
  select full_name into requester_name from profiles where id = NEW.requester_id;
  select full_name into recipient_name from profiles where id = NEW.recipient_id;

  if TG_OP = 'INSERT' then
    insert into notifications(user_id, type, title, body, link)
    values(NEW.recipient_id, 'connection_request', 'New connection request',
      requester_name || ' wants to connect with you', '/notifications');

  elsif TG_OP = 'UPDATE' and NEW.status = 'accepted' and OLD.status = 'pending' then
    insert into notifications(user_id, type, title, body, link)
    values(NEW.requester_id, 'connection_accepted', 'Connection accepted',
      recipient_name || ' accepted your connection request', '/notifications');
  end if;
  return NEW;
end;
$$;
drop trigger if exists trg_notify_connection on connections;
create trigger trg_notify_connection
  after insert or update on connections
  for each row execute function notify_on_connection();

-- Notification trigger: new message
create or replace function notify_on_message()
returns trigger language plpgsql security definer as $$
declare
  sender_name text;
begin
  select full_name into sender_name from profiles where id = NEW.sender_id;
  insert into notifications(user_id, type, title, body, link)
  values(NEW.recipient_id, 'new_message', 'New message',
    sender_name || ' sent you a message', '/student/messages');
  return NEW;
end;
$$;
drop trigger if exists trg_notify_message on messages;
create trigger trg_notify_message
  after insert on messages
  for each row execute function notify_on_message();

-- Notification trigger: mentor session requested
create or replace function notify_on_mentor_session()
returns trigger language plpgsql security definer as $$
declare
  mentee_name text;
begin
  select full_name into mentee_name from profiles where id = NEW.mentee_id;
  insert into notifications(user_id, type, title, body, link)
  values(NEW.mentor_id, 'mentor_request', 'New mentoring request',
    mentee_name || ' has requested a mentoring session', '/alumni/mentoring');
  return NEW;
end;
$$;
drop trigger if exists trg_notify_mentor on mentor_sessions;
create trigger trg_notify_mentor
  after insert on mentor_sessions
  for each row execute function notify_on_mentor_session();
