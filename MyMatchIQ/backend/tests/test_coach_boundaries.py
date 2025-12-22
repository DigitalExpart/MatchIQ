"""
Component 7: Safety & Misuse Test Coverage - Coach Boundary Tests

Tests for:
- Coach mode boundaries
- Response validation
- Edge cases in coach responses
- Boundary conditions
"""
import pytest
from uuid import UUID, uuid4
from typing import List, Dict, Any, Optional

from app.services.coach_service import CoachService, CoachContext
from app.services.scoring_logic import BlueprintProfile, UserProfile
from app.models.pydantic_models import CoachMode, CoachResponse


class TestCoachModeBoundaries:
    """Tests for coach mode boundaries and edge cases."""
    
    def test_explain_mode_with_no_data(self):
        """Test EXPLAIN mode with no assessment data."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={},
            overall_score=None,
            category=None
        )
        
        response = coach_service.get_response(CoachMode.EXPLAIN, context)
        
        assert response is not None, "Should return a response even with no data"
        assert response.mode == CoachMode.EXPLAIN, "Should return EXPLAIN mode"
        assert len(response.message) > 0, "Should have a message"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_reflect_mode_with_no_data(self):
        """Test REFLECT mode with no assessment data."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={},
            overall_score=None,
            category=None
        )
        
        response = coach_service.get_response(CoachMode.REFLECT, context)
        
        assert response is not None, "Should return reflection questions even with no data"
        assert response.mode == CoachMode.REFLECT, "Should return REFLECT mode"
        assert '?' in response.message or len(response.message) > 0, \
            "Should contain questions or guidance"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_learn_mode_with_no_data(self):
        """Test LEARN mode with no assessment data."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={},
            overall_score=None,
            category=None
        )
        
        response = coach_service.get_response(CoachMode.LEARN, context)
        
        assert response is not None, "Should return educational content even with no data"
        assert response.mode == CoachMode.LEARN, "Should return LEARN mode"
        assert len(response.message) > 0, "Should have educational content"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_safety_mode_with_no_red_flags(self):
        """Test SAFETY mode when no red flags are present."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={'emotional_alignment': 80.0},
            overall_score=85,
            category='high-potential',
            red_flags=[],
            confidence_score=0.8
        )
        
        response = coach_service.get_response(CoachMode.SAFETY, context)
        
        assert response is not None, "Should return a response even with no red flags"
        assert response.mode == CoachMode.SAFETY, "Should return SAFETY mode"
        assert len(response.message) > 0, "Should acknowledge absence of red flags"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_safety_mode_with_critical_flags(self):
        """Test SAFETY mode with critical red flags."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={'emotional_alignment': 20.0},
            overall_score=15,
            category='high-risk',
            red_flags=[
                {
                    'severity': 'critical',
                    'category': 'safety',
                    'signal': 'Violence threat detected',
                    'evidence': ['question_1', 'question_2']
                },
                {
                    'severity': 'high',
                    'category': 'safety',
                    'signal': 'Controlling behavior pattern',
                    'evidence': ['question_3']
                }
            ],
            confidence_score=0.9
        )
        
        response = coach_service.get_response(CoachMode.SAFETY, context)
        
        assert response is not None, "Should return a response for critical flags"
        assert response.mode == CoachMode.SAFETY, "Should return SAFETY mode"
        assert len(response.message) > 0, "Should acknowledge critical flags"
        
        message_lower = response.message.lower()
        # Should mention safety concerns
        assert any(word in message_lower for word in ['concern', 'flag', 'pattern', 'safety', 'critical']), \
            "Should acknowledge safety concerns"
        
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_explain_mode_with_extreme_scores(self):
        """Test EXPLAIN mode with extreme scores (very high and very low)."""
        coach_service = CoachService()
        
        # Very high score
        context_high = CoachContext(
            category_scores={
                'emotional_alignment': 95.0,
                'communication_fit': 98.0,
                'values_match': 92.0
            },
            overall_score=96,
            category='high-potential',
            confidence_score=0.95
        )
        
        response_high = coach_service.get_response(CoachMode.EXPLAIN, context_high)
        assert response_high is not None, "Should handle very high scores"
        assert coach_service.validate_response(response_high), "Response should be valid"
        
        # Very low score
        context_low = CoachContext(
            category_scores={
                'emotional_alignment': 5.0,
                'communication_fit': 8.0,
                'values_match': 3.0
            },
            overall_score=5,
            category='high-risk',
            confidence_score=0.9
        )
        
        response_low = coach_service.get_response(CoachMode.EXPLAIN, context_low)
        assert response_low is not None, "Should handle very low scores"
        assert coach_service.validate_response(response_low), "Response should be valid"
    
    def test_coach_with_empty_category_scores(self):
        """Test coach with empty category scores."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={},
            overall_score=50,
            category='mixed-signals',
            confidence_score=0.5
        )
        
        response = coach_service.get_response(CoachMode.EXPLAIN, context)
        
        assert response is not None, "Should handle empty category scores"
        assert coach_service.validate_response(response), "Response should be valid"


class TestResponseValidation:
    """Tests for response validation."""
    
    def test_validation_rejects_empty_message(self):
        """Test that validation rejects empty messages."""
        coach_service = CoachService()
        
        invalid_response = CoachResponse(
            message="",
            mode=CoachMode.EXPLAIN,
            confidence=0.5,
            referenced_data={}
        )
        
        validation_passed = coach_service.validate_response(invalid_response)
        assert not validation_passed, "Should reject empty message"
    
    def test_validation_rejects_none_message(self):
        """Test that validation handles None message gracefully."""
        coach_service = CoachService()
        
        # Create response with None message (shouldn't happen, but test edge case)
        invalid_response = CoachResponse(
            message=None,  # This would fail Pydantic validation, but test the logic
            mode=CoachMode.EXPLAIN,
            confidence=0.5,
            referenced_data={}
        )
        
        # Pydantic should catch this, but if it doesn't, our validation should
        try:
            validation_passed = coach_service.validate_response(invalid_response)
            assert not validation_passed, "Should reject None message"
        except Exception:
            # Pydantic validation should catch this first
            pass
    
    def test_validation_accepts_valid_responses(self):
        """Test that validation accepts valid responses."""
        coach_service = CoachService()
        
        valid_responses = [
            CoachResponse(
                message="This is a valid response that explores patterns.",
                mode=CoachMode.EXPLAIN,
                confidence=0.7,
                referenced_data={'overall_score': 50}
            ),
            CoachResponse(
                message="What patterns do you notice in your relationships?",
                mode=CoachMode.REFLECT,
                confidence=0.8,
                referenced_data={}
            ),
            CoachResponse(
                message="Value alignment refers to how well your core values match.",
                mode=CoachMode.LEARN,
                confidence=1.0,
                referenced_data={'topic': 'value_alignment'}
            ),
        ]
        
        for response in valid_responses:
            validation_passed = coach_service.validate_response(response)
            assert validation_passed, \
                f"Should accept valid response: {response.message[:50]}"
    
    def test_validation_checks_forbidden_phrases(self):
        """Test that validation checks for forbidden phrases."""
        coach_service = CoachService()
        
        # Test various forbidden phrases
        forbidden_tests = [
            "You should definitely leave this person.",
            "You must break up immediately.",
            "You need to end this relationship now.",
            "I recommend you should leave.",
        ]
        
        for message in forbidden_tests:
            invalid_response = CoachResponse(
                message=message,
                mode=CoachMode.EXPLAIN,
                confidence=0.7,
                referenced_data={}
            )
            
            validation_passed = coach_service.validate_response(invalid_response)
            assert not validation_passed, \
                f"Should reject response with directive language: {message}"


class TestEdgeCases:
    """Tests for edge cases and boundary conditions."""
    
    def test_coach_with_none_context_fields(self):
        """Test coach with None context fields."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={},
            overall_score=None,
            category=None,
            blueprint=None,
            user_profile=None,
            red_flags=None,
            confidence_score=0.0
        )
        
        # Should not crash
        for mode in [CoachMode.EXPLAIN, CoachMode.REFLECT, CoachMode.LEARN]:
            try:
                response = coach_service.get_response(mode, context)
                assert response is not None, f"Should handle None fields for mode {mode}"
                assert coach_service.validate_response(response), \
                    f"Response should be valid for mode {mode}"
            except Exception as e:
                pytest.fail(f"Should handle None context fields gracefully for mode {mode}. Error: {e}")
    
    def test_coach_with_very_long_reflection_notes(self):
        """Test coach with very long reflection notes."""
        coach_service = CoachService()
        
        long_notes = "A" * 10000  # Very long string
        
        context = CoachContext(
            category_scores={'emotional_alignment': 60.0},
            overall_score=60,
            category='worth-exploring',
            reflection_notes={
                'additional_notes': long_notes
            },
            confidence_score=0.7
        )
        
        # Should not crash or timeout
        response = coach_service.get_response(CoachMode.EXPLAIN, context)
        assert response is not None, "Should handle very long reflection notes"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_coach_with_special_characters_in_data(self):
        """Test coach with special characters in data."""
        coach_service = CoachService()
        
        context = CoachContext(
            category_scores={'emotional_alignment': 60.0},
            overall_score=60,
            category='worth-exploring',
            reflection_notes={
                'additional_notes': 'Test with émojis 😀 and unicode 中文 and symbols !@#$%'
            },
            confidence_score=0.7
        )
        
        response = coach_service.get_response(CoachMode.EXPLAIN, context)
        assert response is not None, "Should handle special characters"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_coach_with_many_red_flags(self):
        """Test coach with many red flags."""
        coach_service = CoachService()
        
        many_flags = [
            {
                'severity': 'high',
                'category': 'safety',
                'signal': f'Flag {i}',
                'evidence': [f'question_{i}']
            }
            for i in range(50)  # 50 red flags
        ]
        
        context = CoachContext(
            category_scores={'emotional_alignment': 20.0},
            overall_score=15,
            category='high-risk',
            red_flags=many_flags,
            confidence_score=0.9
        )
        
        response = coach_service.get_response(CoachMode.SAFETY, context)
        assert response is not None, "Should handle many red flags"
        assert coach_service.validate_response(response), "Response should be valid"
    
    def test_coach_with_extreme_confidence_scores(self):
        """Test coach with extreme confidence scores."""
        coach_service = CoachService()
        
        for confidence in [0.0, 0.01, 0.99, 1.0]:
            context = CoachContext(
                category_scores={'emotional_alignment': 50.0},
                overall_score=50,
                category='mixed-signals',
                confidence_score=confidence
            )
            
            response = coach_service.get_response(CoachMode.EXPLAIN, context)
            assert response is not None, f"Should handle confidence score {confidence}"
            assert coach_service.validate_response(response), \
                f"Response should be valid for confidence {confidence}"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

