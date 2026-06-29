-- The previous self-insert/self-update policies relied on a subquery
-- (exists … where profiles.user_id = auth.uid()) which fails in production,
-- blocking the Career GPS upsert with "new row violates row-level security".
--
-- This codebase's invariant is profiles.id = auth.uid(), so
-- student_profiles.profile_id = auth.uid() for the owning student. Check that
-- directly — it matches every working .eq("profile_id", user.id) query and
-- removes the dependency on the profiles.user_id column.

drop policy if exists "Student profiles self-insert" on public.student_profiles;
create policy "Student profiles self-insert" on public.student_profiles
  for insert
  with check (profile_id = auth.uid());

drop policy if exists "Student profiles self-update" on public.student_profiles;
create policy "Student profiles self-update" on public.student_profiles
  for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
