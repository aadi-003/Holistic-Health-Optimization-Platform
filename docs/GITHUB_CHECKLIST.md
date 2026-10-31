# GitHub Publishing Checklist & Security Report

## A. Security verification performed (2026-10-30)

1. **Secret-pattern scan** over `src/`, `prisma/`, `tests/`, `docs/`:
   - patterns: `sk-…`, `ghp_…`, `AKIA…`, `AIza…`, `xox…`, high-entropy assignments to
     `secret|token|password|api_key|credential` — **0 findings**.
2. **`.env` handling:**
   - `.env` found **staged by the scaffold** → removed from the index with `git rm --cached .env`
     (do this verification yourself too — command below).
   - `.gitignore` ignores `.env`, `.env.*`, `**/.env`, `**/.env.*` with `!.env.example` negations.
   - `.env.example` contains **placeholders only** (`JWT_SECRET=` is empty; `DATABASE_URL` holds
     the non-secret local SQLite path).
3. **Server/client separation:** no client component imports `bcryptjs`, `jose`, `@/lib/auth` or
   `@/lib/db`. Secrets are only ever read server-side from `process.env`.
4. **JWT secret policy:** production throws a clear configuration error if `JWT_SECRET` is unset;
   the dev fallback string is a fixed, non-secret development marker (documented in auth.ts) and
   is never used when `NODE_ENV=production`.
5. **Git history:** the local history contains only the scaffold's `.env` whose sole value is a
   non-secret SQLite file path. **If you keep this history when publishing, inspect it**:
   `git log --all --full-history --patch -- .env` — confirm nothing sensitive was ever committed.
   If anything sensitive ever lands in history, rotate the credential and rewrite history
   (e.g. `git filter-repo`) before making the repository public.

## B. Commands to verify before pushing (run yourself)

```bash
git ls-files | grep -E '\.env$' && echo "FAIL: .env tracked" || echo "OK: .env not tracked"
grep -rInE "(api[_-]?key|secret|password|token)\s*[:=]\s*['\"][A-Za-z0-9+/=_-]{16,}['\"]" src tests
grep -rInE "sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{30,}" .
git diff --staged                 # inspect the staged diff
git status --short                # nothing ignored is staged
bunx vitest run && bun run lint   # green before push
```

## C. Publishing steps (fresh repository recommended)

```bash
# 1. (Recommended) start a clean history for the public repo
cd holistic
git init -b main
git add .
git status --short          # confirm .env / db / logs / node_modules are NOT listed
git commit -m "Holistic: research-informed Ayurvedic wellness platform (initial release)"

# 2. Create the empty repo on GitHub (no README/license auto-init), then:
git remote add origin git@github.com:<you>/holistic.git
git push -u origin main
```

If you prefer to keep the existing history, run the history check in section A first.

## D. What must never be committed

- `.env` (real values), any file under `secrets/` or `credentials/`
- `db/*.db` SQLite files, `dev.log` / `server.log`
- `node_modules/`, `.next/`, `dist/`, coverage output
- Personal data exports (the settings screen's JSON export)

All are already covered by the root `.gitignore`; re-run `git status --short` if you add new
directories.

## E. After publishing

- Turn on GitHub secret scanning + push protection (repo → Settings → Code security).
- Add branch protection for `main` if others will contribute.
- Keep `.env.example` in sync when a new environment variable appears.
