# Local Setup Guide

## Prerequisites

- Node.js 20+ or Bun 1.1+
- No external services required: the database is a local SQLite file and the weather API is keyless.

## Steps

1. **Install dependencies**

   ```bash
   bun install        # or: npm install
   ```

2. **Create your environment file**

   ```bash
   cp .env.example .env
   ```

   | Variable | Required | Purpose |
   |---|---|---|
   | `DATABASE_URL` | Yes | SQLite file path for dev (`"file:./db/holistic.db"`). Use a PostgreSQL URL in deployment. |
   | `JWT_SECRET` | Required in production | Session signing key. Generate: `openssl rand -base64 48`. In dev, a fallback is used with a console warning. |
   | `CORS_ORIGINS` | No | Comma-separated allowed origins; empty = same-origin only. |
   | `GOOGLE_CLIENT_ID/SECRET` | No | Optional OAuth; email/password works independently. |
   | `WEATHER_API_KEY` | No | Not needed for Open-Meteo; reserved for a keyed provider. |

3. **Create the database schema**

   ```bash
   bun run db:push
   ```

   (Migrations: `bun run db:migrate` for a dev migration flow; the schema is portable to
   PostgreSQL by changing the `provider` in `prisma/schema.prisma`.)

4. **Start the app**

   ```bash
   bun run dev        # http://localhost:3000
   ```

5. **Create an account** via the signup screen, complete profile setup, and take the
   Prakriti assessment.

## Running the tests

```bash
bunx vitest run                                      # 47 engine unit tests
bun tests/api-integration.ts http://localhost:3000   # 33 API integration checks (dev server must run)
bun run lint                                         # ESLint
```

The integration suite covers signup/login/logout, weak-password rejection, protected routes,
profile upsert, questionnaire validation (incomplete submissions rejected), scoring spot-checks,
reading validation, simulation mode, the combined model, environment manual entry, recommendation
generation with source checks, **user-level data isolation between two accounts**, and history
immutability.

## Demo / simulation mode

Wearables → *Generate demo week* creates 7 days of labelled simulated readings
(provenance `simulated`) so the combined model, recommendations and history can be explored
without a device. Remove them any time from the same screen; revoking wearable consent also
deletes them.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Configuration error: JWT_SECRET is not set` | Set `JWT_SECRET` in `.env` (mandatory when `NODE_ENV=production`). |
| Weather says "service unreachable" | Open-Meteo may be rate-limited on shared IPs; use city retry later or manual entry (always available). |
| DB errors after schema edits | `bun run db:push` again, or `bun run db:reset` for a clean start (destroys local data). |
| Login loop after restart | Cookies are httpOnly and same-origin; make sure you access via the same host/port you logged in on. |
