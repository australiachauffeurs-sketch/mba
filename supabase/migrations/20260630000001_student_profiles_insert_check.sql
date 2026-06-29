-- Ensure students can INSERT/UPDATE their own student_profiles row.
-- The original "self-manage" policy declared only USING and no WITH CHECK.
-- For a FOR ALL policy Postgres copies USING into WITH CHECK, but to be
-- explicit and unambiguous for the Career GPS upsert (which can be an
-- INSERT for students who have no row yet), we add a dedicated
-- INSERT-with-check and UPDATE policy keyed on the owning profile.

drop policy if exists "Student profiles self-insert" on public.student_profiles;
create policy "Student profiles self-insert" on public.student_profiles
  for insert
  with check (
    exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
  );

drop policy if exists "Student profiles self-update" on public.student_profiles;
create policy "Student profiles self-update" on public.student_profiles
  for update
  using (
    exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.profiles where id = profile_id and user_id = auth.uid())
  );
