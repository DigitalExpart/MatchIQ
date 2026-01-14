"""
Coach API endpoint using Amora Blocks Service.
LLM-like responses without external AI APIs.
"""
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
import logging

from app.models.pydantic_models import CoachRequest, CoachResponse
from app.services.amora_blocks_service import AmoraBlocksService

router = APIRouter(prefix="/coach", tags=["coach-blocks"])
logger = logging.getLogger(__name__)


async def get_user_id_from_auth() -> UUID:
    """Extract user ID from authentication token."""
    # TODO: Implement actual JWT validation
    return UUID("00000000-0000-0000-0000-000000000000")


@router.post("/", response_model=CoachResponse)
async def get_coach_response(
    request: CoachRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """
    Get LLM-like response from Amora Blocks Service.
    
    Features:
    - Block-based architecture (reflection + normalization + exploration + reframe)
    - Rich, varied responses with low repetition
    - Topic and emotion-aware selection
    - Progressive depth tracking
    - Personalization with context variables
    - Anti-repetition tracking (last 15 blocks)
    - Focused on relationships only
    - 100% local, no external AI APIs
    """
    try:
        logger.info(f"Amora Blocks request: user={user_id}, question='{request.specific_question[:50] if request.specific_question else 'empty'}'")
        
        service = AmoraBlocksService()
        response = service.get_response(request, user_id)
        
        logger.info(f"Amora Blocks response: {len(response.message)} chars, confidence={response.confidence}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error in coach blocks endpoint: {e}", exc_info=True)
        
        # Safe fallback
        return CoachResponse(
            message="I'm here to help you think through relationships and emotions. What's been on your mind?",
            mode=request.mode,
            confidence=0.5,
            referenced_data={"error": True}
        )


@router.get("/health")
async def health_check():
    """Health check for blocks service."""
    return {
        "status": "healthy",
        "service": "amora_blocks",
        "version": "1.0.0"
    }
