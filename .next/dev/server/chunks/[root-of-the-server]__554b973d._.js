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
"[project]/src/app/api/vikriti/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-helpers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/vikriti-questions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$vikriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/vikriti-engine.ts [app-route] (ecmascript)");
;
;
;
;
async function GET() {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const history = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].vikritiAssessment.findMany({
        where: {
            userId: guard.user.id
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 50
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        instrument: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIKRITI_INSTRUMENT"],
        history: history.map((h)=>({
                ...h,
                answersJson: undefined,
                answers: JSON.parse(h.answersJson)
            }))
    });
}
async function POST(request) {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJson"])(request);
    if (!body?.answers) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Missing answers.");
    const answers = body.answers;
    const unanswered = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIKRITI_ITEMS"].filter((i)=>answers[i.id] !== "yes" && answers[i.id] !== "no");
    if (unanswered.length > 0) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])(`${unanswered.length} question(s) unanswered. Answer every question before submitting.`, 422);
    }
    const score = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$vikriti$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoreVikriti"])(answers);
    const record = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].vikritiAssessment.create({
        data: {
            userId: guard.user.id,
            instrumentId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$vikriti$2d$questions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VIKRITI_INSTRUMENT"].id,
            scoringVersion: "experimental_binary_v1",
            answersJson: JSON.stringify(answers),
            vataCount: score.vataCount,
            pittaCount: score.pittaCount,
            kaphaCount: score.kaphaCount,
            vataPct: score.vataPct,
            pittaPct: score.pittaPct,
            kaphaPct: score.kaphaPct,
            dominant: score.dominant
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        assessment: {
            ...record,
            answersJson: undefined
        },
        score,
        scoringNote: "Experimental platform scoring (1 point per 'Yes', normalised per dosha bucket: Vata 13, Pitta 10, Kapha 11). The source questionnaire documents no numeric formula; this method is a labelled design proposal with no clinical validation and no diagnostic cutoffs."
    }, 201);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__554b973d._.js.map