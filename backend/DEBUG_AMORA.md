# Amora Debugging Guide

## A) Triage Checklist

### Step 1: Check Network Tab in DevTools

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Filter by "coach" or "api"
4. Ask Amora a question
5. Look for the request to `/coach/`

**What to check:**
- **Request URL**: Should be `https://macthiq-ai-backend.onrender.com/api/v1/coach/`
- **Method**: Should be `POST`
- **Status Code**: 
  - ✅ `200` = Success
  - ❌ `400` = Bad request (check payload)
  - ❌ `500` = Server error (check backend logs)
  - ❌ `CORS error` = CORS issue
  - ❌ `Failed` = Network error
- **Request Payload**: Should have `mode: "LEARN"` and `specific_question: "your question"`
- **Response**: Should have `message` field with actual response

### Step 2: Distinguish Frontend vs Backend Response

**Backend response** (what you want):
```json
{
  "message": "Readiness for a committed relationship often involves...",
  "mode": "LEARN",
  "confidence": 0.8,
  "referenced_data": {...}
}
```

**Frontend fallback** (what you're getting):
- Message starts with "I'm here to help you explore relationship topics..."
- This comes from `getAIResponse()` local function
- Means backend call failed

### Step 3: Isolate tokenmint.global Errors

1. Open **Incognito window** (no extensions)
2. Test Amora there
3. If it works → extension issue
4. If same issue → not related

**These errors are unrelated** - they're from browser extensions trying to load external scripts.

### Step 4: Test Backend Directly

```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "LEARN",
    "specific_question": "Am I ready for a committed relationship?"
  }'
```

**Expected response:**
```json
{
  "message": "Readiness for a committed relationship often involves...",
  "mode": "LEARN",
  "confidence": 0.8,
  "referenced_data": {"question": "Am I ready for a committed relationship?"}
}
```

If this fails → backend issue
If this works → frontend issue

## B) Concrete Fixes

See code patches below.
