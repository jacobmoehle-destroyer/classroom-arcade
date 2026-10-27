-- Classroom Arcade Global Chat (Supabase)
-- Run this in your Supabase project's SQL Editor.
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  display_name text not null check (char_length(display_name) between 2 and 24),
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;
grant select, insert on public.chat_messages to anon, authenticated;
grant usage, select on sequence public.chat_messages_id_seq to anon, authenticated;

drop policy if exists "Anyone can read chat messages" on public.chat_messages;
create policy "Anyone can read chat messages"
on public.chat_messages for select to anon, authenticated
using (true);

drop policy if exists "Anyone can post chat messages" on public.chat_messages;
create policy "Anyone can post chat messages"
on public.chat_messages for insert to anon, authenticated
with check (
  char_length(display_name) between 2 and 24
  and char_length(body) between 1 and 500
);

-- Keep the table available to Supabase Realtime.
do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null;
end $$;

-- Optional retention cleanup: run periodically from Supabase Cron if enabled.
-- delete from public.chat_messages where created_at < now() - interval '30 days';
