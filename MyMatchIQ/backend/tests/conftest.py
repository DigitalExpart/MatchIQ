"""
Pytest configuration and fixtures for tests.
"""
import pytest
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import Base, engine
from sqlalchemy.orm import sessionmaker

# Test database session
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    """Create a test database session."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    session = TestSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        # Clean up tables (optional, for test isolation)
        # Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_scan_answers():
    """Sample scan answers for testing."""
    from app.services.scoring_logic import ScanAnswer
    
    return [
        ScanAnswer(
            question_id='q1',
            category='emotional_alignment',
            rating='good',
            question_text='How well do your values align?'
        ),
        ScanAnswer(
            question_id='q2',
            category='emotional_alignment',
            rating='strong-match',
            question_text='Do you feel emotionally connected?'
        ),
        ScanAnswer(
            question_id='q3',
            category='communication_fit',
            rating='neutral',
            question_text='How do you communicate during conflicts?'
        ),
    ]


@pytest.fixture
def sample_blueprint_profile():
    """Sample blueprint profile for testing."""
    from app.services.scoring_logic import BlueprintProfile
    
    return BlueprintProfile(
        category_weights={
            'emotional_alignment': 1.2,
            'communication_fit': 1.0
        },
        deal_breakers=[],
        top_priorities=['emotional_alignment']
    )


@pytest.fixture
def sample_user_profile():
    """Sample user profile for testing."""
    from app.services.scoring_logic import UserProfile
    
    return UserProfile(
        name='Test User',
        age=25,
        dating_goal='serious',
        email='test@example.com',
        location='Test City',
        bio='Test bio'
    )

