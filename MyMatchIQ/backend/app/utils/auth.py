"""
Authentication utilities for API endpoints
Extracts user context from auth tokens and headers
"""
from fastapi import Header, HTTPException, Depends
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import User


def get_user_id_from_token(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)  # For development/testing
) -> Optional[UUID]:
    """
    Extract user_id from Authorization header (Bearer token) or X-User-Id header.
    
    In production, this would decode JWT token.
    For now, supports:
    - Bearer token with user_id as payload (simplified)
    - X-User-Id header for development
    """
    # Development/testing: use X-User-Id header if provided
    if x_user_id:
        try:
            return UUID(x_user_id)
        except ValueError:
            pass
    
    # Production: extract from Bearer token
    if authorization and authorization.startswith('Bearer '):
        token = authorization.replace('Bearer ', '')
        # In production, decode JWT and extract user_id
        # For now, simplified: token could be user_id or we decode it
        try:
            # Try parsing as UUID (if token is user_id for dev)
            return UUID(token)
        except ValueError:
            # In production, decode JWT here
            # For now, return None (will require explicit user_id)
            pass
    
    return None


def get_locale_from_header(
    accept_language: Optional[str] = Header(None, alias='Accept-Language')
) -> str:
    """
    Extract locale from Accept-Language header.
    Returns language code (e.g., 'en', 'es', 'fr').
    """
    if not accept_language:
        return 'en'
    
    # Parse Accept-Language header (e.g., "en-US,en;q=0.9")
    # Take first language code
    locale = accept_language.split(',')[0].split(';')[0].strip().lower()
    
    # Extract base language (e.g., 'en' from 'en-US')
    base_language = locale.split('-')[0]
    
    # Supported locales
    supported = ['en', 'es', 'fr', 'de', 'it', 'pt']
    
    if base_language in supported:
        return base_language
    
    return 'en'  # Default to English


def get_current_user(
    user_id: Optional[UUID] = Depends(get_user_id_from_token),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user from database.
    Returns None if user_id not provided or user not found.
    """
    if not user_id:
        return None
    
    return db.query(User).filter(User.id == user_id).first()


def require_auth(
    user_id: Optional[UUID] = Depends(get_user_id_from_token)
) -> UUID:
    """
    Require authentication. Raises 401 if not authenticated.
    """
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )
    return user_id

