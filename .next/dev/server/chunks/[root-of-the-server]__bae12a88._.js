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
"[project]/src/lib/data/city-climate.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Built-in city climate normals — the offline fallback for the Environment
 * screen. When the live weather providers are unreachable (quota, network,
 * sandbox), we still record a snapshot using the typical monthly temperature
 * and humidity for the city (or the nearest known city for a location fix).
 *
 * Snapshots built this way store condition = "typical climate" so the UI can
 * show exactly what the numbers are — never presented as live weather.
 *
 * Values are rough monthly normals (°C, % RH) compiled for educational use —
 * approximate by design, not an hourly forecast.
 */ __turbopack_context__.s([
    "CITIES",
    ()=>CITIES,
    "climateNormal",
    ()=>climateNormal,
    "genericClimate",
    ()=>genericClimate,
    "lookupCity",
    ()=>lookupCity,
    "nearestCity",
    ()=>nearestCity
]);
const CITIES = [
    {
        name: "Delhi",
        country: "IN",
        lat: 28.61,
        lon: 77.21,
        t: [
            14,
            17,
            23,
            29,
            33,
            34,
            31,
            30,
            29,
            25,
            19,
            15
        ],
        h: [
            63,
            54,
            41,
            29,
            27,
            38,
            62,
            68,
            63,
            54,
            57,
            64
        ]
    },
    {
        name: "Mumbai",
        country: "IN",
        lat: 19.08,
        lon: 72.88,
        t: [
            24,
            25,
            27,
            29,
            30,
            29,
            28,
            28,
            28,
            29,
            28,
            26
        ],
        h: [
            71,
            71,
            70,
            71,
            71,
            79,
            86,
            86,
            84,
            78,
            71,
            71
        ]
    },
    {
        name: "Bengaluru",
        country: "IN",
        lat: 12.97,
        lon: 77.59,
        t: [
            22,
            24,
            27,
            28,
            27,
            25,
            24,
            24,
            24,
            24,
            23,
            22
        ],
        h: [
            56,
            47,
            42,
            48,
            58,
            71,
            76,
            76,
            74,
            71,
            66,
            61
        ]
    },
    {
        name: "Chennai",
        country: "IN",
        lat: 13.08,
        lon: 80.27,
        t: [
            25,
            26,
            28,
            31,
            33,
            33,
            32,
            31,
            30,
            29,
            27,
            26
        ],
        h: [
            72,
            71,
            70,
            68,
            63,
            60,
            64,
            68,
            74,
            78,
            76,
            74
        ]
    },
    {
        name: "Kolkata",
        country: "IN",
        lat: 22.57,
        lon: 88.36,
        t: [
            20,
            23,
            28,
            31,
            32,
            31,
            30,
            30,
            30,
            29,
            25,
            21
        ],
        h: [
            66,
            58,
            54,
            60,
            66,
            76,
            82,
            82,
            81,
            76,
            70,
            68
        ]
    },
    {
        name: "Hyderabad",
        country: "IN",
        lat: 17.39,
        lon: 78.49,
        t: [
            22,
            25,
            29,
            32,
            33,
            30,
            28,
            28,
            28,
            27,
            24,
            22
        ],
        h: [
            52,
            42,
            34,
            31,
            34,
            52,
            68,
            70,
            68,
            61,
            54,
            53
        ]
    },
    {
        name: "Pune",
        country: "IN",
        lat: 18.52,
        lon: 73.86,
        t: [
            21,
            23,
            27,
            30,
            30,
            28,
            26,
            26,
            26,
            26,
            23,
            21
        ],
        h: [
            55,
            46,
            40,
            42,
            51,
            67,
            79,
            80,
            77,
            68,
            58,
            56
        ]
    },
    {
        name: "Ahmedabad",
        country: "IN",
        lat: 23.02,
        lon: 72.57,
        t: [
            20,
            23,
            28,
            32,
            34,
            33,
            31,
            30,
            30,
            29,
            25,
            21
        ],
        h: [
            55,
            47,
            38,
            32,
            36,
            50,
            70,
            75,
            72,
            56,
            49,
            53
        ]
    },
    {
        name: "Jaipur",
        country: "IN",
        lat: 26.91,
        lon: 75.79,
        t: [
            16,
            19,
            25,
            30,
            34,
            34,
            31,
            30,
            29,
            26,
            21,
            17
        ],
        h: [
            55,
            45,
            34,
            26,
            25,
            36,
            60,
            69,
            63,
            46,
            46,
            54
        ]
    },
    {
        name: "Varanasi",
        country: "IN",
        lat: 25.32,
        lon: 82.97,
        t: [
            16,
            19,
            25,
            31,
            33,
            33,
            31,
            30,
            30,
            27,
            22,
            17
        ],
        h: [
            68,
            57,
            44,
            36,
            42,
            60,
            78,
            81,
            78,
            69,
            63,
            68
        ]
    },
    {
        name: "Lucknow",
        country: "IN",
        lat: 26.85,
        lon: 80.95,
        t: [
            16,
            19,
            25,
            31,
            33,
            33,
            31,
            30,
            30,
            27,
            22,
            17
        ],
        h: [
            70,
            59,
            46,
            38,
            43,
            61,
            80,
            83,
            79,
            70,
            65,
            70
        ]
    },
    {
        name: "Kochi",
        country: "IN",
        lat: 9.93,
        lon: 76.27,
        t: [
            27,
            28,
            29,
            30,
            29,
            28,
            27,
            27,
            27,
            28,
            28,
            27
        ],
        h: [
            75,
            74,
            73,
            75,
            78,
            82,
            84,
            84,
            82,
            80,
            78,
            76
        ]
    },
    {
        name: "Goa",
        country: "IN",
        lat: 15.3,
        lon: 74.08,
        t: [
            25,
            26,
            28,
            30,
            30,
            29,
            28,
            28,
            28,
            28,
            27,
            26
        ],
        h: [
            68,
            64,
            60,
            62,
            68,
            79,
            86,
            87,
            84,
            77,
            70,
            68
        ]
    },
    {
        name: "Nagpur",
        country: "IN",
        lat: 21.15,
        lon: 79.09,
        t: [
            21,
            24,
            29,
            33,
            35,
            32,
            29,
            29,
            29,
            27,
            23,
            21
        ],
        h: [
            55,
            45,
            35,
            31,
            35,
            53,
            74,
            79,
            74,
            60,
            53,
            55
        ]
    },
    {
        name: "Bhopal",
        country: "IN",
        lat: 23.26,
        lon: 77.41,
        t: [
            19,
            22,
            27,
            32,
            34,
            32,
            29,
            28,
            28,
            26,
            22,
            19
        ],
        h: [
            60,
            50,
            38,
            30,
            33,
            52,
            76,
            81,
            76,
            60,
            55,
            60
        ]
    },
    {
        name: "London",
        country: "GB",
        lat: 51.51,
        lon: -0.13,
        t: [
            5,
            5,
            8,
            10,
            14,
            17,
            19,
            19,
            16,
            12,
            8,
            6
        ],
        h: [
            87,
            83,
            76,
            71,
            70,
            69,
            69,
            71,
            76,
            83,
            86,
            88
        ]
    },
    {
        name: "New York",
        country: "US",
        lat: 40.71,
        lon: -74.01,
        t: [
            0,
            1,
            6,
            12,
            17,
            23,
            25,
            25,
            21,
            14,
            8,
            3
        ],
        h: [
            62,
            60,
            59,
            58,
            64,
            66,
            66,
            68,
            69,
            66,
            65,
            63
        ]
    },
    {
        name: "Berlin",
        country: "DE",
        lat: 52.52,
        lon: 13.41,
        t: [
            0,
            0,
            5,
            9,
            14,
            18,
            20,
            20,
            15,
            10,
            5,
            2
        ],
        h: [
            86,
            83,
            74,
            68,
            68,
            68,
            70,
            71,
            76,
            81,
            86,
            88
        ]
    },
    {
        name: "Paris",
        country: "FR",
        lat: 48.86,
        lon: 2.35,
        t: [
            5,
            6,
            9,
            13,
            17,
            20,
            22,
            22,
            18,
            13,
            8,
            6
        ],
        h: [
            84,
            79,
            73,
            70,
            71,
            70,
            71,
            72,
            76,
            82,
            84,
            85
        ]
    },
    {
        name: "Tokyo",
        country: "JP",
        lat: 35.68,
        lon: 139.69,
        t: [
            6,
            6,
            10,
            15,
            19,
            22,
            26,
            27,
            24,
            18,
            13,
            8
        ],
        h: [
            56,
            56,
            60,
            64,
            70,
            76,
            80,
            79,
            78,
            73,
            66,
            59
        ]
    },
    {
        name: "Singapore",
        country: "SG",
        lat: 1.35,
        lon: 103.82,
        t: [
            27,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            27,
            27
        ],
        h: [
            84,
            83,
            83,
            84,
            83,
            82,
            82,
            82,
            82,
            83,
            85,
            85
        ]
    },
    {
        name: "Dubai",
        country: "AE",
        lat: 25.2,
        lon: 55.27,
        t: [
            20,
            21,
            24,
            28,
            32,
            34,
            35,
            35,
            32,
            29,
            25,
            21
        ],
        h: [
            63,
            61,
            57,
            52,
            51,
            55,
            57,
            58,
            59,
            57,
            58,
            62
        ]
    },
    {
        name: "Sydney",
        country: "AU",
        lat: -33.87,
        lon: 151.21,
        t: [
            23,
            23,
            22,
            19,
            16,
            14,
            13,
            14,
            16,
            18,
            20,
            22
        ],
        h: [
            72,
            74,
            74,
            72,
            73,
            72,
            67,
            64,
            66,
            68,
            70,
            70
        ]
    },
    {
        name: "Melbourne",
        country: "AU",
        lat: -37.81,
        lon: 144.96,
        t: [
            21,
            21,
            19,
            16,
            13,
            11,
            10,
            11,
            13,
            15,
            18,
            20
        ],
        h: [
            64,
            66,
            68,
            70,
            74,
            77,
            76,
            72,
            69,
            66,
            64,
            63
        ]
    },
    {
        name: "Toronto",
        country: "CA",
        lat: 43.65,
        lon: -79.38,
        t: [
            -5,
            -4,
            1,
            7,
            13,
            19,
            22,
            22,
            17,
            10,
            4,
            -2
        ],
        h: [
            74,
            71,
            67,
            63,
            64,
            67,
            69,
            71,
            71,
            70,
            75,
            78
        ]
    },
    {
        name: "Sao Paulo",
        country: "BR",
        lat: -23.55,
        lon: -46.63,
        t: [
            23,
            23,
            22,
            20,
            18,
            17,
            17,
            18,
            19,
            20,
            21,
            22
        ],
        h: [
            79,
            79,
            79,
            79,
            79,
            78,
            75,
            73,
            75,
            77,
            78,
            79
        ]
    },
    {
        name: "Moscow",
        country: "RU",
        lat: 55.76,
        lon: 37.62,
        t: [
            -8,
            -7,
            -2,
            6,
            13,
            17,
            19,
            17,
            11,
            5,
            -2,
            -6
        ],
        h: [
            84,
            81,
            76,
            68,
            66,
            70,
            73,
            75,
            78,
            81,
            85,
            86
        ]
    },
    {
        name: "Cairo",
        country: "EG",
        lat: 30.04,
        lon: 31.24,
        t: [
            14,
            16,
            19,
            23,
            27,
            29,
            30,
            30,
            28,
            25,
            20,
            16
        ],
        h: [
            58,
            55,
            52,
            47,
            45,
            47,
            50,
            52,
            54,
            56,
            58,
            59
        ]
    },
    {
        name: "Nairobi",
        country: "KE",
        lat: -1.29,
        lon: 36.82,
        t: [
            20,
            21,
            21,
            20,
            19,
            18,
            17,
            17,
            18,
            19,
            19,
            20
        ],
        h: [
            72,
            70,
            70,
            74,
            77,
            76,
            74,
            72,
            70,
            70,
            71,
            73
        ]
    },
    {
        name: "Cape Town",
        country: "ZA",
        lat: -33.92,
        lon: 18.42,
        t: [
            22,
            22,
            21,
            18,
            16,
            14,
            13,
            14,
            15,
            17,
            19,
            21
        ],
        h: [
            72,
            74,
            77,
            78,
            79,
            79,
            79,
            78,
            77,
            75,
            73,
            72
        ]
    },
    {
        name: "Los Angeles",
        country: "US",
        lat: 34.05,
        lon: -118.24,
        t: [
            15,
            15,
            16,
            17,
            19,
            21,
            23,
            24,
            23,
            20,
            17,
            15
        ],
        h: [
            63,
            64,
            67,
            69,
            71,
            72,
            72,
            72,
            71,
            68,
            64,
            62
        ]
    },
    {
        name: "San Francisco",
        country: "US",
        lat: 37.77,
        lon: -122.42,
        t: [
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            17,
            18,
            16,
            14,
            11
        ],
        h: [
            77,
            76,
            75,
            74,
            73,
            73,
            73,
            74,
            74,
            75,
            76,
            77
        ]
    },
    {
        name: "Chicago",
        country: "US",
        lat: 41.88,
        lon: -87.63,
        t: [
            -4,
            -2,
            4,
            10,
            16,
            22,
            24,
            24,
            19,
            12,
            5,
            -1
        ],
        h: [
            73,
            72,
            70,
            66,
            68,
            70,
            71,
            72,
            71,
            69,
            72,
            76
        ]
    },
    {
        name: "Bangkok",
        country: "TH",
        lat: 13.76,
        lon: 100.5,
        t: [
            28,
            29,
            30,
            31,
            31,
            30,
            30,
            30,
            30,
            30,
            29,
            28
        ],
        h: [
            72,
            74,
            74,
            74,
            76,
            77,
            77,
            78,
            79,
            78,
            73,
            70
        ]
    },
    {
        name: "Jakarta",
        country: "ID",
        lat: -6.21,
        lon: 106.85,
        t: [
            27,
            27,
            28,
            28,
            28,
            28,
            27,
            27,
            28,
            28,
            28,
            27
        ],
        h: [
            82,
            83,
            84,
            85,
            84,
            83,
            82,
            81,
            81,
            81,
            82,
            83
        ]
    },
    {
        name: "Seoul",
        country: "KR",
        lat: 37.57,
        lon: 126.98,
        t: [
            -2,
            0,
            6,
            12,
            18,
            22,
            26,
            26,
            22,
            15,
            7,
            1
        ],
        h: [
            60,
            58,
            60,
            62,
            67,
            71,
            77,
            76,
            72,
            66,
            62,
            60
        ]
    },
    {
        name: "Beijing",
        country: "CN",
        lat: 39.9,
        lon: 116.41,
        t: [
            -3,
            0,
            7,
            15,
            21,
            25,
            27,
            26,
            21,
            13,
            4,
            -2
        ],
        h: [
            44,
            42,
            44,
            46,
            52,
            58,
            68,
            70,
            64,
            56,
            50,
            46
        ]
    },
    {
        name: "Karachi",
        country: "PK",
        lat: 24.86,
        lon: 67.01,
        t: [
            19,
            21,
            24,
            27,
            29,
            30,
            29,
            28,
            28,
            28,
            25,
            21
        ],
        h: [
            63,
            63,
            64,
            66,
            68,
            70,
            74,
            76,
            75,
            69,
            62,
            62
        ]
    },
    {
        name: "Dhaka",
        country: "BD",
        lat: 23.81,
        lon: 90.41,
        t: [
            19,
            22,
            27,
            29,
            30,
            30,
            29,
            29,
            29,
            28,
            24,
            20
        ],
        h: [
            69,
            62,
            60,
            66,
            71,
            79,
            83,
            82,
            81,
            77,
            72,
            70
        ]
    },
    {
        name: "Colombo",
        country: "LK",
        lat: 6.93,
        lon: 79.86,
        t: [
            28,
            28,
            29,
            29,
            29,
            29,
            28,
            28,
            28,
            28,
            28,
            28
        ],
        h: [
            77,
            76,
            76,
            79,
            81,
            81,
            79,
            78,
            78,
            78,
            78,
            77
        ]
    },
    {
        name: "Kathmandu",
        country: "NP",
        lat: 27.72,
        lon: 85.32,
        t: [
            10,
            13,
            17,
            21,
            23,
            24,
            24,
            24,
            23,
            20,
            15,
            12
        ],
        h: [
            74,
            66,
            57,
            54,
            61,
            74,
            83,
            83,
            81,
            74,
            70,
            73
        ]
    }
];
function norm(s) {
    return s.toLowerCase().replace(/[^a-z]/g, "");
}
function lookupCity(query) {
    const q = norm(query);
    if (!q) return null;
    return CITIES.find((c)=>norm(c.name) === q) ?? CITIES.find((c)=>norm(c.name).includes(q) || q.includes(norm(c.name))) ?? null;
}
function nearestCity(lat, lon) {
    let best = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const c of CITIES){
        const d = (c.lat - lat) ** 2 + ((c.lon - lon) * Math.cos(lat * Math.PI / 180)) ** 2;
        if (d < bestD) {
            bestD = d;
            best = c;
        }
    }
    return best;
}
function climateNormal(city, date) {
    // Southern hemisphere: shift the calendar by six months.
    let m = date.getUTCMonth();
    if (city.lat < 0) m = (m + 6) % 12;
    return {
        temperatureC: city.t[m],
        humidity: city.h[m]
    };
}
function genericClimate(lat, date) {
    const abs = Math.abs(lat);
    let m = date.getUTCMonth();
    if (lat < 0) m = (m + 6) % 12;
    // Very rough annual cycle amplitude by latitude band.
    const amplitude = abs < 15 ? 1.5 : abs < 30 ? 5 : abs < 45 ? 11 : 15;
    const base = abs < 15 ? 27 : abs < 30 ? 25 : abs < 45 ? 15 : 5;
    const seasonal = Math.cos((m - 6.5) / 12 * 2 * Math.PI) * amplitude; // warm mid-year in the north
    const temperatureC = Math.round((base - seasonal + Number.EPSILON) * 10) / 10;
    const humidity = abs < 15 ? 80 : abs < 30 ? 65 : abs < 45 ? 70 : 72;
    return {
        temperatureC,
        humidity
    };
}
}),
"[project]/src/app/api/environment/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$seasonal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine/seasonal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$city$2d$climate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/city-climate.ts [app-route] (ecmascript)");
;
;
;
;
/**
 * Environment endpoint.
 *
 * Weather comes from Open-Meteo (free, keyless); when its quota or network
 * fails we fall back to wttr.in (also free and keyless). If both providers
 * are unreachable we record the city's TYPICAL climate (built-in monthly
 * normals, condition = "typical climate") so the app keeps working and the
 * user can always see which numbers were used. Manual entry always works too.
 */ const WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Severe thunderstorm with hail"
};
async function geocodeCity(city) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`, {
        signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] ?? null;
}
async function fetchWeather(lat, lon) {
    // Primary: Open-Meteo.
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`, {
            signal: AbortSignal.timeout(6000)
        });
        if (res.ok) {
            const data = await res.json();
            if (data.current) {
                return {
                    temperatureC: data.current.temperature_2m ?? null,
                    humidity: data.current.relative_humidity_2m ?? null,
                    condition: data.current.weather_code != null ? WEATHER_CODES[data.current.weather_code] ?? "Unknown" : null
                };
            }
        }
    } catch  {
    // Fall through to the backup provider.
    }
    // Backup: wttr.in (JSON format).
    try {
        const res = await fetch(`https://wttr.in/${lat},${lon}?format=j1`, {
            signal: AbortSignal.timeout(6000),
            headers: {
                "User-Agent": "holistic-prototype"
            }
        });
        if (!res.ok) return null;
        const data = await res.json();
        const cur = data.current_condition?.[0];
        if (!cur) return null;
        return {
            temperatureC: cur.temp_C != null ? Number(cur.temp_C) : null,
            humidity: cur.humidity != null ? Number(cur.humidity) : null,
            condition: cur.weatherDesc?.[0]?.value ?? null
        };
    } catch  {
        return null;
    }
}
async function GET(request) {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const latParam = url.searchParams.get("lat");
    const lonParam = url.searchParams.get("lon");
    try {
        let latitude = null;
        let longitude = null;
        let resolvedCity = null;
        let source = "city";
        if (latParam != null && lonParam != null) {
            latitude = Number(latParam);
            longitude = Number(lonParam);
            source = "location";
        } else if (city) {
            let geo = await geocodeCity(city);
            if (!geo) {
                // Geocoding outage: fall back to the built-in city list.
                const known = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$city$2d$climate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lookupCity"])(city);
                if (!known) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])(`Could not find the city "${city}". Try manual entry instead.`, 404);
                geo = {
                    name: known.name,
                    latitude: known.lat,
                    longitude: known.lon,
                    country: known.country
                };
            }
            latitude = geo.latitude;
            longitude = geo.longitude;
            resolvedCity = [
                geo.name,
                geo.country
            ].filter(Boolean).join(", ");
            source = "city";
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Provide either lat/lon or a city.");
        }
        let weather = await fetchWeather(latitude, longitude);
        // Offline fallback: record the typical climate instead of failing. For a
        // location fix we use the nearest known city; for a city query we try the
        // built-in city list first (also covers geocoding outages).
        if (!weather) {
            const known = source === "city" && city ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$city$2d$climate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lookupCity"])(city) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$city$2d$climate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nearestCity"])(latitude, longitude);
            const normal = known ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$city$2d$climate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["climateNormal"])(known, new Date()) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$city$2d$climate$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["genericClimate"])(latitude, new Date());
            weather = {
                temperatureC: normal.temperatureC,
                humidity: normal.humidity,
                condition: "typical climate"
            };
            if (!resolvedCity) resolvedCity = known ? `${known.name}, ${known.country}` : null;
        }
        const season = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$seasonal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSeason"])(new Date(), latitude);
        const snapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].environmentSnapshot.create({
            data: {
                userId: guard.user.id,
                source,
                city: resolvedCity ?? url.searchParams.get("label") ?? null,
                latitude,
                longitude,
                temperatureC: weather.temperatureC,
                humidity: weather.humidity,
                condition: weather.condition,
                season
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
            snapshot,
            fetchedAt: new Date().toISOString()
        });
    } catch  {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Weather service unreachable. Manual entry remains available.", 503);
    }
}
async function POST(request) {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJson"])(request);
    if (!body) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Invalid request body.");
    const temperatureC = body.temperatureC != null ? Number(body.temperatureC) : null;
    const humidity = body.humidity != null ? Number(body.humidity) : null;
    if (temperatureC != null && (!Number.isFinite(temperatureC) || temperatureC < -90 || temperatureC > 60)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Temperature must be between -90 and 60 °C.");
    }
    if (humidity != null && (!Number.isFinite(humidity) || humidity < 0 || humidity > 100)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorJson"])("Humidity must be between 0 and 100 %.");
    }
    const latitude = body.hemisphere === "south" ? -20 : 20; // nominal latitude for season computation
    const season = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2f$seasonal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSeason"])(new Date(), latitude);
    const snapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].environmentSnapshot.create({
        data: {
            userId: guard.user.id,
            source: "manual",
            city: body.city?.trim() || null,
            latitude,
            longitude: null,
            temperatureC,
            humidity,
            condition: body.condition || null,
            season
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        snapshot
    }, 201);
}
async function DELETE() {
    const guard = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireUser"])();
    if (!guard.user) return guard.response;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].environmentSnapshot.deleteMany({
        where: {
            userId: guard.user.id
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])({
        ok: true
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bae12a88._.js.map