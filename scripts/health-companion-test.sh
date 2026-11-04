#!/usr/bin/env bash
# End-to-end test of the Android companion (Health Connect) integration API.
# Creates a throwaway user, runs the full pairing → sync → dedupe → status →
# poll → disconnect flow, then deletes the test users.
set -uo pipefail
BASE="${1:-http://localhost:3000}"
PASS=0; FAIL=0
check() { # check <name> <actual> <expected>
  if [ "$2" = "$3" ]; then PASS=$((PASS+1)); echo "PASS $1"; else FAIL=$((FAIL+1)); echo "FAIL $1 (expected '$3', got '$2')"; fi
}

EMAIL="companion-e2e-$(date +%s)@test.local"

# 1. signup
SIGNUP=$(curl -s -X POST "$BASE/api/auth/signup" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test1234!\",\"name\":\"Companion E2E\"}")
TOKEN=$(echo "$SIGNUP" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("token",""))')
check "signup-token" "$([ -n "$TOKEN" ] && echo yes || echo no)" "yes"

# 2. pairing/create
PAIR=$(curl -s -X POST "$BASE/api/health/pairing/create" -H "Authorization: Bearer $TOKEN")
CODE=$(echo "$PAIR" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("code",""))')
EXP=$(echo "$PAIR" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("ttlMinutes",""))')
check "pairing-code-format" "$(echo -n "$CODE" | wc -c | tr -d ' ')" "8"
check "pairing-ttl" "$EXP" "10"

# 3. pairing/complete — unknown code
BAD=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/health/pairing/complete" -H 'Content-Type: application/json' -d '{"code":"ZZZZZZZZ"}')
check "complete-unknown-code-404" "$BAD" "404"

# 4. pairing/complete — good code
DONE=$(curl -s -X POST "$BASE/api/health/pairing/complete" -H 'Content-Type: application/json' \
  -d "{\"code\":\"$CODE\",\"deviceLabel\":\"Redmi Note 14\",\"model\":\"24040RA17G\",\"osVersion\":\"Android 14\",\"appVersion\":\"1.0.0\"}")
DEV_TOKEN=$(echo "$DONE" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("token",""))')
check "complete-token-issued" "$([ -n "$DEV_TOKEN" ] && echo yes || echo no)" "yes"

# 5. code is single-use
REUSE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/health/pairing/complete" -H 'Content-Type: application/json' -d "{\"code\":\"$CODE\"}")
check "complete-single-use-409" "$REUSE" "409"

# 6. sync — first push (measured values, origin = Mi Fitness)
S1=$(curl -s -X POST "$BASE/api/health/sync" -H "Authorization: Bearer $DEV_TOKEN" -H 'Content-Type: application/json' -d '{
  "permissions": ["steps","heart_rate","resting_heart_rate","sleep","active_calories","distance","exercise","spo2","hrv"],
  "records": [
    {"metric":"steps","value":8432,"recordedAt":"2026-10-31T18:30:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"heart_rate","value":72,"recordedAt":"2026-10-31T18:35:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"resting_heart_rate","value":61,"recordedAt":"2026-10-31T07:30:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"sleep_duration","value":7.4,"recordedAt":"2026-10-31T06:12:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"sleep_stage_deep","value":84,"recordedAt":"2026-10-31T06:12:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"active_calories","value":412.5,"recordedAt":"2026-10-31T18:30:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"distance","value":6.2,"recordedAt":"2026-10-31T18:30:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"spo2","value":97,"recordedAt":"2026-10-31T06:00:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"hrv_rmssd","value":48,"recordedAt":"2026-10-31T06:00:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"active_minutes","value":35,"recordedAt":"2026-10-31T17:00:00Z","origin":"com.xiaomi.wearable"}
  ]}')
check "sync-created-10" "$(echo "$S1" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("created",-1))')" "10"
check "sync-rejected-0" "$(echo "$S1" | python3 -c 'import sys,json;print(len(json.load(sys.stdin).get("rejected",[])))')" "0"

# 7. dedupe — same push again → all skipped
S2=$(curl -s -X POST "$BASE/api/health/sync" -H "Authorization: Bearer $DEV_TOKEN" -H 'Content-Type: application/json' -d '{
  "records": [
    {"metric":"steps","value":8432,"recordedAt":"2026-10-31T18:30:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"heart_rate","value":72,"recordedAt":"2026-10-31T18:35:00Z","origin":"com.xiaomi.wearable"}
  ]}')
check "dedupe-skipped-2" "$(echo "$S2" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("skipped",-1))')" "2"

# 8. update — same key, changed value
S3=$(curl -s -X POST "$BASE/api/health/sync" -H "Authorization: Bearer $DEV_TOKEN" -H 'Content-Type: application/json' -d '{
  "records": [{"metric":"steps","value":9123,"recordedAt":"2026-10-31T18:30:00Z","origin":"com.xiaomi.wearable"}]}')
check "update-1" "$(echo "$S3" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("updated",-1))')" "1"

# 9. validation rejections
S4=$(curl -s -X POST "$BASE/api/health/sync" -H "Authorization: Bearer $DEV_TOKEN" -H 'Content-Type: application/json' -d '{
  "records": [
    {"metric":"bogus_metric","value":1,"recordedAt":"2026-10-31T10:00:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"heart_rate","value":900,"recordedAt":"2026-10-31T10:00:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"steps","value":100,"recordedAt":"not-a-date","origin":"com.xiaomi.wearable"},
    {"metric":"steps","value":100,"recordedAt":"2020-01-01T00:00:00Z","origin":"com.xiaomi.wearable"},
    {"metric":"steps","value":100,"recordedAt":"2026-10-31T10:00:00Z","origin":""}
  ]}')
check "reject-count-5" "$(echo "$S4" | python3 -c 'import sys,json;print(len(json.load(sys.stdin).get("rejected",[])))')" "5"

# 10. unauthenticated sync
NOAUTH=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/health/sync" -H 'Content-Type: application/json' -d '{"records":[]}')
check "sync-noauth-401" "$NOAUTH" "401"

# 11. status (web session)
ST=$(curl -s "$BASE/api/health/status" -H "Authorization: Bearer $TOKEN")
check "status-device-label" "$(echo "$ST" | python3 -c 'import sys,json;print(json.load(sys.stdin)["device"]["label"])')" "Redmi Note 14"
check "status-origins" "$(echo "$ST" | python3 -c 'import sys,json;print(",".join(json.load(sys.stdin)["device"]["origins"]))')" "com.xiaomi.wearable"
check "status-permissions" "$(echo "$ST" | python3 -c 'import sys,json;print(len(json.load(sys.stdin)["device"]["permissions"]))')" "9"
check "status-lastsync" "$(echo "$ST" | python3 -c 'import sys,json;print("yes" if json.load(sys.stdin)["device"]["lastSyncAt"] else "no")')" "yes"

# 12. latest
LT=$(curl -s "$BASE/api/health/latest" -H "Authorization: Bearer $TOKEN")
check "latest-steps-value" "$(echo "$LT" | python3 -c 'import sys,json;d={m["metric"]:m for m in json.load(sys.stdin)["metrics"]};print(int(d["steps"]["value"]))')" "9123"
check "latest-origin-label" "$(echo "$LT" | python3 -c 'import sys,json;d={m["metric"]:m for m in json.load(sys.stdin)["metrics"]};print(d["steps"]["originLabel"])')" "Mi Fitness (Xiaomi)"

# 13. history
HS=$(curl -s "$BASE/api/health/history?days=7" -H "Authorization: Bearer $TOKEN")
check "history-steps-sum" "$(echo "$HS" | python3 -c 'import sys,json;print(json.load(sys.stdin)["series"]["steps"][-1]["value"])')" "9123"

# 14. sync request + poll
SR=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/health/sync/request" -H "Authorization: Bearer $TOKEN")
check "sync-request-200" "$SR" "200"
PL=$(curl -s "$BASE/api/health/poll" -H "Authorization: Bearer $DEV_TOKEN")
check "poll-request-pending" "$(echo "$PL" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("requestPending"))')" "True"

# 15. user isolation — another user cannot see these readings
SIGNUP2=$(curl -s -X POST "$BASE/api/auth/signup" -H 'Content-Type: application/json' -d "{\"email\":\"other-$(date +%s)@test.local\",\"password\":\"Test1234!\",\"name\":\"Other\"}")
TOKEN2=$(echo "$SIGNUP2" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("token",""))')
LT2=$(curl -s "$BASE/api/health/latest" -H "Authorization: Bearer $TOKEN2")
check "isolation-empty" "$(echo "$LT2" | python3 -c 'import sys,json;print(len(json.load(sys.stdin)["metrics"]))')" "0"

# 16. disconnect — removes synchronized readings
DC=$(curl -s -X POST "$BASE/api/health/device/disconnect" -H "Authorization: Bearer $TOKEN")
check "disconnect-removed-10" "$(echo "$DC" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("removedReadings",-1))')" "10"
ST2=$(curl -s "$BASE/api/health/status" -H "Authorization: Bearer $TOKEN")
check "status-after-disconnect" "$(echo "$ST2" | python3 -c 'import sys,json;print(json.load(sys.stdin)["device"])')" "None"

# 17. revoked token can no longer sync
S5=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/health/sync" -H "Authorization: Bearer $DEV_TOKEN" -H 'Content-Type: application/json' -d '{"records":[{"metric":"steps","value":10,"recordedAt":"2026-10-31T10:00:00Z","origin":"com.xiaomi.wearable"}]}')
check "revoked-token-401" "$S5" "401"

echo "---"
echo "PASS=$PASS FAIL=$FAIL"

# cleanup test users
cd "$(dirname "$0")/.." && bun -e "
const {PrismaClient}=require('@prisma/client');
const db=new PrismaClient();
(async()=>{
  const users=await db.user.findMany({where:{email:{contains:'@test.local'}},select:{id:true,email:true}});
  const targets=users.filter(u=>u.email.startsWith('companion-e2e-')||u.email.startsWith('other-'));
  for(const u of targets){ await db.user.delete({where:{id:u.id}}); }
  console.log('cleaned',targets.length,'test users');
  process.exit(0);
})().catch(e=>{console.error(e.message);process.exit(1)});
"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
