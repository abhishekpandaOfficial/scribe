# Contributing to Scribe

Thanks for contributing to Scribe.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create env file:

```bash
cp .env.example .env
```

4. Run local app:

```bash
npm run dev
```

Frontend runs at `http://127.0.0.1:4173` and API at `http://127.0.0.1:8787`.

## Branch and Commit Guidelines

- Create a feature branch from `main`:

```bash
git checkout -b feat/short-description
```

- Use clear commit messages:
  - `feat: add webhook retry logic`
  - `fix: prevent editor render loop`
  - `docs: improve api examples`

## Pull Request Checklist

Before opening a PR, make sure:

- The app runs locally (`npm run dev`).
- Production build passes (`npm run build`).
- New behavior is validated manually.
- API/UI changes are documented in `README.md` when relevant.
- Secrets are never committed (`.env` stays local).

## Code Style Expectations

- Keep changes focused and minimal.
- Preserve existing folder/module structure.
- Prefer small reusable functions/components over large monolithic blocks.
- Avoid introducing breaking API changes without documenting migration notes.

## Reporting Issues

When opening an issue, include:

- What happened
- Expected behavior
- Steps to reproduce
- Logs/screenshots if available
- Environment info (OS, Node version, browser)

## Security

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
- Do not paste production secrets in issues/PRs.
- For sensitive findings, contact maintainers privately instead of public disclosure.
