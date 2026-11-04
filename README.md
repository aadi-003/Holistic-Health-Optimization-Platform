# Holistic — Personalized Ayurvedic Wellness Platform

**Holistic** is a research-informed, educational wellness web application. It pairs a documented
62-item Prakriti (baseline constitution) assessment with a 34-item Vikriti (current state)
self-check, optional smartwatch and environmental context, and a fully explainable,
evidence-labelled Ayurveda recommendation engine covering dinacharya, ahara, pathya/apathya,
vyayama, nidra, ritucharya and sadvritta.

> **Scope boundary.** Holistic is an educational wellness prototype — not a medical diagnostic or
> treatment system. It makes no claim to diagnose, treat, cure or prevent any condition, makes no
> claim to change a person's Prakriti, and never treats wearable signals as dosha measures.

## Highlights

- **Exact source questionnaires.** All 62 Prakriti items (Patwardhan & Sharma; modified by
  Tripathi et al. 2011) and all 34 Vikriti items are implemented with original wording, response
  options and printed weights. Documented discrepancies (the Pitta 600-vs-599 rounding artefact)
  are disclosed in-app rather than silently corrected.
- **Documented scoring.** Prakriti percentages use the published guna-proportional absolute model
  (obtained ÷ maximum × 100; maxima Vata 960 / Pitta 600 / Kapha 1440) with the published dual-type
  thresholds (secondary ≥ 50 % of primary, tertiary ≤ 75 % of secondary) and an explicit balanced
  (sama) branch. Vikriti scoring is a clearly labelled experimental method — the source documents
  no numeric formula.
- **Experimental 50/30/20 combined model**, as required by the project brief: questionnaire 50 %,
  wearable 30 %, environment 20 %. Every component is separately visible, missing wearable values
  are imputed from documented reference averages and flagged "estimated", and a
  data-completeness/confidence indicator accompanies every result. The model is labelled
  experimental everywhere: no reviewed research justifies these weights.
- **Wearable honesty.** Readings carry provenance labels (measured / manual / simulated /
  estimated). No wearable variable is ever mapped onto a dosha; SpO₂ is display-only because of
  known consumer overestimation bias.
- **Explainable recommendations.** Deterministic rules with three-valued logic
  (true / false / *unknown — withheld with a "waiting for data" reason*), fixed precedence
  (safety > contraindication > vikriti-correction > prakriti-maintenance > education), and a full
  explanation payload per card: Sanskrit term (Devanagari + IAST), classical source, research
  status, evidence level (DR / AI / CT / DP), precautions and the exact inputs that fired it.
  Withheld rules are visible in a transparency log. **No Raga rules ship** — the reviewed sources
  contain no verified Raga-to-dosha mapping.
- **Secure by construction.** bcrypt password hashing, signed JWT sessions in httpOnly cookies,
  per-user data isolation on every query, input validation on every endpoint, consent ledger with
  per-data-type scope and revocation, and no secrets in the repository.

## Technology stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | One deployable full-stack app: React UI + API route handlers. |
| Styling | Tailwind CSS 4 + shadcn/ui | Calm sage-green wellness design system, light + dark tokens. |
| Charts | Recharts | Dosha donuts, trend lines, combined-score history. |
| Database | Prisma ORM + SQLite (dev) | Schema is portable to PostgreSQL (no SQLite-only types). |
| Auth | bcryptjs + jose (HS256 JWT, httpOnly cookie) | Email/password only; independent and self-contained. |
| Testing | Vitest (unit) + HTTP integration suite | Engine-level and end-to-end API tests. |
| Weather | Open-Meteo | Free and keyless by design, so the repo ships zero secrets. |

### Why this differs from the brief's suggested React+Vite / FastAPI stack

The brief allows documented deviations. This environment provides a managed Next.js 16 runtime
(single externally reachable port, managed dev server). Next.js keeps everything the brief asks
for — React, component UI, REST endpoints, modular services, Pytest-equivalent tests — while
collapsing the React/Vite + FastAPI pair into one framework that can actually run and be verified
here. The backend logic lives in framework-independent modules (`src/lib/engine/*`), so porting
those to FastAPI later is a mechanical move; the schema ports to PostgreSQL by swapping the Prisma
datasource provider.

## Quick start (local)

```bash
# 1. Install dependencies
bun install        # or npm install / pnpm install

# 2. Configure environment
cp .env.example .env
#   - DATABASE_URL points at a local SQLite file by default (db/holistic.db)
#   - set JWT_SECRET for anything beyond casual local use:
#     openssl rand -base64 48

# 3. Create the database schema
bun run db:push

# 4. Run
bun run dev        # http://localhost:3000

# 5. Test
bunx vitest run                    # engine unit tests (47)
bun tests/api-integration.ts http://localhost:3000   # API integration suite (33)
bun run lint
```

Full guides: [docs/SETUP.md](docs/SETUP.md) · [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) ·
[docs/COMPANION_APP.md](docs/COMPANION_APP.md) · [docs/GITHUB_CHECKLIST.md](docs/GITHUB_CHECKLIST.md) ·
[docs/TEST_REPORT.md](docs/TEST_REPORT.md)

## Health data connections

The **Health Data** section offers one phone-based pipeline — no simulated
devices anywhere:

- **Android companion app**: `android-companion/` is a Kotlin + Jetpack
  Compose app that reads authorized records from **Health Connect** and syncs
  them to the user's account over HTTPS with a device-scoped, revocable token.
  Watches reach Health Connect through their normal phone apps. Steps, heart
  rate, resting heart rate, sleep (incl. stages where shared), active calories,
  distance, exercise sessions, SpO2 and HRV are supported; anything the phone
  apps do not share with Health Connect simply stays absent.
  Pairing is a single-use 10-minute code generated on the website; the web page
  always shows a QR code + Download button pointing at the APK served from this
  site (`/downloads/holistic-health-companion.apk`), overridable via
  `NEXT_PUBLIC_COMPANION_APK_URL`. See [docs/COMPANION_APP.md](docs/COMPANION_APP.md).

Revoking the connection deletes only the readings that came through it.
Readings accepted with `provenance: "measured"` are restricted server-side to
the `bluetooth:*` / `google_fit*` / `health_connect:*` source prefixes — any
other client input is downgraded to `manual`.

**Environment fallback.** Weather comes from Open-Meteo, then wttr.in. If both providers are
unreachable (quota, network), the app records the city's typical climate from a built-in
monthly-normals table and labels the snapshot `typical climate` — so the three fetch methods
(location / city / manual) never hard-fail and every number in the combined model stays
traceable.

## Project structure

```
src/
  app/
    page.tsx                  # SPA root (client-side screen routing)
    api/                      # REST endpoints (auth, profile, prakriti, vikriti,
                              #   combined, readings, environment,
                              #   feedback, dashboard, history, consent, health/* companion)
  components/
    AppShell.tsx              # Sidebar navigation + topbar + footer + screen switch
    holistic/shared.tsx       # Design-system primitives (donut, badges, panels, states)
    screens/                  # 14 application screens
  lib/
    data/
      prakriti-questions.ts   # Exact 62-item instrument pack (verbatim wording + weights)
      vikriti-questions.ts    # Exact 34-item instrument pack
      knowledge-base.ts       # Evidence-tagged recommendation records + references
    engine/
      prakriti-engine.ts      # Documented scoring + classification
      vikriti-engine.ts       # Experimental scoring (labelled)
      reference-values.ts     # Imputation reference averages (each source-documented)
      combined-engine.ts      # Experimental 50/30/20 model + normalisations
      seasonal.ts             # Ritu computation, tendencies, ritu-sandhi window
      recommendation-engine.ts# Deterministic evaluator with precedence + withheld log
    auth.ts                   # bcrypt + JWT session helpers
    db.ts                     # Prisma client
    health-metrics.ts         # Companion metric catalogue, limits, origin names
    health-companion.ts       # Pairing-code / device-token helpers (server)
android-companion/            # Kotlin + Compose Health Connect companion app
prisma/schema.prisma          # Users, profiles, assessments, readings, consent, events,
                              #   pairing codes, companion devices
tests/                        # Vitest unit tests + HTTP integration suite
docs/                         # Setup, deployment, companion app, GitHub checklist, test report
```

## Research grounding

Every questionnaire item, score, threshold, reference value and recommendation traces back to the
platform's research report and its bibliography, including:

- Gupta et al. 2025, *J Ayurveda Integr Med* — scoping review; instrument landscape, validation
  status, the Prakriti/Vikriti separation statement (PMC12269270).
- Tripathi et al. 2011, *Evid Based Complement Alternat Med* — the 62-item instrument, scoring
  model (960/600/1440), dual-type thresholds, null cardiovascular-dosha findings (PMC2952295).
- Bhalerao & Patwardhan 2016 — reporting practices (PMC4910291).
- Mills et al. 2019 — Vikriti questionnaire and psychological-state correlations (PMC6822152).
- Anagha & Deole 2021 — dinacharya chapter with classical verse citations (CSNE).
- Dhiman et al. 2026 — ritucharya (publisher-verified abstract only; disclosed).
- Shaffer & Ginsberg 2017 — HRV primer; Fuller et al. 2020 — wearable accuracy meta-analysis;
  Android Health Connect documentation (October 2026).

The full reference list with links renders inside the app on **About & References**.

## Limitations (owned, not hidden)

1. The Prakriti instrument has criterion-level validation only (Pitta correlation not significant).
2. The Vikriti score is an experimental platform method with no clinical validation or cutoffs.
3. The 50/30/20 combined model is a design proposal; the research report explicitly cautions
   against unweighted merging, which is why contributions stay separately visible.
4. Health data integration relies on the Android Health Connect companion app
   (see docs/COMPANION_APP.md); what reaches the platform depends on what each
   phone app shares with Health Connect.
5. Web-initiated sync is best-effort (≤15 min background pickup); instant sync
   happens from the companion app. No real-time streaming is claimed.
6. Classical "half-strength" exercise dosing and seasonal routines are traditional guidance,
   labelled as such, not physiologically validated interventions.

## License / attribution

Questionnaire content belongs to its original authors (Patwardhan & Sharma; Tripathi, Patwardhan
& Singh, IMS-BHU) and is reproduced here for the stated educational research purpose. Verify
licensing before any commercial deployment.
