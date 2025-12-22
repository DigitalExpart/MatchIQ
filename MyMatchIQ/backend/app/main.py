"""
Main FastAPI application
"""
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from starlette.middleware.base import BaseHTTPMiddleware
import logging

from app.config import settings
from app.database import init_db
from app.api import assessments, coach, audit_review, versions
from app.services.scoring_config import get_scoring_config

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting MyMatchIQ Backend...")
    db_initialized = init_db()
    if not db_initialized:
        logger.warning("⚠️  Database not available. Server will start but database features are disabled.")
    else:
        logger.info("✅ Database initialized successfully.")
    yield
    # Shutdown
    logger.info("Shutting down MyMatchIQ Backend...")

app = FastAPI(
    title="MyMatchIQ AI Backend",
    description="Decision intelligence engine for relationship compatibility",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["assessments"])
app.include_router(coach.router, prefix="/api/v1/coach", tags=["coach"])
app.include_router(audit_review.router, prefix="/api/v1", tags=["audit"])
app.include_router(versions.router, prefix="/api/v1/versions", tags=["versions"])

@app.get("/health")
async def health_check():
    from app.database import check_db_connection
    db_status = check_db_connection()
    return {
        "status": "healthy",
        "version": "1.0.0",
        "ai_version": settings.AI_VERSION,
        "database": "connected" if db_status else "disconnected"
    }

@app.get("/")
async def root():
    return {
        "message": "MyMatchIQ AI Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

