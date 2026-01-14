"""
Enhanced Coach API endpoints for Amora V1.
Integrates amora_enhanced_service.py with strict validation.
"""
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
import logging

from app.models.pydantic_models import CoachRequest, CoachResponse
from app.services.amora_enhanced_service import AmoraEnhancedService
from app.database import get_supabase_client

router = APIRouter(prefix="/coach", tags=["coach"])
logger = logging.getLogger(__name__)


async def get_user_id_from_auth() -> UUID:
    """Extract user ID from authentication token."""
    # TODO: Implement actual JWT token validation
    # For now, return a test UUID
    return UUID("00000000-0000-0000-0000-000000000000")


async def check_subscription_status(user_id: UUID) -> bool:
    """Check if user has paid subscription."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("users") \
            .select("subscription_status") \
            .eq("id", str(user_id)) \
            .single() \
            .execute()
        
        if response.data:
            return response.data.get("subscription_status") == "premium"
        return False
    except Exception as e:
        logger.error(f"Error checking subscription: {e}")
        return False


@router.post("/", response_model=CoachResponse)
async def get_coach_response(
    request: CoachRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """
    Get response from Amora Enhanced Service.
    
    Features:
    - First-turn detection and warm welcome
    - Emotional mirroring
    - Confidence-based gating
    - Response variability
    - Conversation memory
    - Fail-safe fallbacks
    """
    try:
        logger.info(f"Amora Enhanced request from user {user_id}: {request.specific_question}")
        
        # Check subscription status
        is_paid_user = await check_subscription_status(user_id)
        
        # Initialize enhanced service
        service = AmoraEnhancedService()
        
        # Get response with all enhancements
        response = service.get_response(request, user_id, is_paid_user)
        
        logger.info(f"Amora Enhanced response: {response.message[:100]}...")
        
        return response
        
    except Exception as e:
        logger.error(f"Error in coach endpoint: {e}", exc_info=True)
        
        # Return safe fallback instead of error
        return CoachResponse(
            message="I'm here to help. Can you share a bit more about what you're thinking?",
            mode=request.mode,
            confidence=0.5,
            referenced_data={"error": True}
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "amora_enhanced",
        "version": "1.0.1-session-fix",
        "git_commit": "c674ffa"
    }
