module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "destroySession",
    ()=>destroySession,
    "getSessionUser",
    ()=>getSessionUser,
    "hashPassword",
    ()=>hashPassword,
    "issueSessionToken",
    ()=>issueSessionToken,
    "validateEmail",
    ()=>validateEmail,
    "validatePassword",
    ()=>validatePassword,
    "verifyPassword",
    ()=>verifyPassword
]);
/**
 * Authentication: bcrypt password hashing + signed JWT session delivered two
 * ways, so it survives every hosting context:
 *
 *  1. httpOnly cookie — SameSite=None; Secure behind HTTPS (works inside
 *     cross-site preview iframes where browsers strip Lax cookies from
 *     in-frame fetch calls), SameSite=Lax on plain-HTTP local development.
 *  2. Signed bearer token returned in the login/signup JSON body — the client
 *     stores it and echoes it via the Authorization header. This is the
 *     reliable path when third-party cookie blocking removes the cookie
 *     entirely (embedded preview panels, strict browsers).
 *
 * Secret management: JWT_SECRET is read from the environment. In production a
 * missing secret throws a clear configuration error at first use (fail fast,
 * per the project security rules). In development a derived development
 * secret is used with a console warning; .env (git-ignored) carries the real
 * value locally and .env.example documents it.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
;
;
const COOKIE_NAME = "holistic_session";
const SESSION_DAYS = 7;
function getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Development fallback (never used when NODE_ENV=production).
        return new TextEncoder().encode("holistic-dev-only-secret-do-not-use-in-production");
    }
    return new TextEncoder().encode(secret);
}
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
}
async function issueSessionToken(userId) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        sub: userId
    }).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime(`${SESSION_DAYS}d`).sign(getSecretKey());
}
async function createSession(userId) {
    const token = await issueSessionToken(userId);
    // Behind the Caddy gateway X-Forwarded-Proto tells us the real scheme.
    let isHttps = false;
    try {
        const h = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["headers"])();
        const proto = (h.get("x-forwarded-proto") ?? "").split(",")[0].trim().toLowerCase();
        isHttps = proto === "https";
    } catch  {
    // Outside a request scope — default to conservative cookie attributes.
    }
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    store.set(COOKIE_NAME, token, {
        httpOnly: true,
        // "None" lets the cookie ride along inside cross-site preview iframes;
        // the SameSite=None spec requires the Secure attribute.
        sameSite: isHttps ? "none" : "lax",
        secure: isHttps,
        path: "/",
        maxAge: SESSION_DAYS * 24 * 3600
    });
}
async function destroySession() {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    store.delete(COOKIE_NAME);
}
async function getSessionUser() {
    let token = null;
    try {
        const h = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["headers"])();
        const auth = h.get("authorization");
        if (auth && auth.toLowerCase().startsWith("bearer ")) {
            token = auth.slice(7).trim() || null;
        }
    } catch  {
    // headers() unavailable — cookie-only fallback below.
    }
    if (!token) {
        const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
        token = store.get(COOKIE_NAME)?.value ?? null;
    }
    if (!token) return null;
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, getSecretKey());
        const userId = payload.sub;
        if (!userId) return null;
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        });
        return user;
    } catch  {
        return null;
    }
}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    return null;
}
}),
"[project]/src/lib/api-helpers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorJson",
    ()=>errorJson,
    "json",
    ()=>json,
    "requireUser",
    ()=>requireUser,
    "safeJson",
    ()=>safeJson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
;
function json(data, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status
    });
}
function errorJson(message, status = 400) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: message
    }, {
        status
    });
}
async function requireUser() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionUser"])();
    if (!user) {
        return {
            user: null,
            response: errorJson("Authentication required.", 401)
        };
    }
    return {
        user,
        response: null
    };
}
async function safeJson(request) {
    try {
        return await request.json();
    } catch  {
        return null;
    }
}
}),
"[project]/src/lib/engine/reference-values.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Reference values for imputation and normalisation.
 *
 * Every value documents: raw input, unit, source, normalisation, score range,
 * interpretation, contribution, missing-data handling and evidence status —
 * as required by the project brief (section 11). Reference averages are
 * configurable here in one place and are always flagged "estimated" when
 * used, never presented as smartwatch measurements.
 */ __turbopack_context__.s([
    "COMBINED_WEARABLE_METRICS",
    ()=>COMBINED_WEARABLE_METRICS,
    "METRICS",
    ()=>METRICS,
    "ageBandReference",
    ()=>ageBandReference,
    "hrvReferenceAverage",
    ()=>hrvReferenceAverage
]);
const METRICS = {
    heart_rate: {
        key: "heart_rate",
        label: "Heart rate",
        unit: "bpm",
        referenceAverage: 70,
        referenceSource: "General adult resting population average; clinical normal range 60-100 bpm (AHA).",
        normalRange: [
            60,
            100
        ],
        normalRangeSource: "American Heart Association, adult resting heart rate normal range.",
        evidenceStatus: "Wearable step-count and heart-rate averages show acceptable accuracy (Fuller et al. 2020 meta-analysis, [19]); context only, never a dosha measure.",
        purpose: "Beats per minute — general fitness context."
    },
    resting_heart_rate: {
        key: "resting_heart_rate",
        label: "Resting heart rate",
        unit: "bpm",
        referenceAverage: 70,
        referenceSource: "General adult resting population average (clinical normal 60-100 bpm; AHA).",
        normalRange: [
            60,
            80
        ],
        normalRangeSource: "Common adult resting range used in wearable wellness research (report Ch. 8).",
        evidenceStatus: "Research-supported context indicator (report Ch. 8.1); not a dosha measure.",
        purpose: "Beats per minute at rest — lower usually means better recovery."
    },
    hrv_rmssd: {
        key: "hrv_rmssd",
        label: "HRV (RMSSD)",
        unit: "ms",
        referenceAverage: null,
        referenceSource: "Age-band population averages (Shaffer & Ginsberg 2017 HRV primer [12]; Umetani et al. 1998 age norms).",
        normalRange: null,
        normalRangeSource: "Age-dependent; see ageBandReference().",
        evidenceStatus: "Presented as a stress-recovery index, not a dosha measure (Shaffer & Ginsberg 2017, [12]).",
        purpose: "Heart-rate variability — higher suggests better recovery; drops with stress."
    },
    sleep_duration: {
        key: "sleep_duration",
        label: "Sleep duration",
        unit: "h",
        referenceAverage: 7.5,
        referenceSource: "Midpoint of the 7-9 h recommendation for adults (AASM / Sleep Foundation consensus).",
        normalRange: [
            7,
            9
        ],
        normalRangeSource: "AASM & Sleep Foundation recommended sleep range for adults 18-64.",
        evidenceStatus: "Consumer trackers estimate sleep duration well (sleep sensitivity 0.93-0.96, report Ch. 8.1 [14]); stages are far less reliable.",
        purpose: "Hours slept — recovery indicator."
    },
    steps: {
        key: "steps",
        label: "Steps",
        unit: "steps",
        referenceAverage: 5000,
        referenceSource: "Approximate free-living adult population average (~4,800-5,000 steps/day, published accelerometer studies).",
        normalRange: [
            7000,
            10000
        ],
        normalRangeSource: "Common public-health daily target of 7,000-10,000 steps (platform design proposal).",
        evidenceStatus: "Steps show acceptable average wearable accuracy (Fuller et al. 2020 [19]).",
        purpose: "Daily step count — activity level."
    },
    active_minutes: {
        key: "active_minutes",
        label: "Active minutes",
        unit: "min",
        referenceAverage: 30,
        referenceSource: "General adult physical-activity guidance of ~30 min/day moderate activity (WHO framing).",
        normalRange: [
            30,
            60
        ],
        normalRangeSource: "WHO adult guidance of 150+ moderate minutes/week (daily-equivalent framing).",
        evidenceStatus: "Activity summary from steps/heart rate; vendor estimates vary.",
        purpose: "Minutes of moderate activity — exercise load."
    },
    spo2: {
        key: "spo2",
        label: "SpO2",
        unit: "%",
        referenceAverage: 97,
        referenceSource: "General adult peripheral oxygen saturation average (95-100% normal band).",
        normalRange: [
            95,
            100
        ],
        normalRangeSource: "Standard pulse-oximetry normal band.",
        evidenceStatus: "Consumer SpO2 overestimates reference values (report Ch. 8, [17]); trend display only, excluded from scoring.",
        purpose: "Blood oxygen — display only, not scored."
    }
};
function ageBandReference(age) {
    if (age == null) return 42;
    if (age <= 25) return 55;
    if (age <= 35) return 45;
    if (age <= 45) return 38;
    if (age <= 55) return 32;
    if (age <= 65) return 27;
    return 22;
}
function hrvReferenceAverage(age) {
    return ageBandReference(age);
}
const COMBINED_WEARABLE_METRICS = [
    "sleep_duration",
    "resting_heart_rate",
    "hrv_rmssd",
    "steps"
];
}),
"[project]/src/app/api/readings/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$reference$2d$values$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/reference-values.ts [app-route] (ecmascript)");
;
;
;
const VALID_METRICS = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$reference$2d$values$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["METRICS"]);
async function GET(request) {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const url = new URL(request.url);
    const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? 30)));
    const since = new Date(Date.now() - days * 24 * 3600 * 1000);
    const readings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.findMany({
        where: {
            userId: guard.user.id,
            recordedAt: {
                gte: since
            }
        },
        orderBy: {
            recordedAt: "desc"
        },
        take: 2000
    });
    // Latest reading per metric + provenance coverage.
    const latest = {};
    const provenanceCounts = {};
    for (const r of readings){
        if (!latest[r.metric]) {
            latest[r.metric] = {
                value: r.value,
                unit: r.unit,
                provenance: r.provenance,
                recordedAt: r.recordedAt.toISOString(),
                source: r.source
            };
        }
        provenanceCounts[r.provenance] = (provenanceCounts[r.provenance] ?? 0) + 1;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        readings: readings.map((r)=>({
                id: r.id,
                metric: r.metric,
                value: r.value,
                unit: r.unit,
                provenance: r.provenance,
                source: r.source,
                recordedAt: r.recordedAt.toISOString()
            })),
        latest,
        provenanceCounts
    });
}
const MEASURED_SOURCE_PREFIXES = [
    "bluetooth:",
    "google_fit",
    "health_connect"
];
async function POST(request) {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJson"])(request);
    if (!body) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Invalid request body.");
    const metric = body.metric;
    if (!VALID_METRICS.includes(metric)) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Unknown metric.");
    const value = Number(body.value);
    if (!Number.isFinite(value)) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Value must be a number.");
    // Per-metric sanity validation.
    const limits = {
        heart_rate: [
            30,
            230
        ],
        resting_heart_rate: [
            30,
            130
        ],
        hrv_rmssd: [
            2,
            300
        ],
        sleep_duration: [
            0,
            24
        ],
        steps: [
            0,
            200000
        ],
        active_minutes: [
            0,
            1440
        ],
        spo2: [
            50,
            100
        ]
    };
    const [min, max] = limits[metric] ?? [
        0,
        1000000
    ];
    if (value < min || value > max) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])(`Value for ${metric} must be between ${min} and ${max} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$reference$2d$values$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["METRICS"][metric].unit}.`, 422);
    }
    const recordedAt = body.recordedAt ? new Date(body.recordedAt) : new Date();
    if (Number.isNaN(recordedAt.getTime())) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Invalid recordedAt timestamp.");
    // Provenance guard: a client may claim "measured" ONLY for a real device
    // pipeline (Bluetooth GATT, Google Fit, or the Android Health Connect
    // companion). Anything else stays "manual" —
    // simulated values are not accepted from anywhere.
    const source = (body.source ?? "manual_entry").slice(0, 80);
    const provenance = body.provenance === "measured" && MEASURED_SOURCE_PREFIXES.some((p)=>source.startsWith(p)) ? "measured" : "manual";
    const reading = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.create({
        data: {
            userId: guard.user.id,
            metric,
            value,
            unit: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$reference$2d$values$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["METRICS"][metric].unit,
            provenance,
            source,
            recordedAt
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        reading
    }, 201);
}
async function DELETE(request) {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Missing id parameter.");
    // User isolation: delete only the user's own record.
    const deleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.deleteMany({
        where: {
            id,
            userId: guard.user.id
        }
    });
    if (deleted.count === 0) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Reading not found.", 404);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        ok: true
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ffadaaa4._.js.map