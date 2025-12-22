# Backend Connections Diagram

## 🔗 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components                                               │  │
│  │  • ResultsScreen.tsx                                     │  │
│  │  • AICoachPanel.tsx                                      │  │
│  │  • AIInsightsPanel.tsx                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services Layer                                           │  │
│  │  • apiClient.ts (fetch wrapper)                          │  │
│  │  • aiService.ts (pass-through)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            │ HTTP Requests                      │
│                            │ (Authorization, Headers)           │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Layer (app/api/)                                    │  │
│  │  • assessments.py → POST /api/v1/assessments/           │  │
│  │  • coach.py → POST /api/v1/coach/                       │  │
│  │  • versions.py → GET /api/v1/versions                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication (app/utils/auth.py)                     │  │
│  │  • Extract user_id from JWT or X-User-Id                │  │
│  │  • Get user tier from database                          │  │
│  │  • Extract locale from Accept-Language header          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services Layer (app/services/)                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Scoring Engine                                   │  │  │
│  │  │ • scoring_logic.py (formulas)                   │  │  │
│  │  │ • scoring_engine.py (orchestration)            │  │  │
│  │  │ • scoring_config.py (config management)         │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Safety & Analysis                                │  │  │
│  │  │ • red_flag_engine.py (safety detection)         │  │  │
│  │  │ • dual_scan_engine.py (mutual alignment)        │  │  │
│  │  │ • confidence_gating.py (data sufficiency)      │  │  │
│  │  │ • risk_escalation.py (risk tracking)           │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ AI Coach                                         │  │  │
│  │  │ • coach_service.py (template-based responses)    │  │  │
│  │  │ • explanation_metadata.py (explanation gen)     │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Learning & Versioning                          │  │  │
│  │  │ • pattern_kb.py (anonymized patterns)         │  │  │
│  │  │ • version_registry.py (version tracking)       │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ Tier Enforcement                                │  │  │
│  │  │ • tier_capabilities.py (feature limits)        │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database Layer (app/database.py)                       │  │
│  │  • SQLAlchemy engine                                    │  │
│  │  • Session management                                   │  │
│  │  • Connection pooling                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            │ PostgreSQL (SSL)                   │
│                            ▼                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database Tables                                         │  │
│  │  • users                                                 │  │
│  │  • blueprints                                            │  │
│  │  • scans                                                 │  │
│  │  • scan_results                                          │  │
│  │  • red_flags                                             │  │
│  │  • pattern_knowledge_base                                │  │
│  │  • ai_logic_versions                                     │  │
│  │  • user_feedback                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Examples

### Example 1: Assessment Creation

```
Frontend (ResultsScreen.tsx)
    │
    │ aiService.runAssessment({ scan_id, answers, blueprint_id })
    │
    ▼
apiClient.post('/api/v1/assessments/', payload)
    │ Headers: Authorization, X-Client-Version, Accept-Language
    │
    ▼
Backend (assessments.py)
    │
    │ require_auth() → Extract user_id from token
    │ get_locale_from_header() → Extract locale
    │ get_current_user() → Fetch user tier from DB
    │
    ▼
ScoringEngine.process_assessment()
    │
    ├─→ scoring_logic.py → Calculate scores
    ├─→ red_flag_engine.py → Detect safety issues
    ├─→ confidence_gating.py → Check data sufficiency
    └─→ scoring_config.py → Apply thresholds
    │
    ▼
TierEnforcement.enforce_assessment_response()
    │ Apply tier limits (Free/Basic/Premium)
    │
    ▼
Store in Database (Supabase)
    │ INSERT INTO scan_results (...)
    │
    ▼
Return Response
    │ { scan_id, overall_score, category, insights, red_flags, logic_version }
    │
    ▼
Frontend displays results
```

### Example 2: AI Coach Question

```
Frontend (AICoachPanel.tsx)
    │
    │ aiService.getCoachResponse({ scan_id, mode, question })
    │
    ▼
apiClient.post('/api/v1/coach/', context)
    │ Headers: Authorization, X-Client-Version, Accept-Language
    │
    ▼
Backend (coach.py)
    │
    │ require_auth() → Extract user_id
    │ get_locale_from_header() → Extract locale
    │ get_current_user() → Fetch user tier
    │ get_scan_result() → Load assessment from DB
    │
    ▼
CoachService.get_response()
    │
    ├─→ Determine mode (EXPLAIN, REFLECT, LEARN, SAFETY)
    ├─→ Load scan result data
    ├─→ Generate template-based response
    └─→ Validate non-directive language
    │
    ▼
TierEnforcement.enforce_coach_response()
    │ Apply tier limits
    │
    ▼
Return Response
    │ { response, mode, logic_version }
    │
    ▼
Frontend displays coach response
```

---

## 🔐 Authentication Flow

### Production (JWT)

```
1. User logs in → Supabase Auth
   │
   ▼
2. Supabase returns JWT token
   │
   ▼
3. Frontend stores token (localStorage)
   │
   ▼
4. apiClient.getAuthToken() retrieves token
   │
   ▼
5. apiClient adds header: Authorization: Bearer <token>
   │
   ▼
6. Backend validates token → Extracts user_id
   │
   ▼
7. Backend fetches user from database → Gets tier
   │
   ▼
8. Request proceeds with user context
```

### Development (X-User-Id)

```
1. Frontend sets: localStorage.setItem('myMatchIQ_currentUserId', userId)
   │
   ▼
2. apiClient checks: No token? Use X-User-Id header
   │
   ▼
3. apiClient adds header: X-User-Id: <userId>
   │
   ▼
4. Backend extracts user_id from X-User-Id header
   │
   ▼
5. Backend fetches user from database → Gets tier
   │
   ▼
6. Request proceeds with user context
```

---

## 🗄️ Database Connection (Supabase)

```
Backend (app/database.py)
    │
    │ create_engine(DATABASE_URL, sslmode=require)
    │
    ▼
Supabase PostgreSQL
    │
    │ Connection String:
    │ postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
    │
    ▼
SSL Connection Established
    │
    ▼
Tables Created/Queried
    │
    ├─→ users
    ├─→ blueprints
    ├─→ scans
    ├─→ scan_results
    ├─→ red_flags
    ├─→ pattern_knowledge_base
    ├─→ ai_logic_versions
    └─→ user_feedback
```

---

## 🔄 Request/Response Cycle

```
┌─────────────┐
│   Frontend  │
│  Component  │
└──────┬──────┘
       │
       │ 1. User Action
       ▼
┌─────────────┐
│ aiService   │
│ (pass-thru) │
└──────┬──────┘
       │
       │ 2. API Call
       ▼
┌─────────────┐
│ apiClient   │
│ (wrapper)   │
└──────┬──────┘
       │
       │ 3. HTTP Request
       │    + Auth Headers
       │    + Client Version
       │    + Locale
       ▼
┌─────────────┐
│   Backend   │
│   FastAPI   │
└──────┬──────┘
       │
       │ 4. Authenticate
       ▼
┌─────────────┐
│   Auth      │
│  Extract    │
│  user_id    │
└──────┬──────┘
       │
       │ 5. Process Request
       ▼
┌─────────────┐
│  Services   │
│  Business   │
│   Logic     │
└──────┬──────┘
       │
       │ 6. Database Query
       ▼
┌─────────────┐
│  Supabase   │
│ PostgreSQL  │
└──────┬──────┘
       │
       │ 7. Return Data
       ▼
┌─────────────┐
│   Backend   │
│  Response   │
└──────┬──────┘
       │
       │ 8. HTTP Response
       │    + Status Code
       │    + JSON Body
       │    + Logic Version
       ▼
┌─────────────┐
│ apiClient   │
│ (handles)   │
└──────┬──────┘
       │
       │ 9. Parse Response
       ▼
┌─────────────┐
│ aiService   │
│ (returns)   │
└──────┬──────┘
       │
       │ 10. Update UI
       ▼
┌─────────────┐
│   Frontend  │
│  Component  │
│  Displays   │
└─────────────┘
```

---

## 🎯 Key Integration Points

### 1. Frontend → Backend
- **URL**: `VITE_API_BASE_URL` (default: `http://localhost:8000/api/v1`)
- **Auth**: JWT token or `X-User-Id` header
- **Headers**: `X-Client-Version`, `Accept-Language`

### 2. Backend → Database
- **URL**: `DATABASE_URL` (Supabase connection string)
- **SSL**: Required for Supabase
- **Pooling**: Connection pooling enabled

### 3. Backend → Services
- **Direct imports**: Services imported and called directly
- **No HTTP**: Internal function calls only
- **Synchronous**: All processing is synchronous

---

## 📝 Configuration Files

### Frontend
- `.env`: `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- `src/utils/apiConfig.ts`: API configuration

### Backend
- `.env`: `DATABASE_URL=postgresql://...`
- `app/config.py`: Settings loaded from `.env`

---

## ✅ Connection Checklist

- [ ] Frontend `.env` configured with backend URL
- [ ] Backend `.env` configured with Supabase connection string
- [ ] Backend server running on port 8000
- [ ] Supabase project active and accessible
- [ ] CORS configured in backend (frontend URL allowed)
- [ ] Authentication working (JWT or X-User-Id)
- [ ] Database tables created
- [ ] Health check passes (`GET /health`)

