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
"[project]/src/lib/data/prakriti-questions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Holistic — Prakriti instrument pack (62 items).
 *
 * SOURCE OF TRUTH: the supplied questionnaire document "62_questions.pdf"
 * ("The self-assessment questionnaire to assess Prakriti", originally prepared
 * by Kishor Patwardhan and Rashmi Sharma; modified by Piyush Kumar Tripathi,
 * Kishor Patwardhan and Girish Singh, Institute of Medical Sciences, Banaras
 * Hindu University, Varanasi).
 *
 * VERIFICATION NOTES (documented discrepancies — nothing silently changed):
 * - Every item below carries the original wording, guna, scoring answer
 *   ("yes"/"no" as printed in the "Is your answer the following?" column) and
 *   the printed weight.
 * - The document prints per-dosha totals: Kapha 1440, Pitta 600, Vata 960.
 * - The itemised Pitta weights sum to 599 (7 x 17 = 119, 5 x 24 = 120,
 *   2 x 60 = 120, 2 x 120 = 240) while the printed total is 600. This is a
 *   rounding artefact of 120 points per guna split over 7 Ushna features
 *   (120/7 = 17.14 -> 17). Following the project accuracy rules, the
 *   DOCUMENTED maximum (600) is used for the percentage formula, exactly as
 *   printed in both the questionnaire and the research report
 *   ("maximum scores: Vata 960, Pitta 600, Kapha 1440"). The 599 sum is
 *   disclosed on the About & References screen.
 * - Duplicate items that appear in more than one dosha section in the source
 *   (e.g. "Do you think you have intense sexual desire?" in Kapha-4 and
 *   Pitta-5 with opposite scoring answers) are intentionally kept as separate
 *   items, exactly as printed.
 */ __turbopack_context__.s([
    "PRAKRITI_INSTRUMENT",
    ()=>PRAKRITI_INSTRUMENT,
    "PRAKRITI_ITEMS",
    ()=>PRAKRITI_ITEMS
]);
const PRAKRITI_INSTRUMENT = {
    id: "prakriti_62_charaka_v1",
    language: "en",
    anchoredClassicalSource: "Caraka-samhita, Vimana-sthana 8.95 (guna-based item construction)",
    scoringModel: {
        type: "guna_proportional_absolute",
        perGunaPoints: 120,
        doshaMax: {
            vata: 960,
            pitta: 600,
            kapha: 1440
        }
    },
    classificationThresholds: {
        dualIfSecondaryGePctOfPrimary: 50,
        dualIfTertiaryLePctOfSecondary: 75
    },
    /** Answer framing required by Gupta et al. (2025): lifelong traits, not current state. */ framingInstruction: "Answer every question for your long-standing characteristics over your adult life, not for how you feel these days. Prakriti describes your baseline constitution, not your current state."
};
const PRAKRITI_ITEMS = [
    // ---------------- KAPHA (printed total 1440) ----------------
    {
        id: "K1",
        serial: "1",
        dosha: "kapha",
        guna: "Snigdha",
        text: "Whether your skin remains oily throughout the year in comparison to others?",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "K2",
        serial: "2",
        dosha: "kapha",
        guna: "Shlakshna",
        text: "Are your body-hairs & skin shiny, even when no oil or moisturizer is used?",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "K3A",
        serial: "3.A",
        dosha: "kapha",
        guna: "Mridu",
        text: "Are you considered attractive among your friends?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K3B",
        serial: "3.B",
        dosha: "kapha",
        guna: "Mridu",
        text: "Do even mild or trivial injuries on your body make you upset?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K3C",
        serial: "3.C",
        dosha: "kapha",
        guna: "Mridu",
        text: "Among your family members, is your complexion considered fairer?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K4",
        serial: "4",
        dosha: "kapha",
        guna: "Madhura",
        text: "Do you think you have intense sexual desire?",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "K5A",
        serial: "5.A",
        dosha: "kapha",
        guna: "Saara",
        text: "Have you got well built muscles?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "K5B",
        serial: "5.B",
        dosha: "kapha",
        guna: "Saara",
        text: "Do you change your body posture frequently? (You cannot manage yourself in a stable posture for a long duration.)",
        scoringAnswer: "no",
        weight: 60
    },
    {
        id: "K6",
        serial: "6",
        dosha: "kapha",
        guna: "Sandra",
        text: "Do you have a well-nourished & normally developed body? (You are neither malnourished nor obese.)",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "K7A",
        serial: "7.A",
        dosha: "kapha",
        guna: "Manda",
        text: "Are you lazy and disinterested in activities like morning walk/ jogging, swimming or any type of outdoor games?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K7B",
        serial: "7.B",
        dosha: "kapha",
        guna: "Manda",
        text: "Are you slow in consuming the food? (Even after all have left the dining hall, you are still consuming the same amount of food).",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K7C",
        serial: "7.C",
        dosha: "kapha",
        guna: "Manda",
        text: "When you go to morning walk or college or office, do you walk slowly in comparison to others?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K8A",
        serial: "8.A",
        dosha: "kapha",
        guna: "Stimita",
        text: "If you are assigned any work, do you take some extra time to start it?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K8B",
        serial: "8.B",
        dosha: "kapha",
        guna: "Stimita",
        text: "Do you get irritated easily? (For example, when you don't get breakfast on time in your hostel or when the power goes off while watching a cricket match or your favourite movie on television).",
        scoringAnswer: "no",
        weight: 40
    },
    {
        id: "K8C",
        serial: "8.C",
        dosha: "kapha",
        guna: "Stimita",
        text: "Are you late to develop/suffer from symptoms after exposure to common causative factors? (For example, during seasonal changes, when your friends are easily caught up with flu etc., you are still healthy among them).",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "K9",
        serial: "9",
        dosha: "kapha",
        guna: "Guru",
        text: "Does your gait (style of walking) change with respect to speed or manner frequently?",
        scoringAnswer: "no",
        weight: 120
    },
    {
        id: "K10A",
        serial: "10.A",
        dosha: "kapha",
        guna: "Shita",
        text: "Do you feel hungry more frequently and do you consume more food in comparison to others?",
        scoringAnswer: "no",
        weight: 30
    },
    {
        id: "K10B",
        serial: "10.B",
        dosha: "kapha",
        guna: "Shita",
        text: "Do you tolerate heat easily?",
        scoringAnswer: "yes",
        weight: 30
    },
    {
        id: "K10C",
        serial: "10.C",
        dosha: "kapha",
        guna: "Shita",
        text: "Do you consume liquids in more quantity and frequency in comparison to others?",
        scoringAnswer: "no",
        weight: 30
    },
    {
        id: "K10D",
        serial: "10.D",
        dosha: "kapha",
        guna: "Shita",
        text: "Do you perspire less in comparison to others?",
        scoringAnswer: "yes",
        weight: 30
    },
    {
        id: "K11",
        serial: "11",
        dosha: "kapha",
        guna: "Picchila",
        text: "Are sounds produced frequently in your joints on movement?",
        scoringAnswer: "no",
        weight: 120
    },
    {
        id: "K12A",
        serial: "12.A",
        dosha: "kapha",
        guna: "Achcha",
        text: "Have you got a good/ attractive complexion?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "K12B",
        serial: "12.B",
        dosha: "kapha",
        guna: "Achcha",
        text: "Have you got sweet & pleasant voice?",
        scoringAnswer: "yes",
        weight: 60
    },
    // ---------------- PITTA (printed total 600; itemised sum 599 — see header note) ----------------
    {
        id: "P1A",
        serial: "1.A",
        dosha: "pitta",
        guna: "Ushna",
        text: "Are you more comfortable in winter than summer?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P1B",
        serial: "1.B",
        dosha: "pitta",
        guna: "Ushna",
        text: "Among your family members, is your complexion considered fairer?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P1C",
        serial: "1.C",
        dosha: "pitta",
        guna: "Ushna",
        text: "Does your temperature of oral cavity remain towards upper limit of normal range?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P1D",
        serial: "1.D",
        dosha: "pitta",
        guna: "Ushna",
        text: "Do you have excessive black moles, Freckles etc on your skin? Or Have you noticed new appearance of black moles often on your skin?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P1E",
        serial: "1.E",
        dosha: "pitta",
        guna: "Ushna",
        text: "Do you feel excessive hunger & thirst in comparison to others?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P1F",
        serial: "1.F",
        dosha: "pitta",
        guna: "Ushna",
        text: "Have you experienced premature graying, wrinkling of skin & early baldness?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P1G",
        serial: "1.G",
        dosha: "pitta",
        guna: "Ushna",
        text: "Do you have soft, scanty, brown hair on your face, body & head?",
        scoringAnswer: "yes",
        weight: 17
    },
    {
        id: "P2A",
        serial: "2.A",
        dosha: "pitta",
        guna: "Tikshna",
        text: "Do you involve yourself in risky & heroic activities requiring physical strength often?",
        scoringAnswer: "yes",
        weight: 24
    },
    {
        id: "P2B",
        serial: "2.B",
        dosha: "pitta",
        guna: "Tikshna",
        text: "Do you have ability to digest large quantities of food easily?",
        scoringAnswer: "yes",
        weight: 24
    },
    {
        id: "P2C",
        serial: "2.C",
        dosha: "pitta",
        guna: "Tikshna",
        text: "Do you take large quantities of food & drink in comparison to others?",
        scoringAnswer: "yes",
        weight: 24
    },
    {
        id: "P2D",
        serial: "2.D",
        dosha: "pitta",
        guna: "Tikshna",
        text: "Do you get easily irritated for small/negligible problem in day-to-day life?",
        scoringAnswer: "yes",
        weight: 24
    },
    {
        id: "P2E",
        serial: "2.E",
        dosha: "pitta",
        guna: "Tikshna",
        text: "Do you consume food more frequently than others? (5-6 times/day)",
        scoringAnswer: "yes",
        weight: 24
    },
    {
        id: "P3A",
        serial: "3.A",
        dosha: "pitta",
        guna: "Drava",
        text: "Do you have soft & loose muscle bulk especially around the joints?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "P3B",
        serial: "3.B",
        dosha: "pitta",
        guna: "Drava",
        text: "In comparison to others do you pass urine & stool in large quantities and do you perspire more?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "P4",
        serial: "4",
        dosha: "pitta",
        guna: "Visra",
        text: "Do your friends complain of bad smell being emitted from your body & mouth?",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "P5",
        serial: "5",
        dosha: "pitta",
        guna: "Amla+Katu",
        text: "Do you think you have intense sexual desire?",
        scoringAnswer: "no",
        weight: 120
    },
    // ---------------- VATA (printed total 960) ----------------
    {
        id: "V1A",
        serial: "1.A",
        dosha: "vata",
        guna: "Ruksha",
        text: "Whether your skin remains dry throughout the year in comparison to others?",
        scoringAnswer: "yes",
        weight: 30
    },
    {
        id: "V1B",
        serial: "1.B",
        dosha: "vata",
        guna: "Ruksha",
        text: "Is your body undernourished/ emaciated?",
        scoringAnswer: "yes",
        weight: 30
    },
    {
        id: "V1C",
        serial: "1.C",
        dosha: "vata",
        guna: "Ruksha",
        text: "Have you got rough, low, broken or obstructed voice?",
        scoringAnswer: "yes",
        weight: 30
    },
    {
        id: "V1D",
        serial: "1.D",
        dosha: "vata",
        guna: "Ruksha",
        text: "Does Your sleep last less than 6 hours per day? Or Can your sleep be disturbed easily?",
        scoringAnswer: "yes",
        weight: 30
    },
    {
        id: "V2A",
        serial: "2.A",
        dosha: "vata",
        guna: "Laghu",
        text: "Do you change walking speed & style from time to time?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "V2B",
        serial: "2.B",
        dosha: "vata",
        guna: "Laghu",
        text: "Do you keep changing your food habits from time to time?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "V2C",
        serial: "2.C",
        dosha: "vata",
        guna: "Laghu",
        text: "Do you keep changing your walking / jogging habit from time to time?",
        scoringAnswer: "yes",
        weight: 40
    },
    {
        id: "V3",
        serial: "3",
        dosha: "vata",
        guna: "Chala",
        text: "Do you keep your joints, eyes, eyebrows, jaw, lips, tongue, head, Shoulder, hands & feet frequently moving?",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "V4A",
        serial: "4.A",
        dosha: "vata",
        guna: "Bahu",
        text: "Are you considered a talkative among your friends?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "V4B",
        serial: "4.B",
        dosha: "vata",
        guna: "Bahu",
        text: "Do you have prominent veins & tendons all over the body?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "V5A",
        serial: "5.A",
        dosha: "vata",
        guna: "Shighra",
        text: "Do you generally start the work assigned to you immediately?",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5B",
        serial: "5.B",
        dosha: "vata",
        guna: "Shighra",
        text: "Do you get irritated easily? (E.g., when you do not get breakfast on time in your hostel or when the power goes off while watching a cricket match or your favourite movie over television)",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5C",
        serial: "5.C",
        dosha: "vata",
        guna: "Shighra",
        text: "Do you get frightened easily?",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5D",
        serial: "5.D",
        dosha: "vata",
        guna: "Shighra",
        text: "Do you make friends easily & also lose them easily?",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5E",
        serial: "5.E",
        dosha: "vata",
        guna: "Shighra",
        text: "Do you generally learn things quickly? Or Do you have a good grasping power?",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5F",
        serial: "5.F",
        dosha: "vata",
        guna: "Shighra",
        text: "Is your long term memory weak? (E.g., you can remember only few names of your friends at your primary school).",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5G",
        serial: "5.G",
        dosha: "vata",
        guna: "Shighra",
        text: "Are you more comfortable in summer? Or Do you prefer hot/warm drinks over cold drinks?",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V5H",
        serial: "5.H",
        dosha: "vata",
        guna: "Shighra",
        text: "Do you generally develop symptoms immediately after exposure to common causative factors? (You are easily caught by diseases like flu, allergy during seasonal changes).",
        scoringAnswer: "yes",
        weight: 15
    },
    {
        id: "V6A",
        serial: "6.A",
        dosha: "vata",
        guna: "Shita",
        text: "Do you shiver in winter season more than your friends?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "V6B",
        serial: "6.B",
        dosha: "vata",
        guna: "Shita",
        text: "Do you often feel stiffness in your body after exercise, travelling?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "V7",
        serial: "7",
        dosha: "vata",
        guna: "Parusha",
        text: "Are your nails, teeth, hands, feet and hairs on your body and face rough?",
        scoringAnswer: "yes",
        weight: 120
    },
    {
        id: "V8A",
        serial: "8.A",
        dosha: "vata",
        guna: "Vishada",
        text: "Do you have cracks on the body especially on the heels?",
        scoringAnswer: "yes",
        weight: 60
    },
    {
        id: "V8B",
        serial: "8.B",
        dosha: "vata",
        guna: "Vishada",
        text: "Are some crackling sounds produced in your joints during movements?",
        scoringAnswer: "yes",
        weight: 60
    }
];
}),
"[project]/src/lib/engine/prakriti-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "constitutionDoshas",
    ()=>constitutionDoshas,
    "round2",
    ()=>round2,
    "scorePrakriti",
    ()=>scorePrakriti
]);
/**
 * Prakriti scoring engine.
 *
 * Implements EXACTLY the documented scoring model of the supplied
 * questionnaire / Tripathi et al. (2011) as catalogued by Gupta et al. (2025):
 *
 *   - 120 points per guna, divided equally among that guna's observable
 *     features (weights are pre-computed and printed on each item).
 *   - Maximum scores: Vata 960, Pitta 600, Kapha 1440.
 *   - Dosha percentage = (score obtained / maximum for that dosha) x 100
 *     ("absolute basis" scoring, per Bhalerao & Patwardhan 2016 terminology).
 *
 * Classification reuses the dual-type (dvandvaja) thresholds published in
 * Tripathi et al. (2011), Section 3.3.3 — these are study-design thresholds,
 * not clinically validated cutoffs, and are labelled as such in the UI:
 *   - Dual type when: secondary >= 50% of primary
 *                    AND tertiary <= 75% of secondary (i.e. >= 25% lower).
 *   - When secondary >= 50% of primary but tertiary > 75% of secondary, all
 *     three doshas are relatively close -> reported as "sama" (balanced /
 *     tridoshaj presentation). This branch mirrors the study's observation
 *     that near-equal thirds exist and treats it explicitly instead of
 *     forcing a dual label.
 *   - Otherwise: single-dominant (eka-doshaj).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$prakriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/prakriti-questions.ts [app-route] (ecmascript)");
;
const DOSHA_LABEL = {
    vata: "Vata",
    pitta: "Pitta",
    kapha: "Kapha"
};
function scorePrakriti(answers) {
    const totals = {
        vata: 0,
        pitta: 0,
        kapha: 0
    };
    for (const item of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$prakriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PRAKRITI_ITEMS"]){
        const answer = answers[item.id];
        if (answer === "yes" || answer === "no") {
            if (answer === item.scoringAnswer) {
                totals[item.dosha] += item.weight;
            }
        }
    // Missing answers simply earn no points (documented missing-answer policy:
    // "obtained score" counts only the items the respondent actually answered
    // affirmatively in the scoring direction; unanswered items are reported in
    // the audit payload by the API layer).
    }
    const max = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$prakriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PRAKRITI_INSTRUMENT"].scoringModel.doshaMax;
    const pct = {
        vata: round2(totals.vata / max.vata * 100),
        pitta: round2(totals.pitta / max.pitta * 100),
        kapha: round2(totals.kapha / max.kapha * 100)
    };
    const order = [
        "vata",
        "pitta",
        "kapha"
    ].sort((a, b)=>pct[b] - pct[a]);
    const [primary, secondary, tertiary] = order;
    const { dualIfSecondaryGePctOfPrimary, dualIfTertiaryLePctOfSecondary } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$prakriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PRAKRITI_INSTRUMENT"].classificationThresholds;
    let classification;
    let note;
    if (pct[primary] === 0) {
        classification = "undetermined";
        note = "No affirmative answers were given, so no constitution could be determined. Please review your answers.";
    } else if (pct[secondary] >= dualIfSecondaryGePctOfPrimary / 100 * pct[primary] && pct[tertiary] <= dualIfTertiaryLePctOfSecondary / 100 * pct[secondary]) {
        const pair = [
            primary,
            secondary
        ].sort(fixedDoshaOrder).join("_");
        classification = pair;
        note = `Dual constitution (dvandvaja): ${DOSHA_LABEL[secondary]} scored at least 50% of ${DOSHA_LABEL[primary]} and ${DOSHA_LABEL[tertiary]} was at least 25% lower than ${DOSHA_LABEL[secondary]} (thresholds published in Tripathi et al. 2011; study-design values, not validated clinical cutoffs).`;
    } else if (pct[secondary] >= dualIfSecondaryGePctOfPrimary / 100 * pct[primary]) {
        classification = "sama";
        note = "Balanced presentation (sama / tridoshaj-leaning): all three doshas score relatively close together, so no single or dual constitution meets the published separation thresholds. Treat the percentages as an educational spread, not a fixed type.";
    } else {
        classification = primary;
        note = `Single-dominant constitution (eka-doshaj): ${DOSHA_LABEL[secondary]} scored below 50% of ${DOSHA_LABEL[primary]} (threshold from Tripathi et al. 2011; a study-design value, not a validated clinical cutoff).`;
    }
    const label = buildLabel(classification);
    return {
        vataScore: totals.vata,
        pittaScore: totals.pitta,
        kaphaScore: totals.kapha,
        vataPct: pct.vata,
        pittaPct: pct.pitta,
        kaphaPct: pct.kapha,
        classification,
        label,
        classificationNote: note
    };
}
function buildLabel(classification) {
    switch(classification){
        case "sama":
            return "Balanced (Tridoshaj-leaning)";
        case "undetermined":
            return "Undetermined";
        case "vata_pitta":
            return "Vata-Pitta";
        case "vata_kapha":
            return "Vata-Kapha";
        case "pitta_kapha":
            return "Pitta-Kapha";
        case "vata":
            return "Vata-dominant";
        case "pitta":
            return "Pitta-dominant";
        case "kapha":
            return "Kapha-dominant";
        default:
            return classification;
    }
}
function fixedDoshaOrder(a, b) {
    const order = [
        "vata",
        "pitta",
        "kapha"
    ];
    return order.indexOf(a) - order.indexOf(b);
}
function constitutionDoshas(classification) {
    if ([
        "vata",
        "pitta",
        "kapha"
    ].includes(classification)) {
        return [
            classification
        ];
    }
    if ([
        "vata_pitta",
        "vata_kapha",
        "pitta_kapha"
    ].includes(classification)) {
        return classification.split("_");
    }
    if (classification === "sama") return [
        "vata",
        "pitta",
        "kapha"
    ];
    return [];
}
function round2(n) {
    return Math.round(n * 100) / 100;
}
}),
"[project]/src/lib/data/vikriti-questions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Holistic — Vikriti instrument pack (34 items).
 *
 * SOURCE OF TRUTH: the supplied document "Self-Assessment Vikriti
 * Questionnaire" ("Clinical Questionnaire for Vikriti Assessment,
 * Serial Nos. 1-34").
 *
 * The source documents:
 * - Framing: "Active disturbance over past 2-4 weeks" for every item.
 * - Three dosha sections: Kapha Vikriti (Q1-11), Pitta Vikriti (Q12-21),
 *   Vata Vikriti (Q22-34, printed in Part A Q22-25 and Part B Q26-34).
 * - Response indicator: "Yes Present" — i.e. each item is answered
 *   Yes (present) / No (not present).
 * - The source provides NO numerical scoring formula.
 *
 * SCORING STATUS: experimental (see src/lib/engine/vikriti-engine.ts).
 * The binary scoring implemented here is a platform design proposal,
 * clearly labelled in the UI; it is NOT the 60-item Mills et al. (2019)
 * 5/3/1 instrument and carries no clinical validation.
 */ __turbopack_context__.s([
    "VIKRITI_INSTRUMENT",
    ()=>VIKRITI_INSTRUMENT,
    "VIKRITI_ITEMS",
    ()=>VIKRITI_ITEMS
]);
const VIKRITI_INSTRUMENT = {
    id: "vikriti_34_v1",
    language: "en",
    framingInstruction: "These questions ask about disturbances active over the past 2-4 weeks. Answer Yes only if the sign has actually been present in this window.",
    sectionHeaders: {
        kapha: "Kapha Vikriti — Congestion, Heaviness & Hypoactivity",
        pitta: "Pitta Vikriti — Heat, Acidity & Tissue Irritation",
        vata: "Vata Vikriti — Dryness, Irregularity & Nervous Instability"
    },
    /** Maxima used by the platform's experimental scoring: one point per "Yes". */ experimentalMax: {
        vata: 13,
        pitta: 10,
        kapha: 11
    }
};
const VIKRITI_ITEMS = [
    // ---------------- KAPHA VIKRITI (Q1-11) ----------------
    {
        id: "VK1",
        serial: 1,
        dosha: "kapha",
        title: "Excess Saliva & Sweet Taste",
        text: "Do you notice extra saliva building up, a thick mucus coating in your throat, or a sweet taste in your mouth?",
        section: "kapha"
    },
    {
        id: "VK2",
        serial: 2,
        dosha: "kapha",
        title: "Excessive Oily Skin & Scalp",
        text: "Has your face or scalp suddenly become greasy, or have you noticed excess oil and earwax?",
        section: "kapha"
    },
    {
        id: "VK3",
        serial: 3,
        dosha: "kapha",
        title: "Heaviness in Body & Head",
        text: "Does your head, chest, arms, or legs feel heavily weighed down, as if wrapped in a wet blanket?",
        section: "kapha"
    },
    {
        id: "VK4",
        serial: 4,
        dosha: "kapha",
        title: "Puffiness & Water Retention",
        text: "Do you wake up with puffy eyelids, swollen ankles/feet, or notice sudden fluid retention?",
        section: "kapha"
    },
    {
        id: "VK5",
        serial: 5,
        dosha: "kapha",
        title: "Lethargy & Low Drive",
        text: "Do you feel a strong lack of motivation or drive to do physical tasks, feeling sluggish even when well-rested?",
        section: "kapha"
    },
    {
        id: "VK6",
        serial: 6,
        dosha: "kapha",
        title: "Sluggish Digestion",
        text: "Does your food take 6 to 8+ hours to digest, leaving a heavy feeling and lingering burps hours after meals?",
        section: "kapha"
    },
    {
        id: "VK7",
        serial: 7,
        dosha: "kapha",
        title: "Loss of Appetite",
        text: "Have you lost your natural hunger, or do you feel mild aversion/nausea when seeing or smelling food?",
        section: "kapha"
    },
    {
        id: "VK8",
        serial: 8,
        dosha: "kapha",
        title: "Oversleeping & Fatigue",
        text: "Are you sleeping 9 to 11+ hours continuously but still waking up unrefreshed, heavy, and exhausted?",
        section: "kapha"
    },
    {
        id: "VK9",
        serial: 9,
        dosha: "kapha",
        title: "Daytime Drowsiness",
        text: "Do you find yourself nodding off, feeling cloudy, or drifting into an involuntary daze during daytime hours?",
        section: "kapha"
    },
    {
        id: "VK10",
        serial: 10,
        dosha: "kapha",
        title: "Chest & Sinus Phlegm",
        text: "Do you experience thick clear/white mucus cough, post-nasal drip, or bronchial congestion?",
        section: "kapha"
    },
    {
        id: "VK11",
        serial: 11,
        dosha: "kapha",
        title: "Cold, Swollen Joints",
        text: "Do your joints feel cold, puffy, and stiff to bend without any sensation of heat or burning?",
        section: "kapha"
    },
    // ---------------- PITTA VIKRITI (Q12-21) ----------------
    {
        id: "VK12",
        serial: 12,
        dosha: "pitta",
        title: "Internal & Body Burning",
        text: "Do you experience heartburn, stomach burning, or a hot feeling in your palms, soles, or eyes?",
        section: "pitta"
    },
    {
        id: "VK13",
        serial: 13,
        dosha: "pitta",
        title: "Red Rashes & Skin Flare-ups",
        text: "Have you had sudden red rashes, hives, inflamed acne, or burning sensitive skin patches?",
        section: "pitta"
    },
    {
        id: "VK14",
        serial: 14,
        dosha: "pitta",
        title: "Hot / Dark Yellow Urine",
        text: "Is your urine deep yellow or concentrated, accompanied by a stinging or burning sensation?",
        section: "pitta"
    },
    {
        id: "VK15",
        serial: 15,
        dosha: "pitta",
        title: "Sharp, Urgent Hunger",
        text: "Do you feel burning hunger within 2 hours of eating, feeling shaky or dizzy if not fed immediately?",
        section: "pitta"
    },
    {
        id: "VK16",
        serial: 16,
        dosha: "pitta",
        title: "Acid Reflux & Sour Burps",
        text: "Do you get acid regurgitation rising into your throat with a sour, burning fluid in your mouth?",
        section: "pitta"
    },
    {
        id: "VK17",
        serial: 17,
        dosha: "pitta",
        title: "Irritability & Outbursts",
        text: "Have you been unusually impatient, frustrated, angry, or prone to sudden verbal flare-ups?",
        section: "pitta"
    },
    {
        id: "VK18",
        serial: 18,
        dosha: "pitta",
        title: "Hair Shedding & Scalp Heat",
        text: "Have you noticed sudden accelerated hair loss, a burning tender scalp, or rapid graying?",
        section: "pitta"
    },
    {
        id: "VK19",
        serial: 19,
        dosha: "pitta",
        title: "Profuse Sweating with Odor",
        text: "Do you sweat heavily with minimal exertion, with a strong, sour odor that stains clothing?",
        section: "pitta"
    },
    {
        id: "VK20",
        serial: 20,
        dosha: "pitta",
        title: "Loose, Burning Bowels",
        text: "Are your bowel movements frequent, loose or yellowish, accompanied by urgency or rectal burning?",
        section: "pitta"
    },
    {
        id: "VK21",
        serial: 21,
        dosha: "pitta",
        title: "Mouth Ulcers & Spongy Gums",
        text: "Have you experienced painful canker sores, bleeding gums, or occasional nose spotting?",
        section: "pitta"
    },
    // ---------------- VATA VIKRITI (Q22-34; source Parts A + B) ----------------
    {
        id: "VK22",
        serial: 22,
        dosha: "vata",
        title: "Severe Skin Dryness & Cracks",
        text: "Is your skin excessively rough or flaking, with deep cracked heels and lips that lotions do not heal?",
        section: "vata"
    },
    {
        id: "VK23",
        serial: 23,
        dosha: "vata",
        title: "Muscle & Weight Depletion",
        text: "Have you noticed a rapid loss of muscle fullness, hollowed cheeks, or unintended weight loss?",
        section: "vata"
    },
    {
        id: "VK24",
        serial: 24,
        dosha: "vata",
        title: "Hoarse or Weak Voice",
        text: "Does your voice sound dry, obstructed, or raspy when you speak?",
        section: "vata"
    },
    {
        id: "VK25",
        serial: 25,
        dosha: "vata",
        title: "2-4 AM Waking with Racing Mind",
        text: "Do you wake up startled between 2:00 AM and 4:00 AM unable to fall back asleep due to racing thoughts?",
        section: "vata"
    },
    {
        id: "VK26",
        serial: 26,
        dosha: "vata",
        title: "Twitches & Fine Tremors",
        text: "Do you experience twitching eyelids or lips, fine finger tremors, or sudden limb jerks?",
        section: "vata"
    },
    {
        id: "VK27",
        serial: 27,
        dosha: "vata",
        title: "Abdominal Gas & Bloating",
        text: "Does your belly swell tight with audible gurgling and colic that is relieved by passing gas?",
        section: "vata"
    },
    {
        id: "VK28",
        serial: 28,
        dosha: "vata",
        title: "Erratic Appetite",
        text: "Does your hunger fluctuate unpredictably - craving food one day, but having zero appetite the next?",
        section: "vata"
    },
    {
        id: "VK29",
        serial: 29,
        dosha: "vata",
        title: "Restlessness & Rapid Speech",
        text: "Do you feel unable to sit still, talking very fast, pacing, or hopping erratically between tasks?",
        section: "vata"
    },
    {
        id: "VK30",
        serial: 30,
        dosha: "vata",
        title: "Anxiety & Sudden Spikes of Panic",
        text: "Do you experience sudden unprompted nervousness, a racing pulse, or free-floating dread?",
        section: "vata"
    },
    {
        id: "VK31",
        serial: 31,
        dosha: "vata",
        title: "Wandering, Sharp Nerve/Joint Pains",
        text: "Do you get pricking, shifting aches that travel from one joint or nerve area to another?",
        section: "vata"
    },
    {
        id: "VK32",
        serial: 32,
        dosha: "vata",
        title: "Cold Sensitivity & Morning Stiffness",
        text: "Do you shiver easily at slight temperature drops and wake with a locked, stiff back or limbs?",
        section: "vata"
    },
    {
        id: "VK33",
        serial: 33,
        dosha: "vata",
        title: "Dry, Pellet-like Constipation",
        text: "Are your stools hard, dry, and evacuated every 2-3 days with severe straining?",
        section: "vata"
    },
    {
        id: "VK34",
        serial: 34,
        dosha: "vata",
        title: "Popping & Cracking Joints",
        text: "Do your knees, neck, or other joints make loud cracking, clicking, or grating sounds when moving?",
        section: "vata"
    }
];
}),
"[project]/src/lib/engine/vikriti-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scoreVikriti",
    ()=>scoreVikriti,
    "vikritiDominantDosha",
    ()=>vikritiDominantDosha
]);
/**
 * Vikriti scoring engine — EXPERIMENTAL.
 *
 * The supplied 34-item questionnaire documents no numerical scoring formula
 * (its only documented response indicator is "Yes Present"). Per the project
 * brief, when the source lacks a formula the platform must implement a
 * separately labelled experimental scoring method. The method:
 *
 *   1. Each "Yes" (present) answer adds 1 point to that item's dosha bucket:
 *      Vata = items 22-34 (max 13), Pitta = items 12-21 (max 10),
 *      Kapha = items 1-11 (max 11).
 *   2. Percentage = (points / dosha maximum) x 100.
 *   3. Dominant current imbalance = the highest percentage. Ties are reported
 *      as a tie between the tied doshas (no arbitrary tie-breaking).
 *
 * Documented assumptions:
 *   - Every "Yes" contributes equally within a dosha (equal severity weighting;
 *     the source does not rank item severity).
 *   - Normalisation is per-dosha against each bucket's item count, so the three
 *     sections are comparable despite unequal lengths.
 *   - Range: 0-100% per dosha.
 *   - Missing answers: the API requires all 34 items answered before scoring;
 *     unanswered submissions are rejected rather than imputed.
 *   - The source maps each numbered item to its dosha section explicitly
 *     (Kapha 1-11, Pitta 12-21, Vata 22-34); no additional mapping was invented.
 *
 * This score is an experimental self-assessment aid with NO clinical
 * validation and NO scientific cutoffs. It is not a diagnostic.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/vikriti-questions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/prakriti-engine.ts [app-route] (ecmascript)");
;
;
function scoreVikriti(answers) {
    const counts = {
        vata: 0,
        pitta: 0,
        kapha: 0
    };
    for (const item of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIKRITI_ITEMS"]){
        if (answers[item.id] === "yes") counts[item.dosha] += 1;
    }
    const max = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIKRITI_INSTRUMENT"].experimentalMax;
    const pct = {
        vata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])(counts.vata / max.vata * 100),
        pitta: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])(counts.pitta / max.pitta * 100),
        kapha: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])(counts.kapha / max.kapha * 100)
    };
    const order = [
        "vata",
        "pitta",
        "kapha"
    ].sort((a, b)=>pct[b] - pct[a]);
    const [primary, secondary] = order;
    const tie = pct[primary] === pct[secondary] && pct[primary] > 0;
    let dominant;
    let dominantLabel;
    if (tie) {
        const pair = [
            primary,
            secondary
        ].sort(fixedOrder).join("_");
        dominant = pair;
        dominantLabel = `Tied: ${cap(primary)} & ${cap(secondary)}`;
    } else {
        dominant = primary;
        dominantLabel = `${cap(primary)}-predominant imbalance`;
    }
    return {
        vataCount: counts.vata,
        pittaCount: counts.pitta,
        kaphaCount: counts.kapha,
        vataPct: pct.vata,
        pittaPct: pct.pitta,
        kaphaPct: pct.kapha,
        dominant,
        dominantLabel,
        tie
    };
}
function fixedOrder(a, b) {
    const order = [
        "vata",
        "pitta",
        "kapha"
    ];
    return order.indexOf(a) - order.indexOf(b);
}
function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function vikritiDominantDosha(dominant) {
    const first = dominant.split("_")[0];
    if (first === "vata" || first === "pitta" || first === "kapha") return first;
    return null;
}
}),
"[project]/src/lib/engine/seasonal.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Seasonal module (ritucharya support).
 *
 * Computes the classical six-ritu season from a date. Mapping is a monthly
 * approximation of the classical scheme (report Ch. 9.2 per Dhiman et al.
 * 2026 [6] abstract) — a documented design proposal, not a research-derived
 * calendar. Southern-hemisphere users are shifted by six months (the report
 * notes hemisphere-inverted seasonality in modern transcriptomic evidence).
 *
 * Dosha tendency per season (classical scheme, educational display only —
 * the report explicitly warns not to compute "dosha load" from data):
 *   Vasanta  -> Kapha aggravation
 *   Greeshma -> Vata accumulation, Kapha pacifies
 *   Varsha   -> Vata aggravation, Pitta accumulation
 *   Sharad   -> Pitta aggravation, Vata pacifies
 *   Hemanta  -> Pitta pacifies, Kapha accumulation (strong agni)
 *   Shishira -> Kapha accumulation, Vata accumulation tendency
 */ __turbopack_context__.s([
    "SEASON_LABEL",
    ()=>SEASON_LABEL,
    "computeSeason",
    ()=>computeSeason,
    "isRituSandhi",
    ()=>isRituSandhi,
    "seasonDoshaTendency",
    ()=>seasonDoshaTendency
]);
const SEASON_LABEL = {
    vasanta: "Vasanta (spring)",
    greeshma: "Greeshma (summer)",
    varsha: "Varsha (monsoon)",
    sharad: "Sharad (autumn)",
    hemanta: "Hemanta (early winter)",
    shishira: "Shishira (late winter)"
};
const NORTHERN = [
    // index = month-1 (approximate monthly assignment)
    "hemanta",
    "shishira",
    "shishira",
    "vasanta",
    "vasanta",
    "greeshma",
    "greeshma",
    "varsha",
    "varsha",
    "sharad",
    "sharad",
    "hemanta"
];
function computeSeason(date, latitude) {
    const month = date.getUTCMonth();
    const northern = NORTHERN[month];
    if (latitude != null && latitude < 0) {
        // Southern hemisphere: seasons inverted by six months.
        return NORTHERN[(month + 6) % 12];
    }
    return northern;
}
function seasonDoshaTendency(season) {
    switch(season){
        case "vasanta":
            return [
                "kapha"
            ];
        case "greeshma":
            return [
                "vata"
            ];
        case "varsha":
            return [
                "vata",
                "pitta"
            ];
        case "sharad":
            return [
                "pitta"
            ];
        case "hemanta":
            return [
                "kapha"
            ];
        case "shishira":
            return [
                "kapha",
                "vata"
            ];
    }
}
function isRituSandhi(date, latitude) {
    const day = date.getUTCDate();
    const lastDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    return day <= 7 || day >= lastDayOfMonth - 6;
}
}),
"[project]/src/lib/data/knowledge-base.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Holistic — Ayurveda knowledge base and rule pack.
 *
 * Every record carries its Sanskrit term (Devanagari + IAST), English
 * meaning, explanation, classical source, research reference, conditions,
 * evidence level and precautions, per the record schema of the research
 * report (Ch. 10.1) and the twelve worked example rules (Ch. 14.3).
 *
 * Evidence levels (kept strictly separate everywhere in the UI):
 *   DR = demonstrated research finding (peer-reviewed quantitative result)
 *   AI = author interpretation (authors' conclusion from their data)
 *   CT = classical/traditional guidance (classical text via a reviewed modern
 *        source)
 *   DP = experimental software rule / design proposal of this platform
 *
 * CLASSICAL SOURCES are cited at chapter/verse level exactly as given by the
 * accessed modern sources (Anagha & Deole 2021 [5]; Dhiman et al. 2026 [6]).
 * Bracketed numbers refer to the platform bibliography (About screen).
 *
 * RAGA / MUSIC: the reviewed research contains NO verified Raga-to-dosha
 * mapping, so this knowledge base deliberately ships NO raga rules. This is
 * disclosed on the About screen rather than inventing relationships.
 */ __turbopack_context__.s([
    "KNOWLEDGE_BASE",
    ()=>KNOWLEDGE_BASE,
    "PLATFORM_REFERENCES",
    ()=>PLATFORM_REFERENCES
]);
const ALL_DOSHAS = [
    "vata",
    "pitta",
    "kapha"
];
const KNOWLEDGE_BASE = [
    // ================= DINACHARYA =================
    {
        ruleId: "DIN-001",
        category: "dinacharya",
        precedence: 5,
        sanskritDeva: "ब्रह्ममुहूर्त",
        sanskritIast: "brahma-muhūrta",
        english: "Pre-dawn wake window",
        recommendation: "Aim for a consistent wake time in the pre-dawn window (roughly 45-60 minutes before sunrise), and keep it the same across the week.",
        why: "The classical daily regimen places waking during brahma-muhūrta at the start of the day's routine. As an educational app we translate this into a regularity rule adapted to your own schedule rather than a fixed clock time.",
        conditions: {},
        classicalSource: "A.Hr.Sū. 2/1 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Adapt to your schedule and sleep need; do not shorten sleep to wake earlier.",
            "Regularity framing is a platform adaptation (design proposal)."
        ],
        applicability: "All users."
    },
    {
        ruleId: "DIN-002",
        category: "dinacharya",
        precedence: 4,
        sanskritDeva: "दन्तधावन",
        sanskritIast: "dantadhavana",
        english: "Tooth cleaning — taste by constitution",
        recommendation: "Classical oral-care education: for a Vata constitution the tooth-stick tradition uses sweet and astringent tastes (e.g. madhuka, khadira). If you use chew-sticks or herbal formulations, this is the classical taste logic behind them.",
        why: "The dinacharya chapter maps Prakriti to taste category for oral care: Vata - sweet/astringent, with citations. This is presented as taste education, not a dental treatment.",
        conditions: {
            prakritiIncludes: [
                "vata"
            ]
        },
        classicalSource: "A.Hr.Sū. 2/2-3; Cha.Sa.Sū. 5/71-73 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Not a dental treatment.",
            "Chew-sticks can injure gums; follow modern dental care."
        ],
        applicability: "Users whose constitution includes Vata as dominant or dual member."
    },
    {
        ruleId: "DIN-003",
        category: "dinacharya",
        precedence: 4,
        sanskritDeva: "दन्तधावन",
        sanskritIast: "dantadhavana",
        english: "Tooth cleaning — bitter taste education",
        recommendation: "Classical oral-care education: for a Pitta constitution the tooth-stick tradition favours bitter tastes (e.g. nimba / neem). Presented as the classical taste logic behind herbal oral-care choices.",
        why: "Same classical Prakriti-to-taste table; Pitta maps to the bitter taste category.",
        conditions: {
            prakritiIncludes: [
                "pitta"
            ]
        },
        classicalSource: "A.Hr.Sū. 2/2-3; Cha.Sa.Sū. 5/71-73 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Not a dental treatment.",
            "Follow modern dental care."
        ],
        applicability: "Users whose constitution includes Pitta as dominant or dual member."
    },
    {
        ruleId: "DIN-004",
        category: "dinacharya",
        precedence: 4,
        sanskritDeva: "दन्तधावन / उद्वर्तन",
        sanskritIast: "dantadhavana / udvartana",
        english: "Tooth cleaning — pungent taste; dry powder massage",
        recommendation: "Classical education: for a Kapha constitution the tooth-stick tradition favours pungent tastes (e.g. karanja, arka); the classical routine also describes udvartana (dry powder friction massage) as a Kapha-reducing practice.",
        why: "The tooth-stick table maps Kapha to the pungent taste; udvartana appears in the same dinacharya sequence for Kapha constitutions.",
        conditions: {
            prakritiIncludes: [
                "kapha"
            ]
        },
        classicalSource: "Tooth table via Anagha & Deole 2021, [5]; udvartana A.Hr.Sū. 2/16 via [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Skin sensitivity caution with dry powders.",
            "Not a dental or weight-loss treatment."
        ],
        applicability: "Users whose constitution includes Kapha as dominant or dual member."
    },
    {
        ruleId: "DIN-005",
        category: "dinacharya",
        precedence: 5,
        sanskritDeva: "जिह्वानिर्लेखन",
        sanskritIast: "jihvā-nirlekhana",
        english: "Tongue scraping",
        recommendation: "Include gentle tongue scraping in your morning oral care, as part of the classical morning sequence.",
        why: "Listed in the dinacharya component catalogue extracted from the peer-reviewed CSNE chapter as part of the oral-hygiene stack (brushing, tongue scraping, oil pulling).",
        conditions: {},
        classicalSource: "Dinacharya catalogue via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Use a smooth, dedicated scraper; avoid scraping irritated tissue."
        ],
        applicability: "All users."
    },
    {
        ruleId: "DIN-006",
        category: "dinacharya",
        precedence: 3,
        sanskritDeva: "अभ्यङ्ग",
        sanskritIast: "abhyaṅga",
        english: "Oil massage before bathing",
        recommendation: "Consider a comfortable oil massage (abhyaṅga) before bathing, especially when your current state shows Vata-dominant signs.",
        why: "Abhyaṅga before bathing is part of the classical dinacharya sequence, and it is described as sleep-promoting and grounding (A.Hr.Sū. 2/8). The Vata-state emphasis follows the imbalance-correction precedence.",
        conditions: {},
        classicalSource: "A.Hr.Sū. 2/8, 2/11-14 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Warm the oil comfortably; avoid slips on oily floors.",
            "Patch-test oils if you have sensitive skin."
        ],
        applicability: "All users; emphasised for Vata imbalance states."
    },
    {
        ruleId: "DIN-007",
        category: "dinacharya",
        precedence: 5,
        sanskritDeva: "स्नान",
        sanskritIast: "snāna",
        english: "Bathing — season-appropriate water temperature",
        recommendation: "Keep bathing in your routine; the classical texts condition water temperature on season and body region (warm in cold seasons, cooler preference in peak heat).",
        why: "Snāna with region- and season-conditional water temperature is extracted in the dinacharya catalogue.",
        conditions: {
            seasons: [
                "hemanta",
                "shishira",
                "greeshma"
            ]
        },
        classicalSource: "Su.Sa.Ci. 24/61 via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Avoid overheating or chilling; comfort first."
        ],
        applicability: "All users; strongest framing in cold or peak-heat seasons."
    },
    // ================= AHARA =================
    {
        ruleId: "AHA-001",
        category: "ahara",
        precedence: 5,
        sanskritDeva: "आहार-काल",
        sanskritIast: "āhāra-kāla",
        english: "Eat on true hunger, previous meal digested",
        recommendation: "Before eating, do a quick hunger check: the classical rule is to eat when the previous meal is digested and genuine hunger is present.",
        why: "Classical eating-behaviour anchor: eat when the previous meal is digested and on genuine hunger (Su.Sa.Ut. 34/75). The app presents this as an educational prompt, never as food restriction.",
        conditions: {},
        classicalSource: "Su.Sa.Ut. 34/75 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Educational only — never skip meals you need or restrict food groups.",
            "Opt out anytime; not suitable as written during pregnancy, illness or disordered-eating recovery."
        ],
        applicability: "All users."
    },
    {
        ruleId: "AHA-002",
        category: "ahara",
        precedence: 5,
        sanskritDeva: "आहारविधि",
        sanskritIast: "āhāra-vidhi",
        english: "Rules of eating (how to eat)",
        recommendation: "Classical eating-rule education: eat warm and unctuous preparations in due quantity, at a comfortable pace, with attention — the classical 'how to eat' set.",
        why: "The āhāra-vidhi rules of Caraka-saṃhitā Vimāna-sthāna 1.21-25 (eat warm/unctuous in due quantity, etc.) are carried by the reviewed CSNE chapter.",
        conditions: {},
        classicalSource: "Cha.Sa.Vī. 1/21-25 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "General education; individual dietary needs (allergies, medical diets) always take precedence."
        ],
        applicability: "All users."
    },
    {
        ruleId: "AHA-003",
        category: "ahara",
        precedence: 5,
        sanskritDeva: "द्वि-काल भोजन",
        sanskritIast: "dvi-kāla bhojana",
        english: "Two-meal regularity",
        recommendation: "Aim for a regular two-meal pattern with a stable timing rhythm rather than continuous grazing through the day.",
        why: "The classical anchors describe twice-daily meal frequency without grazing (report Ch. 9.3); the app frames this as meal-regularity education.",
        conditions: {},
        classicalSource: "Meal regularity anchors via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Never restrict food groups or amounts your body needs.",
            "Opt out anytime; no weight-loss framing."
        ],
        applicability: "All users."
    },
    {
        ruleId: "AHA-004",
        category: "ahara",
        precedence: 4,
        sanskritDeva: "रस शिक्षा",
        sanskritIast: "rasa-śikṣā",
        english: "Taste education by constitution",
        recommendation: "Taste-pattern education: the classical logic maps constitutions to balancing tastes — Vata: sweet, sour, salty tendencies; Pitta: sweet, bitter, astringent tendencies; Kapha: pungent, bitter, astringent tendencies. Use this as background when you plan meals.",
        why: "Generalisation of the constitution-to-taste pattern demonstrated by the tooth-stick table (report Ch. 9.7). Educational content, not a diet prescription.",
        conditions: {
            prakritiIncludes: ALL_DOSHAS
        },
        classicalSource: "Taste-by-constitution pattern via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Not a diet prescription; never restrict food groups.",
            "Individual medical diets always take precedence."
        ],
        applicability: "Content adapts to the user's dominant constitution doshas."
    },
    {
        ruleId: "AHA-005",
        category: "ahara",
        precedence: 5,
        sanskritDeva: "ऋतु-आहार",
        sanskritIast: "ṛtu-āhāra",
        english: "Season-conditional eating emphasis",
        recommendation: "In peak heat, favour lighter meals and steady hydration timing; in cold seasons, favour warm, nourishing meal regularity — a classical seasonal eating emphasis.",
        why: "Digestive strength (agni) varies seasonally in the classical scheme (report Ch. 9.2); meal-regularity advice is adjusted seasonally as education.",
        conditions: {
            seasons: [
                "greeshma",
                "hemanta",
                "shishira"
            ]
        },
        classicalSource: "Seasonal scheme per Dhiman et al. 2026 [6, Abstract]; dinacharya anchors [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "No clinical claims; general education only."
        ],
        applicability: "Users in hot or cold seasons."
    },
    // ================= PATHYA / APATHYA =================
    {
        ruleId: "PAT-001",
        category: "pathya",
        precedence: 3,
        sanskritDeva: "पथ्य",
        sanskritIast: "pathya",
        english: "Suitable — Vata-state support",
        recommendation: "When your current state is Vata-dominant, classical routine logic favours regularity: regular meal and sleep times, warm unctuous meals framing, and sensory-rest breaks.",
        why: "Grounding-routine education assembled from dinacharya regularity principles; Vata-state psychological associations from Mills et al. (2019) are used as educational context only.",
        conditions: {
            vikritiDominant: "vata"
        },
        classicalSource: "Dinacharya regularity principles via Anagha & Deole 2021, [5]",
        researchReference: "Mills et al. 2019 [4]: Vata imbalance associated with anxiety (p ≤ 0.05) and rumination (p ≤ 0.01) — association, not causation.",
        evidenceLevel: "CT",
        precautions: [
            "No anxiety or treatment claims.",
            "No medicated oil therapies or enemas (out of scope)."
        ],
        applicability: "Users whose vikriti self-assessment is currently Vata-dominant."
    },
    {
        ruleId: "PAT-002",
        category: "pathya",
        precedence: 3,
        sanskritDeva: "पथ्य",
        sanskritIast: "pathya",
        english: "Suitable — Pitta-state support",
        recommendation: "When your current state is Pitta-dominant, classical taste logic favours cooling preparations (sweet, bitter, astringent tendencies), avoiding peak-sun exertion and favouring calmer meal pacing.",
        why: "Pitta-heat framing consistent with classical attributes (tīkṣṇa/heat) used educationally; the seasonal scheme assigns Sharad to Pitta aggravation.",
        conditions: {
            vikritiDominant: "pitta"
        },
        classicalSource: "Classical Pitta attributes via Tripathi et al. 2011 [2] and Anagha & Deole 2021 [5]",
        researchReference: "Mills et al. 2019 [4]: Pitta imbalance associated with poorer mood (p ≤ 0.01) and stress — association, not causation.",
        evidenceLevel: "CT",
        precautions: [
            "No dehydration or acidity diagnosis language.",
            "General education only."
        ],
        applicability: "Users whose vikriti self-assessment is currently Pitta-dominant."
    },
    {
        ruleId: "PAT-003",
        category: "pathya",
        precedence: 3,
        sanskritDeva: "पथ्य",
        sanskritIast: "pathya",
        english: "Suitable — Kapha-state support",
        recommendation: "When your current state is Kapha-dominant, classical routine logic favours wake-time regularity, lighter warm preparations with pungent-bitter-astringent taste education, and consistent daily activity.",
        why: "Kapha-state features (heaviness, hypoactivity) map to the classical opposite-quality logic (light, warm, mobile); assembled from the dinacharya catalogue.",
        conditions: {
            vikritiDominant: "kapha"
        },
        classicalSource: "Dinacharya catalogue via Anagha & Deole 2021, [5]",
        researchReference: "Mills et al. 2019 [4]: Kapha imbalance associated with stress (p ≤ 0.01) — association, not causation.",
        evidenceLevel: "CT",
        precautions: [
            "General education; never skip needed nutrition.",
            "No weight-loss framing."
        ],
        applicability: "Users whose vikriti self-assessment is currently Kapha-dominant."
    },
    {
        ruleId: "APT-001",
        category: "apathya",
        precedence: 2,
        sanskritDeva: "अपथ्य",
        sanskritIast: "apathya",
        english: "To limit — excess exercise contraindication",
        recommendation: "Avoid pushing exercise to exhaustion. The classical texts list excess vyāyāma as causing thirst, emaciation, breathlessness, fatigue, cough and fever — and contraindicate vigorous exercise in Vata/Pitta disturbance, childhood and old age.",
        why: "Contraindication list A.Hr.Sū. 2/14; the rule fires as a caution whenever vikriti shows Vata or Pitta imbalance, so the contraindication precedes maintenance advice.",
        conditions: {
            vikritiDominant: "vata"
        },
        classicalSource: "A.Hr.Sū. 2/14 (via Anagha & Deole 2021, [5])",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Safety framing; consult a professional for exercise decisions if you have any health condition."
        ],
        applicability: "Fires on Vata-dominant vikriti; a mirror caution exists for Pitta (VYA-003)."
    },
    {
        ruleId: "APT-002",
        category: "apathya",
        precedence: 5,
        sanskritDeva: "अपथ्य",
        sanskritIast: "apathya",
        english: "To limit — heavy/oily patterns in Kapha state",
        recommendation: "When your current state is Kapha-dominant, classical quality-logic suggests moderating heavy, oily, fried and very sweet preparations and daytime napping — framed as education, not prohibition.",
        why: "Opposite-quality (guṇa) logic applied to Kapha heaviness/oiliness; educational framing from the dinacharya catalogue.",
        conditions: {
            vikritiDominant: "kapha"
        },
        classicalSource: "Guṇa logic via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Never restrict food groups; opt out anytime."
        ],
        applicability: "Users whose vikriti self-assessment is currently Kapha-dominant."
    },
    // ================= VYAYAMA =================
    {
        ruleId: "VYA-001",
        category: "vyayama",
        precedence: 4,
        sanskritDeva: "व्यायाम",
        sanskritIast: "vyāyāma",
        english: "Exercise at half your strength",
        recommendation: "Exercise regularly but within the classical dose: up to about half your capacity — the traditional check is stopping when effort feels like half of your maximum, e.g. sweat on the forehead/nose without exhaustion. Use steps and active minutes as your objective dose.",
        why: "Classical dose rule: exercise lightens the body, strengthens digestion and reduces obesity, capped at half of one's strength (A.Hr.Sū. 2/11-14). Wearable steps/active minutes are the objective measures with acceptable accuracy.",
        conditions: {},
        classicalSource: "A.Hr.Sū. 2/11-14 (via Anagha & Deole 2021, [5])",
        researchReference: "Fuller et al. 2020 [19]: steps/HR acceptable average accuracy.",
        evidenceLevel: "CT",
        precautions: [
            "'Half strength' is a classical (traditional) dose, NOT a physiologically validated threshold.",
            "No max-HR prescriptions; consult a professional if you have cardiac or other conditions."
        ],
        applicability: "All users."
    },
    {
        ruleId: "VYA-002",
        category: "vyayama",
        precedence: 5,
        sanskritDeva: "ऋतु-व्यायाम",
        sanskritIast: "ṛtu-vyāyāma",
        english: "Season-conditional exercise intensity",
        recommendation: "Classically, exercise capacity is described as higher in cool seasons (especially for those on nourishing diets) and lower in peak heat — adjust outdoor activity timing and intensity with the season.",
        why: "Season-and-diet conditioning of exercise from the classical exercise chapter (report Ch. 9.4); aligned with practical heat-avoidance.",
        conditions: {
            seasons: [
                "hemanta",
                "shishira",
                "vasanta",
                "greeshma"
            ]
        },
        classicalSource: "A.Hr.Sū. 2/11-14 via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Avoid overheating in summer; hydrate; no clinical claims."
        ],
        applicability: "Users in cool or peak-heat seasons."
    },
    {
        ruleId: "VYA-003",
        category: "vyayama",
        precedence: 1,
        sanskritDeva: "व्यायाम-सावधानता",
        sanskritIast: "vyāyāma-sāavadhānatā",
        english: "Recovery first — do not increase intensity now",
        recommendation: "Hold off increasing exercise intensity right now. Your recent data shows recovery strain (short sleep, elevated resting heart rate, low HRV, or a Vata/Pitta imbalance state). Prioritise sleep regularity and lighter movement; a comfortable post-exercise massage is the classical recovery framing.",
        why: "The classical contraindication of excess exercise in Vata/Pitta states (A.Hr.Sū. 2/14) is combined with wearable context (sleep duration, RHR trend, HRV as stress-recovery index). Wearable thresholds are platform design proposals requiring calibration.",
        conditions: {
            wearable: [
                "sleep_debt"
            ]
        },
        classicalSource: "A.Hr.Sū. 2/14 (via Anagha & Deole 2021, [5])",
        researchReference: "HRV as stress-recovery index: Shaffer & Ginsberg 2017 [12]; wearable accuracy limits: [10, 19].",
        evidenceLevel: "DP",
        precautions: [
            "Wearable input is context, never a dosha readout or medical alert.",
            "Persistent anomalies deserve professional attention; this is not a medical warning."
        ],
        applicability: "Fires when 7-day sleep average < 6.5 h (design-proposal threshold)."
    },
    {
        ruleId: "VYA-004",
        category: "vyayama",
        precedence: 2,
        sanskritDeva: "व्यायाम-सावधानता",
        sanskritIast: "vyāyāma-sāavadhānatā",
        english: "Recovery first — strain indicators present",
        recommendation: "Your 7-day resting heart rate trend is above your usual level or HRV nights are repeatedly low — treat this as a 'body under load' context card: reduce optional intensity, protect sleep regularity, and recover first.",
        why: "Recovery-first framing from the worked example rules (report Ch. 14.3 R11): RHR trend above baseline or repeated low-HRV nights suppress intensity-increase advice.",
        conditions: {
            wearable: [
                "rhr_elevated"
            ]
        },
        classicalSource: null,
        researchReference: "HRV as stress-recovery index [12]; wearable accuracy limits [10, 19].",
        evidenceLevel: "DP",
        precautions: [
            "Never a medical alert; persistent anomalies -> general practitioner suggestion.",
            "Thresholds are design proposals pending calibration."
        ],
        applicability: "Fires when 7-day RHR average exceeds the user's overall baseline by > 5 bpm or > 85 bpm."
    },
    // ================= NIDRA =================
    {
        ruleId: "NID-001",
        category: "nidra",
        precedence: 4,
        sanskritDeva: "निद्रा",
        sanskritIast: "nidrā",
        english: "Regular sleep timing",
        recommendation: "Keep a regular bed and wake time. Classical texts prescribe sleep in proper quantity and at proper time, with needs varying by person; modern sleep research also treats regularity as a measurable, useful property.",
        why: "Nidrā anchor: proper sleep supports happiness, nourishment, strength and knowledge (Cha.Sa.Sū. 21/30 via [5]); regularity is measurable from wearable sleep sessions.",
        conditions: {},
        classicalSource: "Cha.Sa.Sū. 21/30 (via Anagha & Deole 2021, [5])",
        researchReference: "Sleep-wake summary accuracy: report Ch. 8.1 [14].",
        evidenceLevel: "CT",
        precautions: [
            "Never diagnose sleep apnoea or insomnia; persistent complaints -> professional care.",
            "Sleep stages shown (if any) are estimates with wide error margins."
        ],
        applicability: "All users."
    },
    {
        ruleId: "NID-002",
        category: "nidra",
        precedence: 5,
        sanskritDeva: "रात्रि-चर्या",
        sanskritIast: "rātri-caryā",
        english: "Evening wind-down stack",
        recommendation: "Build a simple evening routine: a comfortable (not too late) bath, optional light oil massage, dim screens and a consistent wind-down before your regular bedtime.",
        why: "Bath before sleep and regular timing appear in the dinacharya sequence; abhyaṅga is described as sleep-promoting (A.Hr.Sū. 2/8).",
        conditions: {},
        classicalSource: "A.Hr.Sū. 2/8; dinacharya sequence via Anagha & Deole 2021, [5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "General education; adapt to your schedule."
        ],
        applicability: "All users."
    },
    {
        ruleId: "NID-003",
        category: "nidra",
        precedence: 3,
        sanskritDeva: "निद्रा-नियमन",
        sanskritIast: "nidrā-niyamana",
        english: "Vata-state bedtime regularity",
        recommendation: "With a Vata-dominant current state, protect an earlier, highly regular bedtime and a warm, calm wind-down — classical grounding logic paired with the sleep-regularity principle.",
        why: "Worked example R5: Vikriti Vata imbalance or short sleep -> suppress intensity advice, offer abhyaṅga-before-bath education and earlier-bedtime regularity prompt.",
        conditions: {
            vikritiDominant: "vata"
        },
        classicalSource: "A.Hr.Sū. 2/8 via Anagha & Deole 2021, [5]",
        researchReference: "Mills et al. 2019 [4] Vata-state associations as educational context; sleep-accuracy limits [14].",
        evidenceLevel: "CT",
        precautions: [
            "No anxiety claims; education only."
        ],
        applicability: "Users whose vikriti self-assessment is currently Vata-dominant."
    },
    // ================= RITUCHARYA =================
    {
        ruleId: "RTU-001",
        category: "ritucharya",
        precedence: 5,
        sanskritDeva: "ऋतुसन्धि",
        sanskritIast: "ṛtu-sandhi",
        english: "Seasonal junction — transition gently",
        recommendation: "You are in a seasonal junction window (ṛtu-sandhi). Classical seasonal logic tapers the previous regimen and introduces the next gradually; keep meal and sleep times especially regular through the change.",
        why: "Ṛtu-sandhi transition vulnerability from the ritucharya scheme (Dhiman et al. 2026 [6, Abstract]); junction window length is a design proposal.",
        conditions: {
            rituSandhi: true
        },
        classicalSource: "Ṛtu-sandhi concept per Dhiman et al. 2026 [6, Abstract]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Seasonal claims are labelled 'biologically plausible; not yet tested as an intervention' per [6].",
            "Window length is a design proposal."
        ],
        applicability: "Users within the first or last 7 days of a season (design proposal)."
    },
    {
        ruleId: "RTU-002",
        category: "ritucharya",
        precedence: 5,
        sanskritDeva: "हेमन्त-शिशिर चर्या",
        sanskritIast: "hemanta-śiśira caryā",
        english: "Cold-season routine",
        recommendation: "In the cold half of the year, the classical scheme emphasises nourishing regular meals, warm bathing below the neck, and season-appropriate exercise; digestive strength is described as strong.",
        why: "Seasonal routine emphasis from the worked example R7; bath temperature rules Su.Sa.Ci. 24/61 via [5].",
        conditions: {
            seasons: [
                "hemanta",
                "shishira"
            ]
        },
        classicalSource: "Su.Sa.Ci. 24/61 via Anagha & Deole 2021, [5]; seasonal scheme [6]",
        researchReference: "Pro-inflammatory winter transcriptomic profile [21] — plausibility anchor, not intervention evidence.",
        evidenceLevel: "CT",
        precautions: [
            "Avoid overheating claims; not for heat-sensitive conditions.",
            "Plausible-untested label per [6]."
        ],
        applicability: "Users in Hemanta or Shishira."
    },
    {
        ruleId: "RTU-003",
        category: "ritucharya",
        precedence: 5,
        sanskritDeva: "ग्रीष्म चर्या",
        sanskritIast: "grīṣma caryā",
        english: "Peak-heat routine",
        recommendation: "In peak heat: avoid exertion at peak sun, favour cooler bathing emphasis and lighter evening meals — classical seasonal practice, with extra relevance if your constitution is Pitta-dominant.",
        why: "Worked example R8: season = peak heat AND Prakriti Pitta-dominant -> cooling-routine education.",
        conditions: {
            seasons: [
                "greeshma"
            ]
        },
        classicalSource: "Seasonal scheme [6]; Pitta-heat attributes [2, 5]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "No dehydration-diagnosis language.",
            "Hydrate sensibly in heat."
        ],
        applicability: "Users in Greeshma; emphasised for Pitta constitutions."
    },
    {
        ruleId: "RTU-004",
        category: "ritucharya",
        precedence: 5,
        sanskritDeva: "वसन्त चर्या",
        sanskritIast: "vasanta caryā",
        english: "Spring routine",
        recommendation: "In spring, the classical scheme describes liquefied Kapha: favour lighter preparations, steady activity and earlier wake times as the seasonal emphasis.",
        why: "Vasanta is classically the Kapha-aggravation season (report Ch. 9.2); routine emphasis follows opposite-quality logic.",
        conditions: {
            seasons: [
                "vasanta"
            ]
        },
        classicalSource: "Seasonal scheme per Dhiman et al. 2026 [6, Abstract]",
        researchReference: null,
        evidenceLevel: "CT",
        precautions: [
            "Plausible-untested label per [6]; general education only."
        ],
        applicability: "Users in Vasanta."
    },
    // ================= SADVRITTA =================
    {
        ruleId: "SAD-001",
        category: "sadvritta",
        precedence: 5,
        sanskritDeva: "सद्वृत्त",
        sanskritIast: "sadvṛtta",
        english: "Code of right conduct — measured speech and sensory rest",
        recommendation: "Practice small conduct anchors from the classical code of right conduct: measured speech, periodic sensory-rest breaks from screens, and respectful social interaction through the workday.",
        why: "The code of right conduct (sadvṛtta) is prescribed for social and professional life and described as preventing exogenous disease (Cha.Sa.Sū. 8/25 via [5]); linked educationally to modern stress constructs.",
        conditions: {},
        classicalSource: "Cha.Sa.Sū. 8/25 (via Anagha & Deole 2021, [5])",
        researchReference: "Mills et al. 2019 [4] psychological measures (MAAS, PSS) as referenced wellbeing constructs.",
        evidenceLevel: "CT",
        precautions: [
            "No mental-health diagnosis; keep framing non-sectarian."
        ],
        applicability: "All users."
    },
    {
        ruleId: "SAD-002",
        category: "sadvritta",
        precedence: 5,
        sanskritDeva: "स्वाध्याय / चिन्तन",
        sanskritIast: "svādhyāya / cintana",
        english: "Weekly reflective check-in",
        recommendation: "Once a week, review your routine adherence (wake/sleep/meal regularity) and jot a short reflective note about the week — a modern reflective-practice habit the platform pairs with classical regularity.",
        why: "Weekly check-ins on routine adherence and reflective journaling are the report's app-rule proposal for the conduct domain (framed via the reflection construct of modern instruments, not as classical prescriptions).",
        conditions: {},
        classicalSource: null,
        researchReference: "Reflection construct of the Reflection-Rumination Questionnaire (report Ch. 9.6); clearly labelled as a modern instrument.",
        evidenceLevel: "DP",
        precautions: [
            "Modern practice, not a classical prescription.",
            "No mental-health diagnosis."
        ],
        applicability: "All users."
    },
    {
        ruleId: "SAD-003",
        category: "sadvritta",
        precedence: 3,
        sanskritDeva: "मनः-शान्ति शिक्षा",
        sanskritIast: "manaḥ-śānti śikṣā",
        english: "State-aware stress education",
        recommendation: "Educational note: research on the vikriti questionnaire reports associations between dosha imbalance states and psychological states (Vata with anxiety and rumination; Pitta with poorer mood and stress; Kapha with stress). These are associations, not diagnoses — if stress feels heavy, ordinary routine stabilisers (regular meals, sleep, movement, social contact) are a sensible first step.",
        why: "The Vikriti study's psychological correlations are used strictly as educational context per the report's copy rules (Ch. 13): associations phrased as research findings, no diagnosis language.",
        conditions: {
            vikritiDominant: ALL_DOSHAS[0]
        },
        classicalSource: null,
        researchReference: "Mills et al. 2019 [4], Results: Vata-anxiety (p ≤ 0.05), rumination (p ≤ 0.01); Pitta-mood (p ≤ 0.01), stress; Kapha-stress (p ≤ 0.01).",
        evidenceLevel: "DR",
        precautions: [
            "Association ≠ causation; no diagnosis or treatment claims.",
            "Distress escalation path: suggest professional care."
        ],
        applicability: "Content adapts to the dominant vikriti dosha."
    }
];
const PLATFORM_REFERENCES = [
    {
        id: "1",
        citation: "Gupta A, Singh V, Chandra S, Garg R. Towards standardization of Prakriti Evaluation: A scoping review of modern assessment tools and their psychometric properties in Ayurvedic medicine. J Ayurveda Integr Med. 2025;16(4):101157.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12269270/"
    },
    {
        id: "2",
        citation: "Tripathi PK, Patwardhan K, Singh G. The Basic Cardiovascular Responses to Postural Changes, Exercise, and Cold Pressor Test: Do They Vary in Accordance with the Dual Constitutional Types of Ayurveda? Evid Based Complement Alternat Med. 2011;2011:251850.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2952295/"
    },
    {
        id: "3",
        citation: "Bhalerao S, Patwardhan K. Good reporting practices for Ayurveda-based research studies. (Read via PubMed Central PMC4910291.)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4910291/"
    },
    {
        id: "4",
        citation: "Mills PJ, et al. The Self-Assessment Vikriti questionnaire and psychological states. (Read via PubMed Central PMC6822152.)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6822152/"
    },
    {
        id: "5",
        citation: "Anagha S, Deole YS. Dinacharya: the daily regimen. Charak Samhita New Edition book chapter, Charak Samhita Research, Training and Skill Development Centre, 2021.",
        url: "https://www.carakasamhitaonline.com/"
    },
    {
        id: "6",
        citation: "Dhiman K, et al. Ritucharya critical narrative review, 2026. (Publisher-verified abstract only; full text inaccessible.)",
        url: "https://journalajmah.com/"
    },
    {
        id: "12",
        citation: "Shaffer F, Ginsberg JP. An Overview of Heart Rate Variability Metrics and Norms. Front Public Health. 2017;5:258.",
        url: "https://www.frontiersin.org/articles/10.3389/fpubh.2017.00258/full"
    },
    {
        id: "14",
        citation: "Sleep-wake detection validation of consumer wearables (report Ch. 8.1, [14]).",
        url: "https://pubmed.ncbi.nlm.nih.gov/"
    },
    {
        id: "19",
        citation: "Fuller D, et al. Reliability and validity of commercially available wearable devices for measuring steps, energy expenditure, and heart rate: systematic review. JMIR Mhealth Uhealth. 2020;8(9):e18694.",
        url: "https://www.jmir.org/2020/9/e18694/"
    },
    {
        id: "21",
        citation: "Seasonally expressed human transcripts with hemisphere-inverted patterns (report Ch. 9.2, [21]).",
        url: "https://pubmed.ncbi.nlm.nih.gov/"
    }
];
}),
"[project]/src/lib/engine/recommendation-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeWearableFlags",
    ()=>computeWearableFlags,
    "evaluateRules",
    ()=>evaluateRules
]);
/**
 * Deterministic, explainable recommendation engine.
 *
 * Design per the research report (Ch. 14):
 *  - transparent rules, no black-box scoring;
 *  - three-valued condition evaluation: true / false / unknown. A rule whose
 *    required input is missing is WITHHELD with reason "waiting for data";
 *  - fixed precedence: safety (1) > contraindication (2) > vikriti-correction
 *    (3) > prakriti-maintenance (4) > general education (5). Conflicts are
 *    resolved by precedence and the resolution is recorded;
 *  - each emitted card carries the full explanation payload (inputs that
 *    influenced it, sources, evidence level, precautions, applicability).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$knowledge$2d$base$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/knowledge-base.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/prakriti-engine.ts [app-route] (ecmascript)");
;
;
function mean(values) {
    return values.reduce((s, v)=>s + v, 0) / values.length;
}
function computeWearableFlags(readings, age) {
    const weekAgo = (asOf)=>new Date(asOf.getTime() - 7 * 24 * 3600 * 1000);
    const asOf = new Date();
    const start = weekAgo(asOf);
    const within = (m)=>readings.filter((r)=>r.metric === m && new Date(r.recordedAt) >= start);
    const sleep = within("sleep_duration").map((r)=>r.value);
    const rhr = within("resting_heart_rate").map((r)=>r.value);
    const hrv = within("hrv_rmssd").map((r)=>r.value);
    const steps = within("steps").map((r)=>r.value);
    const sleepAvg = sleep.length ? mean(sleep) : null;
    const rhrAvg = rhr.length ? mean(rhr) : null;
    const hrvAvg = hrv.length ? mean(hrv) : null;
    const stepsAvg = steps.length ? mean(steps) : null;
    const sleepDebt = sleepAvg != null ? sleepAvg < 6.5 : null;
    // RHR elevated: above 85 bpm or > 5 bpm above the user's overall baseline
    // (all-time average of manual/measured readings) — design proposals.
    const allRhr = readings.filter((r)=>r.metric === "resting_heart_rate").map((r)=>r.value);
    const baseline = allRhr.length ? mean(allRhr) : null;
    const rhrElevated = rhrAvg != null && baseline != null ? rhrAvg > baseline + 5 || rhrAvg > 85 : null;
    const hrvRefTable = {
        0: 55,
        26: 45,
        36: 38,
        46: 32,
        56: 27,
        66: 22
    };
    const band = age == null ? 42 : age <= 25 ? 55 : age <= 35 ? 45 : age <= 45 ? 38 : age <= 55 ? 32 : age <= 65 ? 27 : 22;
    void hrvRefTable;
    const lowHrv = hrvAvg != null ? hrvAvg < band * 0.8 : null;
    const lowActivity = stepsAvg != null ? stepsAvg < 4000 : null;
    return {
        sleepDebt,
        rhrElevated,
        lowHrv,
        lowActivity,
        sleepAvg,
        rhrAvg,
        hrvAvg,
        stepsAvg
    };
}
function vikritiDominantDoshas(vikriti) {
    return vikriti.dominant.split("_").filter((d)=>d === "vata" || d === "pitta" || d === "kapha");
}
function evaluateRules(ctx) {
    const flags = computeWearableFlags(ctx.readings, ctx.age);
    const prakritiDoshas = ctx.prakriti ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["constitutionDoshas"])(ctx.prakriti.classification) : null;
    const vikritiDoshas = ctx.vikriti ? vikritiDominantDoshas(ctx.vikriti) : null;
    const dominantPct = ctx.vikriti ? Math.max(ctx.vikriti.vataPct, ctx.vikriti.pittaPct, ctx.vikriti.kaphaPct) : null;
    const shown = [];
    const withheld = [];
    for (const rule of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$knowledge$2d$base$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["KNOWLEDGE_BASE"]){
        const c = rule.conditions;
        const because = [];
        let unknown = false;
        let unknownReason = "";
        // Prakriti condition
        if (c.prakritiIncludes) {
            if (!prakritiDoshas) {
                unknown = true;
                unknownReason = "waiting for a completed Prakriti assessment";
            } else {
                const match = c.prakritiIncludes.some((d)=>prakritiDoshas.includes(d));
                if (!match) {
                    withheld.push({
                        status: "withheld",
                        rule,
                        reason: "constitution condition not met"
                    });
                    continue;
                }
                because.push(`your constitution (${ctx.prakriti.label}) includes ${c.prakritiIncludes.filter((d)=>prakritiDoshas.includes(d)).join(" & ")}`);
            }
        }
        // Vikriti condition
        if (c.vikritiDominant) {
            if (!vikritiDoshas) {
                unknown = true;
                unknownReason = "waiting for a completed Vikriti self-assessment";
            } else if (!vikritiDoshas.includes(c.vikritiDominant)) {
                withheld.push({
                    status: "withheld",
                    rule,
                    reason: "current-state condition not met"
                });
                continue;
            } else {
                because.push(`your current self-assessment shows ${c.vikritiDominant}-predominant signs${dominantPct != null ? ` (${dominantPct}%)` : ""}`);
            }
        }
        if (c.vikritiAtLeast != null) {
            if (dominantPct == null) {
                unknown = true;
                unknownReason = "waiting for a completed Vikriti self-assessment";
            } else if (dominantPct < c.vikritiAtLeast) {
                withheld.push({
                    status: "withheld",
                    rule,
                    reason: "imbalance below rule threshold"
                });
                continue;
            }
        }
        // Season condition
        if (c.seasons) {
            if (!c.seasons.includes(ctx.season)) {
                withheld.push({
                    status: "withheld",
                    rule,
                    reason: "not the current season"
                });
                continue;
            }
            because.push(`the current season is ${ctx.season}`);
        }
        if (c.rituSandhi === true) {
            if (!ctx.rituSandhi) {
                withheld.push({
                    status: "withheld",
                    rule,
                    reason: "outside the seasonal junction window"
                });
                continue;
            }
            because.push("the date falls in a seasonal junction (ṛtu-sandhi) window");
        }
        // Wearable conditions
        if (c.wearable) {
            // Map snake_case condition flags to the camelCase keys of the flags object.
            const flagKeys = {
                sleep_debt: "sleepDebt",
                rhr_elevated: "rhrElevated",
                low_hrv: "lowHrv",
                low_activity: "lowActivity"
            };
            for (const flag of c.wearable){
                const value = flags[flagKeys[flag] ?? flag];
                if (value == null) {
                    unknown = true;
                    unknownReason = flag === "sleep_debt" ? "waiting for sleep data (7-day window)" : flag === "rhr_elevated" ? "waiting for resting-heart-rate data (7-day window)" : flag === "low_hrv" ? "waiting for HRV data (7-day window)" : "waiting for activity data (7-day window)";
                    break;
                }
                if (!value) {
                    withheld.push({
                        status: "withheld",
                        rule,
                        reason: `wearable flag "${flag}" not triggered`
                    });
                    break;
                }
                because.push(flag === "sleep_debt" ? `your 7-day sleep average is ${flags.sleepAvg?.toFixed(1)} h (below the 6.5 h design-proposal threshold)` : flag === "rhr_elevated" ? `your 7-day resting heart rate average is elevated` : flag === "low_hrv" ? `your HRV nights are repeatedly low` : `your 7-day step average is low`);
            }
            if (because.length === 0 && !unknown) continue;
        }
        if (unknown) {
            withheld.push({
                status: "withheld",
                rule,
                reason: unknownReason
            });
            continue;
        }
        if (because.length === 0) because.push("it applies to everyone as general education");
        shown.push({
            status: "shown",
            rule,
            because
        });
    }
    // Precedence ordering; conflicts recorded in the payload of vikriti-correction rules.
    shown.sort((a, b)=>a.rule.precedence - b.rule.precedence || a.rule.ruleId.localeCompare(b.rule.ruleId));
    // Conflict recording: if a safety rule fired, note the resolution on lower-precedence rules.
    const safetyFired = shown.some((s)=>s.rule.precedence === 1);
    if (safetyFired) {
        for (const s of shown){
            if (s.rule.precedence > 1) {
                s.because.push(`shown after a higher-precedence recovery rule outweighed routine advice under fixed precedence (safety > contraindication > vikriti-correction > prakriti-maintenance > education)`);
            }
        }
    }
    return {
        shown,
        withheld
    };
}
}),
"[project]/src/app/api/recommendations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/prakriti-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$vikriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/vikriti-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$seasonal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/seasonal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$recommendation$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/recommendation-engine.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET() {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const [latestPrakriti, latestVikriti, profile, recentReadings, latestEnv] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].prakritiAssessment.findFirst({
            where: {
                userId: guard.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].vikritiAssessment.findFirst({
            where: {
                userId: guard.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].profile.findUnique({
            where: {
                userId: guard.user.id
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].healthReading.findMany({
            where: {
                userId: guard.user.id,
                recordedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 3600 * 1000)
                }
            },
            orderBy: {
                recordedAt: "desc"
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].environmentSnapshot.findFirst({
            where: {
                userId: guard.user.id
            },
            orderBy: {
                recordedAt: "desc"
            }
        })
    ]);
    const prakriti = latestPrakriti ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$prakriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scorePrakriti"])(JSON.parse(latestPrakriti.answersJson)) : null;
    const vikriti = latestVikriti ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$vikriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoreVikriti"])(JSON.parse(latestVikriti.answersJson)) : null;
    const readings = recentReadings.map((r)=>({
            metric: r.metric,
            value: r.value,
            provenance: r.provenance,
            recordedAt: r.recordedAt.toISOString()
        }));
    const lat = latestEnv?.latitude ?? null;
    const season = latestEnv?.season ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$seasonal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSeason"])(new Date(), lat);
    const { shown, withheld } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$recommendation$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["evaluateRules"])({
        prakriti,
        vikriti,
        combined: null,
        season,
        rituSandhi: latestEnv ? true : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$seasonal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRituSandhi"])(new Date(), lat),
        readings,
        age: profile?.age ?? null
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        generatedAt: new Date().toISOString(),
        season,
        shown: shown.map((s)=>({
                ruleId: s.rule.ruleId,
                category: s.rule.category,
                precedence: s.rule.precedence,
                sanskritDeva: s.rule.sanskritDeva,
                sanskritIast: s.rule.sanskritIast,
                english: s.rule.english,
                recommendation: s.rule.recommendation,
                why: s.rule.why,
                because: s.because,
                classicalSource: s.rule.classicalSource,
                researchReference: s.rule.researchReference,
                evidenceLevel: s.rule.evidenceLevel,
                precautions: s.rule.precautions,
                applicability: s.rule.applicability
            })),
        withheld: withheld.map((w)=>({
                ruleId: w.rule.ruleId,
                english: w.rule.english,
                reason: w.reason
            })),
        note: "Deterministic rule-based suggestions for educational wellness support. They do not cure, treat or eliminate dosha imbalance, and they are not medical advice."
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9d4bed54._.js.map