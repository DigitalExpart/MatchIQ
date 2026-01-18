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
    - Multi-session support with coach_session_id
    """
    from app.services.amora_session_service import AmoraSessionService
    
    try:
        logger.info(f"Amora request from user {user_id}: mode={request.mode}, question='{request.specific_question}', coach_session_id={request.coach_session_id}")
        
        # Validate coach_session_id if provided
        session_service = AmoraSessionService()
        coach_session_id = request.coach_session_id
        
        if coach_session_id:
            # Verify session belongs to user
            session = session_service.get_session(user_id, coach_session_id)
            if not session:
                raise HTTPException(status_code=404, detail="Coaching session not found or access denied")
        
        # Check subscription status
        is_paid_user = await check_subscription_status(user_id)
        
        # Save user message if we have a session
        user_message_id = None
        if coach_session_id and request.specific_question:
            try:
                user_message_id = session_service.save_message(
                    session_id=coach_session_id,
                    sender="user",
                    message_text=request.specific_question,
                    metadata={
                        "mode": request.mode,
                        "context": request.context or {}
                    }
                )
            except Exception as e:
                logger.warning(f"Failed to save user message: {e}")
        
        # Try blocks service first (for LEARN mode)
        if request.mode == "LEARN":
            try:
                blocks_service = AmoraBlocksService()
                response = blocks_service.get_response(request, user_id, coach_session_id)
                # Engine is set in referenced_data by the service
                response.engine = response.referenced_data.get('engine', 'blocks')
                
                # Save Amora's response if we have a session
                amora_message_id = None
                if coach_session_id:
                    try:
                        topics = response.referenced_data.get('topics', [])
                        emotions = response.referenced_data.get('emotions', [])
                        primary_topic = topics[0] if topics else None
                        
                        # Update session topic if needed
                        if primary_topic:
                            session_service.update_session_topic(coach_session_id, primary_topic)
                        
                        # Save Amora's response
                        amora_message_id = session_service.save_message(
                            session_id=coach_session_id,
                            sender="amora",
                            message_text=response.message,
                            metadata={
                                "topics": topics,
                                "emotions": emotions,
                                "response_style": response.referenced_data.get('response_style'),
                                "engine": response.engine,
                                "confidence": response.confidence
                            }
                        )
                        
                        # Check if we should update summary
                        if session_service.should_update_summary(coach_session_id):
                            recent_messages = session_service.get_recent_messages(coach_session_id, limit=10)
                            summary_text, next_plan_text = session_service.generate_summary(
                                session_id=coach_session_id,
                                topics=topics,
                                recent_messages=recent_messages,
                                emotions=emotions
                            )
                            session_service.update_session_summary(
                                session_id=coach_session_id,
                                summary_text=summary_text,
                                next_plan_text=next_plan_text
                            )
                    except Exception as e:
                        logger.warning(f"Failed to save Amora message or update summary: {e}")
                
                # Add session and message IDs to response
                response.coach_session_id = coach_session_id
                response.message_id = amora_message_id
                
                logger.info(f"Amora BLOCKS response: message_length={len(response.message)}, confidence={response.confidence}, engine={response.engine}")
                logger.info(f"Message preview: {response.message[:150]}...")
                return response
                
            except Exception as blocks_error:
                logger.error(f"AmoraBlocksService failed, falling back to legacy templates: {blocks_error}", exc_info=True)
                
                # Fall back to enhanced service
                enhanced_service = AmoraEnhancedService()
                response = enhanced_service.get_response(request, user_id, is_paid_user)
                response.engine = "legacy_templates"
                response.referenced_data['engine'] = "legacy_templates"
                response.coach_session_id = coach_session_id
                
                # Save Amora's response if we have a session
                if coach_session_id:
                    try:
                        amora_message_id = session_service.save_message(
                            session_id=coach_session_id,
                            sender="amora",
                            message_text=response.message,
                            metadata={"engine": "legacy_templates"}
                        )
                        response.message_id = amora_message_id
                    except Exception as e:
                        logger.warning(f"Failed to save Amora message: {e}")
                
                logger.warning(f"Using legacy templates as fallback: {response.message[:100]}...")
                return response
        else:
            # For non-LEARN modes, use enhanced service
            enhanced_service = AmoraEnhancedService()
            response = enhanced_service.get_response(request, user_id, is_paid_user)
            response.engine = "legacy_templates"
            response.coach_session_id = coach_session_id
            
            # Save Amora's response if we have a session
            if coach_session_id:
                try:
                    amora_message_id = session_service.save_message(
                        session_id=coach_session_id,
                        sender="amora",
                        message_text=response.message,
                        metadata={"engine": "legacy_templates", "mode": request.mode}
                    )
                    response.message_id = amora_message_id
                except Exception as e:
                    logger.warning(f"Failed to save Amora message: {e}")
            
            logger.info(f"Amora Enhanced response (mode={request.mode}): {response.message[:100]}...")
            return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in coach endpoint: {e}", exc_info=True)
        
        # Return safe fallback instead of error
        return CoachResponse(
            message="I'm here to help. Can you share a bit more about what you're thinking?",
            mode=request.mode,
            confidence=0.5,
            referenced_data={"error": True},
            engine="error_fallback",
            coach_session_id=request.coach_session_id
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
