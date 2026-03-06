# Scribe

A block-based technical writing SaaS starter built with React + Vite and an Express API.

Scribe helps creators draft, preview, publish, and distribute technical content with API-first workflows, webhook automation, and analytics views.

## Tags

`opensource` `saas` `react` `vite` `express` `sqlite` `supabase` `upstash` `webhooks` `api-first` `technical-writing`

## Why Scribe

Most editors are either:

- too generic for engineering content, or
- too rigid to integrate into custom frontends and pipelines.

Scribe is designed to be a practical middle ground:

- Rich block editor for technical posts (code, tables, charts, callouts, diagrams, etc.)
- API-first content access for external apps (`/v1/*` + public endpoints)
- Webhook triggers on content lifecycle events
- Local-first development with seeded data
- Migration path to Supabase persistence and Upstash cache

## Core Features

- Landing page with dark/light theme toggle and animated hero UI
- Auth: register, login, profile update, JWT session
- Dashboard with KPIs, post filters, and editing flow
- Slash-command editor (`/`) with block insertion
- Preview mode for rendered post output
- Templates and settings surfaces
- API key management and webhook management
- Public blog/profile endpoints
- Analytics overview API
- Caching with Upstash Redis (fallback: in-memory cache)
- Supabase migration script and schema
- Runtime provider switch: SQLite or Supabase (`DATA_PROVIDER`)
- Supabase RLS + safe `public_profiles` view for anonymous public profile reads

## Tech Stack

### Frontend

- React 19
- Vite 7
- Recharts
- Inline design system + custom global CSS variables

### Backend

- Node.js + Express 5
- better-sqlite3 (default local persistence)
- JWT + bcryptjs auth
- Zod validation
- nanoid identifiers

### Infra Integrations

- Supabase (`@supabase/supabase-js`) for migration/target persistence setup
- Upstash Redis (`@upstash/redis`) for response caching
- Placeholder config support for Stripe, Resend, Inngest, Tinybird, R2

## Monorepo Structure

```text
scribe/
  backend/
    data/                       # SQLite DB file
    scripts/
      migrate-sqlite-to-supabase.js
    src/
      server.js                 # Express API routes
      db.js                     # SQLite schema + seed
      config.js                 # Env wiring
      lib/
        cache.js                # Upstash + local fallback cache
        security.js             # JWT, bcrypt, keys, IDs
        supabase.js             # Supabase clients/meta
    supabase/
      schema.sql                # Supabase SQL schema
      README.md                 # Migration notes
  src/                          # React app
    components/
    screens/
    lib/
    data/
    styles/
  .env.example
  package.json
```

## Quick Start (Local)

### Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm 9+

### 1) Clone and install

```bash
git clone https://github.com/abhishekpandaOfficial/scribe.git
cd scribe
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

For first run, defaults are enough. You can keep placeholder values for optional integrations.

### 3) Run app (frontend + backend)

```bash
npm run dev
```

Default URLs:

- Frontend: `http://127.0.0.1:4173`
- API: `http://127.0.0.1:8787`
- Health: `http://127.0.0.1:8787/health`

### 4) Sign in options

- Standard auth: register/login from UI

Seeded local account (created automatically in SQLite on first run):

- email: `abhishek@abhishekpanda.com`
- password: `Password@123`

## Scripts

- `npm run dev` - run API + frontend together
- `npm run dev:web` - run Vite frontend only
- `npm run dev:api` - run backend in watch mode
- `npm run start:api` - run backend once
- `npm run build` - production frontend build
- `npm run preview` - preview built frontend
- `npm run supabase:db:push:dry` - dry run remote Supabase schema push (CLI)
- `npm run supabase:db:push` - push `supabase/migrations/*` to remote Supabase
- `npm run supabase:bind` - link project, push schema, then migrate SQLite data to Supabase
- `npm run migrate:supabase:dry` - inspect migration plan without writes
- `npm run migrate:supabase` - migrate SQLite data to Supabase

## Environment Variables

Use `.env.example` as source of truth.

### Required for local dev

- `VITE_API_URL` (default `http://127.0.0.1:8787`)
- `API_PORT` (default `8787`)
- `JWT_SECRET` (change for production)
- `DB_PATH` (default `backend/data/scribe.db`)
- `DATA_PROVIDER` (`sqlite` or `supabase`)

### Optional but recommended

- `UPSTASH_REDIS_URL`
- `UPSTASH_REDIS_TOKEN`
- `CACHE_TTL_SECONDS`

When Upstash values are missing/placeholder, Scribe automatically falls back to in-memory cache.

### Supabase migration variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF` (required for `npm run supabase:bind`)
- `SUPABASE_DB_PASSWORD` (optional; used by Supabase CLI if required)
- `SUPABASE_MIGRATE_BATCH_SIZE` (optional, default `500`)

### Reserved/future integrations (already wired in config)

- Auth: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Storage: `CLOUDFLARE_R2_*`
- Events: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
- Payments: `STRIPE_*`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Email: `RESEND_API_KEY`
- Analytics: `TINYBIRD_TOKEN`

## API Overview

Base URL (local): `http://127.0.0.1:8787`

Note: this section documents currently implemented backend routes. The in-app API docs screen also shows some planned/future endpoints that are not wired yet.

### Health

- `GET /health`

### Auth (JWT)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`

### Posts (dashboard/private)

- `GET /api/posts?status=all|draft|review|scheduled|published`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/view`

### API Keys + Webhooks + Analytics

- `GET /api/api-keys`
- `POST /api/api-keys`
- `DELETE /api/api-keys/:id`
- `GET /api/webhooks`
- `POST /api/webhooks`
- `POST /api/webhooks/:id/test`
- `DELETE /api/webhooks/:id`
- `GET /api/analytics/overview`

### Public Content API

- `GET /api/public/:username/profile`
- `GET /api/public/:username/posts`
- `GET /api/public/:username/posts/:slug`

### API-Key Consumer Endpoints (`x-api-key`)

- `GET /v1/posts?status=published|all|draft|review|scheduled`
- `GET /v1/posts/:slug`

## API Usage Examples

### Create API key from UI

1. Sign in
2. Go to `Settings -> API Keys`
3. Create key and copy once
4. Use as `x-api-key` header

### Fetch published posts

```bash
curl -X GET 'http://127.0.0.1:8787/v1/posts?status=published' \
  -H 'x-api-key: sk_live_your_key_here'
```

### Fetch a single post by slug

```bash
curl -X GET 'http://127.0.0.1:8787/v1/posts/async-await-state-machine' \
  -H 'x-api-key: sk_live_your_key_here'
```

## Webhooks

### Configure in UI

1. Go to `Settings -> Webhooks`
2. Add destination URL
3. Select one or more events
4. Save and use `Test` action

### Emitted events

- `post.created`
- `post.updated`
- `post.published`
- `post.deleted`
- `webhook.test`

Wildcard matching supported:

- `post.*`
- `*`

### Payload format

```json
{
  "event": "post.published",
  "timestamp": "2026-03-06T18:30:00.000Z",
  "payload": {
    "id": "pst_xxx",
    "title": "My Post",
    "slug": "my-post"
  }
}
```

## Editor Blocks and Slash Command

In the writing area, type `/` to open block commands.

Supported categories include:

- Text: paragraph, lead, headings, lists, quote, divider
- Code/Math: code, math
- Callouts: insight, warning, danger, success, info
- Media: image, youtube, tech stack
- Diagram/Layout: mermaid, chart, toggle, steps, tabs, columns, table

## Theme + UX

- Global dark/light toggle across screens
- Animated landing page, cards, and floating visuals
- Sticky editor top bar with preview/edit toggle

## Persistence Strategy

### Current default

- SQLite (`better-sqlite3`) via `backend/data/scribe.db`
- Auto-migration + seed data on startup

### Supabase runtime mode

- Set `DATA_PROVIDER=supabase`
- Ensure valid:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Run:

```bash
npm run supabase:bind
```

With this, API runtime reads/writes directly against Supabase tables.
Public endpoints use anon-scope reads (`supabasePublic`) backed by RLS policies.

### Supabase migration path

1. Set real Supabase env values in `.env`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF`

2. Authenticate Supabase CLI once:

```bash
supabase login
```

3. Push schema (tables/queries) to your Supabase project:

```bash
npm run supabase:db:push
```

4. Dry run data migration:

```bash
npm run migrate:supabase:dry
```

5. Execute data migration:

```bash
npm run migrate:supabase
```

Optional all-in-one bind command (project link + schema push + data migration):

```bash
npm run supabase:bind
```

Optional reset before migration:

```bash
npm run migrate:supabase -- --reset
```

Note: if `DATA_PROVIDER=sqlite`, you can still keep Supabase synced using migration scripts.

## Caching

Scribe applies cache for analytics/posts/public/v1 reads.

- Provider: Upstash Redis when configured
- Fallback: in-memory map when Upstash is not configured
- Response header: `x-cache: HIT|MISS`

Key invalidation runs automatically after content/profile updates.

## Deploy Notes

Minimum production hardening checklist:

- Set strong `JWT_SECRET`
- Enforce strong auth policies in production
- Use managed database backup strategy
- Configure CORS to explicit origins
- Set real Upstash Redis credentials
- Add rate limiting and request logging (recommended next step)

## Download and Use Locally

If users just want to run locally without setup complexity:

1. Download ZIP or clone repo
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev`
5. Open frontend URL and sign in with your account

## Open Source Status

This repository is structured like an open-source starter and is ready for contributions.

Suggested next OSS steps:

- Add issue/PR templates
- Add CI for lint/test/build

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feat/my-change`
3. Commit: `git commit -m "feat: add my change"`
4. Push: `git push origin feat/my-change`
5. Open a Pull Request

## Known Gaps / Roadmap

- Align custom JWT auth with Supabase Auth identity mapping for first-class RLS ownership policies
- Media upload API implementation (`/v1/media` currently UI docs only)
- Stripe billing flows and webhook verification
- Inngest event publishing and Tinybird ingestion
- Automated tests for API + editor interactions

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client/browser
- API keys are shown once on creation; store safely
- Rotate secrets regularly in production
- Supabase RLS policies are included for published-only public post reads

---

If you are building a developer-focused writing SaaS, Scribe gives you a practical starting point with real APIs, real persistence options, and a frontend that is ready to customize.
