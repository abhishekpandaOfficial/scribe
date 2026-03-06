# Supabase Migration

## 1) Create Schema
Run `backend/supabase/schema.sql` in your Supabase SQL Editor.

## 2) Configure Env
Set real values in `.env`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `SUPABASE_MIGRATE_BATCH_SIZE` (default `500`)

## 3) Dry Run
```bash
npm run migrate:supabase:dry
```

## 4) Migrate Data
```bash
npm run migrate:supabase
```

To reset target tables before migration:
```bash
npm run migrate:supabase -- --reset
```

## Notes
- Current backend continues to run with SQLite by default, but this migrates all existing data to Supabase tables.
- Caching works with Upstash Redis if `UPSTASH_REDIS_URL` + `UPSTASH_REDIS_TOKEN` are real values, otherwise local-memory fallback is used.
