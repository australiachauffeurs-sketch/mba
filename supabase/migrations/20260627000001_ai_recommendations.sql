alter table student_profiles add column if not exists ai_recommendations jsonb;
alter table student_profiles add column if not exists ai_recommendations_at timestamptz;
