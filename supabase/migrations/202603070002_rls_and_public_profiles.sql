-- Harden public access with RLS and expose only safe profile fields.

-- Enable RLS on all app tables.
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.api_keys enable row level security;
alter table public.webhooks enable row level security;
alter table public.webhook_logs enable row level security;
alter table public.page_views enable row level security;

-- Remove broad grants from anon/authenticated roles.
revoke all on table public.users from anon, authenticated;
revoke all on table public.posts from anon, authenticated;
revoke all on table public.api_keys from anon, authenticated;
revoke all on table public.webhooks from anon, authenticated;
revoke all on table public.webhook_logs from anon, authenticated;
revoke all on table public.page_views from anon, authenticated;

-- Public post reads (published only) through anon/authenticated roles.
grant select on table public.posts to anon, authenticated;
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read
on public.posts
for select
to anon, authenticated
using (status = 'published');

-- Public profile view strips sensitive columns (no email/password hash).
create or replace view public.public_profiles as
select
  id,
  name,
  username,
  plan,
  bio,
  website,
  twitter,
  github,
  created_at,
  updated_at
from public.users;

grant select on table public.public_profiles to anon, authenticated;
