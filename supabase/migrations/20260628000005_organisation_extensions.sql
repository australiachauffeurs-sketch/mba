-- Extend events table for organisation dashboard
alter table events
  add column if not exists organiser_id uuid references profiles(id),
  add column if not exists date timestamptz,
  add column if not exists end_date timestamptz,
  add column if not exists event_type text default 'seminar',
  add column if not exists is_virtual boolean default false,
  add column if not exists virtual_link text,
  add column if not exists max_attendees int,
  add column if not exists registration_deadline timestamptz,
  add column if not exists tags text[] default '{}';

-- Sync organiser_id from organizer_id on insert/update for backwards compat
create or replace function sync_organiser_id()
returns trigger language plpgsql as $$
begin
  if NEW.organiser_id is null and NEW.organizer_id is not null then
    NEW.organiser_id := NEW.organizer_id;
  end if;
  if NEW.organizer_id is null and NEW.organiser_id is not null then
    NEW.organizer_id := NEW.organiser_id;
  end if;
  -- also sync date/event_date
  if NEW.date is null and NEW.event_date is not null then
    NEW.date := NEW.event_date;
  end if;
  if NEW.event_date is null and NEW.date is not null then
    NEW.event_date := NEW.date;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_sync_organiser on events;
create trigger trg_sync_organiser
  before insert or update on events
  for each row execute function sync_organiser_id();

-- Add organiser_id policy
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'events' and policyname = 'events_manage_organiser') then
    execute 'create policy "events_manage_organiser" on events for all using (auth.uid() = organiser_id)';
  end if;
end $$;

-- Extend opportunities table with new columns
alter table opportunities
  add column if not exists industry text,
  add column if not exists work_mode text default 'hybrid',
  add column if not exists stipend text,
  add column if not exists start_date date,
  add column if not exists skills_required text[] default '{}',
  add column if not exists benefits text,
  add column if not exists open boolean default true;

-- Update type check to include more types
alter table opportunities drop constraint if exists opportunities_type_check;
alter table opportunities add constraint opportunities_type_check
  check (type in ('internship','full-time','fulltime','part-time','contract','volunteer','research','workshop','other'));

-- opportunity_applications: separate from the existing applications table
create table if not exists opportunity_applications (
  id uuid default gen_random_uuid() primary key,
  opportunity_id uuid references opportunities(id) on delete cascade not null,
  applicant_id uuid references profiles(id) on delete cascade not null,
  organisation_id uuid references profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending','reviewing','shortlisted','accepted','rejected')),
  cover_letter text,
  resume_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(opportunity_id, applicant_id)
);

alter table opportunity_applications enable row level security;

create policy "opp_app_select_applicant" on opportunity_applications
  for select using (auth.uid() = applicant_id);

create policy "opp_app_select_org" on opportunity_applications
  for select using (auth.uid() = organisation_id);

create policy "opp_app_insert" on opportunity_applications
  for insert with check (auth.uid() = applicant_id);

create policy "opp_app_update_org" on opportunity_applications
  for update using (auth.uid() = organisation_id);

-- Auto-set organisation_id from opportunities.posted_by on insert
create or replace function set_opp_app_org()
returns trigger language plpgsql security definer as $$
begin
  select posted_by into NEW.organisation_id
  from opportunities where id = NEW.opportunity_id;
  return NEW;
end;
$$;

drop trigger if exists trg_set_opp_app_org on opportunity_applications;
create trigger trg_set_opp_app_org
  before insert on opportunity_applications
  for each row execute function set_opp_app_org();
