#!/bin/bash
# End-to-end verification of the v3 vikriti model + manual metrics via the API.
set -euo pipefail
BASE="http://localhost:3000"
JAR=/tmp/verify-cookies.txt
rm -f "$JAR"

EMAIL="verify-$(date +%s)@test.local"
echo "== signup =="
curl -s -c "$JAR" -X POST "$BASE/api/auth/signup" -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"verify-pass-123\",\"name\":\"Verify Bot\"}" | head -c 200; echo

echo "== vikriti answers (9/13 vata yes) =="
ANS="{"
for i in $(seq 1 34); do
  [ $i -gt 1 ] && ANS+=","
  if [ $i -ge 22 ] && [ $i -le 30 ]; then ANS+="\"VK$i\":\"yes\""; else ANS+="\"VK$i\":\"no\""; fi
done
ANS+="}"
curl -s -b "$JAR" -X POST "$BASE/api/vikriti" -H "Content-Type: application/json" \
  -d "{\"answers\":$ANS}" -o /dev/null -w "POST /api/vikriti: %{http_code}\n"

echo "== combined result (new payload) =="
curl -s -b "$JAR" "$BASE/api/vikriti/combined" | python3 -c "
import json,sys
d = json.load(sys.stdin)['latest']['breakdown']
print('modelVersion:', d['modelVersion'])
print('combinedScore:', d['combinedScore'], 'Q:', d['questionnaire']['contribution'], 'W:', d['wearable']['contribution'], 'E:', d['environment']['contribution'])
print('subScores:', [(s['metric'], s['weight'], s['assumedNormal'], s['score']) for s in d['wearable']['subScores']])
print('calculation lines:')
[print('  ', l) for l in d['calculation']]
assert d['modelVersion'] == 'combined_50_30_20_fixed_weights_v3'
assert len(d['wearable']['subScores']) == 7
assert all(s['assumedNormal'] for s in d['wearable']['subScores'])
assert d['wearable']['balanceScore'] == 100 and d['wearable']['contribution'] == 0
# identity check
exp = round(0.5*d['questionnaire']['contribution'] + 0.3*d['wearable']['contribution'] + 0.2*d['environment']['contribution'], 2)
assert abs(d['combinedScore'] - exp) < 0.01, (d['combinedScore'], exp)
print('COMBINED OK')
"

echo "== manual subjective readings =="
for m in stress_level:2 sleep_quality:4 mood:3; do
  M="${m%%:*}"; V="${m##*:}"
  curl -s -b "$JAR" -X POST "$BASE/api/readings" -H "Content-Type: application/json" \
    -d "{\"metric\":\"$M\",\"value\":$V}" -o /dev/null -w "POST $M=$V: %{http_code}\n"
done
curl -s -b "$JAR" -X POST "$BASE/api/readings" -H "Content-Type: application/json" \
  -d '{"metric":"stress_level","value":9}' -o /dev/null -w "POST stress_level=9 (should be 422): %{http_code}\n"

echo "== combined with real readings (sleep 5h, steps 3k) =="
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
curl -s -b "$JAR" -X POST "$BASE/api/readings" -H "Content-Type: application/json" -d "{\"metric\":\"sleep_duration\",\"value\":5,\"recordedAt\":\"$NOW\"}" -o /dev/null
curl -s -b "$JAR" -X POST "$BASE/api/readings" -H "Content-Type: application/json" -d "{\"metric\":\"steps\",\"value\":3000,\"recordedAt\":\"$NOW\"}" -o /dev/null
curl -s -b "$JAR" "$BASE/api/vikriti/combined" | python3 -c "
import json,sys
d = json.load(sys.stdin)['latest']['breakdown']
w = d['wearable']
print('assumedCount:', w['assumedCount'], 'balance:', w['balanceScore'], 'strain:', w['contribution'])
print('calculation[1]:', d['calculation'][1])
assert w['assumedCount'] == 3  # heart_rate, spo2, active_calories have no readings
# sleep 5h -> 40, steps 3000 -> 12.5, stress 2 -> 75, quality 4 -> 75, rest assumed 100
bal = (20*40 + 15*100 + 10*100 + 15*100 + 15*12.5 + 15*75 + 10*75)/100
assert abs(w['balanceScore'] - bal) < 0.01, (w['balanceScore'], bal)
print('WEIGHTED BALANCE OK')
"

echo "== latest map =="
curl -s -b "$JAR" "$BASE/api/readings?days=30" | python3 -c "
import json,sys
d = json.load(sys.stdin)
latest = d['latest']
print('latest metrics:', sorted(latest.keys()))
for k in ['stress_level','sleep_quality','mood','sleep_duration','steps']:
    assert k in latest, k
    assert 'id' in latest[k], 'id missing'
print('LATEST OK')
"

echo "== recommendations (steps + doshaFocus present) =="
curl -s -b "$JAR" "$BASE/api/recommendations" | python3 -c "
import json,sys
d = json.load(sys.stdin)
shown = d['shown']
print('shown rules:', [(r['ruleId'], r['doshaFocus'], len(r['steps'])) for r in shown][:6])
assert all('steps' in r and len(r['steps']) > 0 for r in shown)
assert any(r['doshaFocus'] == 'vata' for r in shown)
print('RECOMMENDATIONS OK')
"
echo "ALL VERIFICATIONS PASSED"
