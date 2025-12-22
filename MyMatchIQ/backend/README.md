# MyMatchIQ Backend AI System

## 🚀 Quick Start

**Get started in 5 minutes** → See [QUICK_START.md](./QUICK_START.md)

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Complete architecture breakdown
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase configuration guide
- **[FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)** - Integration guide
- **[BACKEND_CONNECTIONS.md](./BACKEND_CONNECTIONS.md)** - Visual connection diagrams
- **[BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)** - Complete summary
- **[START_BACKEND.md](./START_BACKEND.md)** - Server startup instructions

## 🏗️ Architecture Overview

FastAPI-based REST API for relationship compatibility assessment with AI-powered insights and coaching.

- **Database**: Supabase (PostgreSQL)
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn ASGI
- **Port**: 8000 (default)

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration & settings
│   ├── database.py          # Database connection (Supabase)
│   ├── models/              # Data models (SQLAlchemy + Pydantic)
│   ├── api/                 # API endpoints (REST routes)
│   ├── services/            # Business logic (scoring, AI coach, etc.)
│   ├── analytics/           # Offline learning & calibration
│   ├── governance/          # Configuration governance
│   └── utils/               # Utilities (auth, validators)
├── requirements.txt         # Python dependencies
└── .env                     # Environment variables (create from .env.example)
```

## 🔧 Setup

### 1. Install Dependencies

```powershell
python -m pip install -r requirements.txt
```

### 2. Configure Supabase

1. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Copy `.env.example` to `.env`
3. Add your Supabase connection string to `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### 3. Start Server

```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the batch file:
```powershell
.\start_backend.bat
```

## ✅ Verify It Works

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

Or visit: [http://localhost:8000/docs](http://localhost:8000/docs) for API documentation

## 🔑 Key Features

1. **Deterministic Scoring**: Rule-based compatibility scoring
2. **Safety-First**: Red flag detection and safety pattern recognition
3. **Non-Directive AI**: Coach explains patterns, never prescribes actions
4. **Versioned Logic**: All results track AI version
5. **Confidence Gating**: Blocks classifications with insufficient data
6. **Tier Enforcement**: Free/Basic/Premium feature limits

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health and database status

### Assessments
- `POST /api/v1/assessments/` - Create and process assessment
- `GET /api/v1/assessments/{scan_id}/result` - Get scan result

### AI Coach
- `POST /api/v1/coach/` - Get AI Coach response

### Versions
- `GET /api/v1/versions` - Get logic version information

See `/docs` endpoint for full Swagger UI documentation.

## 🔐 Authentication

- **Production**: JWT tokens (Bearer token in Authorization header)
- **Development**: `X-User-Id` header for local testing

## 🗄️ Database

Uses **Supabase (PostgreSQL)** for data storage. Tables are automatically created on first startup.

Key tables:
- `users` - User accounts
- `blueprints` - User's ideal partner profiles
- `scans` - Assessment sessions
- `scan_results` - Assessment results
- `red_flags` - Detected safety concerns
- `pattern_knowledge_base` - Anonymized patterns
- `ai_logic_versions` - Logic version tracking

## 🔗 Frontend Integration

The React frontend connects via:
- **API Client**: `src/services/apiClient.ts` (centralized fetch wrapper)
- **AI Service**: `src/services/aiService.ts` (pass-through layer)

See [FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md) for details.

## 🐛 Troubleshooting

### Database Connection Failed
- Check `.env` file has correct Supabase connection string
- Verify Supabase project is active
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Port 8000 Already in Use
Change port: `--port 8001`

### Module Not Found
Install dependencies: `python -m pip install -r requirements.txt`

## 📝 Environment Variables

See `.env.example` for required configuration:
- `DATABASE_URL` - Supabase connection string
- `CORS_ORIGINS` - Allowed frontend URLs
- `SECRET_KEY` - JWT secret key
- `AI_VERSION` - AI logic version

## 🚀 Development

Run with auto-reload:
```powershell
python -m uvicorn app.main:app --reload
```

Run tests (when implemented):
```powershell
pytest
```

## 📞 Support

- Check server logs for detailed error messages
- Verify `.env` file configuration
- See documentation files listed above
- Check Supabase dashboard for database status

## 📄 License

Proprietary - MyMatchIQ
