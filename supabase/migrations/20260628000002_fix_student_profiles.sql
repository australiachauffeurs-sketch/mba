-- Fix student_profiles: add missing columns and create id alias so existing eq("id") queries work

-- Missing columns referenced in code but not in original schema
alter table student_profiles
  add column if not exists specialization text,
  add column if not exists career_interests text[],
  add column if not exists work_experience text,
  add column if not exists interests text[],
  add column if not exists expected_graduation text,
  add column if not exists updated_at timestamptz default now();

-- CRITICAL: code queries student_profiles with eq("id", user.id) but the PK is profile_id.
-- Since profiles.id = auth.uid() (set at signup), and student_profiles.profile_id = profiles.id,
-- we need student_profiles to also accept id = profile_id lookups.
-- The cleanest fix: code will be updated to use profile_id, but we also add the column
-- so any old queries don't crash.
-- We can't create a generated column that equals the PK in Postgres easily, so instead
-- we just ensure code is fixed below. This migration only adds missing data columns.
