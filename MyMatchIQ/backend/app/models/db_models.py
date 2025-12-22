"""
SQLAlchemy database models
"""
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    profile = Column(JSONB, default={}, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    subscription_tier = Column(String(20), default="free", nullable=False)
    
    blueprints = relationship("Blueprint", back_populates="user", cascade="all, delete-orphan")
    scans = relationship("Scan", back_populates="user", cascade="all, delete-orphan")


class Blueprint(Base):
    __tablename__ = "blueprints"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    version = Column(Integer, default=1, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    answers = Column(JSONB, default=[], nullable=False)
    profile_summary = Column(JSONB)
    completion_percentage = Column(Integer, default=0, nullable=False)
    
    user = relationship("User", back_populates="blueprints")


class Scan(Base):
    __tablename__ = "scans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    scan_type = Column(String(20), nullable=False)
    person_name = Column(String(255))
    interaction_type = Column(String(50))
    answers = Column(JSONB, default=[], nullable=False)
    reflection_notes = Column(JSONB)
    categories_completed = Column(ARRAY(String))
    status = Column(String(20), default="in_progress", nullable=False)
    dual_scan_session_id = Column(UUID(as_uuid=True))
    dual_scan_role = Column(String(1))  # 'A' or 'B'
    partner_scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id"))
    is_unified = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="scans")
    results = relationship("ScanResult", back_populates="scan", cascade="all, delete-orphan")
    partner_scan = relationship("Scan", remote_side=[id])


class ScanResult(Base):
    __tablename__ = "scan_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ai_version = Column(String(20), nullable=False)
    logic_version = Column(String(20), nullable=False, default='1.0.0')  # Scoring config version
    overall_score = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)
    category_scores = Column(JSONB, nullable=False)
    red_flags = Column(JSONB, default=[])
    inconsistencies = Column(JSONB, default=[])
    profile_mismatches = Column(JSONB, default=[])
    confidence_score = Column(Float)
    confidence_reason = Column(Text)  # Explanation of confidence level
    data_sufficiency = Column(JSONB)  # Data sufficiency check results
    conflict_density = Column(JSONB)  # Conflict density analysis
    gating_recommendations = Column(JSONB)  # Recommendations from confidence gating
    escalation_reason = Column(Text)  # Explanation of risk escalation if occurred
    strengths = Column(JSONB, default=[])
    awareness_areas = Column(JSONB, default=[])
    recommended_action = Column(String(50))
    action_label = Column(String(255))
    action_guidance = Column(Text)
    ai_analysis = Column(JSONB)
    explanation_metadata = Column(JSONB)
    
    scan = relationship("Scan", back_populates="results")


class RedFlag(Base):
    __tablename__ = "red_flags"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    scan_result_id = Column(UUID(as_uuid=True), ForeignKey("scan_results.id", ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    severity = Column(String(20), nullable=False)
    category = Column(String(50), nullable=False)
    signal = Column(Text, nullable=False)
    evidence = Column(JSONB)
    type = Column(String(50))
    detected_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    acknowledged_at = Column(DateTime)
    resolved_at = Column(DateTime)
    pattern_hash = Column(String(64))


class PatternKnowledgeBase(Base):
    __tablename__ = "pattern_knowledge_base"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pattern_hash = Column(String(64), unique=True, nullable=False)
    pattern_type = Column(String(50), nullable=False)
    pattern_data = Column(JSONB, nullable=False)
    occurrence_count = Column(Integer, default=1, nullable=False)
    avg_score = Column(Float)
    score_std_dev = Column(Float)
    flag_rate = Column(Float)
    avg_confidence = Column(Float)
    outcome_distribution = Column(JSONB)
    first_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class AILogicVersion(Base):
    __tablename__ = "ai_logic_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    version = Column(String(20), unique=True, nullable=False)
    description = Column(Text)
    scoring_config = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_by = Column(String(255))
    is_active = Column(Boolean, default=False, nullable=False)
    activated_at = Column(DateTime)
    changes = Column(JSONB)


class UserFeedback(Base):
    __tablename__ = "user_feedback"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_result_id = Column(UUID(as_uuid=True), ForeignKey("scan_results.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    was_accurate = Column(Boolean)
    feedback_text = Column(Text)
    score_accuracy = Column(Integer)  # 1-5
    explanation_helpfulness = Column(Integer)  # 1-5
    flag_relevance = Column(Integer)  # 1-5
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id", ondelete="CASCADE"))
    user_name = Column(String(255))  # User's name if provided
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_message_at = Column(DateTime)
    is_active = Column(Boolean, default=True, nullable=False)
    
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # 'user' or 'ai'
    message = Column(Text, nullable=False)
    is_question = Column(Boolean, default=False)  # Whether the user message is a question
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    session = relationship("ChatSession", back_populates="messages")

