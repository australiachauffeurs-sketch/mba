-- Extended profile fields for comprehensive signup flows

-- Common profile extensions
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS is_profile_complete boolean DEFAULT false;

-- Student profile extensions
ALTER TABLE student_profiles
  ADD COLUMN IF NOT EXISTS roll_number text,
  ADD COLUMN IF NOT EXISTS batch_number text,
  ADD COLUMN IF NOT EXISTS batch_year integer,
  ADD COLUMN IF NOT EXISTS university_id text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS work_experience_years integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS previous_company text,
  ADD COLUMN IF NOT EXISTS previous_role text,
  ADD COLUMN IF NOT EXISTS looking_for text[],
  ADD COLUMN IF NOT EXISTS open_to_mentor boolean DEFAULT false;

-- Alumni profile extensions
ALTER TABLE alumni_profiles
  ADD COLUMN IF NOT EXISTS roll_number text,
  ADD COLUMN IF NOT EXISTS batch_year integer,
  ADD COLUMN IF NOT EXISTS job_title text,
  ADD COLUMN IF NOT EXISTS years_of_experience integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS open_to_hire boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS areas_of_expertise text[];

-- Faculty profile extensions
ALTER TABLE faculty_profiles
  ADD COLUMN IF NOT EXISTS faculty_id text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS joining_year integer,
  ADD COLUMN IF NOT EXISTS office_location text,
  ADD COLUMN IF NOT EXISTS google_scholar_url text,
  ADD COLUMN IF NOT EXISTS orcid_id text,
  ADD COLUMN IF NOT EXISTS publications_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS h_index integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS research_areas text[],
  ADD COLUMN IF NOT EXISTS active_grants text,
  ADD COLUMN IF NOT EXISTS open_to_collaborate boolean DEFAULT true;

-- Investor profile extensions
ALTER TABLE investor_profiles
  ADD COLUMN IF NOT EXISTS firm_website text,
  ADD COLUMN IF NOT EXISTS aum_range text,
  ADD COLUMN IF NOT EXISTS firm_location text,
  ADD COLUMN IF NOT EXISTS stage_focus text[],
  ADD COLUMN IF NOT EXISTS geographies text[],
  ADD COLUMN IF NOT EXISTS check_size_min numeric,
  ADD COLUMN IF NOT EXISTS check_size_max numeric,
  ADD COLUMN IF NOT EXISTS thesis_description text,
  ADD COLUMN IF NOT EXISTS notable_investments text,
  ADD COLUMN IF NOT EXISTS portfolio_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS alumni_connection text;

-- Index for fast lookup by roll_number
CREATE INDEX IF NOT EXISTS idx_student_profiles_roll_number ON student_profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_roll_number ON alumni_profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_faculty_id ON faculty_profiles(faculty_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_complete ON profiles(is_profile_complete);
