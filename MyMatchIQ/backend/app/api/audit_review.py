"""
Audit Review API

Provides endpoints for reviewing AI Coach audit logs.
Used for sampling and quality assurance.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.services.coach_audit import CoachAuditLogger

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/logs")
async def get_audit_logs(
    limit: int = Query(100, ge=1, le=1000),
    mode: Optional[str] = Query(None),
    validation_status: Optional[str] = Query(None),
    has_forbidden_phrases: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get recent audit logs for review.
    
    Returns summary information (without full output text).
    """
    logger = CoachAuditLogger(db)
    logs = logger.get_recent_logs(
        limit=limit,
        mode=mode,
        validation_status=validation_status,
        has_forbidden_phrases=has_forbidden_phrases
    )
    return {"logs": logs, "count": len(logs)}


@router.get("/logs/{log_id}")
async def get_audit_log_detail(
    log_id: str,
    db: Session = Depends(get_db)
):
    """
    Get full audit log by ID (includes output text).
    
    Use this for detailed review of specific responses.
    """
    logger = CoachAuditLogger(db)
    log = logger.get_log_by_id(log_id)
    
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    
    return log


@router.get("/stats")
async def get_audit_stats(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get statistics for sampling review.
    
    Provides overview of audit logs for quality assurance.
    """
    logger = CoachAuditLogger(db)
    stats = logger.get_sampling_stats(start_date=start_date, end_date=end_date)
    return stats


@router.get("/sampling")
async def get_sampling_logs(
    sample_size: int = Query(10, ge=1, le=100),
    mode: Optional[str] = Query(None),
    include_failures: bool = Query(True),
    include_forbidden: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Get a sampling of logs for review.
    
    Useful for quality assurance and spot-checking.
    """
    logger = CoachAuditLogger(db)
    
    # Get logs with filters
    validation_status = None if include_failures else 'pass'
    has_forbidden_phrases = None if include_forbidden else False
    
    logs = logger.get_recent_logs(
        limit=sample_size * 2,  # Get more to sample from
        mode=mode,
        validation_status=validation_status,
        has_forbidden_phrases=has_forbidden_phrases
    )
    
    # Sample randomly (simple: take every Nth)
    import random
    if len(logs) > sample_size:
        sampled = random.sample(logs, sample_size)
    else:
        sampled = logs
    
    # Get full details for sampled logs
    detailed_logs = []
    for log in sampled:
        detail = logger.get_log_by_id(log['id'])
        if detail:
            detailed_logs.append(detail)
    
    return {
        "sampling": {
            "sample_size": sample_size,
            "total_available": len(logs),
            "sampled": len(detailed_logs)
        },
        "logs": detailed_logs
    }

