-- Enable pgvector for AI matching
create extension if not exists vector;

-- ============================================================
-- PROFILES (base table for all users)
-- ============================================================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('student', 'alumni', 'faculty', 'investor', 'admin')),
  full_name text not null,
  email text not null,
  avatar_url text,
  headline text,
  bio text,
  location text,
  linkedin_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- STUDENT PROFILES
-- ============================================================
create table public.student_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  program text,
  graduation_year int,
  gpa numeric(3,2),
  career_goals text,
  industries_of_interest text[],
  skills text[],
  startup_interest boolean default false,
  internship_seeking boolean default true
);

-- ============================================================
-- ALUMNI PROFILES
-- ============================================================
create table public.alumni_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  graduation_year int,
  current_company text,
  current_title text,
  industry text,
  expertise text[],
  open_to_mentoring boolean default true,
  hiring boolean default false,
  hiring_roles text[]
);

-- ============================================================
-- FACULTY PROFILES
-- ============================================================
create table public.faculty_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  department text,
  research_areas text[],
  courses_taught text[],
  open_to_collaboration boolean default true
);

-- ============================================================
-- INVESTOR PROFILES
-- ============================================================
create table public.investor_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  firm text,
  investment_thesis text,
  industries text[],
  stages text[],
  ticket_size_min int,
  ticket_size_max int,
  geography text[]
);

-- ============================================================
-- PROFILE EMBEDDINGS (pgvector — the AI matching engine)
-- ============================================================
create table public.profile_embeddings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  embedding vector(1536),  -- OpenAI text-embedding-3-small dimension
  embedding_text text,     -- the text that was embedded (for debugging)
  updated_at timestamptz default now()
);

-- Index for fast cosine similarity search
create index on public.profile_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================================
-- MATCHES (AI-generated connection recommendations)
-- ============================================================
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  source_profile_id uuid references public.profiles(id) on delete cascade not null,
  target_profile_id uuid references public.profiles(id) on delete cascade not null,
  match_type text not null check (match_type in ('mentor', 'hire', 'invest', 'collaborate', 'cofounder', 'research')),
  score numeric(5,2) not null,
  reason text,
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'introduced')),
  created_at timestamptz default now(),
  unique (source_profile_id, target_profile_id, match_type)
);

-- ============================================================
-- INTRODUCTIONS (AI-drafted messages)
-- ============================================================
create table public.introductions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade not null,
  drafted_by text default 'ai',
  message text not null,
  status text default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- CONNECTIONS (accepted relationships)
-- ============================================================
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  profile_a_id uuid references public.profiles(id) on delete cascade not null,
  profile_b_id uuid references public.profiles(id) on delete cascade not null,
  connection_type text check (connection_type in ('mentor', 'hire', 'invest', 'collaborate', 'peer')),
  created_at timestamptz default now(),
  unique (profile_a_id, profile_b_id)
);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.alumni_profiles enable row level security;
alter table public.faculty_profiles enable row level security;
alter table public.investor_profiles enable row level security;
alter table public.profile_embeddings enable row level security;
alter table public.matches enable row level security;
alter table public.introductions enable row level security;
alter table public.connections enable row level security;
alter table public.analytics_events enable row level security;

-- Profiles: users can read all, only update their own
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);

-- Role-specific profiles: same pattern
create policy "Student profiles readable" on public.student_profiles for select using (true);
create policy "Student profiles self-manage" on public.student_profiles for all using (
  exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
);

create policy "Alumni profiles readable" on public.alumni_profiles for select using (true);
create policy "Alumni profiles self-manage" on public.alumni_profiles for all using (
  exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
);

create policy "Faculty profiles readable" on public.faculty_profiles for select using (true);
create policy "Faculty profiles self-manage" on public.faculty_profiles for all using (
  exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
);

create policy "Investor profiles readable" on public.investor_profiles for select using (true);
create policy "Investor profiles self-manage" on public.investor_profiles for all using (
  exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
);

-- Embeddings: service role only (written by server-side AI pipeline)
create policy "Embeddings service role only" on public.profile_embeddings for all using (false);

-- Matches: users see their own matches
create policy "Users see own matches" on public.matches for select using (
  source_profile_id in (select id from public.profiles where user_id = auth.uid())
  or target_profile_id in (select id from public.profiles where user_id = auth.uid())
);

-- Connections: users see own connections
create policy "Users see own connections" on public.connections for select using (
  profile_a_id in (select id from public.profiles where user_id = auth.uid())
  or profile_b_id in (select id from public.profiles where user_id = auth.uid())
);

-- ============================================================
-- FUNCTION: match_profiles (cosine similarity search)
-- ============================================================
create or replace function public.match_profiles(
  query_embedding vector(1536),
  source_role text,
  target_role text,
  match_threshold float default 0.7,
  match_count int default 10
)
returns table (
  profile_id uuid,
  full_name text,
  headline text,
  role text,
  similarity float
)
language sql stable
as $$
  select
    p.id as profile_id,
    p.full_name,
    p.headline,
    p.role,
    1 - (pe.embedding <=> query_embedding) as similarity
  from public.profile_embeddings pe
  join public.profiles p on p.id = pe.profile_id
  where p.role = target_role
    and 1 - (pe.embedding <=> query_embedding) > match_threshold
  order by pe.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger embeddings_updated_at before update on public.profile_embeddings
  for each row execute function public.handle_updated_at();
