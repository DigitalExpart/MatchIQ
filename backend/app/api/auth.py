from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from uuid import UUID
import logging
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_supabase_client
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


# Pydantic Models
class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    location: Optional[str] = None
    dating_goal: Optional[str] = 'serious'


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    age: Optional[int]
    location: Optional[str]
    dating_goal: str
    created_at: str


class AuthResponse(BaseModel):
    user: UserResponse
    message: str


def hash_password(password: str) -> str:
    """Hash password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/signup", response_model=AuthResponse)
async def sign_up(request: SignUpRequest):
    """
    Create a new user account.
    No email verification required - users can start using immediately.
    """
    try:
        supabase = get_supabase_client()
        
        # Check if user already exists
        existing = supabase.table("users").select("id").eq("email", request.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        password_hash = hash_password(request.password)
        
        # Create user profile
        profile = {
            "name": request.name,
            "age": request.age,
            "location": request.location or "",
            "dating_goal": request.dating_goal,
        }
        
        # Insert user into database
        user_data = {
            "email": request.email,
            "password_hash": password_hash,
            "profile": profile,
            "is_active": True,
            "subscription_tier": "free"
        }
        
        result = supabase.table("users").insert(user_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        user = result.data[0]
        
        # Return user data
        user_response = UserResponse(
            id=str(user["id"]),
            email=user["email"],
            name=profile["name"],
            age=profile.get("age"),
            location=profile.get("location"),
            dating_goal=profile.get("dating_goal", "serious"),
            created_at=user["created_at"]
        )
        
        return AuthResponse(
            user=user_response,
            message="Account created successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sign up error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/signin", response_model=AuthResponse)
async def sign_in(request: SignInRequest):
    """
    Sign in an existing user.
    Returns user data if credentials are valid.
    """
    try:
        supabase = get_supabase_client()
        
        # Find user by email
        result = supabase.table("users").select("*").eq("email", request.email).execute()
        
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = result.data[0]
        
        # Verify password
        password_hash = hash_password(request.password)
        if user.get("password_hash") != password_hash:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check if user is active
        if not user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account is inactive")
        
        # Extract profile data
        profile = user.get("profile", {})
        
        user_response = UserResponse(
            id=str(user["id"]),
            email=user["email"],
            name=profile.get("name", "User"),
            age=profile.get("age"),
            location=profile.get("location", ""),
            dating_goal=profile.get("dating_goal", "serious"),
            created_at=user["created_at"]
        )
        
        return AuthResponse(
            user=user_response,
            message="Signed in successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sign in error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}", response_model=UserResponse)
async def get_user(user_id: UUID):
    """Get user profile by ID."""
    try:
        supabase = get_supabase_client()
        
        result = supabase.table("users").select("*").eq("id", str(user_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = result.data[0]
        profile = user.get("profile", {})
        
        return UserResponse(
            id=str(user["id"]),
            email=user["email"],
            name=profile.get("name", "User"),
            age=profile.get("age"),
            location=profile.get("location", ""),
            dating_goal=profile.get("dating_goal", "serious"),
            created_at=user["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

