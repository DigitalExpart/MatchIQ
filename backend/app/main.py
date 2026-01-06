from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

from app.config import settings
from app.database import init_db
from app.api import auth, assessments, blueprints, results, coach
from app.models.pydantic_models import HealthResponse

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown."""
    # Startup
    logger.info("Starting MyMatchIQ Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"AI Version: {settings.AI_VERSION}")
    
    db_status = init_db()
    if db_status:
        logger.info("Database connection successful")
    else:
        logger.warning("Database connection check failed - tables may not exist yet")
    
    yield
    
    # Shutdown
    logger.info("Shutting down MyMatchIQ Backend...")


app = FastAPI(
    title="MyMatchIQ AI Backend",
    description="Decision intelligence engine for relationship compatibility",
    version="1.0.0",
    lifespan=lifespan
)

# CORS - Configure to allow frontend origins including Vercel deployments
# Strip whitespace from origins and filter empty strings
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview deployments
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["assessments"])
app.include_router(blueprints.router, prefix="/api/v1/blueprints", tags=["blueprints"])
app.include_router(results.router, prefix="/api/v1/results", tags=["results"])
app.include_router(coach.router, prefix="/api/v1/coach", tags=["coach"])


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    try:
        from app.database import get_supabase_client
        supabase = get_supabase_client()
        # Try a simple query
        supabase.table("users").select("id").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        db_status = "disconnected"
    
    return HealthResponse(
        status="healthy",
        version=settings.AI_VERSION,
        database=db_status
    )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "MyMatchIQ AI Backend",
        "version": settings.AI_VERSION,
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )

