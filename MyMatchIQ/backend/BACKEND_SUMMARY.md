# MyMatchIQ Backend - Complete Summary

## 📋 Overview

**FastAPI-based REST API** for relationship compatibility assessment with AI-powered insights and coaching.

- **Database**: Supabase (PostgreSQL)
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn ASGI
- **Port**: 8000 (default)

---

## 🏗️ Architecture Layers

### 1. **API Layer** (`app/api/`)
REST endpoints that handle HTTP requests/responses.

| File | Endpoints | Purpose |
|------|-----------|---------|
| `assessments.py` | `POST /api/v1/assessments/`<br>`GET /api/v1/assessments/{id}/result` | Create & retrieve assessments |
| `coach.py` | `POST /api/v1/coach/` | AI Coach responses |
| `audit_review.py` | Audit endpoints | Review & audit functionality |
| `versions.py` | `GET /api/v1/versions` | Version information |

### 2. **Services Layer** (`app/services/`)
Business logic - all AI scoring, analysis, and coaching.

| Service | Purpose |
|---------|---------|
| `scoring_logic.py` | Core scoring formulas (pure functions) |
| `scoring_engine.py` | Main scoring orchestration |
| `scoring_config.py` | Configuration management |
| `red_flag_engine.py` | Safety pattern detection |
| `dual_scan_engine.py` | Mutual alignment calculations |
| `coach_service.py` | AI Coach (Ella) - template-based responses |
| `confidence_gating.py` | Data sufficiency checks |
| `risk_escalation.py` | Risk tracking & escalation |
| `pattern_kb.py` | Anonymized pattern storage |
| `version_registry.py` | Logic versioning system |
| `tier_capabilities.py` | Subscription tier features |

### 3. **Models Layer** (`app/models/`)
Data structures and validation.

| File | Purpose |
|------|---------|
| `db_models.py` | SQLAlchemy ORM models (database tables) |
| `pydantic_models.py` | Request/Response validation models |

### 4. **Database Layer** (`app/database.py`)
Connection management and session handling.

- SQLAlchemy engine with Supabase SSL support
- Connection pooling
- Graceful error handling (works without DB)

### 5. **Utilities** (`app/utils/`)
Helper functions.

| File | Purpose |
|------|---------|
| `auth.py` | Authentication helpers (JWT, X-User-Id) |
| `validators.py` | Input validation |

---

## 🔄 Key Workflows

### Assessment Creation
```
1. User submits answers → POST /api/v1/assessments/
2. Extract user_id from auth token
3. Calculate blueprint profile
4. Calculate category scores
5. Calculate overall score
6. Detect red flags
7. Apply confidence gating
8. Classify category (high-potential, worth-exploring, etc.)
9. Generate insights
10. Store in database
11. Return result with scores, flags, insights
```

### AI Coach Response
```
1. User asks question → POST /api/v1/coach/
2. Extract user_id and locale
3. Load scan result
4. Determine coach mode (EXPLAIN, REFLECT, LEARN, SAFETY)
5. Generate template-based response
6. Validate non-directive language
7. Apply tier enforcement
8. Return coach response
```

---

## 🗄️ Database Schema (Supabase)

### Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts and profiles |
| `blueprints` | User's ideal partner profiles |
| `scans` | Assessment sessions |
| `scan_results` | Assessment results with scores |
| `red_flags` | Detected safety concerns |
| `pattern_knowledge_base` | Anonymized patterns for learning |
| `ai_logic_versions` | Logic version tracking |
| `user_feedback` | User feedback on results |

---

## 🔐 Authentication

### Production (JWT)
- Bearer token in `Authorization` header
- Token validated → user_id extracted
- User tier fetched from database

### Development (X-User-Id)
- `X-User-Id` header for local testing
- No full auth setup required
- User ID passed directly

---

## 📊 Key Features

1. **Deterministic Scoring**
   - Same inputs = same outputs
   - Rule-based calculations
   - No randomness

2. **Safety-First**
   - Red flag detection
   - Safety pattern recognition
   - Appropriate escalation

3. **Non-Directive AI**
   - Coach explains patterns
   - Never prescribes actions
   - Template-based responses

4. **Versioned Logic**
   - All results track AI version
   - Config changes versioned
   - Human approval required

5. **Confidence Gating**
   - Blocks classifications with insufficient data
   - Minimum answer requirements
   - Category coverage checks

6. **Tier Enforcement**
   - Free/Basic/Premium tiers
   - Feature limits per tier
   - Graceful degradation

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Supabase Database
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres

# AI Version
AI_VERSION=1.0.0

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=False
LOG_LEVEL=INFO
```

---

## 🚀 Running the Server

### Development
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📡 API Endpoints

### Health Check
```
GET /health
Response: { status, version, database_status }
```

### Assessments
```
POST /api/v1/assessments/
Body: { scan_id, answers[], blueprint_id }
Response: { scan_id, overall_score, category, insights[], red_flags[], logic_version }

GET /api/v1/assessments/{scan_id}/result
Response: { scan_id, overall_score, category, insights[], red_flags[], logic_version }
```

### AI Coach
```
POST /api/v1/coach/
Body: { scan_id, mode, question }
Response: { response, mode, logic_version }
```

### Versions
```
GET /api/v1/versions
Response: { versions[], active_version }
```

---

## 🔗 Frontend Integration

### API Client
- Centralized fetch wrapper (`src/services/apiClient.ts`)
- Authentication injection
- Error handling
- Retry logic
- Debouncing

### AI Service
- Pass-through layer (`src/services/aiService.ts`)
- No business logic
- Calls backend endpoints
- Returns typed responses

### Components
- `ResultsScreen.tsx` → Uses `aiService.runAssessment()`
- `AICoachPanel.tsx` → Uses `aiService.getCoachResponse()`
- `AIInsightsPanel.tsx` → Uses `aiService.getScanResult()`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `BACKEND_ARCHITECTURE.md` | Complete architecture breakdown |
| `SUPABASE_SETUP.md` | Supabase configuration guide |
| `FRONTEND_BACKEND_INTEGRATION.md` | Integration guide |
| `QUICK_START.md` | 5-minute setup guide |
| `START_BACKEND.md` | Server startup instructions |

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] Database connection string configured
- [ ] `.env` file created and configured
- [ ] Dependencies installed (`requirements.txt`)
- [ ] Backend server running
- [ ] Health check passes
- [ ] Frontend configured with API base URL
- [ ] CORS origins configured
- [ ] Authentication working (JWT or X-User-Id)

---

## 🐛 Common Issues

### Database Connection Failed
- Check connection string format
- Verify password is correct
- Ensure Supabase project is active

### CORS Errors
- Add frontend URL to `CORS_ORIGINS`
- Check backend logs for blocked origins

### 401 Unauthorized
- Verify token is being sent
- Check `X-User-Id` header in dev mode
- Validate token format

### 500 Server Error
- Check backend logs
- Verify database connection
- Check request payload format

---

## 🎯 Next Steps

1. **Set up Supabase** → Follow `SUPABASE_SETUP.md`
2. **Configure environment** → Set up `.env` file
3. **Start backend** → Run server
4. **Test integration** → Verify frontend connects
5. **Deploy** → Set up production environment

---

## 📞 Support Resources

- **Backend Logs**: Check server console output
- **API Docs**: Visit `/docs` when server is running
- **Supabase Dashboard**: Monitor database usage
- **Health Endpoint**: `GET /health` for status check

