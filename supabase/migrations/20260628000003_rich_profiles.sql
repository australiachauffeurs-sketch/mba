-- Rich profile fields for all roles

-- ── STUDENT PROFILES ─────────────────────────────────────────────────────────
alter table student_profiles
  add column if not exists avatar_url text,
  add column if not exists location text,
  add column if not exists portfolio_url text,
  add column if not exists headline text,
  add column if not exists work_experience text,
  add column if not exists projects jsonb default '[]',
  add column if not exists certifications jsonb default '[]',
  add column if not exists achievements text[] default '{}';

-- ── ALUMNI PROFILES ──────────────────────────────────────────────────────────
alter table alumni_profiles
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists headline text,
  add column if not exists location text,
  add column if not exists linkedin_url text,
  add column if not exists website_url text,
  add column if not exists company text,
  add column if not exists job_title text,
  add column if not exists industry text,
  add column if not exists expertise_areas text[] default '{}',
  add column if not exists mentoring_topics text[] default '{}',
  add column if not exists work_history jsonb default '[]',
  add column if not exists education jsonb default '[]',
  add column if not exists achievements text[] default '{}',
  add column if not exists open_to_mentor boolean default false,
  add column if not exists updated_at timestamptz default now();

-- ── FACULTY PROFILES ─────────────────────────────────────────────────────────
alter table faculty_profiles
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists headline text,
  add column if not exists location text,
  add column if not exists linkedin_url text,
  add column if not exists website_url text,
  add column if not exists title text,
  add column if not exists department text,
  add column if not exists publications jsonb default '[]',
  add column if not exists research_projects jsonb default '[]',
  add column if not exists achievements text[] default '{}',
  add column if not exists updated_at timestamptz default now();

-- ── INVESTOR PROFILES ────────────────────────────────────────────────────────
alter table investor_profiles
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists headline text,
  add column if not exists location text,
  add column if not exists linkedin_url text,
  add column if not exists website_url text,
  add column if not exists firm text,
  add column if not exists firm_website text,
  add column if not exists aum_range text,
  add column if not exists portfolio_companies jsonb default '[]',
  add column if not exists industries text[] default '{}',
  add column if not exists stage_focus text[] default '{}',
  add column if not exists geographies text[] default '{}',
  add column if not exists check_size_min numeric,
  add column if not exists check_size_max numeric,
  add column if not exists thesis_description text,
  add column if not exists notable_investments text,
  add column if not exists updated_at timestamptz default now();
