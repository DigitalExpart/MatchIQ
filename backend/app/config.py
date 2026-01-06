from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:[PASSWORD]@db.xvicydrqtddctywkvyge.supabase.co:5432/postgres"
    )
    
    # Supabase Configuration
    SUPABASE_PROJECT_ID: str = os.getenv("SUPABASE_PROJECT_ID", "xvicydrqtddctywkvyge")
    SUPABASE_URL: str = os.getenv(
        "SUPABASE_URL",
        "https://xvicydrqtddctywkvyge.supabase.co"
    )
    SUPABASE_ANON_KEY: str = os.getenv(
        "SUPABASE_ANON_KEY",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA"
    )
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # AI Version
    AI_VERSION: str = os.getenv("AI_VERSION", "1.0.0")
    
    # CORS - Allow frontend origins including Vercel deployments
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,https://match-bgedokie7-digital-experts.vercel.app,https://match-8wbet35tf-digital-experts.vercel.app"
        ).split(",")
        if origin.strip()
    ]
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

