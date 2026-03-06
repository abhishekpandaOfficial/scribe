-- Scribe Supabase schema (parity with current SQLite model)

create table if not exists public.users (
  id text primary key,
  name text not null,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  plan text not null default 'Pro',
  bio text,
  website text,
  twitter text,
  github text,
  created_at text not null,
  updated_at text not null
);

create table if not exists public.posts (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  content_json text,
  status text not null default 'draft',
  series text,
  chapter integer,
  difficulty text,
  tags_json text,
  read_time text,
  views integer not null default 0,
  created_at text not null,
  updated_at text not null,
  published_at text,
  unique (user_id, slug)
);

create table if not exists public.api_keys (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  permissions_json text not null,
  last_used_at text,
  expires_at text,
  revoked integer not null default 0,
  created_at text not null
);

create table if not exists public.webhooks (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  name text not null,
  url text not null,
  events_json text not null,
  is_active integer not null default 1,
  last_status integer,
  last_triggered_at text,
  created_at text not null
);

create table if not exists public.webhook_logs (
  id text primary key,
  webhook_id text not null references public.webhooks(id) on delete cascade,
  event_type text not null,
  status integer,
  response_body text,
  created_at text not null
);

create table if not exists public.page_views (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  post_id text references public.posts(id) on delete set null,
  source text,
  country text,
  created_at text not null
);

create index if not exists idx_posts_user_status on public.posts(user_id, status);
create index if not exists idx_api_keys_hash on public.api_keys(key_hash);
create index if not exists idx_page_views_user on public.page_views(user_id, created_at);
