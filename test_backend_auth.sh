#!/bin/bash
# Test script to verify backend accepts X-User-Id header
# Usage: ./test_backend_auth.sh YOUR_USER_ID_HERE

USER_ID="${1:-00000000-0000-0000-0000-000000000001}"

echo "Testing backend authentication with X-User-Id header..."
echo "User ID: $USER_ID"
echo ""

echo "=== Testing GET /api/v1/coach/sessions ==="
curl -i \
  -H "X-User-Id: $USER_ID" \
  -H "Content-Type: application/json" \
  https://macthiq-ai-backend.onrender.com/api/v1/coach/sessions

echo ""
echo ""
echo "=== Testing POST /api/v1/coach/sessions ==="
curl -i \
  -X POST \
  -H "X-User-Id: $USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Session","primary_topic":"heartbreak"}' \
  https://macthiq-ai-backend.onrender.com/api/v1/coach/sessions

echo ""
echo ""
echo "=== Testing GET /api/v1/coach/sessions/followups/due ==="
curl -i \
  -H "X-User-Id: $USER_ID" \
  -H "Content-Type: application/json" \
  https://macthiq-ai-backend.onrender.com/api/v1/coach/sessions/followups/due
