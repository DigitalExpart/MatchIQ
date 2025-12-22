"""
Cumulative Risk Escalation Logic

Extends the Red Flag Engine to track historical red flags per user and escalate
severity when patterns repeat across multiple scans.

Rules:
- No predictions
- No advice
- No new red flag types
- Escalation increases clarity, not alarmism
- Tracks cross-scan recurrence of critical signals
"""
from typing import List, Dict, Optional, Set
from dataclasses import dataclass
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.db_models import RedFlag, Scan, ScanResult
from app.services.scoring_logic import ScanAnswer
from app.services.red_flag_engine import RedFlag


@dataclass
class EscalationResult:
    """Result of risk escalation analysis"""
    escalated_flags: List[Dict]  # Flags with escalated severity
    escalation_reason: str  # Explanation of escalation
    historical_pattern: Dict  # Pattern data from history
    escalation_metadata: Dict  # Additional metadata


@dataclass
class HistoricalPattern:
    """Pattern detected across historical scans"""
    flag_type: str
    category: str
    occurrence_count: int
    first_seen: datetime
    last_seen: datetime
    severity_history: List[str]  # List of severities in chronological order
    scan_ids: List[str]  # Scan IDs where this pattern appeared


class RiskEscalationEngine:
    """
    Engine for tracking and escalating red flags based on historical patterns.
    """
    
    def __init__(self, db: Session):
        self.db = db
        # Time window for pattern detection (days)
        self.pattern_window_days = 90
        # Minimum occurrences for escalation
        self.min_occurrences_for_escalation = {
            'critical': 1,  # Critical flags escalate immediately
            'high': 2,      # High severity flags need 2 occurrences
            'medium': 3,   # Medium severity flags need 3 occurrences
            'low': 4       # Low severity flags need 4 occurrences
        }
    
    def analyze_historical_patterns(
        self,
        user_id: str,
        current_flags: List[RedFlag],
        current_scan_id: str
    ) -> EscalationResult:
        """
        Analyze historical red flags and escalate current flags if patterns repeat.
        
        Args:
            user_id: User ID to analyze history for
            current_flags: Red flags detected in current scan
            current_scan_id: ID of current scan
        
        Returns:
            EscalationResult with escalated flags and reasoning
        """
        escalated_flags = []
        escalation_reasons = []
        historical_patterns = {}
        
        # Get historical red flags for this user
        historical_flags = self._get_historical_flags(user_id, current_scan_id)
        
        # Group historical flags by type and category
        historical_by_pattern = self._group_flags_by_pattern(historical_flags)
        
        # Analyze each current flag for escalation
        for current_flag in current_flags:
            pattern_key = self._get_pattern_key(current_flag)
            
            # Check if this pattern has appeared before
            if pattern_key in historical_by_pattern:
                historical_pattern = historical_by_pattern[pattern_key]
                
                # Check if escalation criteria met
                should_escalate, reason = self._should_escalate(
                    current_flag,
                    historical_pattern
                )
                
                if should_escalate:
                    # Create escalated flag
                    escalated_flag = self._create_escalated_flag(
                        current_flag,
                        historical_pattern,
                        reason
                    )
                    escalated_flags.append(escalated_flag)
                    escalation_reasons.append(reason)
                    historical_patterns[pattern_key] = historical_pattern
        
        # Build escalation reason
        if escalation_reasons:
            escalation_reason = f"Pattern recurrence detected: {'; '.join(escalation_reasons[:3])}"
            if len(escalation_reasons) > 3:
                escalation_reason += f" and {len(escalation_reasons) - 3} more pattern(s)"
        else:
            escalation_reason = "No escalation needed - patterns are new or below threshold"
        
        return EscalationResult(
            escalated_flags=escalated_flags,
            escalation_reason=escalation_reason,
            historical_pattern={
                'pattern_count': len(historical_patterns),
                'patterns': historical_patterns
            },
            escalation_metadata={
                'escalated_count': len(escalated_flags),
                'total_current_flags': len(current_flags),
                'historical_flag_count': len(historical_flags)
            }
        )
    
    def _get_historical_flags(
        self,
        user_id: str,
        exclude_scan_id: str,
        days: Optional[int] = None
    ) -> List[RedFlag]:
        """
        Get historical red flags for user within time window.
        
        Args:
            user_id: User ID
            exclude_scan_id: Scan ID to exclude (current scan)
            days: Number of days to look back (default: pattern_window_days)
        
        Returns:
            List of RedFlag objects from history
        """
        days = days or self.pattern_window_days
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Query historical flags
        historical_flags_query = self.db.query(RedFlag).join(Scan).filter(
            Scan.user_id == user_id,
            Scan.id != exclude_scan_id,
            RedFlag.detected_at >= cutoff_date
        )
        
        historical_flags = historical_flags_query.all()
        
        # Convert to RedFlag dataclass objects
        result = []
        for flag in historical_flags:
            result.append(RedFlag(
                severity=flag.severity,
                category=flag.category,
                signal=flag.signal,
                evidence=flag.evidence or [],
                type=flag.type
            ))
        
        return result
    
    def _group_flags_by_pattern(
        self,
        flags: List[RedFlag]
    ) -> Dict[str, HistoricalPattern]:
        """
        Group flags by pattern (type + category) and build historical patterns.
        
        Returns:
            Dictionary mapping pattern_key to HistoricalPattern
        """
        patterns = {}
        
        for flag in flags:
            pattern_key = self._get_pattern_key(flag)
            
            if pattern_key not in patterns:
                patterns[pattern_key] = HistoricalPattern(
                    flag_type=flag.type or 'unknown',
                    category=flag.category,
                    occurrence_count=0,
                    first_seen=datetime.utcnow(),
                    last_seen=datetime.utcnow(),
                    severity_history=[],
                    scan_ids=[]
                )
            
            pattern = patterns[pattern_key]
            pattern.occurrence_count += 1
            pattern.severity_history.append(flag.severity)
            # Note: We don't have scan_id in RedFlag dataclass, so we'll track by count
            # In production, you'd want to include scan_id in the dataclass
        
        return patterns
    
    def _get_pattern_key(self, flag: RedFlag) -> str:
        """
        Generate a key for grouping flags by pattern.
        
        Uses type and category to identify similar patterns.
        """
        flag_type = flag.type or 'unknown'
        return f"{flag_type}:{flag.category}"
    
    def _should_escalate(
        self,
        current_flag: RedFlag,
        historical_pattern: HistoricalPattern
    ) -> tuple[bool, str]:
        """
        Determine if a flag should be escalated based on historical pattern.
        
        Returns:
            (should_escalate: bool, reason: str)
        """
        # Get minimum occurrences required for escalation
        min_occurrences = self.min_occurrences_for_escalation.get(
            current_flag.severity,
            3  # Default
        )
        
        # Check if pattern has occurred enough times
        total_occurrences = historical_pattern.occurrence_count + 1  # +1 for current
        
        if total_occurrences < min_occurrences:
            return False, ""
        
        # Determine escalation based on severity progression
        severity_levels = ['low', 'medium', 'high', 'critical']
        current_severity_index = severity_levels.index(current_flag.severity) if current_flag.severity in severity_levels else 0
        
        # Check if severity has been increasing
        if len(historical_pattern.severity_history) > 0:
            # Count occurrences of each severity level
            severity_counts = {}
            for sev in historical_pattern.severity_history + [current_flag.severity]:
                severity_counts[sev] = severity_counts.get(sev, 0) + 1
            
            # Escalate if pattern is recurring at same or higher severity
            if current_flag.severity in ['high', 'critical']:
                # High/critical flags escalate if recurring
                if total_occurrences >= min_occurrences:
                    new_severity = 'critical' if current_flag.severity == 'high' else current_flag.severity
                    reason = f"Recurring {current_flag.severity} severity pattern detected ({total_occurrences} occurrence(s))"
                    return True, reason
        
        # For medium/low severity, escalate if recurring multiple times
        if total_occurrences >= min_occurrences:
            # Escalate by one level
            if current_flag.severity == 'low' and total_occurrences >= 4:
                reason = f"Recurring low severity pattern ({total_occurrences} occurrence(s))"
                return True, reason
            elif current_flag.severity == 'medium' and total_occurrences >= 3:
                reason = f"Recurring medium severity pattern ({total_occurrences} occurrence(s))"
                return True, reason
        
        return False, ""
    
    def _create_escalated_flag(
        self,
        original_flag: RedFlag,
        historical_pattern: HistoricalPattern,
        escalation_reason: str
    ) -> Dict:
        """
        Create an escalated version of a flag.
        
        Escalation increases severity by one level (low->medium->high->critical).
        """
        severity_levels = ['low', 'medium', 'high', 'critical']
        current_index = severity_levels.index(original_flag.severity) if original_flag.severity in severity_levels else 0
        
        # Escalate severity (but don't go beyond critical)
        if current_index < len(severity_levels) - 1:
            new_severity = severity_levels[current_index + 1]
        else:
            new_severity = original_flag.severity  # Already at critical
        
        # Build escalated signal with context
        escalated_signal = f"{original_flag.signal} [Escalated: {escalation_reason}]"
        
        return {
            'severity': new_severity,
            'category': original_flag.category,
            'signal': escalated_signal,
            'evidence': original_flag.evidence,
            'type': original_flag.type,
            'escalation_reason': escalation_reason,
            'original_severity': original_flag.severity,
            'occurrence_count': historical_pattern.occurrence_count + 1,
            'is_escalated': True
        }
    
    def detect_cross_scan_critical_signals(
        self,
        user_id: str,
        current_flags: List[RedFlag],
        current_scan_id: str
    ) -> List[Dict]:
        """
        Detect critical signals that appear across multiple scans.
        
        This is a specialized check for critical-level flags that recur.
        """
        critical_flags = [f for f in current_flags if f.severity == 'critical']
        
        if not critical_flags:
            return []
        
        historical_flags = self._get_historical_flags(user_id, current_scan_id, days=180)  # 6 months for critical
        historical_critical = [f for f in historical_flags if f.severity == 'critical']
        
        cross_scan_critical = []
        
        for current_flag in critical_flags:
            pattern_key = self._get_pattern_key(current_flag)
            
            # Check if this critical pattern appeared before
            matching_historical = [
                f for f in historical_critical
                if self._get_pattern_key(f) == pattern_key
            ]
            
            if matching_historical:
                cross_scan_critical.append({
                    'flag': current_flag,
                    'historical_count': len(matching_historical),
                    'pattern_key': pattern_key,
                    'message': f"Critical pattern '{pattern_key}' has appeared {len(matching_historical) + 1} time(s) across scans"
                })
        
        return cross_scan_critical

