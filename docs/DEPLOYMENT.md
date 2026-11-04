# Deployment Guide

## Target topology (per the brief's preferred services)

| Piece | Service | Notes |
|---|---|---|
| Web app (Next.js) | Vercel (or Render) | Set environment variables in the dashboard, never in code. |
| Database | Managed PostgreSQL (e.g. Neon, Render Postgres) | Swap the Prisma datasource provider. |
| Secrets | Hosting provider's env-var settings | `.env` never leaves your machine. |
| Source | GitHub | See docs/GITHUB_CHECKLIST.md before publishing. |

## 1. Switch Prisma to PostgreSQL

```prisma
datasource db {
  provider = "postgresql"          // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Then `bunx prisma migrate dev --name init` (or `db push`) against the managed database. No schema
types are SQLite-specific, so this is the only change needed.

## 2. Environment variables (host dashboard)

```
DATABASE_URL  = postgresql://…            (managed Postgres URL)
JWT_SECRET    = <openssl rand -base64 48> (REQUIRED in production — app fails fast without it)
CORS_ORIGINS  = https://your-domain.com   (optional; same-origin default)
```

Never set secret values in `next.config`, code, or `VITE_`-style variables — this app has none.

## 3. Build & run

```bash
bun install
bun run build        # next build (+ standalone output copies)
bun run start        # NODE_ENV=production; serves on $PORT
```

On Vercel: import the repo, framework preset Next.js, add the env vars, deploy. On Render:
Node environment, build command `bun install && bun run build`, start command `bun run start`.

## 4. Post-deploy verification

- Signup → login → logout round-trip on the deployed domain (HTTPS sets the Secure cookie flag).
- `GET /api/auth/me` unauthenticated returns `{ user: null }` (no data leaks).
- Weather fetch works server-side (Outbound to open-meteo.com from the host).
- Confirm the app never logs secrets (session token handling never prints the cookie).

## 5. Data lifecycle

- All tables are user-scoped with `ON DELETE CASCADE` from `User`; account-level deletion removes
  assessments, readings, consent records and events.
- Consider adding a scheduled deletion job if your jurisdiction requires retention limits.
