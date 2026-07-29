#!/usr/bin/env bash
# Probe catalogentry-setup payload variants on gbs-qa.
# Usage: export TOKEN='your-jwt-without-Bearer-prefix' && ./scripts/probe-catalogentry-setup.sh

set -euo pipefail

BASE="${BASE:-https://gbs-qa.trutesta.io/trutesta-hccl-services}"
CATALOG_ID="${CATALOG_ID:-085f99b0-5f6c-4c71-b19c-78ac07dc2b99}"
TENANT_ID="${TENANT_ID:-71a267d2-7a08-11e7-bb31-be2e44b06b34}"
USER_PROFILE_ID="${USER_PROFILE_ID:-0e6fb9e5-bc98-4f0f-9e6d-94e18753c021}"
MAX_TIME="${MAX_TIME:-120}"

if [ -z "${TOKEN:-}" ]; then
  echo "ERROR: Set TOKEN to a fresh JWT from the browser Network tab."
  echo "  export TOKEN='eyJ...'"
  exit 1
fi

HDR=(
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $TOKEN"
  -H "x-tenantid: $TENANT_ID"
  -H "x-userprofileid: $USER_PROFILE_ID"
)

probe_setup() {
  local label="$1"
  local body="$2"
  local out
  out=$(mktemp)
  local code time size
  read -r code time size < <(
    curl -sS -o "$out" -w "%{http_code} %{time_total} %{size_download}" \
      --max-time "$MAX_TIME" -X POST \
      "${BASE}/hccl/onboard/onboard/catalogentry-setup" \
      "${HDR[@]}" -d "$body" 2>/dev/null || echo "000 0 0"
  )
  local snippet
  snippet=$(head -c 120 "$out" | tr '\n' ' ' | tr -cd '[:print:] ')
  rm -f "$out"
  printf "%-42s HTTP %-3s  %6.2fs  %5sB  | %s\n" "$label" "$code" "$time" "$size" "$snippet"
}

probe_get() {
  local label="$1"
  local path="$2"
  local out
  out=$(mktemp)
  local code time size
  read -r code time size < <(
    curl -sS -o "$out" -w "%{http_code} %{time_total} %{size_download}" \
      --max-time "$MAX_TIME" -X GET \
      "${BASE}${path}?userProfileId=${USER_PROFILE_ID}" \
      "${HDR[@]}" 2>/dev/null || echo "000 0 0"
  )
  local snippet
  snippet=$(head -c 120 "$out" | tr '\n' ' ' | tr -cd '[:print:] ')
  rm -f "$out"
  printf "%-42s HTTP %-3s  %6.2fs  %5sB  | %s\n" "$label" "$code" "$time" "$size" "$snippet"
}

echo "catalogentry-setup probes (authenticated)"
echo "BASE=$BASE  catalogId=$CATALOG_ID"
echo

code=$(curl -sS -o /dev/null -w "%{http_code} %{time_total}" --max-time 30 -X POST \
  "${BASE}/hccl/catalog/catalog/query" "${HDR[@]}" -d '{"pageNumber":1,"pageSize":1,"isPaging":true}')
printf "%-42s HTTP %-3s  %6.2fs\n" "control: catalog/query" "${code% *}" "${code#* }"

probe_get "control: tixui/get-context (GET)" "/hccl/tixui/get-context"

echo "--- setup payloads (backend AI path when catalogId + (url OR notes)) ---"
probe_setup "1. catalogId only" "{\"catalogId\":\"$CATALOG_ID\"}"
probe_setup "2. catalogId + empty url/notes" "{\"catalogId\":\"$CATALOG_ID\",\"url\":\"\",\"notes\":\"\"}"
probe_setup "3. notes only" "{\"catalogId\":\"$CATALOG_ID\",\"notes\":\"Automation Technician job in Haverhill MA.\"}"
probe_setup "4. url only (example.com)" "{\"catalogId\":\"$CATALOG_ID\",\"url\":\"https://example.com/job\"}"
probe_setup "5. url only (indeed)" "{\"catalogId\":\"$CATALOG_ID\",\"url\":\"https://www.indeed.com/viewjob?jk=f6f731bd5c9115ff\"}"
probe_setup "6. url + notes (full)" "{\"catalogId\":\"$CATALOG_ID\",\"url\":\"https://www.indeed.com/viewjob?jk=f6f731bd5c9115ff\",\"notes\":\"Youth Fit: Possible. Pay 28-40/hr.\"}"
probe_setup "7. no catalogId" "{\"url\":\"https://example.com\",\"notes\":\"probe\"}"

echo
echo "Interpretation:"
echo "  - If #1 is 200 but #3-#6 are 502 -> AI/scrape path"
echo "  - If all are 502 but catalog/query is 206 -> whole setup route broken"
echo "  - If all ~9s + 502 -> gateway timeout on this route"
