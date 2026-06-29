-- Enable Supabase Realtime for the messages table
alter publication supabase_realtime add table messages;

-- Ensure RLS is on and recipients can see their own messages via realtime
alter table messages replica identity full;
