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


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class PasswordResetResponse(BaseModel):
    message: str
    token: Optional[str] = None  # For development/testing - remove in production


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


@router.post("/forgot-password", response_model=PasswordResetResponse)
async def forgot_password(request: ForgotPasswordRequest):
    """
    Request a password reset.
    Generates a reset token and stores it in the database.
    In production, this would send an email with the reset link.
    """
    try:
        supabase = get_supabase_client()
        
        # Find user by email
        result = supabase.table("users").select("id, email").eq("email", request.email).execute()
        
        if not result.data:
            # Don't reveal if email exists (security best practice)
            return PasswordResetResponse(
                message="If an account with that email exists, a password reset link has been sent."
            )
        
        user = result.data[0]
        user_id = user["id"]
        
        # Generate secure token
        reset_token = secrets.token_urlsafe(32)
        
        # Token expires in 1 hour
        expires_at = datetime.utcnow() + timedelta(hours=1)
        
        # Store token in database
        token_data = {
            "user_id": user_id,
            "token": reset_token,
            "expires_at": expires_at.isoformat(),
            "used": False
        }
        
        supabase.table("password_reset_tokens").insert(token_data).execute()
        
        # TODO: In production, send email with reset link
        # For now, return token in response (remove in production)
        logger.info(f"Password reset token generated for user {user_id}: {reset_token}")
        
        return PasswordResetResponse(
            message="If an account with that email exists, a password reset link has been sent.",
            token=reset_token  # Remove this in production
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        # Don't reveal errors to prevent email enumeration
        return PasswordResetResponse(
            message="If an account with that email exists, a password reset link has been sent."
        )


@router.post("/reset-password", response_model=PasswordResetResponse)
async def reset_password(request: ResetPasswordRequest):
    """
    Reset password using a valid reset token.
    """
    try:
        supabase = get_supabase_client()
        
        # Find token
        token_result = supabase.table("password_reset_tokens") \
            .select("*") \
            .eq("token", request.token) \
            .eq("used", False) \
            .execute()
        
        if not token_result.data:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
        token_data = token_result.data[0]
        
        # Parse expires_at (handle both string and datetime)
        expires_at_str = token_data["expires_at"]
        if isinstance(expires_at_str, str):
            if expires_at_str.endswith("Z"):
                expires_at_str = expires_at_str.replace("Z", "+00:00")
            expires_at = datetime.fromisoformat(expires_at_str)
        else:
            expires_at = expires_at_str
        
        # Check if token is expired
        now = datetime.utcnow()
        if expires_at.tzinfo:
            now = now.replace(tzinfo=expires_at.tzinfo)
        else:
            expires_at = expires_at.replace(tzinfo=None)
        
        if now > expires_at:
            raise HTTPException(status_code=400, detail="Reset token has expired")
        
        user_id = token_data["user_id"]
        
        # Hash new password
        new_password_hash = hash_password(request.new_password)
        
        # Update user password
        supabase.table("users") \
            .update({"password_hash": new_password_hash}) \
            .eq("id", user_id) \
            .execute()
        
        # Mark token as used
        supabase.table("password_reset_tokens") \
            .update({"used": True}) \
            .eq("token", request.token) \
            .execute()
        
        return PasswordResetResponse(
            message="Password has been reset successfully. You can now sign in with your new password."
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reset password error: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset password")

