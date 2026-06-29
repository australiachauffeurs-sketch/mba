-- Add AI recommendation cache columns to all role profile tables

alter table alumni_profiles
  add column if not exists ai_recommendations jsonb,
  add column if not exists ai_recommendations_at timestamptz;

alter table faculty_profiles
  add column if not exists ai_recommendations jsonb,
  add column if not exists ai_recommendations_at timestamptz;

alter table investor_profiles
  add column if not exists ai_recommendations jsonb,
  add column if not exists ai_recommendations_at timestamptz;
