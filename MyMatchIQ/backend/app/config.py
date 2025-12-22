"""
Configuration settings for MyMatchIQ backend
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database (Supabase)
    # Get connection string from: https://app.supabase.com/project/YOUR_PROJECT/settings/database
    # Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
    DATABASE_URL: str = "postgresql://postgres:password@db.project.supabase.co:5432/postgres"
    
    # AI Version
    AI_VERSION: str = "1.0.0"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

