# MyMatchIQ Backend

FastAPI backend for MyMatchIQ relationship compatibility assessment system.

## Features

- **Deterministic AI Scoring**: Rule-based compatibility scoring engine
- **Red Flag Detection**: Safety and deal-breaker detection
- **Dual Scan Support**: Mutual alignment calculations
- **AI Coach**: Template-based explanation generator
- **Supabase Integration**: PostgreSQL database with JSONB support

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Supabase Configuration
SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xvicydrqtddctywkvyge.supabase.co:5432/postgres

# AI Configuration
AI_VERSION=1.0.0

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
DEBUG=True
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration script: `migrations/001_create_tables.sql`
4. Verify tables were created in the **Table Editor**

### 4. Run the Server

```bash
# Development mode (with auto-reload)
python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## API Endpoints

### Assessments
- `POST /api/v1/assessments/` - Create new assessment
- `GET /api/v1/assessments/{scan_id}` - Get assessment
- `GET /api/v1/assessments/` - List user's assessments

### Blueprints
- `POST /api/v1/blueprints/` - Create blueprint (self-assessment)
- `GET /api/v1/blueprints/` - Get user's active blueprint
- `PUT /api/v1/blueprints/{blueprint_id}` - Update blueprint

### Results
- `GET /api/v1/results/{scan_id}` - Get scan result
- `GET /api/v1/results/` - List user's scan results

### AI Coach
- `POST /api/v1/coach/` - Get AI Coach response

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py             # Configuration settings
│   ├── database.py           # Supabase client
│   ├── models/
│   │   ├── pydantic_models.py  # Request/Response models
│   │   └── db_models.py        # Database models
│   ├── api/
│   │   ├── assessments.py     # Assessment endpoints
│   │   ├── blueprints.py     # Blueprint endpoints
│   │   ├── results.py        # Results endpoints
│   │   └── coach.py          # AI Coach endpoints
│   ├── services/
│   │   ├── scoring_engine.py    # Scoring logic
│   │   ├── red_flag_engine.py   # Red flag detection
│   │   ├── dual_scan_engine.py  # Dual scan logic
│   │   └── coach_service.py     # AI Coach service
│   └── utils/
│       └── validators.py     # Validation utilities
├── migrations/
│   └── 001_create_tables.sql # Database schema
├── requirements.txt
└── README.md
```

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest
```

### Code Style

This project follows PEP 8 style guidelines. Consider using:
- `black` for code formatting
- `flake8` for linting
- `mypy` for type checking

## Deployment

### Railway

1. Connect your GitHub repository
2. Select the `backend` branch
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Deploy

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_PROJECT_ID` | Supabase project ID | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AI_VERSION` | AI logic version | Yes |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `ENVIRONMENT` | Environment (development/production) | No |
| `DEBUG` | Enable debug mode | No |

## License

See main project LICENSE file.

