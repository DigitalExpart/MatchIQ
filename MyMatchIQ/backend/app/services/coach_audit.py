"""
AI Coach Response Audit Logging

Implements full audit logging for AI Coach responses with immutable logs
that do not block response delivery.

Logs:
- timestamp
- user_id (hashed)
- mode (EXPLAIN / REFLECT / LEARN / SAFETY)
- input_context_hash
- output_text
- validation_status (pass/fail)
- logic_version
"""
import hashlib
import json
from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import Column, String, Text, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base
from app.services.scoring_config import get_logic_version


class CoachAuditLog(Base):
    """
    Immutable audit log table for AI Coach responses.
    """
    __tablename__ = "coach_audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    user_id_hash = Column(String(64), nullable=False, index=True)  # SHA-256 hash of user_id
    mode = Column(String(20), nullable=False, index=True)  # EXPLAIN, REFLECT, LEARN, SAFETY
    input_context_hash = Column(String(64), nullable=False, index=True)  # SHA-256 hash of input context
    output_text = Column(Text, nullable=False)  # Full response text
    output_text_hash = Column(String(64), nullable=False, index=True)  # SHA-256 hash of output
    validation_status = Column(String(10), nullable=False)  # 'pass' or 'fail'
    logic_version = Column(String(20), nullable=False)  # Scoring config version
    ai_version = Column(String(20), nullable=False)  # AI version
    scan_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # Optional scan reference
    scan_result_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # Optional result reference
    response_length = Column(Integer, nullable=False)  # Character count of output
    has_forbidden_phrases = Column(Boolean, default=False, nullable=False)  # Whether response contained forbidden phrases
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class CoachAuditLogger:
    """
    Service for logging AI Coach responses with non-blocking writes.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.logic_version = get_logic_version()
    
    def hash_user_id(self, user_id: str) -> str:
        """
        Hash user ID for privacy-preserving logging.
        
        Uses SHA-256 with a salt (in production, use environment variable).
        """
        # In production, use a secret salt from environment
        salt = "coach_audit_salt"  # Should be from settings in production
        combined = f"{salt}:{user_id}"
        return hashlib.sha256(combined.encode()).hexdigest()
    
    def hash_context(self, context: Dict[str, Any]) -> str:
        """
        Create deterministic hash of input context.
        
        Normalizes context by sorting keys and removing non-deterministic fields.
        """
        # Create a normalized version of context
        normalized = {
            'category_scores': context.get('category_scores', {}),
            'overall_score': context.get('overall_score'),
            'category': context.get('category'),
            'mode': context.get('mode'),
            'specific_question': context.get('specific_question'),
            # Exclude timestamps, user-specific data that changes
        }
        
        # Sort keys and convert to JSON string
        json_str = json.dumps(normalized, sort_keys=True)
        return hashlib.sha256(json_str.encode()).hexdigest()
    
    def hash_output(self, output_text: str) -> str:
        """Hash output text for deduplication."""
        return hashlib.sha256(output_text.encode()).hexdigest()
    
    def log_response(
        self,
        user_id: str,
        mode: str,
        input_context: Dict[str, Any],
        output_text: str,
        validation_status: str,
        ai_version: str,
        scan_id: Optional[str] = None,
        scan_result_id: Optional[str] = None,
        has_forbidden_phrases: bool = False
    ) -> Optional[str]:
        """
        Log AI Coach response.
        
        This method is designed to be non-blocking - if logging fails,
        it should not prevent the response from being delivered.
        
        Returns:
            Log ID if successful, None if logging failed (but doesn't raise)
        """
        try:
            # Hash user ID
            user_id_hash = self.hash_user_id(user_id)
            
            # Hash input context
            input_context_hash = self.hash_context(input_context)
            
            # Hash output
            output_text_hash = self.hash_output(output_text)
            
            # Create audit log entry
            audit_log = CoachAuditLog(
                user_id_hash=user_id_hash,
                mode=mode,
                input_context_hash=input_context_hash,
                output_text=output_text,
                output_text_hash=output_text_hash,
                validation_status=validation_status,
                logic_version=self.logic_version,
                ai_version=ai_version,
                scan_id=uuid.UUID(scan_id) if scan_id else None,
                scan_result_id=uuid.UUID(scan_result_id) if scan_result_id else None,
                response_length=len(output_text),
                has_forbidden_phrases=has_forbidden_phrases
            )
            
            # Non-blocking write - commit immediately
            self.db.add(audit_log)
            self.db.commit()
            
            return str(audit_log.id)
        except Exception as e:
            # Log error but don't block response delivery
            # In production, use proper logging
            import logging
            logging.error(f"Failed to log coach response: {e}")
            # Rollback on error
            self.db.rollback()
            return None
    
    def get_recent_logs(
        self,
        limit: int = 100,
        mode: Optional[str] = None,
        validation_status: Optional[str] = None,
        has_forbidden_phrases: Optional[bool] = None
    ) -> list:
        """
        Get recent audit logs for review.
        
        Args:
            limit: Maximum number of logs to return
            mode: Filter by mode (optional)
            validation_status: Filter by validation status (optional)
            has_forbidden_phrases: Filter by forbidden phrase presence (optional)
        
        Returns:
            List of audit log dictionaries
        """
        query = self.db.query(CoachAuditLog)
        
        if mode:
            query = query.filter(CoachAuditLog.mode == mode)
        if validation_status:
            query = query.filter(CoachAuditLog.validation_status == validation_status)
        if has_forbidden_phrases is not None:
            query = query.filter(CoachAuditLog.has_forbidden_phrases == has_forbidden_phrases)
        
        logs = query.order_by(CoachAuditLog.timestamp.desc()).limit(limit).all()
        
        return [
            {
                'id': str(log.id),
                'timestamp': log.timestamp.isoformat(),
                'mode': log.mode,
                'validation_status': log.validation_status,
                'logic_version': log.logic_version,
                'ai_version': log.ai_version,
                'response_length': log.response_length,
                'has_forbidden_phrases': log.has_forbidden_phrases,
                'input_context_hash': log.input_context_hash,
                'output_text_hash': log.output_text_hash,
                # Note: output_text is not included by default for privacy
                # Include it only when specifically needed for review
            }
            for log in logs
        ]
    
    def get_log_by_id(self, log_id: str) -> Optional[Dict[str, Any]]:
        """
        Get full audit log by ID (for detailed review).
        
        Returns full log including output_text.
        """
        log = self.db.query(CoachAuditLog).filter(CoachAuditLog.id == uuid.UUID(log_id)).first()
        
        if not log:
            return None
        
        return {
            'id': str(log.id),
            'timestamp': log.timestamp.isoformat(),
            'user_id_hash': log.user_id_hash,
            'mode': log.mode,
            'input_context_hash': log.input_context_hash,
            'output_text': log.output_text,  # Full text for review
            'output_text_hash': log.output_text_hash,
            'validation_status': log.validation_status,
            'logic_version': log.logic_version,
            'ai_version': log.ai_version,
            'scan_id': str(log.scan_id) if log.scan_id else None,
            'scan_result_id': str(log.scan_result_id) if log.scan_result_id else None,
            'response_length': log.response_length,
            'has_forbidden_phrases': log.has_forbidden_phrases
        }
    
    def get_sampling_stats(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Get statistics for sampling review.
        
        Returns:
            Dictionary with statistics for review sampling
        """
        query = self.db.query(CoachAuditLog)
        
        if start_date:
            query = query.filter(CoachAuditLog.timestamp >= start_date)
        if end_date:
            query = query.filter(CoachAuditLog.timestamp <= end_date)
        
        total_logs = query.count()
        
        # Count by mode
        mode_counts = {}
        for mode in ['EXPLAIN', 'REFLECT', 'LEARN', 'SAFETY']:
            count = query.filter(CoachAuditLog.mode == mode).count()
            mode_counts[mode] = count
        
        # Count by validation status
        validation_counts = {
            'pass': query.filter(CoachAuditLog.validation_status == 'pass').count(),
            'fail': query.filter(CoachAuditLog.validation_status == 'fail').count()
        }
        
        # Count forbidden phrase occurrences
        forbidden_count = query.filter(CoachAuditLog.has_forbidden_phrases == True).count()
        
        # Average response length
        avg_length = self.db.query(
            self.db.func.avg(CoachAuditLog.response_length)
        ).scalar() or 0
        
        return {
            'total_logs': total_logs,
            'mode_distribution': mode_counts,
            'validation_distribution': validation_counts,
            'forbidden_phrase_count': forbidden_count,
            'forbidden_phrase_rate': (forbidden_count / total_logs * 100) if total_logs > 0 else 0,
            'average_response_length': round(avg_length, 2),
            'date_range': {
                'start': start_date.isoformat() if start_date else None,
                'end': end_date.isoformat() if end_date else None
            }
        }

