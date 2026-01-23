"""Application configuration."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # Environment
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://localhost:5432/matchiq"
    
    # Supabase
    SUPABASE_PROJECT_ID: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str = ""  # Optional, for admin operations
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-please-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # AI Version
    AI_VERSION: str = "2.0.0"
    
    # Amora V2 - LLM Configuration
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Feature Flags
    AMORA_V2_ENABLED: bool = False
    AMORA_V2_ROLLOUT_PERCENTAGE: int = 0
    
    # Rate Limiting
    FREE_USER_MESSAGE_LIMIT: int = 10
    PAID_USER_MESSAGE_LIMIT: int = 100
    
    # Cost Control
    MAX_TOKENS_PER_RESPONSE: int = 150
    CACHE_TTL_SECONDS: int = 604800  # 7 days
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
