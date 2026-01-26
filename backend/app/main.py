from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

from app.config import settings
from app.database import init_db
from app.api import auth, assessments, blueprints, results, coach, coach_enhanced, coach_sessions, admin
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
    
    # Check Amora Blocks Service status
    try:
        from app.services.amora_blocks_service import AmoraBlocksService
        blocks_service = AmoraBlocksService()
        blocks_count = blocks_service.get_blocks_count()
        
        if blocks_count > 0:
            logger.info(f"Amora Blocks Service: Loaded {blocks_count} blocks with embeddings")
        else:
            logger.warning(f"Amora Blocks Service: NO BLOCKS FOUND! Will fall back to legacy templates.")
            logger.warning("    Run: python backend/scripts/compute_block_embeddings.py")
    except Exception as e:
        logger.error(f"Amora Blocks Service initialization failed: {e}")
        logger.error("    Falling back to legacy template system")
    
    yield
    
    # Shutdown
    logger.info("Shutting down MyMatchIQ Backend...")


app = FastAPI(
    title="MyMatchIQ AI Backend",
    description="Decision intelligence engine for relationship compatibility",
    version="2.0.0-blocks",
    lifespan=lifespan
)

# CORS - Configure to allow frontend origins including Vercel deployments
# Strip whitespace from origins and filter empty strings
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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

# Use Enhanced Amora (V1 Complete - semantic, emotionally intelligent)
# Comment out old coach router, use coach_enhanced
# app.include_router(coach.router, prefix="/api/v1/coach", tags=["coach"])
app.include_router(coach_enhanced.router, prefix="/api/v1", tags=["coach-enhanced"])
app.include_router(coach_sessions.router, prefix="/api/v1", tags=["coach-sessions"])

# Admin endpoints for maintenance (compute embeddings, etc.)
app.include_router(admin.router, prefix="/api/v1", tags=["admin"])


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
