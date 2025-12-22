# MatchIQ - Relationship Compatibility Assessment Platform

A comprehensive platform for assessing relationship compatibility with AI-powered insights and coaching.

## 🏗️ Repository Structure

This repository is organized into separate branches for different components:

### Branches

- **`main`** - Main repository with documentation and overview
- **`frontend`** - React (Vite + TypeScript) frontend application
- **`backend`** - FastAPI (Python) backend API server
- **`ai-frontend`** - AI-specific frontend components and features
- **`ai-backend`** - AI-specific backend services and logic

## 📁 Project Structure

```
MatchIQ/
├── MyMatchIQ/
│   ├── src/              # Frontend React application
│   ├── backend/          # Backend FastAPI application
│   └── backend_ai_design/ # AI design documentation
└── README.md             # This file
```

## 🚀 Quick Start

### Frontend Setup

```bash
# Switch to frontend branch
git checkout frontend

# Navigate to frontend directory
cd MyMatchIQ

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Switch to backend branch
git checkout backend

# Navigate to backend directory
cd MyMatchIQ/backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Copy .env.example to .env and add your Supabase connection string

# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Technology Stack

### Frontend
- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **FastAPI** (Python 3.10+)
- **PostgreSQL** via **Supabase**
- **SQLAlchemy** for ORM
- **Pydantic** for data validation

## 📚 Documentation

### Frontend Documentation
- See `MyMatchIQ/README.md` for frontend-specific documentation
- Component documentation in `MyMatchIQ/src/components/`

### Backend Documentation
- See `MyMatchIQ/backend/README.md` for backend setup
- API documentation available at `http://localhost:8000/docs` when server is running
- Architecture details in `MyMatchIQ/backend/BACKEND_ARCHITECTURE.md`

### AI Components
- AI Frontend: See `ai-frontend` branch
- AI Backend: See `ai-backend` branch
- AI Design: See `MyMatchIQ/backend_ai_design/` directory

## 🔐 Environment Setup

### Frontend Environment Variables
Create `.env` in `MyMatchIQ/`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ENV=local
```

### Backend Environment Variables
Create `.env` in `MyMatchIQ/backend/`:
```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
AI_VERSION=1.0.0
```

See `MyMatchIQ/backend/CONNECT_SUPABASE.md` for Supabase setup instructions.

## 🌐 API Endpoints

When backend is running, API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Key Endpoints
- `POST /api/v1/assessments/` - Create and process assessment
- `GET /api/v1/assessments/{scan_id}/result` - Get scan result
- `POST /api/v1/coach/` - Get AI Coach response
- `GET /api/v1/versions` - Get logic version information

## 🧪 Testing

### Frontend Tests
```bash
cd MyMatchIQ
npm test
```

### Backend Tests
```bash
cd MyMatchIQ/backend
pytest
```

## 📦 Deployment

### Frontend Deployment
Build for production:
```bash
cd MyMatchIQ
npm run build
```

Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
Deploy to your preferred Python hosting service (Railway, Render, Heroku, etc.)

Ensure environment variables are configured in your hosting platform.

## 🤝 Contributing

1. Create a feature branch from the appropriate branch (`frontend`, `backend`, `ai-frontend`, or `ai-backend`)
2. Make your changes
3. Commit and push to your branch
4. Create a pull request

## 📄 License

Proprietary - MatchIQ

## 🔗 Links

- **GitHub Repository**: https://github.com/DigitalExpart/MatchIQ
- **Frontend Branch**: `frontend`
- **Backend Branch**: `backend`
- **AI Frontend Branch**: `ai-frontend`
- **AI Backend Branch**: `ai-backend`

## 📞 Support

For issues or questions, please check the documentation in each branch or create an issue in the repository.
