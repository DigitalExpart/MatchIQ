# Frontend-Backend Integration Guide

## 🔗 How Frontend Connects to Backend

### Overview

The React frontend (Vite + TypeScript) communicates with the FastAPI backend through a centralized API client layer.

---

## 📁 Frontend Architecture

```
MyMatchIQ/src/
├── services/
│   ├── apiClient.ts      # Centralized API client (fetch wrapper)
│   └── aiService.ts      # AI service layer (pass-through to backend)
├── utils/
│   └── apiConfig.ts      # API configuration (base URL, environment)
└── components/
    ├── screens/
    │   └── ResultsScreen.tsx    # Uses aiService for assessments
    └── ai/
        ├── AICoachPanel.tsx     # Uses aiService for coach
        └── AIInsightsPanel.tsx  # Uses aiService for insights
```

---

## 🔄 Request Flow

### 1. Assessment Creation Flow

```
User completes assessment
    ↓
ResultsScreen.tsx
    ↓
aiService.runAssessment(payload)
    ↓
apiClient.post('/api/v1/assessments/', payload)
    ↓
Backend: POST /api/v1/assessments/
    ↓
ScoringEngine.process_assessment()
    ↓
Returns: { scores, insights, red_flags, logic_version }
    ↓
Frontend displays results
```

### 2. AI Coach Flow

```
User asks coach question
    ↓
AICoachPanel.tsx
    ↓
aiService.getCoachResponse(context)
    ↓
apiClient.post('/api/v1/coach/', context)
    ↓
Backend: POST /api/v1/coach/
    ↓
CoachService.get_response()
    ↓
Returns: { response, mode, logic_version }
    ↓
Frontend displays coach response
```

---

## 🔧 API Client (`apiClient.ts`)

### Responsibilities

1. **Centralized Fetch Wrapper**
   - All API calls go through `apiClient`
   - Consistent error handling
   - Request/response logging

2. **Authentication**
   - Injects JWT token: `Authorization: Bearer <token>`
   - Dev mode: Uses `X-User-Id` header if no token

3. **Headers**
   - `X-Client-Version`: Frontend version
   - `Accept-Language`: User locale
   - `Content-Type`: application/json

4. **Error Handling**
   - 401: Unauthorized → Redirect to login
   - 403: Forbidden → Show error message
   - 429: Rate limited → Retry with backoff
   - 500: Server error → Show fallback message

5. **Connection Safety**
   - Timeout: 30 seconds
   - Retry: 3 attempts (read-only requests)
   - Debouncing: Prevents duplicate requests
   - Abort controllers: Cancels on navigation

---

## 🎯 AI Service Layer (`aiService.ts`)

### Purpose

**Pass-through layer only** - No business logic, no fallbacks, no local scoring.

### Functions

#### `runAssessment(payload)`
- Calls: `POST /api/v1/assessments/`
- Returns: Assessment result with scores, insights, flags

#### `getCoachResponse(context)`
- Calls: `POST /api/v1/coach/`
- Returns: Coach response with explanation

#### `getScanResult(scanId)`
- Calls: `GET /api/v1/assessments/{scanId}/result`
- Returns: Stored assessment result

#### `getVersionInfo()`
- Calls: `GET /api/v1/versions`
- Returns: Logic version information

---

## 🔐 Authentication Flow

### Production (JWT)

```
1. User logs in → Supabase Auth
2. Supabase returns JWT token
3. Frontend stores token (localStorage/sessionStorage)
4. apiClient.getAuthToken() retrieves token
5. apiClient injects: Authorization: Bearer <token>
6. Backend validates token → Extracts user_id
```

### Development (X-User-Id)

```
1. Frontend sets: localStorage.setItem('myMatchIQ_currentUserId', userId)
2. apiClient checks: No token? Use X-User-Id header
3. Backend extracts user_id from X-User-Id header
4. Works without full auth setup
```

---

## 📊 Data Flow Examples

### Example 1: Creating Assessment

**Frontend Request:**
```typescript
const result = await aiService.runAssessment({
  scan_id: "123e4567-e89b-12d3-a456-426614174000",
  answers: [
    { question_id: "q1", rating: 5 },
    { question_id: "q2", rating: 3 },
    // ...
  ],
  blueprint_id: "blueprint-uuid"
});
```

**Backend Processing:**
```python
# assessments.py
@router.post("/")
async def create_assessment(
    payload: AssessmentRequest,
    user_id: UUID = Depends(require_auth),
    locale: str = Depends(get_locale_from_header)
):
    # 1. Get user tier
    user = get_current_user(user_id)
    user_tier = user.subscription_tier
    
    # 2. Process assessment
    engine = ScoringEngine()
    result = engine.process_assessment(payload)
    
    # 3. Apply tier enforcement
    tier_enforcement = TierEnforcement()
    result = tier_enforcement.enforce_assessment_response(result, user_tier)
    
    # 4. Store in database
    db_result = store_scan_result(result, user_id)
    
    # 5. Return response
    return AssessmentResponse(
        scan_id=db_result.id,
        overall_score=result.overall_score,
        category=result.category,
        insights=result.insights,
        red_flags=result.red_flags,
        logic_version=result.logic_version
    )
```

**Frontend Response:**
```typescript
{
  scan_id: "123e4567-e89b-12d3-a456-426614174000",
  overall_score: 75,
  category: "worth-exploring",
  insights: [...],
  red_flags: [...],
  logic_version: "1.0.0"
}
```

---

### Example 2: AI Coach Question

**Frontend Request:**
```typescript
const response = await aiService.getCoachResponse({
  scan_id: "123e4567-e89b-12d3-a456-426614174000",
  mode: "EXPLAIN",
  question: "Why is my compatibility score 75?"
});
```

**Backend Processing:**
```python
# coach.py
@router.post("/")
async def get_coach_response(
    context: CoachRequest,
    user_id: UUID = Depends(require_auth),
    locale: str = Depends(get_locale_from_header)
):
    # 1. Get user tier
    user = get_current_user(user_id)
    user_tier = user.subscription_tier
    
    # 2. Get scan result
    scan_result = get_scan_result(context.scan_id, user_id)
    
    # 3. Generate coach response
    coach = CoachService()
    response = coach.get_response(
        mode=context.mode,
        scan_result=scan_result,
        question=context.question,
        locale=locale
    )
    
    # 4. Apply tier enforcement
    tier_enforcement = TierEnforcement()
    response = tier_enforcement.enforce_coach_response(response, user_tier)
    
    # 5. Return response
    return CoachResponse(
        response=response.text,
        mode=response.mode,
        logic_version=response.logic_version
    )
```

**Frontend Response:**
```typescript
{
  response: "Your compatibility score of 75 reflects...",
  mode: "EXPLAIN",
  logic_version: "1.0.0"
}
```

---

## 🛡️ Error Handling

### Frontend Error States

```typescript
// Loading state
{ isLoading: true } → Show skeleton loader

// Error state
{ error: "Network error" } → Show error message + retry button

// Empty state
{ data: null } → Show "No data available" message

// Fallback
Backend unavailable → Show "AI features temporarily unavailable"
```

### Backend Error Responses

```json
// 400 Bad Request
{
  "error": "VALIDATION_ERROR",
  "details": {
    "field": "answers",
    "message": "At least 10 answers required"
  }
}

// 401 Unauthorized
{
  "error": "UNAUTHORIZED",
  "details": "Invalid or expired token"
}

// 403 Forbidden
{
  "error": "TIER_LIMIT_EXCEEDED",
  "details": "Upgrade to Premium for this feature"
}

// 500 Server Error
{
  "error": "INTERNAL_ERROR",
  "details": "An unexpected error occurred"
}
```

---

## 🔄 State Management

### Frontend State

```typescript
// ResultsScreen.tsx
const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
const [isLoadingAI, setIsLoadingAI] = useState(false);
const [error, setError] = useState<string | null>(null);

// On mount or scan completion
useEffect(() => {
  if (scanId) {
    loadAssessmentResult(scanId);
  }
}, [scanId]);

const loadAssessmentResult = async (id: string) => {
  setIsLoadingAI(true);
  setError(null);
  try {
    const result = await aiService.getScanResult(id);
    setAssessmentResult(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoadingAI(false);
  }
};
```

---

## 🧪 Testing the Integration

### 1. Start Backend

```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
python -m uvicorn app.main:app --reload
```

### 2. Start Frontend

```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ"
npm run dev
```

### 3. Test API Connection

```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing

# Should return:
# {
#   "status": "healthy",
#   "version": "1.0.0",
#   "database": "connected"
# }
```

### 4. Test from Frontend

1. Open browser: `http://localhost:5173`
2. Complete an assessment
3. Check browser console for API calls
4. Verify results display correctly

---

## 🔍 Debugging

### Frontend Debugging

```typescript
// Enable API logging
localStorage.setItem('debug_api', 'true');

// Check API calls in Network tab
// Look for:
// - Request headers (Authorization, X-Client-Version)
// - Response status codes
// - Response body structure
```

### Backend Debugging

```python
# Enable debug logging
# In .env:
DEBUG=True
LOG_LEVEL=DEBUG

# Check server logs for:
# - Incoming requests
# - Database queries
# - Error stack traces
```

### Common Issues

1. **CORS Error**
   - Check `CORS_ORIGINS` in backend `.env`
   - Add frontend URL to allowed origins

2. **401 Unauthorized**
   - Check if token is being sent
   - Verify token is valid
   - Check `X-User-Id` header in dev mode

3. **500 Server Error**
   - Check backend logs
   - Verify database connection
   - Check request payload format

---

## 📝 Environment Variables

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`.env`)

```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## ✅ Integration Checklist

- [x] API client created (`apiClient.ts`)
- [x] AI service layer created (`aiService.ts`)
- [x] Frontend components wired to services
- [x] Authentication headers configured
- [x] Error handling implemented
- [x] Loading states added
- [x] Empty states added
- [x] Backend endpoints configured
- [x] CORS configured
- [x] Environment variables set

---

## 🚀 Next Steps

1. **Set up Supabase project** (see `SUPABASE_SETUP.md`)
2. **Configure `.env` files** (frontend + backend)
3. **Test assessment creation** end-to-end
4. **Test AI Coach** end-to-end
5. **Add error monitoring** (Sentry, etc.)
6. **Add request logging** for debugging


