"""
AI Coach API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.pydantic_models import CoachRequest, CoachResponse, CoachMode, ChatSessionResponse, ChatMessageResponse
from app.models.db_models import ScanResult, Scan, Blueprint, User, ChatSession, ChatMessage
from app.services.coach_service import CoachService, CoachContext
from app.services.scoring_logic import (
    calculate_blueprint_profile,
    BlueprintAnswer,
    BlueprintProfile
)
from app.utils.auth import require_auth, get_locale_from_header
from app.utils.chat_utils import is_question, extract_name, should_ask_for_name, get_greeting_with_name
from app.services.tier_capabilities import SubscriptionTier, TierEnforcement
from app.services.coach_service import FORBIDDEN_PHRASES
from app.config import settings
from typing import Optional, List

router = APIRouter()


def _build_coach_context(
    request: CoachRequest,
    user_id: UUID,
    db: Session
) -> CoachContext:
    """Build context for coach service."""
    scan_result = None
    blueprint_profile = None
    user_profile = None
    
    # Load scan result
    if request.scan_result_id:
        scan_result = db.query(ScanResult).filter(
            ScanResult.id == request.scan_result_id
        ).first()
    elif request.scan_id:
        scan = db.query(Scan).filter(Scan.id == request.scan_id).first()
        if scan:
            scan_result = db.query(ScanResult).filter(
                ScanResult.scan_id == scan.id
            ).order_by(ScanResult.created_at.desc()).first()
    
    # Load blueprint
    if request.blueprint_id:
        blueprint = db.query(Blueprint).filter(
            Blueprint.id == request.blueprint_id
        ).first()
    else:
        blueprint = db.query(Blueprint).filter(
            Blueprint.user_id == user_id,
            Blueprint.is_active == True
        ).first()
    
    if blueprint:
        blueprint_answers = [
            BlueprintAnswer(
                question_id=a['question_id'],
                category=a['category'],
                response=a['response'],
                importance=a['importance'],
                is_deal_breaker=a.get('is_deal_breaker', False)
            )
            for a in blueprint.answers
        ]
        blueprint_profile = calculate_blueprint_profile(blueprint_answers)
    
    # Load user profile
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        profile_data = user.profile or {}
        from app.services.scoring_logic import UserProfile
        user_profile = UserProfile(
            name=profile_data.get('name', 'User'),
            age=profile_data.get('age', 25),
            dating_goal=profile_data.get('dating_goal', 'serious'),
            email=user.email,
            location=profile_data.get('location'),
            bio=profile_data.get('bio')
        )
    
    # Extract data from scan result
    category_scores = {}
    overall_score = None
    category = None
    red_flags = []
    confidence_score = 0.5
    confidence_reason = None
    data_sufficiency = None
    reflection_notes = None
    
    if scan_result:
        category_scores = scan_result.category_scores or {}
        overall_score = scan_result.overall_score
        category = scan_result.category
        red_flags = scan_result.red_flags or []
        confidence_score = scan_result.confidence_score or 0.5
        confidence_reason = getattr(scan_result, 'confidence_reason', None)
        data_sufficiency = getattr(scan_result, 'data_sufficiency', None)
        
        # Get reflection notes from scan
        if scan_result.scan_id:
            scan = db.query(Scan).filter(Scan.id == scan_result.scan_id).first()
            if scan and scan.reflection_notes:
                reflection_notes = scan.reflection_notes
    
    # Get explanation metadata from scan result if available
    explanation_metadata = None
    if scan_result and hasattr(scan_result, 'explanation_metadata'):
        explanation_metadata = scan_result.explanation_metadata
    
    return CoachContext(
        category_scores=category_scores,
        overall_score=overall_score,
        category=category,
        blueprint=blueprint_profile,
        user_profile=user_profile,
        red_flags=red_flags,
        confidence_score=confidence_score,
        confidence_reason=confidence_reason,
        data_sufficiency=data_sufficiency,
        reflection_notes=reflection_notes,
        explanation_metadata=explanation_metadata
    )


def _get_or_create_session(
    user_id: UUID,
    scan_id: Optional[UUID],
    session_id: Optional[UUID],
    db: Session
) -> ChatSession:
    """Get existing session or create a new one."""
    if session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == session_id,
            ChatSession.user_id == user_id,
            ChatSession.is_active == True
        ).first()
        if session:
            return session
    
    # Create new session
    session = ChatSession(
        user_id=user_id,
        scan_id=scan_id,
        is_active=True
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def _load_chat_history(session_id: UUID, db: Session) -> list:
    """Load chat history for a session."""
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    return [
        {
            'role': msg.role,
            'message': msg.message,
            'is_question': msg.is_question,
            'created_at': msg.created_at.isoformat()
        }
        for msg in messages
    ]


def _save_message(
    session_id: UUID,
    role: str,
    message: str,
    is_question: bool,
    db: Session
):
    """Save a message to the chat history."""
    chat_message = ChatMessage(
        session_id=session_id,
        role=role,
        message=message,
        is_question=is_question
    )
    db.add(chat_message)
    
    # Update session's last_message_at
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        session.last_message_at = datetime.utcnow()
        # Update user_name if extracted from user message
        if role == 'user':
            extracted_name = extract_name(message)
            if extracted_name and not session.user_name:
                session.user_name = extracted_name
    
    db.commit()


@router.post("/", response_model=CoachResponse)
async def get_coach_response(
    request: CoachRequest,
    user_id: UUID = Depends(require_auth),  # Extracted from auth token
    db: Session = Depends(get_db),
    locale: str = Depends(get_locale_from_header)  # Extracted from Accept-Language header
):
    """
    Get AI Coach response in specified mode.
    Supports session memory and name recognition.
    """
    # Validate request
    if not any([request.scan_result_id, request.scan_id]):
        if request.mode != CoachMode.REFLECT:
            raise HTTPException(
                status_code=400,
                detail="scan_result_id or scan_id required for this mode"
            )
    
    # Get or create chat session
    session = _get_or_create_session(user_id, request.scan_id, request.session_id, db)
    
    # Load chat history
    chat_history = _load_chat_history(session.id, db)
    
    # Handle user message if provided
    user_message = request.specific_question
    if user_message:
        # Detect if it's a question
        is_question_flag = is_question(user_message)
        
        # Extract name if present
        extracted_name = extract_name(user_message)
        if extracted_name and not session.user_name:
            session.user_name = extracted_name
            db.commit()
        
        # Save user message
        _save_message(session.id, 'user', user_message, is_question_flag, db)
        
        # TASK 3: Intent filter refinement - check if it's a valid coaching intent
        from app.utils.intent_classifier import classify_intent, IntentType
        intent, intent_confidence = classify_intent(user_message)
        
        # If it's a fallback (malicious/unrelated) and not a simple greeting, handle appropriately
        if intent == IntentType.FALLBACK and intent_confidence > 0.7:
            # Only trigger fallback for clearly malicious/unrelated content
            # Don't trigger for simple greetings or valid coaching questions
            if not any(greeting in user_message.lower() for greeting in ['hi', 'hello', 'hey', 'thanks']):
                # This is handled by the coach service's pre-intent layer
                pass
        
        # If it's not a question and not providing name, provide helpful response
        if not is_question_flag and request.mode == CoachMode.LEARN:
            # Check if user is providing their name
            if extracted_name:
                response_message = f"Nice to meet you, {extracted_name}! How can I help you today?"
                _save_message(session.id, 'ai', response_message, False, db)
                return CoachResponse(
                    message=response_message,
                    mode=request.mode,
                    confidence=1.0,
                    referenced_data={},
                    session_id=session.id,
                    user_name=session.user_name
                )
            # If it's not a question and not a name, still process it (might be a statement)
            # Continue to normal flow to let the coach service handle it
    
    # Build context
    context = _build_coach_context(request, user_id, db)
    
    # Get user subscription tier
    from app.models.db_models import User
    user = db.query(User).filter(User.id == user_id).first()
    user_tier_str = user.subscription_tier if user and user.subscription_tier else "free"
    user_tier = SubscriptionTier(user_tier_str.lower())
    
    # Enforce tier limits before getting response
    mode_str = request.mode.value if hasattr(request.mode, 'value') else str(request.mode)
    pre_check_response, _ = TierEnforcement.enforce_coach_response(
        tier=user_tier,
        mode=mode_str,
        response=None,  # Will be generated
        context=context
    )
    
    # If response is an error (mode not allowed), return it
    if pre_check_response is not None and hasattr(pre_check_response, 'message') and 'not available' in pre_check_response.message:
        return pre_check_response
    
    # Get coach response with session context
    coach_service = CoachService()
    
    # Add session context (user name, chat history)
    context.user_name = session.user_name
    context.chat_history = chat_history if chat_history else []
    
    response = coach_service.get_response(request.mode, context, user_message=user_message)
    
    # Validate response
    validation_passed = coach_service.validate_response(response)
    if not validation_passed:
        raise HTTPException(
            status_code=500,
            detail="Generated response failed validation"
        )
    
    # Re-apply tier enforcement with actual response
    response, limitations = TierEnforcement.enforce_coach_response(
        tier=user_tier,
        mode=mode_str,
        response=response,
        context=context
    )
    
    # Log response to audit log (non-blocking)
    try:
        from app.services.coach_audit import CoachAuditLogger
        audit_logger = CoachAuditLogger(db)
        
        # Check if response has forbidden phrases
        response_lower = response.message.lower()
        has_forbidden = any(phrase in response_lower for phrase in FORBIDDEN_PHRASES)
        
        # Build input context for logging
        input_context = {
            'category_scores': context.category_scores,
            'overall_score': context.overall_score,
            'category': context.category,
            'mode': request.mode.value,
            'specific_question': request.specific_question,
            'confidence_score': context.confidence_score
        }
        
        # Log response (non-blocking - errors are caught)
        audit_logger.log_response(
            user_id=str(user_id),
            mode=request.mode.value,
            input_context=input_context,
            output_text=response.message,
            validation_status='pass' if validation_passed else 'fail',
            ai_version=settings.AI_VERSION,
            scan_id=str(request.scan_id) if request.scan_id else None,
            scan_result_id=str(request.scan_result_id) if request.scan_result_id else None,
            has_forbidden_phrases=has_forbidden
        )
    except Exception as e:
        # Log error but don't block response delivery
        import logging
        logging.warning(f"Failed to audit log coach response: {e}")
    
    # Save AI response to chat history
    if response.message:
        _save_message(session.id, 'ai', response.message, False, db)
    
    # Add session info to response
    response.session_id = session.id
    response.user_name = session.user_name
    
    return response


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: UUID,
    user_id: UUID = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get a chat session with all messages."""
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    return ChatSessionResponse(
        id=session.id,
        user_id=session.user_id,
        scan_id=session.scan_id,
        user_name=session.user_name,
        created_at=session.created_at,
        updated_at=session.updated_at,
        last_message_at=session.last_message_at,
        messages=[
            ChatMessageResponse(
                id=msg.id,
                role=msg.role,
                message=msg.message,
                is_question=msg.is_question,
                created_at=msg.created_at
            )
            for msg in messages
        ]
    )


@router.get("/sessions", response_model=List[ChatSessionResponse])
async def list_chat_sessions(
    scan_id: Optional[UUID] = None,
    user_id: UUID = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """List chat sessions for a user, optionally filtered by scan_id."""
    query = db.query(ChatSession).filter(
        ChatSession.user_id == user_id,
        ChatSession.is_active == True
    )
    
    if scan_id:
        query = query.filter(ChatSession.scan_id == scan_id)
    
    sessions = query.order_by(ChatSession.last_message_at.desc()).limit(10).all()
    
    result = []
    for session in sessions:
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id
        ).order_by(ChatMessage.created_at.asc()).all()
        
        result.append(ChatSessionResponse(
            id=session.id,
            user_id=session.user_id,
            scan_id=session.scan_id,
            user_name=session.user_name,
            created_at=session.created_at,
            updated_at=session.updated_at,
            last_message_at=session.last_message_at,
            messages=[
                ChatMessageResponse(
                    id=msg.id,
                    role=msg.role,
                    message=msg.message,
                    is_question=msg.is_question,
                    created_at=msg.created_at
                )
                for msg in messages
            ]
        ))
    
    return result

