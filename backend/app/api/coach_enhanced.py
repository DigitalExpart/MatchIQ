"""
Enhanced Coach API endpoints for Amora V1.
Now uses BLOCKS architecture for rich, varied, non-repetitive responses.
"""
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
import logging

from app.models.pydantic_models import CoachRequest, CoachResponse
from app.services.amora_blocks_service import AmoraBlocksService
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
    Get response from Amora Blocks Service (primary) or fallback to Enhanced Service.
    
    Features:
    - Block-based response architecture (reflection + normalization + exploration)
    - Topic and emotion-aware selection
    - Anti-repetition across blocks
    - Progressive depth per topic
    - Simple personalization with context variables
    - Graceful fallback to legacy templates if blocks unavailable
    """
    try:
        logger.info(f"Amora request from user {user_id}: mode={request.mode}, question='{request.specific_question}'")
        
        # Check subscription status
        is_paid_user = await check_subscription_status(user_id)
        
        # Try blocks service first (for LEARN mode)
        if request.mode == "LEARN":
            try:
                blocks_service = AmoraBlocksService()
                response = blocks_service.get_response(request, user_id)
                response.engine = "blocks"
                
                logger.info(f"Amora BLOCKS response: {response.message[:100]}... (confidence={response.confidence})")
                return response
                
            except Exception as blocks_error:
                logger.error(f"AmoraBlocksService failed, falling back to legacy templates: {blocks_error}", exc_info=True)
                
                # Fall back to enhanced service
                enhanced_service = AmoraEnhancedService()
                response = enhanced_service.get_response(request, user_id, is_paid_user)
                response.engine = "legacy_templates"
                
                logger.warning(f"Using legacy templates as fallback: {response.message[:100]}...")
                return response
        else:
            # For non-LEARN modes, use enhanced service
            enhanced_service = AmoraEnhancedService()
            response = enhanced_service.get_response(request, user_id, is_paid_user)
            response.engine = "legacy_templates"
            
            logger.info(f"Amora Enhanced response (mode={request.mode}): {response.message[:100]}...")
            return response
        
    except Exception as e:
        logger.error(f"Error in coach endpoint: {e}", exc_info=True)
        
        # Return safe fallback instead of error
        return CoachResponse(
            message="I'm here to help. Can you share a bit more about what you're thinking?",
            mode=request.mode,
            confidence=0.5,
            referenced_data={"error": True},
            engine="error_fallback"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    try:
        # Check blocks service status
        blocks_service = AmoraBlocksService()
        blocks_count = blocks_service.get_blocks_count()
        
        return {
            "status": "healthy",
            "service": "amora_blocks_primary",
            "version": "2.0.0-blocks",
            "blocks_loaded": blocks_count,
            "fallback": "legacy_templates"
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "degraded",
            "service": "amora_legacy_fallback",
            "version": "1.0.1",
            "error": str(e)
        }
