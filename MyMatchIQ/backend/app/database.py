"""
Database connection and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from sqlalchemy.exc import OperationalError
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Create engine with SSL support for Supabase
# Supabase requires SSL connections
def _get_connect_args():
    """Get connection arguments, adding SSL for Supabase if needed."""
    connect_args = {}
    if "supabase.co" in settings.DATABASE_URL:
        # Check if sslmode is already in URL
        if "sslmode" not in settings.DATABASE_URL:
            connect_args["sslmode"] = "require"
    return connect_args

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG,
    connect_args=_get_connect_args()
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Track if database is available
_db_available = None


def check_db_connection() -> bool:
    """Check if database connection is available."""
    global _db_available
    if _db_available is not None:
        return _db_available
    
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        _db_available = True
        return True
    except Exception as e:
        _db_available = False
        logger.warning(f"Database connection not available: {e}")
        return False


def init_db():
    """Initialize database tables. Fails gracefully if database is not available."""
    if not check_db_connection():
        logger.warning("Database not available. Skipping table initialization.")
        logger.info("Server will start, but database features will not work.")
        return False
    
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
        return True
    except OperationalError as e:
        logger.warning(f"Could not initialize database tables: {e}")
        logger.info("Server will start, but database features will not work.")
        return False
    except Exception as e:
        logger.error(f"Unexpected error initializing database: {e}")
        return False


def get_db() -> Session:
    """
    Dependency for getting database session.
    Yields a database session and closes it after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

