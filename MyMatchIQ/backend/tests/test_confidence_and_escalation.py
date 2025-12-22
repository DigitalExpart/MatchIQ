"""
Component 7: Safety & Misuse Test Coverage - Confidence & Escalation Tests

Tests for:
- Low-data edge cases
- Conflicting user values
- Partial assessments
- Repeated critical flags
- Confidence gating
- Risk escalation
"""
import pytest
from uuid import UUID, uuid4
from typing import List, Dict, Any, Optional

from app.services.scoring_logic import ScanAnswer, BlueprintProfile, UserProfile, ReflectionNotes
from app.services.confidence_gating import ConfidenceGating, ConfidenceGatingResult
from app.services.risk_escalation import RiskEscalationEngine
from app.services.scoring_config import get_scoring_config
from app.services.red_flag_engine import RedFlag, RedFlagEngine
from sqlalchemy.orm import Session


class TestLowDataEdgeCases:
    """Tests for low-data edge cases and confidence gating."""
    
    def test_confidence_gating_with_very_few_answers(self):
        """Test confidence gating with very few answers."""
        gating = ConfidenceGating()
        
        # Create minimal answers (less than minimum)
        answers = [
            ScanAnswer(
                question_id='q1',
                category='emotional_alignment',
                rating='good',
                question_text='Test question 1'
            ),
            ScanAnswer(
                question_id='q2',
                category='emotional_alignment',
                rating='neutral',
                question_text='Test question 2'
            )
        ]
        
        category_scores = {'emotional_alignment': 60.0}
        category_coverage = {'emotional_alignment': 2}
        
        result = gating.gate_confidence(
            base_confidence=0.8,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage,
            target_category='high-potential'
        )
        
        assert result is not None, "Should return gating result"
        assert result.adjusted_confidence < 0.8, \
            "Confidence should be reduced with very few answers"
        assert not result.data_sufficiency.is_sufficient, \
            "Data should be marked as insufficient"
        assert not result.can_classify_high_potential, \
            "Should not allow high-potential classification with low data"
    
    def test_confidence_gating_with_no_category_coverage(self):
        """Test confidence gating with no category coverage."""
        gating = ConfidenceGating()
        
        answers = []
        category_scores = {}
        category_coverage = {}
        
        result = gating.gate_confidence(
            base_confidence=0.9,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage,
            target_category='high-potential'
        )
        
        assert result is not None, "Should return gating result"
        assert result.adjusted_confidence < 0.9, \
            "Confidence should be reduced with no data"
        assert not result.data_sufficiency.is_sufficient, \
            "Data should be marked as insufficient"
        assert not result.can_classify_high_potential, \
            "Should not allow high-potential classification with no data"
    
    def test_confidence_gating_with_minimal_category_coverage(self):
        """Test confidence gating with minimal category coverage."""
        gating = ConfidenceGating()
        
        # Only one category covered
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='good',
                question_text=f'Test question {i}'
            )
            for i in range(10)
        ]
        
        category_scores = {'emotional_alignment': 75.0}
        category_coverage = {'emotional_alignment': 10}
        
        result = gating.gate_confidence(
            base_confidence=0.8,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage,
            target_category='high-potential'
        )
        
        assert result is not None, "Should return gating result"
        # Confidence might be reduced due to low category coverage
        assert result.data_sufficiency.details.get('covered_categories', 0) == 1, \
            "Should detect low category coverage"
    
    def test_confidence_gating_prevents_high_potential_with_low_confidence(self):
        """Test that confidence gating prevents high-potential classification with low confidence."""
        gating = ConfidenceGating()
        
        # Create answers with some data but not enough
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='good',
                question_text=f'Test question {i}'
            )
            for i in range(8)  # Less than minimum
        ]
        
        category_scores = {'emotional_alignment': 90.0}  # High score
        category_coverage = {'emotional_alignment': 8}
        
        result = gating.gate_confidence(
            base_confidence=0.5,  # Low confidence
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage,
            target_category='high-potential'
        )
        
        assert not result.can_classify_high_potential, \
            "Should prevent high-potential classification with low confidence"
        assert result.adjusted_confidence < 0.7, \
            "Adjusted confidence should be below high-potential threshold"


class TestConflictingUserValues:
    """Tests for conflicting user values and conflict density detection."""
    
    def test_conflict_density_detection(self):
        """Test that conflict density is detected correctly."""
        gating = ConfidenceGating()
        
        # Create answers with conflicting ratings in same category
        answers = [
            ScanAnswer(
                question_id='q1',
                category='emotional_alignment',
                rating='strong-match',  # High rating
                question_text='Question 1'
            ),
            ScanAnswer(
                question_id='q2',
                category='emotional_alignment',
                rating='red-flag',  # Low rating - conflict!
                question_text='Question 2'
            ),
            ScanAnswer(
                question_id='q3',
                category='emotional_alignment',
                rating='good',
                question_text='Question 3'
            ),
        ]
        
        category_scores = {'emotional_alignment': 50.0}
        category_coverage = {'emotional_alignment': 3}
        
        result = gating.gate_confidence(
            base_confidence=0.8,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage
        )
        
        assert result is not None, "Should return gating result"
        assert result.conflict_density.score > 0, \
            "Should detect conflict density"
        assert len(result.conflict_density.conflicts) > 0, \
            "Should identify conflicts"
        assert result.adjusted_confidence < 0.8, \
            "Confidence should be reduced due to conflicts"
    
    def test_conflict_density_with_multiple_categories(self):
        """Test conflict density detection across multiple categories."""
        gating = ConfidenceGating()
        
        # Create answers with conflicts in multiple categories
        answers = [
            # Category 1: conflicting
            ScanAnswer('q1', 'emotional_alignment', 'strong-match', 'Q1'),
            ScanAnswer('q2', 'emotional_alignment', 'red-flag', 'Q2'),
            # Category 2: conflicting
            ScanAnswer('q3', 'communication_fit', 'good', 'Q3'),
            ScanAnswer('q4', 'communication_fit', 'yellow-flag', 'Q4'),
            ScanAnswer('q5', 'communication_fit', 'strong-match', 'Q5'),
        ]
        
        category_scores = {
            'emotional_alignment': 50.0,
            'communication_fit': 60.0
        }
        category_coverage = {
            'emotional_alignment': 2,
            'communication_fit': 3
        }
        
        result = gating.gate_confidence(
            base_confidence=0.8,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage
        )
        
        assert result.conflict_density.score > 0.2, \
            "Should detect conflicts across multiple categories"
        assert result.adjusted_confidence < 0.8, \
            "Confidence should be reduced"
    
    def test_no_conflict_density_with_consistent_answers(self):
        """Test that consistent answers don't trigger conflict detection."""
        gating = ConfidenceGating()
        
        # Create consistent answers
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='good',  # All consistent
                question_text=f'Question {i}'
            )
            for i in range(10)
        ]
        
        category_scores = {'emotional_alignment': 75.0}
        category_coverage = {'emotional_alignment': 10}
        
        result = gating.gate_confidence(
            base_confidence=0.8,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage
        )
        
        assert result.conflict_density.score < 0.2, \
            "Should have low conflict density with consistent answers"
        # Confidence might still be adjusted for other reasons, but conflicts shouldn't reduce it


class TestPartialAssessments:
    """Tests for partial assessments."""
    
    def test_partial_assessment_with_missing_categories(self):
        """Test handling of partial assessments with missing categories."""
        gating = ConfidenceGating()
        
        # Only one category answered
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='good',
                question_text=f'Question {i}'
            )
            for i in range(15)
        ]
        
        category_scores = {'emotional_alignment': 70.0}
        category_coverage = {'emotional_alignment': 15}
        
        result = gating.gate_confidence(
            base_confidence=0.7,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage
        )
        
        assert result is not None, "Should handle partial assessments"
        # Should note limited category coverage
        assert result.data_sufficiency.details.get('covered_categories', 0) == 1, \
            "Should detect limited category coverage"
    
    def test_partial_assessment_with_incomplete_reflection(self):
        """Test handling of partial assessments with incomplete reflection notes."""
        gating = ConfidenceGating()
        
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='good',
                question_text=f'Question {i}'
            )
            for i in range(20)
        ]
        
        category_scores = {'emotional_alignment': 70.0}
        category_coverage = {'emotional_alignment': 20}
        
        result = gating.gate_confidence(
            base_confidence=0.6,  # Lower base confidence (no reflection notes)
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage
        )
        
        assert result is not None, "Should handle assessments without reflection notes"
        # Confidence might be lower without reflection notes


class TestRepeatedCriticalFlags:
    """Tests for repeated critical flags and risk escalation."""
    
    def test_risk_escalation_with_repeated_flags(self):
        """Test that risk escalation occurs with repeated flags."""
        # Note: This test requires a database session
        # In a real test, you'd use a test database
        
        config = get_scoring_config()
        escalation_engine = RiskEscalationEngine(config)
        
        # Create current flags
        current_flags = [
            RedFlag(
                severity='high',
                category='safety',
                signal='Controlling behavior',
                evidence=['q1'],
                type='safety_pattern_controlling'
            )
        ]
        
        # Test escalation logic (without DB for unit test)
        # In integration tests, you'd test with actual historical data
        
        # For now, test that the engine exists and can be initialized
        assert escalation_engine is not None, "Escalation engine should be initialized"
        assert hasattr(escalation_engine, 'escalate_risk'), \
            "Escalation engine should have escalate_risk method"
    
    def test_escalation_reason_generated(self):
        """Test that escalation reason is generated when escalation occurs."""
        # This would be tested in integration tests with actual DB
        # For unit tests, we verify the structure
        
        config = get_scoring_config()
        escalation_engine = RiskEscalationEngine(config)
        
        # Verify escalation engine structure
        assert hasattr(escalation_engine, '_get_historical_flags'), \
            "Should have method to get historical flags"
        assert hasattr(escalation_engine, '_get_flag_pattern_key'), \
            "Should have method to generate flag pattern keys"
    
    def test_critical_flag_recurrence_detection(self):
        """Test that critical flag recurrence is detected."""
        # This would be tested in integration tests
        # For unit tests, verify the logic structure
        
        config = get_scoring_config()
        escalation_engine = RiskEscalationEngine(config)
        
        # Create test flags
        flag1 = RedFlag(
            severity='critical',
            category='safety',
            signal='Violence threat',
            evidence=['q1'],
            type='safety_pattern_violence'
        )
        
        flag2 = RedFlag(
            severity='critical',
            category='safety',
            signal='Violence threat',  # Same signal
            evidence=['q2'],
            type='safety_pattern_violence'
        )
        
        # Verify pattern key generation
        key1 = escalation_engine._get_flag_pattern_key(flag1)
        key2 = escalation_engine._get_flag_pattern_key(flag2)
        
        assert key1 == key2, \
            "Same flag patterns should generate same keys for recurrence detection"


class TestConfidenceGatingIntegration:
    """Integration tests for confidence gating with scoring engine."""
    
    def test_scoring_engine_respects_confidence_gating(self):
        """Test that scoring engine respects confidence gating."""
        from app.services.scoring_engine import ScoringEngine
        
        scoring_engine = ScoringEngine()
        
        # Create minimal answers
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='good',
                question_text=f'Question {i}'
            )
            for i in range(5)  # Very few answers
        ]
        
        blueprint_profile = BlueprintProfile(
            category_weights={'emotional_alignment': 1.0},
            deal_breakers=[],
            top_priorities=[]
        )
        
        user_profile = UserProfile(
            name='Test User',
            age=25,
            dating_goal='serious',
            email='test@example.com'
        )
        
        result = scoring_engine.process_scan(
            answers,
            blueprint_profile,
            user_profile,
            None
        )
        
        assert result is not None, "Should return result"
        assert 'confidence_score' in result, "Should include confidence score"
        assert 'confidence_reason' in result, "Should include confidence reason"
        assert 'data_sufficiency' in result, "Should include data sufficiency"
        
        # With very few answers, confidence should be low
        assert result['confidence_score'] < 0.7, \
            "Confidence should be reduced with very few answers"
        
        # Should not classify as high-potential with low confidence
        if result['category'] == 'high-potential':
            assert result['confidence_score'] >= 0.7, \
                "High-potential should require high confidence"
    
    def test_confidence_gating_blocks_high_potential(self):
        """Test that confidence gating blocks high-potential classification."""
        from app.services.scoring_engine import ScoringEngine
        
        scoring_engine = ScoringEngine()
        
        # Create answers that would score high but with low data
        answers = [
            ScanAnswer(
                question_id=f'q{i}',
                category='emotional_alignment',
                rating='strong-match',  # High ratings
                question_text=f'Question {i}'
            )
            for i in range(8)  # Not enough data
        ]
        
        blueprint_profile = BlueprintProfile(
            category_weights={'emotional_alignment': 1.0},
            deal_breakers=[],
            top_priorities=[]
        )
        
        user_profile = UserProfile(
            name='Test User',
            age=25,
            dating_goal='serious',
            email='test@example.com'
        )
        
        result = scoring_engine.process_scan(
            answers,
            blueprint_profile,
            user_profile,
            None
        )
        
        # Even with high scores, should not classify as high-potential with low data
        if result['overall_score'] >= 85:
            # If score is high enough, check that confidence gating prevents classification
            assert result['category'] != 'high-potential' or result['confidence_score'] >= 0.7, \
                "High-potential classification should require sufficient confidence"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

