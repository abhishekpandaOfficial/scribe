# Supabase Migration

## 1) Create / Push Schema

Recommended (Supabase CLI + migration files):

```bash
npm run supabase:db:push
```

Alternative (manual SQL editor):

Run `backend/supabase/schema.sql` in your Supabase SQL Editor.

## 2) Configure Env
Set real values in `.env`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF`

Optional:

- `SUPABASE_MIGRATE_BATCH_SIZE` (default `500`)
- `SUPABASE_DB_PASSWORD` (if CLI prompts for DB password)

## 3) Dry Run
```bash
npm run migrate:supabase:dry
```

## 4) Migrate Data
```bash
npm run migrate:supabase
```

All-in-one bind (link + schema push + data migration):

```bash
npm run supabase:bind
```

To reset target tables before migration:
```bash
npm run migrate:supabase -- --reset
```

## Notes
- Backend defaults to SQLite, but you can switch runtime to Supabase by setting `DATA_PROVIDER=supabase`.
- Caching works with Upstash Redis if `UPSTASH_REDIS_URL` + `UPSTASH_REDIS_TOKEN` are real values, otherwise local-memory fallback is used.
