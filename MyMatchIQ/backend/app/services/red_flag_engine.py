"""
Red Flag & Risk Detection Engine
"""
from typing import List, Dict, Optional
from dataclasses import dataclass
from sqlalchemy.orm import Session
from app.services.scoring_logic import ScanAnswer, BlueprintProfile, UserProfile, ReflectionNotes, RATING_SCORES
from app.services.scoring_config import get_scoring_config


@dataclass
class RedFlag:
    severity: str  # 'low', 'medium', 'high', 'critical'
    category: str
    signal: str
    evidence: List[str]
    type: Optional[str] = None


@dataclass
class Inconsistency:
    type: str
    description: str
    questions: List[str]
    severity: str


@dataclass
class ProfileMismatch:
    description: str
    severity: str
    category: str


# Safety patterns to detect
SAFETY_PATTERNS = {
    'controlling_behavior': {
        'keywords': ['control', 'permission', 'allow', 'forbid', 'must ask'],
        'questions': ['communication', 'boundaries', 'independence'],
        'severity': 'critical',
        'description': 'Patterns suggesting controlling behavior'
    },
    'inconsistency': {
        'keywords': ['different story', 'changed', 'contradict'],
        'questions': ['honesty', 'reliability', 'consistency'],
        'severity': 'high',
        'description': 'Inconsistent information or behavior'
    },
    'boundary_disrespect': {
        'keywords': ['ignored', 'pushed', 'insisted', "wouldn't accept"],
        'questions': ['boundaries', 'respect', 'consent'],
        'severity': 'critical',
        'description': 'Disrespect for stated boundaries'
    },
    'emotional_manipulation': {
        'keywords': ['guilt', 'blame', 'made me feel', 'manipulate'],
        'questions': ['communication', 'emotional', 'respect'],
        'severity': 'high',
        'description': 'Patterns suggesting emotional manipulation'
    },
    'isolation_attempts': {
        'keywords': ['friends', 'family', 'isolate', 'separate'],
        'questions': ['relationships', 'support', 'independence'],
        'severity': 'critical',
        'description': 'Attempts to isolate from support systems'
    },
    'intensity_rushing': {
        'keywords': ['too fast', 'rushed', 'pressure', 'commitment'],
        'questions': ['pace', 'timing', 'boundaries'],
        'severity': 'medium',
        'description': 'Rushing intimacy or commitment'
    }
}


class RedFlagEngine:
    """
    Engine for detecting red flags and safety concerns.
    Uses configuration thresholds for severity determination.
    Supports risk escalation based on historical patterns.
    """
    
    def __init__(self, db: Optional[Session] = None):
        self.scoring_config = get_scoring_config()
        self.db = db  # Optional database session for escalation
    
    def detect_all(
        self,
        answers: List[ScanAnswer],
        blueprint_profile: BlueprintProfile,
        user_profile: UserProfile,
        reflection_notes: Optional[ReflectionNotes] = None,
        user_id: Optional[str] = None,
        scan_id: Optional[str] = None,
        apply_escalation: bool = True
    ) -> List[RedFlag]:
        """
        Run all flag detection methods.
        
        Args:
            answers: Scan answers
            blueprint_profile: User's blueprint profile
            user_profile: User profile
            reflection_notes: Optional reflection notes
            user_id: Optional user ID for escalation analysis
            scan_id: Optional scan ID for escalation analysis
            apply_escalation: Whether to apply risk escalation logic
        
        Returns:
            List of RedFlag objects (may include escalated flags)
        """
        all_flags = []
        
        # Deal-breaker violations
        all_flags.extend(
            self._detect_deal_breaker_violations(answers, blueprint_profile)
        )
        
        # Safety patterns
        all_flags.extend(
            self._detect_safety_patterns(answers, reflection_notes)
        )
        
        # Aggregate and prioritize
        prioritized = self._aggregate_and_prioritize(all_flags)
        
        # Apply risk escalation if database session available
        if apply_escalation and self.db and user_id and scan_id:
            try:
                from app.services.risk_escalation import RiskEscalationEngine
                escalation_engine = RiskEscalationEngine(self.db)
                escalation_result = escalation_engine.analyze_historical_patterns(
                    user_id=user_id,
                    current_flags=prioritized,
                    current_scan_id=scan_id
                )
                
                # Replace escalated flags
                if escalation_result.escalated_flags:
                    # Remove original flags that were escalated
                    escalated_pattern_keys = {
                        f"{f.get('type', 'unknown')}:{f.get('category', 'unknown')}"
                        for f in escalation_result.escalated_flags
                    }
                    
                    # Keep non-escalated flags
                    non_escalated = [
                        f for f in prioritized
                        if f"{f.type or 'unknown'}:{f.category}" not in escalated_pattern_keys
                    ]
                    
                    # Convert escalated flags back to RedFlag objects
                    escalated_red_flags = []
                    for escalated_dict in escalation_result.escalated_flags:
                        escalated_red_flags.append(RedFlag(
                            severity=escalated_dict['severity'],
                            category=escalated_dict['category'],
                            signal=escalated_dict['signal'],
                            evidence=escalated_dict['evidence'],
                            type=escalated_dict.get('type')
                        ))
                    
                    # Combine non-escalated and escalated flags
                    prioritized = non_escalated + escalated_red_flags
                    
                    # Re-prioritize with escalated flags
                    prioritized = self._aggregate_and_prioritize(prioritized)
                    
                    # Store escalation reason (will be saved to scan_result)
                    self._last_escalation_reason = escalation_result.escalation_reason
                else:
                    self._last_escalation_reason = None
            except Exception as e:
                # If escalation fails, continue with original flags
                # Log error but don't break the flow
                import logging
                logging.warning(f"Risk escalation failed: {e}")
                self._last_escalation_reason = None
        else:
            self._last_escalation_reason = None
        
        return prioritized
    
    def get_escalation_reason(self) -> Optional[str]:
        """Get escalation reason from last detection, if any."""
        return getattr(self, '_last_escalation_reason', None)
    
    def _detect_deal_breaker_violations(
        self,
        answers: List[ScanAnswer],
        blueprint_profile: BlueprintProfile
    ) -> List[RedFlag]:
        """
        Detect when responses violate user's stated deal-breakers.
        """
        flags = []
        
        for deal_breaker in blueprint_profile.deal_breakers:
            category = deal_breaker['category']
            question_id = deal_breaker.get('question_id')
            
            # Find relevant answers
            relevant_answers = [
                a for a in answers 
                if a.category == category
            ]
            
            if question_id:
                relevant_answers = [
                    a for a in relevant_answers 
                    if a.question_id == question_id
                ]
            
            # Check for violations
            for answer in relevant_answers:
                if answer.rating == 'red-flag':
                    # Use config to determine severity for deal-breaker violations
                    threshold = self.scoring_config.red_flag_severity_thresholds.get('critical', {})
                    severity = 'critical' if threshold.get('auto_escalate', True) else 'high'
                    
                    flags.append(RedFlag(
                        severity=severity,
                        category=category,
                        signal=f"Response conflicts with your deal-breaker: {deal_breaker.get('description', category)}",
                        evidence=[answer.question_id],
                        type='deal_breaker_violation'
                    ))
                elif answer.rating == 'yellow-flag' and question_id:
                    flags.append(RedFlag(
                        severity='high',
                        category=category,
                        signal=f"Potential conflict with your deal-breaker: {deal_breaker.get('description', category)}",
                        evidence=[answer.question_id],
                        type='deal_breaker_potential'
                    ))
        
        return flags
    
    def _detect_safety_patterns(
        self,
        answers: List[ScanAnswer],
        reflection_notes: Optional[ReflectionNotes] = None
    ) -> List[RedFlag]:
        """
        Detect safety-related patterns in responses and reflection notes.
        """
        flags = []
        
        # Check answers for safety patterns
        for answer in answers:
            answer_lower = (answer.question_text.lower() + ' ' + str(answer.rating).lower())
            
            for pattern_name, pattern_config in SAFETY_PATTERNS.items():
                if answer.category in pattern_config['questions']:
                    if any(kw in answer_lower for kw in pattern_config['keywords']):
                        if answer.rating == 'red-flag':
                            severity = pattern_config['severity']
                        elif answer.rating == 'yellow-flag':
                            severity_map = {
                                'critical': 'high',
                                'high': 'medium',
                                'medium': 'low'
                            }
                            severity = severity_map.get(pattern_config['severity'], 'medium')
                        else:
                            continue
                        
                        flags.append(RedFlag(
                            severity=severity,
                            category=answer.category,
                            signal=pattern_config['description'],
                            evidence=[answer.question_id],
                            type=f'safety_pattern_{pattern_name}'
                        ))
        
        # Check reflection notes
        if reflection_notes:
            notes_dict = {
                'good_moments': reflection_notes.good_moments or '',
                'worst_moments': reflection_notes.worst_moments or '',
                'sad_moments': reflection_notes.sad_moments or '',
                'vulnerable_moments': reflection_notes.vulnerable_moments or '',
                'additional_notes': reflection_notes.additional_notes or ''
            }
            
            notes_text = ' '.join([notes for notes in notes_dict.values() if notes]).lower()
            
            for pattern_name, pattern_config in SAFETY_PATTERNS.items():
                if any(kw in notes_text for kw in pattern_config['keywords']):
                    flags.append(RedFlag(
                        severity=pattern_config['severity'],
                        category='general',
                        signal=f"{pattern_config['description']} (mentioned in your reflections)",
                        evidence=['reflection_notes'],
                        type=f'safety_pattern_{pattern_name}_reflection'
                    ))
        
        return flags
    
    def detect_inconsistencies(
        self,
        answers: List[ScanAnswer]
    ) -> List[Inconsistency]:
        """
        Detect inconsistent responses within the same assessment.
        """
        inconsistencies = []
        
        # Group by category
        category_answers = {}
        for answer in answers:
            cat = answer.category
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        # Check for contradictory responses
        for category, cat_answers in category_answers.items():
            if len(cat_answers) < 2:
                continue
            
            ratings = [a.rating for a in cat_answers]
            rating_scores = [RATING_SCORES.get(r, 50) for r in ratings]
            
            # Large gap in ratings
            if max(rating_scores) - min(rating_scores) >= 75:
                inconsistencies.append(Inconsistency(
                    type='contradictory_responses',
                    description=f'Significant variance in {category} responses',
                    questions=[a.question_id for a in cat_answers],
                    severity='medium'
                ))
            
            # Isolated red flag in otherwise positive responses
            if ratings.count('red-flag') == 1 and all(
                r in ['strong-match', 'good', 'neutral'] 
                for r in ratings if r != 'red-flag'
            ):
                inconsistencies.append(Inconsistency(
                    type='isolated_red_flag',
                    description=f'One red flag stands out in otherwise positive {category} responses',
                    questions=[a.question_id for a in cat_answers if a.rating == 'red-flag'],
                    severity='high'
                ))
        
        return inconsistencies
    
    def detect_profile_mismatches(
        self,
        answers: List[ScanAnswer],
        blueprint_profile: BlueprintProfile,
        user_profile: UserProfile
    ) -> List[ProfileMismatch]:
        """
        Detect when responses don't align with user's profile expectations.
        """
        mismatches = []
        
        # Check dating goal alignment
        if user_profile.dating_goal in ['marriage', 'long-term']:
            goal_answers = [
                a for a in answers
                if 'goal' in a.question_text.lower() or 
                   'future' in a.question_text.lower() or
                   'commitment' in a.question_text.lower()
            ]
            
            if goal_answers:
                low_goal_ratings = [
                    a for a in goal_answers 
                    if a.rating in ['yellow-flag', 'red-flag']
                ]
                
                if len(low_goal_ratings) > len(goal_answers) * 0.5:
                    mismatches.append(ProfileMismatch(
                        description=f'Responses about relationship goals may not align with your {user_profile.dating_goal} goal',
                        severity='high',
                        category='goals'
                    ))
        
        # Check age-appropriate expectations
        if user_profile.age >= 30:
            maturity_answers = [
                a for a in answers
                if 'mature' in a.question_text.lower() or
                   'responsibility' in a.question_text.lower()
            ]
            
            if maturity_answers:
                immaturity_flags = [
                    a for a in maturity_answers
                    if a.rating in ['yellow-flag', 'red-flag']
                ]
                
                if len(immaturity_flags) > len(maturity_answers) * 0.4:
                    mismatches.append(ProfileMismatch(
                        description=f'At {user_profile.age}, maturity levels may not align with your expectations',
                        severity='medium',
                        category='maturity'
                    ))
        
        return mismatches
    
    def _aggregate_and_prioritize(
        self,
        all_flags: List[RedFlag]
    ) -> List[RedFlag]:
        """
        Group flags by severity and remove duplicates.
        """
        # Group by severity
        by_severity = {
            'critical': [],
            'high': [],
            'medium': [],
            'low': []
        }
        
        # Deduplicate
        seen = set()
        
        for flag in all_flags:
            flag_key = (
                flag.signal,
                tuple(sorted(flag.evidence))
            )
            
            if flag_key not in seen:
                seen.add(flag_key)
                by_severity[flag.severity].append(flag)
        
        # Return prioritized list (critical first)
        result = []
        for severity in ['critical', 'high', 'medium', 'low']:
            result.extend(by_severity[severity])
        
        return result

