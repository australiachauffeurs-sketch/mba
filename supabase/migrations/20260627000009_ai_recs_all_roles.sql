-- Add AI recommendations cache columns to alumni, faculty, investor profiles
alter table alumni_profiles add column if not exists ai_recommendations jsonb;
alter table alumni_profiles add column if not exists ai_recommendations_at timestamptz;

alter table faculty_profiles add column if not exists ai_recommendations jsonb;
alter table faculty_profiles add column if not exists ai_recommendations_at timestamptz;

alter table investor_profiles add column if not exists ai_recommendations jsonb;
alter table investor_profiles add column if not exists ai_recommendations_at timestamptz;
