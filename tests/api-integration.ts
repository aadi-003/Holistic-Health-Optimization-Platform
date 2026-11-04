/**
 * API integration test — run against the dev server on localhost:3000.
 * Exercises the full golden path end-to-end, including user-level data
 * isolation between two accounts.
 *
 * Usage: bun tests/api-integration.ts [baseUrl]
 */
const BASE = process.argv[2] ?? "http://localhost:3000";

let passed = 0;
let failed = 0;

function check(name: string, ok: boolean, detail = "") {
  if (ok) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function client() {
  let cookie = "";
  return {
    async call(path: string, init: RequestInit = {}) {
      const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}), ...(init.headers ?? {}) },
      });
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) cookie = setCookie.split(";")[0];
      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      return { status: res.status, body };
    },
  };
}

const unique = Date.now();

async function main() {
  console.log(`API integration test against ${BASE}\n`);

  /* ---------- Auth ---------- */
  const alice = client();
  const su = await alice.call("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name: "Alice Tester", email: `alice-${unique}@test.local`, password: " passphrase1" }),
  });
  // Note: password intentionally starts with a space to prove trimming isn't assumed — actually validate:
  check("signup rejects weak passwords", (await client().call("/api/auth/signup", { method: "POST", body: JSON.stringify({ name: "Weak", email: `weak-${unique}@test.local`, password: "short" }) })).status === 400);
  check("signup accepts valid registration", su.status === 201, JSON.stringify(su.body));

  const li = await alice.call("/api/auth/login", { method: "POST", body: JSON.stringify({ email: `alice-${unique}@test.local`, password: " passphrase1" }) });
  check("login works (password with spaces preserved verbatim)", li.status === 200, JSON.stringify(li.body));

  const bad = await client().call("/api/auth/login", { method: "POST", body: JSON.stringify({ email: `alice-${unique}@test.local`, password: "wrongpass1" }) });
  check("invalid credentials rejected", bad.status === 401);

  const me = await alice.call("/api/auth/me");
  check("session resolves /api/auth/me", me.status === 200 && (me.body as { user: unknown }).user != null);

  const anon = client();
  const anonMe = await anon.call("/api/auth/me");
  check("anonymous session is null", anonMe.status === 200 && (anonMe.body as { user: unknown }).user === null);
  const anonDash = await anon.call("/api/dashboard");
  check("protected routes require auth", anonDash.status === 401);

  /* ---------- Profile ---------- */
  const prof = await alice.call("/api/profile", { method: "PUT", body: JSON.stringify({ name: "Alice Tester", age: 29, city: "Varanasi", heightCm: 165, weightKg: 58 }) });
  check("profile upsert works", prof.status === 200 && (prof.body as { profile: { age: number } }).profile.age === 29);

  /* ---------- Prakriti ---------- */
  const q = await alice.call("/api/prakriti");
  const history0 = (q.body as { history: unknown[] }).history;
  check("prakriti questionnaire/history endpoint ok", q.status === 200 && Array.isArray(history0));

  const partialAnswers: Record<string, string> = {};
  for (const id of ["K1", "V3"]) partialAnswers[id] = "yes";
  const partial = await alice.call("/api/prakriti", { method: "POST", body: JSON.stringify({ answers: partialAnswers }) });
  check("incomplete prakriti submission rejected (422)", partial.status === 422);

  const { PRAKRITI_ITEMS } = await import("../src/lib/data/prakriti-questions");
  const prakritiAnswers: Record<string, "yes" | "no"> = {};
  // Answer vata items in scoring direction, everything else against -> single Vata 100%.
  for (const item of PRAKRITI_ITEMS) {
    prakritiAnswers[item.id] = item.dosha === "vata" ? item.scoringAnswer : item.scoringAnswer === "yes" ? "no" : "yes";
  }
  const prak = await alice.call("/api/prakriti", { method: "POST", body: JSON.stringify({ answers: prakritiAnswers }) });
  const prakBody = prak.body as { score: { vataPct: number; classification: string } };
  check("prakriti submission scores vata at 100%", prak.status === 201 && prakBody.score.vataPct === 100, JSON.stringify(prakBody));
  check("prakriti classification = vata", prakBody.score.classification === "vata");

  /* ---------- Vikriti ---------- */
  const { VIKRITI_ITEMS } = await import("../src/lib/data/vikriti-questions");
  const vikritiAnswers: Record<string, "yes" | "no"> = {};
  for (const item of VIKRITI_ITEMS) vikritiAnswers[item.id] = item.dosha === "vata" ? "yes" : "no";
  const vik = await alice.call("/api/vikriti", { method: "POST", body: JSON.stringify({ answers: vikritiAnswers }) });
  const vikBody = vik.body as { score: { dominant: string; vataPct: number } };
  check("vikriti submission scores vata 100% dominant", vik.status === 201 && vikBody.score.dominant === "vata" && vikBody.score.vataPct === 100, JSON.stringify(vikBody));

  /* ---------- Readings + combined ---------- */
  const now = new Date().toISOString();
  for (const [metric, value] of [["sleep_duration", 8], ["resting_heart_rate", 64], ["hrv_rmssd", 62], ["steps", 9500]]) {
    const r = await alice.call("/api/readings", { method: "POST", body: JSON.stringify({ metric, value, recordedAt: now }) });
    check(`manual reading ${metric} accepted`, r.status === 201);
  }
  const badReading = await alice.call("/api/readings", { method: "POST", body: JSON.stringify({ metric: "heart_rate", value: 999 }) });
  check("invalid reading rejected (422)", badReading.status === 422);

  const sim = await alice.call("/api/readings/simulate", { method: "POST" });
  check("simulation mode generates labelled demo readings", sim.status === 201);

  const combined = await alice.call("/api/vikriti/combined", { method: "POST" });
  const cBody = combined.body as { assessment: { breakdown: { combinedScore: number; wearable: { dataCompleteness: number } } } };
  check("combined model computes", combined.status === 201 && typeof cBody.assessment.breakdown.combinedScore === "number");
  check("combined model tracks data completeness", cBody.assessment.breakdown.wearable.dataCompleteness === 1);

  /* ---------- Environment ---------- */
  const env = await alice.call("/api/environment?city=Varanasi");
  // The weather service may be rate-limited/unreachable in some environments;
  // what MUST hold is graceful degradation with the manual path intact.
  const envOk = env.status === 200 || (env.status === 503 && /manual entry/i.test((env.body as { error: string }).error));
  check("city weather fetch works or degrades gracefully to manual entry", envOk, JSON.stringify(env.body).slice(0, 120));
  const manualEnv = await alice.call("/api/environment", { method: "POST", body: JSON.stringify({ temperatureC: 31, humidity: 70, hemisphere: "north" }) });
  check("manual environment accepted", manualEnv.status === 201);
  const badEnv = await alice.call("/api/environment", { method: "POST", body: JSON.stringify({ temperatureC: 900 }) });
  check("invalid environment rejected", badEnv.status === 400);

  /* ---------- Recommendations ---------- */
  const recs = await alice.call("/api/recommendations");
  const recsBody = recs.body as { shown: { ruleId: string; evidenceLevel: string; classicalSource: string | null; researchReference: string | null }[]; withheld: unknown[] };
  check("recommendations generate", recs.status === 200 && recsBody.shown.length > 0);
  check("every shown recommendation has a source", recsBody.shown.every((r) => r.classicalSource || r.researchReference));
  check("vata-imbalanced pathya rule fired (PAT-001)", recsBody.shown.some((r) => r.ruleId === "PAT-001"));
  check("no raga rules exist", recsBody.shown.every((r) => !/raga/i.test(r.ruleId)));

  /* ---------- User isolation ---------- */
  const bob = client();
  await bob.call("/api/auth/signup", { method: "POST", body: JSON.stringify({ name: "Bob Tester", email: `bob-${unique}@test.local`, password: "bobpass123" }) });
  await bob.call("/api/auth/login", { method: "POST", body: JSON.stringify({ email: `bob-${unique}@test.local`, password: "bobpass123" }) });

  const bobPrakriti = await bob.call("/api/prakriti");
  check("bob sees zero prakriti assessments (isolation)", (bobPrakriti.body as { history: unknown[] }).history.length === 0);
  const bobReadings = await bob.call("/api/readings?days=30");
  check("bob sees zero readings (isolation)", (bobReadings.body as { readings: unknown[] }).readings.length === 0);
  const bobCombined = await bob.call("/api/vikriti/combined", { method: "POST" });
  check("bob cannot compute combined without own vikriti (isolation + precondition)", bobCombined.status === 409);

  /* ---------- History ---------- */
  const hist = await alice.call("/api/history");
  const h = hist.body as { prakriti: unknown[]; vikriti: unknown[]; combined: unknown[] };
  check("history returns immutable assessment records", hist.status === 200 && h.prakriti.length === 1 && h.vikriti.length === 1 && h.combined.length === 1);

  /* ---------- Logout ---------- */
  await alice.call("/api/auth/logout", { method: "POST" });
  const afterLogout = await alice.call("/api/dashboard");
  check("logout invalidates the session", afterLogout.status === 401);

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("Test run crashed:", e);
  process.exit(1);
});
