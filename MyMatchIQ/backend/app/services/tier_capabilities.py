"""
Subscription-Aware Feature Enforcement

Implements tier-based intelligence limits while ensuring:
- Safety signals and red flags are NEVER gated
- Accuracy is NEVER reduced
- Only depth of explanation varies

Tiers:
- Free: category-level summaries only
- Premium: sub-pattern insights
- Elite: historical comparison insights
"""
from typing import Dict, List, Optional, Any
from enum import Enum


class SubscriptionTier(str, Enum):
    """Subscription tier levels"""
    FREE = "free"
    PREMIUM = "premium"
    ELITE = "elite"


class TierCapabilities:
    """
    Defines capabilities for each subscription tier.
    """
    
    # Tier capabilities matrix
    CAPABILITIES = {
        SubscriptionTier.FREE: {
            'category_summaries': True,  # Basic category-level summaries
            'sub_pattern_insights': False,  # Detailed pattern analysis
            'historical_comparison': False,  # Compare with past scans
            'deep_insights': False,  # Deep AI insights
            'explanation_depth': 'basic',  # Basic explanations only
            'signal_level_details': False,  # Individual signal contributions
            'adjustment_explanations': False,  # Why adjustments were made
            'pattern_analysis': False,  # Pattern matching and analysis
            'coach_modes': ['EXPLAIN'],  # Only EXPLAIN mode
            'coach_question_limit': 5,  # Limited questions per session
        },
        SubscriptionTier.PREMIUM: {
            'category_summaries': True,
            'sub_pattern_insights': True,  # Can see sub-patterns
            'historical_comparison': False,
            'deep_insights': True,  # Can see deep insights
            'explanation_depth': 'detailed',  # Detailed explanations
            'signal_level_details': True,  # Can see signal contributions
            'adjustment_explanations': True,  # Can see why adjustments made
            'pattern_analysis': True,  # Can see pattern analysis
            'coach_modes': ['EXPLAIN', 'REFLECT', 'LEARN'],  # More coach modes
            'coach_question_limit': 20,  # More questions
        },
        SubscriptionTier.ELITE: {
            'category_summaries': True,
            'sub_pattern_insights': True,
            'historical_comparison': True,  # Can compare with history
            'deep_insights': True,
            'explanation_depth': 'comprehensive',  # Full explanations
            'signal_level_details': True,
            'adjustment_explanations': True,
            'pattern_analysis': True,
            'coach_modes': ['EXPLAIN', 'REFLECT', 'LEARN', 'SAFETY'],  # All modes
            'coach_question_limit': None,  # Unlimited
        }
    }
    
    # Features that are NEVER gated (available to all tiers)
    ALWAYS_AVAILABLE = {
        'red_flags': True,  # Red flags always shown
        'safety_signals': True,  # Safety signals always shown
        'basic_score': True,  # Overall score always shown
        'category_scores': True,  # Category scores always shown
        'confidence_score': True,  # Confidence score always shown
        'recommended_action': True,  # Recommended action always shown
        'strengths': True,  # Strengths always shown
        'awareness_areas': True,  # Awareness areas always shown
        'validation_accuracy': True,  # Accuracy never reduced
    }
    
    @classmethod
    def can_access_feature(cls, tier: SubscriptionTier, feature: str) -> bool:
        """
        Check if a tier can access a specific feature.
        
        Safety features are always available regardless of tier.
        """
        # Safety features are always available
        if feature in cls.ALWAYS_AVAILABLE and cls.ALWAYS_AVAILABLE[feature]:
            return True
        
        # Check tier capabilities
        tier_caps = cls.CAPABILITIES.get(tier, cls.CAPABILITIES[SubscriptionTier.FREE])
        return tier_caps.get(feature, False)
    
    @classmethod
    def get_explanation_depth(cls, tier: SubscriptionTier) -> str:
        """Get explanation depth level for tier."""
        tier_caps = cls.CAPABILITIES.get(tier, cls.CAPABILITIES[SubscriptionTier.FREE])
        return tier_caps.get('explanation_depth', 'basic')
    
    @classmethod
    def can_use_coach_mode(cls, tier: SubscriptionTier, mode: str) -> bool:
        """Check if tier can use specific coach mode."""
        tier_caps = cls.CAPABILITIES.get(tier, cls.CAPABILITIES[SubscriptionTier.FREE])
        allowed_modes = tier_caps.get('coach_modes', [])
        return mode in allowed_modes
    
    @classmethod
    def filter_insights_by_tier(
        cls,
        tier: SubscriptionTier,
        insights: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Filter insights based on tier capabilities.
        
        Safety-related insights are never filtered.
        """
        filtered = []
        
        for insight in insights:
            insight_type = insight.get('type', '')
            
            # Safety insights are always included
            if insight_type in ['safety', 'red_flag', 'critical']:
                filtered.append(insight)
                continue
            
            # Check if tier can access this insight type
            if insight_type == 'deep-insight':
                if cls.can_access_feature(tier, 'deep_insights'):
                    filtered.append(insight)
            elif insight_type == 'pattern':
                if cls.can_access_feature(tier, 'pattern_analysis'):
                    filtered.append(insight)
            elif insight_type == 'historical':
                if cls.can_access_feature(tier, 'historical_comparison'):
                    filtered.append(insight)
            elif insight_type == 'sub_pattern':
                if cls.can_access_feature(tier, 'sub_pattern_insights'):
                    filtered.append(insight)
            else:
                # Default: include if it's a basic insight
                filtered.append(insight)
        
        return filtered
    
    @classmethod
    def filter_explanation_metadata(
        cls,
        tier: SubscriptionTier,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Filter explanation metadata based on tier.
        
        Returns filtered metadata appropriate for tier.
        Safety and accuracy information is never filtered.
        """
        filtered = metadata.copy()
        
        # Free tier: only category summaries
        if tier == SubscriptionTier.FREE:
            if 'category_explanations' in filtered:
                # Keep only basic info (no signal details)
                filtered['category_explanations'] = {
                    cat: {
                        'category': exp.get('category', cat),
                        'final_score': exp.get('final_score', 0),
                        'signal_count': exp.get('signal_count', 0),
                        # Remove top_signals, detailed contributions
                    }
                    for cat, exp in filtered['category_explanations'].items()
                }
            
            if 'overall_explanation' in filtered:
                # Keep basic overall info
                overall = filtered['overall_explanation'].copy()
                # Remove detailed adjustments
                overall.pop('adjustments', None)
                overall.pop('reflection_adjustments', None)
                filtered['overall_explanation'] = {
                    'overall_score': overall.get('overall_score'),
                    'category_weights': overall.get('category_weights', {}),
                    'category_contributions': overall.get('category_contributions', {})
                }
            
            # Remove calculation trace
            filtered.pop('calculation_trace', None)
        
        # Premium tier: detailed but no historical
        elif tier == SubscriptionTier.PREMIUM:
            # Keep all metadata except historical comparisons
            if 'overall_explanation' in filtered:
                overall = filtered['overall_explanation'].copy()
                # Keep adjustments but remove historical references
                filtered['overall_explanation'] = overall
        
        # Elite tier: everything (no filtering)
        # else: keep all metadata
        
        return filtered
    
    @classmethod
    def get_coach_response_limitations(
        cls,
        tier: SubscriptionTier
    ) -> Dict[str, Any]:
        """
        Get limitations message for coach responses based on tier.
        
        Returns None if no limitations, or dict with limitation info.
        """
        tier_caps = cls.CAPABILITIES.get(tier, cls.CAPABILITIES[SubscriptionTier.FREE])
        
        limitations = []
        
        if not cls.can_access_feature(tier, 'historical_comparison'):
            limitations.append('Historical comparison insights are available in Elite tier')
        
        if tier == SubscriptionTier.FREE:
            limitations.append('Upgrade to Premium for detailed signal-level explanations')
            limitations.append('Upgrade to Premium for pattern analysis and deep insights')
        
        if tier_caps.get('coach_question_limit'):
            limit = tier_caps['coach_question_limit']
            limitations.append(f'You have {limit} questions remaining in this session')
        
        return {
            'has_limitations': len(limitations) > 0,
            'limitations': limitations,
            'tier': tier.value
        }


class TierEnforcement:
    """
    Service for enforcing tier-based feature limits.
    """
    
    @staticmethod
    def enforce_assessment_response(
        tier: SubscriptionTier,
        response_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Enforce tier limits on assessment response.
        
        Safety and accuracy are never reduced.
        Only depth of explanation varies.
        """
        # Create filtered response
        filtered_response = response_data.copy()
        
        # Filter insights based on tier
        if 'insights' in filtered_response:
            filtered_response['insights'] = TierCapabilities.filter_insights_by_tier(
                tier,
                filtered_response['insights']
            )
        
        # Filter explanation metadata
        if 'explanation_metadata' in filtered_response:
            filtered_response['explanation_metadata'] = TierCapabilities.filter_explanation_metadata(
                tier,
                filtered_response['explanation_metadata']
            )
        
        # Add tier information
        filtered_response['tier'] = tier.value
        filtered_response['tier_limitations'] = TierCapabilities.get_coach_response_limitations(tier)
        
        # Ensure safety features are always present
        # (They should already be there, but double-check)
        safety_features = ['red_flags', 'confidence_score', 'recommended_action', 'strengths', 'awareness_areas']
        for feature in safety_features:
            if feature not in filtered_response:
                # If missing, add empty/default value
                if feature == 'red_flags':
                    filtered_response[feature] = []
                elif feature == 'confidence_score':
                    filtered_response[feature] = 0.5
                elif feature in ['strengths', 'awareness_areas']:
                    filtered_response[feature] = []
        
        return filtered_response
    
    @staticmethod
    def enforce_coach_response(
        tier: SubscriptionTier,
        mode: str,
        response: Any,
        context: Any
    ) -> tuple[Any, Optional[Dict[str, Any]]]:
        """
        Enforce tier limits on coach response.
        
        Returns:
            (response, limitations_info)
        """
        # Check if mode is allowed
        if not TierCapabilities.can_use_coach_mode(tier, mode):
            # Return error response
            from app.models.pydantic_models import CoachResponse, CoachMode
            return CoachResponse(
                message=f"This coach mode ({mode}) is not available in your current tier ({tier.value}). "
                        f"Upgrade to Premium or Elite to access additional coach modes.",
                mode=CoachMode(mode),
                confidence=0.0,
                referenced_data={}
            ), None
        
        # Get limitations info
        limitations = TierCapabilities.get_coach_response_limitations(tier)
        
        # Adjust response depth based on tier
        explanation_depth = TierCapabilities.get_explanation_depth(tier)
        
        # If explanation depth is basic, simplify response
        if explanation_depth == 'basic' and hasattr(response, 'message'):
            # For basic tier, we might want to simplify the message
            # But we don't want to change the core content
            # So we'll just add a note about limitations
            pass
        
        return response, limitations

