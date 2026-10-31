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
"[project]/src/lib/health-companion.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PAIRING_MAX_ATTEMPTS",
    ()=>PAIRING_MAX_ATTEMPTS,
    "PAIRING_TTL_MINUTES",
    ()=>PAIRING_TTL_MINUTES,
    "SYNC_MAX_AGE_DAYS",
    ()=>SYNC_MAX_AGE_DAYS,
    "SYNC_MAX_RECORDS",
    ()=>SYNC_MAX_RECORDS,
    "generateDeviceToken",
    ()=>generateDeviceToken,
    "generatePairingCode",
    ()=>generatePairingCode,
    "requireDevice",
    ()=>requireDevice,
    "sha256",
    ()=>sha256
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
;
;
const PAIRING_TTL_MINUTES = 10;
const PAIRING_MAX_ATTEMPTS = 5;
const SYNC_MAX_RECORDS = 2000;
const SYNC_MAX_AGE_DAYS = 45;
/** Unambiguous alphabet (no 0/O/1/I) — codes are read aloud or typed by hand. */ const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function generatePairingCode() {
    const bytes = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(8);
    let out = "";
    for(let i = 0; i < 8; i++)out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    return out;
}
function sha256(value) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(value).digest("hex");
}
function generateDeviceToken() {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString("hex");
}
async function requireDevice(request) {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token) return null;
    const device = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthCompanionDevice.findUnique({
        where: {
            tokenHash: sha256(token)
        }
    });
    if (!device || device.revokedAt) return null;
    return {
        device
    };
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
"[project]/src/lib/health-metrics.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMPANION_METRICS",
    ()=>COMPANION_METRICS,
    "COMPANION_METRIC_KEYS",
    ()=>COMPANION_METRIC_KEYS,
    "METRIC_DAILY_AGG",
    ()=>METRIC_DAILY_AGG,
    "ORIGIN_NAMES",
    ()=>ORIGIN_NAMES,
    "SYNC_LIMITS",
    ()=>SYNC_LIMITS,
    "originLabel",
    ()=>originLabel
]);
/**
 * Extended metric catalog for the Android companion (Health Connect) sync.
 *
 * The core seven metrics are the platform catalogue in
 * `engine/reference-values.ts` (shared with manual entry and the combined
 * vikriti model — do not change them here). The companion adds Health-Connect
 * data types the platform previously had no keys for: active calories,
 * distance and sleep stages. These are display/context metrics only — they are
 * NOT added to COMBINED_WEARABLE_METRICS, so the combined model is unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$reference$2d$values$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/reference-values.ts [app-route] (ecmascript)");
;
const COMPANION_ONLY = {
    active_calories: {
        key: "active_calories",
        label: "Active calories",
        unit: "kcal",
        referenceAverage: null,
        referenceSource: "Vendor estimate; no platform reference average is used.",
        normalRange: null,
        normalRangeSource: "Highly individual (body size, activity) — trend display only.",
        evidenceStatus: "Energy expenditure is the least accurate wearable estimate (Fuller et al. 2020, [19]); display only.",
        purpose: "Active energy burned — display only, not scored."
    },
    distance: {
        key: "distance",
        label: "Distance",
        unit: "km",
        referenceAverage: null,
        referenceSource: "No platform reference average; activity-context metric.",
        normalRange: null,
        normalRangeSource: "Individual — trend display only.",
        evidenceStatus: "GPS/step-derived distance estimates vary by vendor; display only.",
        purpose: "Distance travelled — activity context, display only."
    },
    sleep_stage_light: {
        key: "sleep_stage_light",
        label: "Sleep — light",
        unit: "min",
        referenceAverage: null,
        referenceSource: "No platform reference; stage split varies by tracker.",
        normalRange: null,
        normalRangeSource: "No validated consumer cut-offs.",
        evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
        purpose: "Minutes in light sleep — display only."
    },
    sleep_stage_deep: {
        key: "sleep_stage_deep",
        label: "Sleep — deep",
        unit: "min",
        referenceAverage: null,
        referenceSource: "No platform reference; stage split varies by tracker.",
        normalRange: null,
        normalRangeSource: "No validated consumer cut-offs.",
        evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
        purpose: "Minutes in deep sleep — display only."
    },
    sleep_stage_rem: {
        key: "sleep_stage_rem",
        label: "Sleep — REM",
        unit: "min",
        referenceAverage: null,
        referenceSource: "No platform reference; stage split varies by tracker.",
        normalRange: null,
        normalRangeSource: "No validated consumer cut-offs.",
        evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
        purpose: "Minutes in REM sleep — display only."
    },
    sleep_stage_awake: {
        key: "sleep_stage_awake",
        label: "Sleep — awake",
        unit: "min",
        referenceAverage: null,
        referenceSource: "No platform reference; stage split varies by tracker.",
        normalRange: null,
        normalRangeSource: "No validated consumer cut-offs.",
        evidenceStatus: "Consumer stage detection is far less reliable than sleep duration (report Ch. 8.1, [14]); display only.",
        purpose: "Minutes awake during the sleep period — display only."
    }
};
const COMPANION_METRICS = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$reference$2d$values$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["METRICS"],
    ...COMPANION_ONLY
};
const COMPANION_METRIC_KEYS = Object.keys(COMPANION_METRICS);
const SYNC_LIMITS = {
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
    ],
    active_calories: [
        0,
        10000
    ],
    distance: [
        0,
        300
    ],
    sleep_stage_light: [
        0,
        1440
    ],
    sleep_stage_deep: [
        0,
        1440
    ],
    sleep_stage_rem: [
        0,
        1440
    ],
    sleep_stage_awake: [
        0,
        1440
    ]
};
const METRIC_DAILY_AGG = {
    heart_rate: "avg",
    resting_heart_rate: "avg",
    hrv_rmssd: "avg",
    spo2: "avg",
    sleep_duration: "sum",
    steps: "sum",
    active_minutes: "sum",
    active_calories: "sum",
    distance: "sum",
    sleep_stage_light: "sum",
    sleep_stage_deep: "sum",
    sleep_stage_rem: "sum",
    sleep_stage_awake: "sum"
};
const ORIGIN_NAMES = {
    "com.xiaomi.wearable": "Mi Fitness (Xiaomi)",
    "com.xiaomi.hm.health": "Zepp Life (Xiaomi)",
    "com.google.android.apps.fitness": "Google Fit",
    "com.google.android.apps.healthdata": "Health Connect",
    "com.samsung.android.health": "Samsung Health",
    "com.huawei.health": "Huawei Health",
    "com.fitbit.FitbitMobile": "Fitbit",
    "com.heytap.health": "OHealth (OnePlus/Oppo)",
    "com.oplus.health": "OHealth (OnePlus/Oppo)",
    "com.amazfithealth": "Zepp (Amazfit)",
    "com.huami.watch.hmwatchmanager": "Zepp (Amazfit)"
};
function originLabel(pkg) {
    return ORIGIN_NAMES[pkg] ?? pkg;
}
}),
"[project]/src/app/api/health/sync/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$companion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/health-companion.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$metrics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/health-metrics.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$companion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireDevice"])(request);
    if (!auth) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Companion authentication required.", 401);
    const userId = auth.device.userId;
    const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJson"])(request);
    if (!body) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Invalid request body.");
    // Failure report without records (e.g. Health Connect permission revoked).
    if (!body.records?.length) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthCompanionDevice.update({
            where: {
                id: auth.device.id
            },
            data: {
                lastSyncAt: new Date(),
                lastSyncStatus: body.error ? "error" : "success",
                lastSyncMessage: (body.error ?? "No new records.").slice(0, 200),
                lastSyncCreated: 0,
                lastSyncTotal: 0,
                syncRequestedAt: null,
                ...body.permissions ? {
                    permissionsJson: JSON.stringify(body.permissions.slice(0, 40))
                } : {}
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
            created: 0,
            updated: 0,
            skipped: 0,
            rejected: [],
            total: 0
        });
    }
    if (body.records.length > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$companion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SYNC_MAX_RECORDS"]) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])(`At most ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$companion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SYNC_MAX_RECORDS"]} records per request — split into batches.`, 413);
    }
    // ---- validate & normalise -------------------------------------------------
    const now = Date.now();
    const minDate = new Date(now - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$companion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SYNC_MAX_AGE_DAYS"] * 24 * 3600 * 1000);
    const maxDate = new Date(now + 10 * 60 * 1000);
    const rejected = [];
    const clean = [];
    const origins = new Set();
    body.records.forEach((r, index)=>{
        const metric = r.metric;
        const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$metrics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COMPANION_METRICS"][metric];
        if (!meta) {
            rejected.push({
                index,
                reason: `Unknown metric ${String(r.metric).slice(0, 40)}`
            });
            return;
        }
        const value = Number(r.value);
        if (!Number.isFinite(value)) {
            rejected.push({
                index,
                reason: "Value must be a number"
            });
            return;
        }
        const limits = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$metrics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SYNC_LIMITS"][metric];
        if (limits && (value < limits[0] || value > limits[1])) {
            rejected.push({
                index,
                reason: `Value outside ${limits[0]}-${limits[1]} ${meta.unit}`
            });
            return;
        }
        const recordedAt = new Date(r.recordedAt ?? "");
        if (Number.isNaN(recordedAt.getTime())) {
            rejected.push({
                index,
                reason: "Invalid recordedAt timestamp"
            });
            return;
        }
        if (recordedAt < minDate || recordedAt > maxDate) {
            rejected.push({
                index,
                reason: "recordedAt outside the accepted window"
            });
            return;
        }
        const origin = (r.origin ?? "").trim().slice(0, 100);
        if (!origin || !/^[A-Za-z0-9._]+$/.test(origin)) {
            rejected.push({
                index,
                reason: "Missing or invalid origin (Health Connect dataOrigin package)"
            });
            return;
        }
        origins.add(origin);
        clean.push({
            metric,
            value: Math.round(value * 1000) / 1000,
            recordedAt,
            source: `health_connect:${origin}`.slice(0, 80)
        });
    });
    // ---- dedupe & upsert ------------------------------------------------------
    let created = 0;
    let updated = 0;
    let skipped = 0;
    if (clean.length > 0) {
        const windowStart = new Date(Math.min(...clean.map((c)=>c.recordedAt.getTime())));
        const windowEnd = new Date(Math.max(...clean.map((c)=>c.recordedAt.getTime())));
        const metrics = [
            ...new Set(clean.map((c)=>c.metric))
        ];
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.findMany({
            where: {
                userId,
                metric: {
                    in: metrics
                },
                source: {
                    startsWith: "health_connect:"
                },
                recordedAt: {
                    gte: windowStart,
                    lte: windowEnd
                }
            },
            select: {
                id: true,
                metric: true,
                source: true,
                recordedAt: true,
                value: true
            }
        });
        const byKey = new Map(existing.map((e)=>[
                `${e.metric}|${e.source}|${e.recordedAt.toISOString()}`,
                e
            ]));
        for (const c of clean){
            const key = `${c.metric}|${c.source}|${c.recordedAt.toISOString()}`;
            const match = byKey.get(key);
            if (match) {
                if (Math.abs(match.value - c.value) > 1e-9) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.update({
                        where: {
                            id: match.id
                        },
                        data: {
                            value: c.value
                        }
                    });
                    updated += 1;
                } else {
                    skipped += 1;
                }
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.create({
                    data: {
                        userId,
                        metric: c.metric,
                        value: c.value,
                        unit: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$metrics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["COMPANION_METRICS"][c.metric].unit,
                        provenance: "measured",
                        source: c.source,
                        recordedAt: c.recordedAt
                    }
                });
                byKey.set(key, {
                    id: "",
                    metric: c.metric,
                    source: c.source,
                    recordedAt: c.recordedAt,
                    value: c.value
                });
                created += 1;
            }
        }
    }
    const total = clean.length;
    const status = rejected.length === 0 ? "success" : created + updated + skipped > 0 ? "partial" : "error";
    const message = rejected.length > 0 ? `${rejected.length} of ${body.records.length} records rejected (e.g. ${rejected[0].reason}).` : `${created} new, ${updated} updated, ${skipped} unchanged.`;
    // Merge previously-seen origins so the website keeps showing the source apps.
    const previousOrigins = auth.device.originsJson ? JSON.parse(auth.device.originsJson) : [];
    const mergedOrigins = [
        ...new Set([
            ...previousOrigins,
            ...origins
        ])
    ];
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthCompanionDevice.update({
        where: {
            id: auth.device.id
        },
        data: {
            lastSyncAt: new Date(),
            lastSyncStatus: status,
            lastSyncMessage: message.slice(0, 200),
            lastSyncCreated: created,
            lastSyncTotal: total,
            syncRequestedAt: null,
            originsJson: JSON.stringify(mergedOrigins.slice(0, 20)),
            ...body.permissions ? {
                permissionsJson: JSON.stringify(body.permissions.slice(0, 40))
            } : {}
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        created,
        updated,
        skipped,
        rejected: rejected.slice(0, 20),
        total,
        status
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__27082c1f._.js.map