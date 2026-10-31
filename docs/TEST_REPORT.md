# Test Report

Date: 2026-10-30 · Commit state: working tree of the fresh Holistic project

## Summary

| Suite | Count | Result |
|---|---|---|
| Engine unit tests (Vitest) | 47 | **47 passed** |
| API integration suite (HTTP, golden path) | 33 | **33 passed** |
| ESLint | — | Clean |
| Dev-server compile | — | Clean (no runtime errors in dev.log) |
| Secret scan | — | No secrets found; `.env` untracked and ignored |

## 1. Unit tests (`tests/`)

### Prakriti engine (`prakriti-engine.test.ts`, 13 tests)

- Instrument pack: exactly **62 items**; documented maxima **960/600/1440**; itemised weight sums
  (Vata 960, Kapha 1440, **Pitta 599** — the documented 600-vs-599 rounding artefact, disclosed
  not corrected); all items carry yes/no scoring answers.
- Known-answer vectors: full Vata vector → 960/960 = 100 %, single `vata`; full Kapha → 1440/1440
  = 100 %; full Pitta → 599/600 = 99.83 %.
- Classification boundaries: dual type at exactly secondary = 50 % of primary (crafted vector:
  Kapha 100 %, Vata 50 %, Pitta 0 → `vata_kapha`, order-collapsed label); balanced `sama` branch
  when the tertiary is not 25 % below the secondary (all-yes vector → V 100 / P 79.83 / K 72.22);
  `undetermined` for the all-zero vector.
- Missing answers earn no points; percentages always within [0, 100].

### Vikriti + combined + seasonal (`vikriti-combined.test.ts`, 23 tests)

- Vikriti pack: **34 items**, buckets Kapha 11 (Q1-11) / Pitta 10 (Q12-21) / Vata 13 (Q22-34),
  serials 1-34 contiguous.
- Experimental scoring: one point per Yes normalised per bucket; dominant selection; tie handling
  (Vata 100 & Kapha 100 → `vata_kapha` order-collapsed tie).
- Wearable normalisation (documented design-proposal mappings): sleep 7-9 h → 100 with −30/h
  outside; RHR 100 at ≤ 70, −2.5/bpm, floor 0 at 110; HRV 100 at age-band reference → 0 at half;
  steps linear 2k→10k.
- Environmental aggravation (classical guna logic): cold+dry → Vata; heat → Pitta; cold+damp →
  Kapha (hand-computed values asserted).
- Seasonal module: monthly ritu mapping, southern-hemisphere inversion, classical tendencies,
  ṛtu-sandhi window flag.
- Combined model: weight identity `0.5Q + 0.3W + 0.2E` holds; missing wearable indicators are
  imputed from reference averages with `estimated` provenance and completeness 0; real readings
  raise completeness to 1 and confidence to 86; classical seasonal tendency bonus (+12) applied
  only when the season matches the dominant dosha; model version + ≥5-step explanation payload.
- Reference values: every metric documents unit, source and evidence status; **SpO₂ excluded**
  from scoring (overestimation bias).

### Recommendation engine + knowledge base (`recommendation-engine.test.ts`, 11 tests)

- Every rule carries Sanskrit (Devanagari + IAST), an evidence level in {DR, AI, CT, DP}, ≥ 1
  precaution and ≥ 1 resolvable source (classical or research).
- **Zero raga rules** (no verified mapping in reviewed sources).
- All eight required categories covered.
- Three-valued evaluation: prakriti-conditional rules withheld with "waiting for…" when no
  assessment exists; constitution- and vikriti-conditional rules fire/withhold correctly; safety
  sleep-debt rule (VYA-003) fires on < 6.5 h and is ordered by precedence; recovery rule withheld
  when RHR data missing; ṛtu-sandhi rule only inside the window; conflict-resolution note recorded
  on lower-precedence rules when a safety rule fires.

**Bug found and fixed during testing:** the evaluator compared snake_case condition flags against
camelCase flag keys, silently disabling all wearable-conditional rules — caught by the VYA-003
test, fixed in `recommendation-engine.ts`, regression-covered.

## 2. API integration suite (`tests/api-integration.ts`, 33 checks)

Run against the live dev server. Covers:

- **Auth (7):** signup, weak-password rejection, login (including whitespace-preserved
  passwords), invalid credentials, session resolution, anonymous null, protected-route 401.
- **Profile (1):** upsert with numeric clamping.
- **Prakriti (4):** history endpoint, incomplete submission → 422, full submission scores
  Vata 100 %, classification `vata`.
- **Vikriti (1):** full submission → Vata 100 % dominant.
- **Readings (6):** four metrics accepted, out-of-range value → 422, simulation mode creates
  labelled demo data.
- **Combined (2):** computes with the 50/30/20 breakdown; completeness = 1 with real readings.
- **Environment (3):** city fetch works **or degrades gracefully to manual entry** (the sandbox
  IP hit Open-Meteo's shared daily limit during testing — the 503 + manual-fallback path was
  exercised exactly as designed); manual entry accepted; invalid temperature → 400.
- **Recommendations (4):** generate; every shown card has a source; vata pathya rule fired from
  the seeded self-assessment; no raga rules.
- **User isolation (3):** second account sees zero prakriti records, zero readings, and cannot
  compute a combined result without its own vikriti (409).
- **History + logout (2):** immutable assessment records; logout invalidates the session.

## 3. Static checks

- `bun run lint` — clean.
- Dev server (`dev.log`) — compiles clean; no runtime errors during the browser walkthrough.
- **Secret scan** (patterns: `sk-`, `ghp_`, `AKIA…`, `AIza…`, high-entropy `secret|token|key =
  "…"`) — no findings. `.env` verified **untracked** (`git rm --cached` applied — the scaffold
  had it staged) and matched by `.gitignore`. `.env.example` contains placeholders only. Client
  components import no server-only module (bcrypt/jose/db) — verified by grep.

## 4. Manual / browser verification

Golden path exercised in a real browser via the agent-browser tool:

signup → profile setup → Prakriti assessment (62 questions, progress, jump map) → Prakriti result
(donut + absolute scores + validation disclosure) → Vikriti check-in (34 questions, section
banners) → Vikriti result (separate + experimental combined) → demo week generation →
recommendations with sources and transparency log → environment (manual) → history → settings →
logout. Results recorded in the delivery summary.

## 5. Remaining limitations

- Health data integrations cover Google Fit (REST) and the Android Health Connect
  companion app (docs/COMPANION_APP.md); on-device sync quality depends on what
  Mi Fitness shares for the Redmi Watch 5 Lite. The APK build/host step is
  performed by the owner (Android SDK tooling); the web QR activates once
  NEXT_PUBLIC_COMPANION_APK_URL is set.
- Weather depends on Open-Meteo availability; manual entry is the designed fallback.
- No automated E2E browser CI (agent-browser walkthrough was manual); `bun run build` is managed
  by the sandbox dev pipeline (production build verified via the dev compile + start path).
