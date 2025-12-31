from supabase import create_client, Client
from app.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Global Supabase client
_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """Get or create Supabase client instance."""
    global _supabase_client
    
    if _supabase_client is None:
        try:
            _supabase_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
            logger.info(f"Supabase client initialized for project: {settings.SUPABASE_PROJECT_ID}")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    
    return _supabase_client


def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations."""
    if not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY is required for admin operations")
    
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )


def init_db():
    """Initialize database connection."""
    try:
        client = get_supabase_client()
        # Test connection
        result = client.table("users").select("id").limit(1).execute()
        logger.info("Database connection successful")
        return True
    except Exception as e:
        logger.warning(f"Database initialization check failed (this is OK if tables don't exist yet): {e}")
        return False

