"""
Assessment API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.pydantic_models import (
    CreateScanRequest,
    ScanResultResponse,
    ScanAnswerInput,
    ReflectionNotesInput
)
from app.models.db_models import Scan, ScanResult, User
from app.services.scoring_engine import ScoringEngine
from app.services.red_flag_engine import RedFlagEngine
from app.services.scoring_logic import (
    ScanAnswer,
    BlueprintProfile,
    UserProfile,
    ReflectionNotes,
    calculate_blueprint_profile
)
from app.services.pattern_kb import PatternKnowledgeBase
from app.utils.auth import require_auth, get_locale_from_header

router = APIRouter()


def _convert_scan_answers(answers: List[ScanAnswerInput]) -> List[ScanAnswer]:
    """Convert Pydantic models to internal models."""
    from app.services.scoring_logic import ScanAnswer
    return [
        ScanAnswer(
            question_id=a.question_id,
            category=a.category,
            rating=a.rating.value,
            question_text=a.question_text
        )
        for a in answers
    ]


def _get_user_blueprint(db: Session, user_id: UUID) -> BlueprintProfile:
    """Get user's active blueprint."""
    from app.models.db_models import Blueprint
    
    blueprint = db.query(Blueprint).filter(
        Blueprint.user_id == user_id,
        Blueprint.is_active == True
    ).first()
    
    if not blueprint:
        raise HTTPException(
            status_code=400,
            detail="No active blueprint found. Please complete self-assessment first."
        )
    
    # Convert blueprint answers to internal format
    from app.services.scoring_logic import BlueprintAnswer
    
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
    
    return calculate_blueprint_profile(blueprint_answers)


def _get_user_profile(db: Session, user_id: UUID) -> UserProfile:
    """Get user profile."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile_data = user.profile or {}
    
    return UserProfile(
        name=profile_data.get('name', 'User'),
        age=profile_data.get('age', 25),
        dating_goal=profile_data.get('dating_goal', 'serious'),
        email=user.email,
        location=profile_data.get('location'),
        bio=profile_data.get('bio')
    )


@router.post("/", response_model=ScanResultResponse)
async def create_assessment(
    request: CreateScanRequest,
    user_id: UUID = Depends(require_auth),  # Extracted from auth token
    db: Session = Depends(get_db),
    locale: str = Depends(get_locale_from_header)  # Extracted from Accept-Language header
):
    """
    Process a new assessment and return results.
    """
    # Get user subscription tier
    from app.models.db_models import User
    user = db.query(User).filter(User.id == user_id).first()
    user_tier_str = user.subscription_tier if user and user.subscription_tier else "free"
    user_tier = SubscriptionTier(user_tier_str.lower())
    # Convert request to internal models
    scan_answers = _convert_scan_answers(request.answers)
    
    # Get user blueprint
    blueprint_profile = _get_user_blueprint(db, user_id)
    
    # Get user profile
    user_profile = _get_user_profile(db, user_id)
    
    # Convert reflection notes
    reflection_notes = None
    if request.reflection_notes:
        reflection_notes = ReflectionNotes(
            good_moments=request.reflection_notes.good_moments,
            worst_moments=request.reflection_notes.worst_moments,
            sad_moments=request.reflection_notes.sad_moments,
            vulnerable_moments=request.reflection_notes.vulnerable_moments,
            additional_notes=request.reflection_notes.additional_notes
        )
    
    # Create scan record
    scan = Scan(
        user_id=user_id,
        scan_type=request.scan_type.value,
        person_name=request.person_name,
        interaction_type=request.interaction_type,
        answers=[a.dict() for a in request.answers],
        reflection_notes=request.reflection_notes.dict() if request.reflection_notes else None,
        categories_completed=request.categories_completed or [],
        status='completed'
    )
    db.add(scan)
    db.flush()
    
    # Process with scoring engine
    scoring_engine = ScoringEngine()
    result_data = scoring_engine.process_scan(
        scan_answers,
        blueprint_profile,
        user_profile,
        reflection_notes
    )
    
    # Detect red flags (with escalation if user_id available)
    flag_engine = RedFlagEngine(db=db)
    red_flags = flag_engine.detect_all(
        scan_answers,
        blueprint_profile,
        user_profile,
        reflection_notes,
        user_id=str(user_id),
        scan_id=str(scan.id),
        apply_escalation=True
    )
    
    # Get escalation reason if escalation occurred
    escalation_reason = flag_engine.get_escalation_reason()
    
    # Detect inconsistencies
    inconsistencies = flag_engine.detect_inconsistencies(scan_answers)
    
    # Detect profile mismatches
    profile_mismatches = flag_engine.detect_profile_mismatches(
        scan_answers,
        blueprint_profile,
        user_profile
    )
    
    # Create scan result
    scan_result = ScanResult(
        scan_id=scan.id,
        ai_version=result_data['ai_version'],
        logic_version=result_data.get('logic_version', '1.0.0'),
        overall_score=result_data['overall_score'],
        category=result_data['category'],
        category_scores=result_data['category_scores'],
        red_flags=[{
            'severity': f.severity,
            'category': f.category,
            'signal': f.signal,
            'evidence': f.evidence,
            'type': f.type
        } for f in red_flags],
        inconsistencies=[{
            'type': i.type,
            'description': i.description,
            'questions': i.questions,
            'severity': i.severity
        } for i in inconsistencies],
        profile_mismatches=[{
            'description': m.description,
            'severity': m.severity,
            'category': m.category
        } for m in profile_mismatches],
        confidence_score=result_data['confidence_score'],
        confidence_reason=result_data.get('confidence_reason'),
        data_sufficiency=result_data.get('data_sufficiency'),
        conflict_density=result_data.get('conflict_density'),
        gating_recommendations=result_data.get('gating_recommendations'),
        escalation_reason=escalation_reason,
        strengths=result_data['strengths'],
        awareness_areas=result_data['awareness_areas'],
        recommended_action=result_data['recommended_action'],
        action_label=result_data['action_label'],
        action_guidance=result_data['action_guidance'],
        explanation_metadata=result_data.get('explanation_metadata'),
        ai_analysis={
            'confidence_score': result_data['confidence_score'],
            'confidence_reason': result_data.get('confidence_reason'),
            'data_sufficiency': result_data.get('data_sufficiency'),
            'conflict_density': result_data.get('conflict_density'),
            'strengths': result_data['strengths'],
            'awareness_areas': result_data['awareness_areas'],
            'explanation_metadata': result_data.get('explanation_metadata')
        }
    )
    db.add(scan_result)
    db.commit()
    db.refresh(scan_result)
    
    # Store pattern (anonymized)
    pattern_kb = PatternKnowledgeBase(db)
    pattern_hash = pattern_kb.generate_pattern_hash(
        [a.dict() for a in request.answers],
        result_data['category_scores']
    )
    pattern_kb.store_pattern(
        pattern_hash,
        {'rating_sequence': [a.rating for a in scan_answers]},
        outcome=result_data['category'],
        score=float(result_data['overall_score']),
        flag_count=len(red_flags),
        confidence=result_data['confidence_score']
    )
    
    # Enforce tier limits on response (user_tier already retrieved at start of function)
    filtered_result_data = TierEnforcement.enforce_assessment_response(
        tier=user_tier,
        response_data=result_data
    )
    
    # Convert to response model
    return ScanResultResponse(
        id=scan_result.id,
        scan_id=scan_result.scan_id,
        overall_score=scan_result.overall_score,
        category=scan_result.category,
        category_scores=scan_result.category_scores,
        red_flags=[{
            'severity': f['severity'],
            'category': f['category'],
            'signal': f['signal'],
            'evidence': f['evidence'],
            'type': f.get('type')
        } for f in (filtered_result_data.get('red_flags', scan_result.red_flags) or scan_result.red_flags)],
        inconsistencies=[{
            'type': i['type'],
            'description': i['description'],
            'questions': i['questions'],
            'severity': i['severity']
        } for i in scan_result.inconsistencies],
        profile_mismatches=[{
            'description': m['description'],
            'severity': m['severity'],
            'category': m['category']
        } for m in scan_result.profile_mismatches],
        confidence_score=scan_result.confidence_score or 0.5,
        confidence_reason=getattr(scan_result, 'confidence_reason', None) or result_data.get('confidence_reason'),
        data_sufficiency=getattr(scan_result, 'data_sufficiency', None) or result_data.get('data_sufficiency'),
        conflict_density=getattr(scan_result, 'conflict_density', None) or result_data.get('conflict_density'),
        gating_recommendations=getattr(scan_result, 'gating_recommendations', None) or result_data.get('gating_recommendations'),
        escalation_reason=getattr(scan_result, 'escalation_reason', None),
        ai_version=scan_result.ai_version,
        logic_version=getattr(scan_result, 'logic_version', None) or result_data.get('logic_version', '1.0.0'),
        strengths=filtered_result_data.get('strengths', scan_result.strengths or []),
        awareness_areas=filtered_result_data.get('awareness_areas', scan_result.awareness_areas or []),
        recommended_action=filtered_result_data.get('recommended_action', scan_result.recommended_action),
        action_label=filtered_result_data.get('action_label', scan_result.action_label),
        action_guidance=filtered_result_data.get('action_guidance', scan_result.action_guidance),
        explanation_metadata=filtered_result_data.get('explanation_metadata', getattr(scan_result, 'explanation_metadata', None)),
        tier=user_tier.value,
        tier_limitations=filtered_result_data.get('tier_limitations'),
        created_at=scan_result.created_at
    )


@router.get("/{scan_id}/result", response_model=ScanResultResponse)
async def get_scan_result(
    scan_id: UUID,
    user_id: UUID,  # From auth
    db: Session = Depends(get_db)
):
    """Get scan result by scan ID."""
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == user_id
    ).first()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    scan_result = db.query(ScanResult).filter(
        ScanResult.scan_id == scan_id
    ).first()
    
    if not scan_result:
        raise HTTPException(status_code=404, detail="Scan result not found")
    
    return ScanResultResponse(
        id=scan_result.id,
        scan_id=scan_result.scan_id,
        overall_score=scan_result.overall_score,
        category=scan_result.category,
        category_scores=scan_result.category_scores,
        red_flags=scan_result.red_flags or [],
        inconsistencies=scan_result.inconsistencies or [],
        profile_mismatches=scan_result.profile_mismatches or [],
        confidence_score=scan_result.confidence_score or 0.5,
        confidence_reason=getattr(scan_result, 'confidence_reason', None),
        data_sufficiency=getattr(scan_result, 'data_sufficiency', None),
        conflict_density=getattr(scan_result, 'conflict_density', None),
        gating_recommendations=getattr(scan_result, 'gating_recommendations', None),
        escalation_reason=getattr(scan_result, 'escalation_reason', None),
        ai_version=scan_result.ai_version,
        logic_version=getattr(scan_result, 'logic_version', None) or '1.0.0',
        strengths=scan_result.strengths or [],
        awareness_areas=scan_result.awareness_areas or [],
        recommended_action=scan_result.recommended_action,
        action_label=scan_result.action_label,
        action_guidance=scan_result.action_guidance,
        created_at=scan_result.created_at
    )

