"""
Calibration Analyzer

Analyzes aggregate metrics to detect calibration issues.

Purpose:
- Detect boundary crowding (scores clustering near thresholds)
- Identify over/under-triggered flags
- Find confidence misalignment
- Detect escalation spikes

Rules:
- Analysis only - no decisions
- Severity-tagged findings
- No runtime changes
- Proposals only
"""
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
import json
from pathlib import Path

from app.services.scoring_config import get_scoring_config


class FindingSeverity(str, Enum):
    """Severity levels for calibration findings."""
    INFO = "info"  # Informational, no action needed
    LOW = "low"  # Minor issue, monitor
    MEDIUM = "medium"  # Moderate issue, consider adjustment
    HIGH = "high"  # Significant issue, should be addressed
    CRITICAL = "critical"  # Critical issue, requires immediate attention


@dataclass
class CalibrationFinding:
    """A single calibration finding."""
    finding_type: str
    severity: FindingSeverity
    description: str
    evidence: Dict[str, Any]
    recommendation: Optional[str] = None
    affected_components: List[str] = field(default_factory=list)


class CalibrationAnalyzer:
    """
    Analyzes metrics to detect calibration issues.
    
    All analysis is read-only. No changes are made.
    """
    
    def __init__(self, metrics: Dict[str, Any]):
        """
        Initialize analyzer with metrics.
        
        Args:
            metrics: Metrics dictionary from AggregateMetricsCollector
        """
        self.metrics = metrics
        self.scoring_config = get_scoring_config()
        self.findings: List[CalibrationFinding] = []
    
    def analyze_all(self) -> Dict[str, Any]:
        """
        Run all calibration analyses.
        
        Returns:
            Dictionary containing all findings and summary
        """
        self.findings = []
        
        # Run all analyses
        self._analyze_boundary_crowding()
        self._analyze_flag_triggering()
        self._analyze_confidence_alignment()
        self._analyze_escalation_patterns()
        self._analyze_classification_distribution()
        self._analyze_data_sufficiency_patterns()
        
        # Generate report
        return self._generate_report()
    
    def _analyze_boundary_crowding(self):
        """
        Detect boundary crowding - scores clustering near classification thresholds.
        
        This suggests thresholds may need adjustment.
        """
        score_dist = self.metrics.get('score_distributions', {})
        overall_dist = score_dist.get('overall_distribution', {})
        
        if not overall_dist or overall_dist.get('count', 0) < 10:
            return
        
        # Get classification thresholds from config
        thresholds = self.scoring_config.compatibility_thresholds
        
        # Helper to get threshold value
        def get_threshold(category: str, default: int) -> int:
            cat_config = thresholds.get(category, {}) if isinstance(thresholds, dict) else getattr(thresholds, category, {})
            if isinstance(cat_config, dict):
                return cat_config.get('min_score', default)
            return getattr(cat_config, 'min_score', default)
        
        # Check for crowding near each threshold
        threshold_values = [
            ('high-potential', get_threshold('high_potential', 85)),
            ('worth-exploring', get_threshold('worth_exploring', 65)),
            ('mixed-signals', get_threshold('mixed_signals', 45)),
            ('caution', get_threshold('caution', 25)),
        ]
        
        percentiles = overall_dist.get('percentiles', {})
        p50 = percentiles.get('p50', 50)
        
        for category, threshold in threshold_values:
            # Check if median is very close to threshold
            distance = abs(p50 - threshold)
            
            if distance < 5:  # Within 5 points
                severity = FindingSeverity.HIGH if distance < 2 else FindingSeverity.MEDIUM
                
                self.findings.append(CalibrationFinding(
                    finding_type='boundary_crowding',
                    severity=severity,
                    description=f"Scores clustering near {category} threshold ({threshold}). "
                               f"Median score is {p50}, only {distance} points away.",
                    evidence={
                        'category': category,
                        'threshold': threshold,
                        'median_score': p50,
                        'distance': distance,
                        'percentiles': percentiles
                    },
                    recommendation=f"Consider adjusting {category} threshold or investigating score distribution.",
                    affected_components=['scoring', 'classification']
                ))
    
    def _analyze_flag_triggering(self):
        """
        Analyze red flag triggering patterns.
        
        Detects over-triggering (too many flags) or under-triggering (too few flags).
        """
        flag_freq = self.metrics.get('red_flag_frequencies', {})
        
        if not flag_freq or flag_freq.get('total_assessments', 0) < 10:
            return
        
        flag_rate = flag_freq.get('flag_rate', 0.0)
        flags_per_assessment = flag_freq.get('flags_per_assessment', 0.0)
        
        # Expected flag rate (based on design assumptions)
        # Adjust these based on your expected rates
        expected_flag_rate_min = 0.05  # 5% of assessments should have flags
        expected_flag_rate_max = 0.30  # 30% max
        
        # Check for over-triggering
        if flag_rate > expected_flag_rate_max:
            severity = FindingSeverity.HIGH if flag_rate > 0.50 else FindingSeverity.MEDIUM
            
            self.findings.append(CalibrationFinding(
                finding_type='over_triggered_flags',
                severity=severity,
                description=f"Red flags triggered in {flag_rate:.1%} of assessments, "
                           f"exceeding expected maximum of {expected_flag_rate_max:.1%}.",
                evidence={
                    'flag_rate': flag_rate,
                    'flags_per_assessment': flags_per_assessment,
                    'expected_max': expected_flag_rate_max,
                    'severity_distribution': flag_freq.get('severity_distribution', {})
                },
                recommendation="Review red flag detection thresholds. May be too sensitive.",
                affected_components=['red_flag_engine', 'safety_patterns']
            ))
        
        # Check for under-triggering
        elif flag_rate < expected_flag_rate_min:
            severity = FindingSeverity.MEDIUM if flag_rate < 0.01 else FindingSeverity.LOW
            
            self.findings.append(CalibrationFinding(
                finding_type='under_triggered_flags',
                severity=severity,
                description=f"Red flags triggered in only {flag_rate:.1%} of assessments, "
                           f"below expected minimum of {expected_flag_rate_min:.1%}.",
                evidence={
                    'flag_rate': flag_rate,
                    'flags_per_assessment': flags_per_assessment,
                    'expected_min': expected_flag_rate_min
                },
                recommendation="Review red flag detection thresholds. May be too conservative.",
                affected_components=['red_flag_engine', 'safety_patterns']
            ))
        
        # Check severity distribution
        severity_dist = flag_freq.get('severity_distribution', {})
        if severity_dist:
            critical_count = severity_dist.get('critical', 0)
            total_flags = flag_freq.get('total_flags', 0)
            
            if total_flags > 0:
                critical_rate = critical_count / total_flags
                
                # Critical flags should be rare
                if critical_rate > 0.20:  # More than 20% of flags are critical
                    self.findings.append(CalibrationFinding(
                        finding_type='high_critical_flag_rate',
                        severity=FindingSeverity.HIGH,
                        description=f"{critical_rate:.1%} of red flags are critical severity. "
                                   f"This may indicate over-escalation or threshold issues.",
                        evidence={
                            'critical_count': critical_count,
                            'total_flags': total_flags,
                            'critical_rate': critical_rate,
                            'severity_distribution': severity_dist
                        },
                        recommendation="Review critical flag thresholds and escalation logic.",
                        affected_components=['red_flag_engine', 'risk_escalation']
                    ))
    
    def _analyze_confidence_alignment(self):
        """
        Analyze confidence score alignment with classifications.
        
        Detects misalignment where confidence doesn't match classification.
        """
        confidence_matrix = self.metrics.get('confidence_matrix', {})
        matrix = confidence_matrix.get('matrix', {})
        
        if not matrix:
            return
        
        # Check each classification category
        for category, data in matrix.items():
            avg_confidence = data.get('average_confidence')
            total = data.get('total', 0)
            
            if avg_confidence is None or total < 5:
                continue
            
            # Expected confidence ranges by category
            expected_ranges = {
                'high-potential': (0.7, 1.0),
                'worth-exploring': (0.6, 0.9),
                'mixed-signals': (0.4, 0.7),
                'caution': (0.3, 0.6),
                'high-risk': (0.5, 1.0)  # Can be high confidence for risk
            }
            
            expected_min, expected_max = expected_ranges.get(category, (0.0, 1.0))
            
            # Check if average confidence is outside expected range
            if avg_confidence < expected_min:
                severity = FindingSeverity.MEDIUM if avg_confidence < expected_min * 0.8 else FindingSeverity.LOW
                
                self.findings.append(CalibrationFinding(
                    finding_type='low_confidence_for_category',
                    severity=severity,
                    description=f"Average confidence for {category} is {avg_confidence:.2f}, "
                               f"below expected minimum of {expected_min:.2f}.",
                    evidence={
                        'category': category,
                        'average_confidence': avg_confidence,
                        'expected_min': expected_min,
                        'total_assessments': total,
                        'confidence_distribution': data.get('confidence_distribution', {})
                    },
                    recommendation=f"Review confidence gating for {category}. May need threshold adjustment.",
                    affected_components=['confidence_gating', 'scoring']
                ))
            
            elif avg_confidence > expected_max:
                severity = FindingSeverity.MEDIUM if avg_confidence > expected_max * 1.2 else FindingSeverity.LOW
                
                self.findings.append(CalibrationFinding(
                    finding_type='high_confidence_for_category',
                    severity=severity,
                    description=f"Average confidence for {category} is {avg_confidence:.2f}, "
                               f"above expected maximum of {expected_max:.2f}.",
                    evidence={
                        'category': category,
                        'average_confidence': avg_confidence,
                        'expected_max': expected_max,
                        'total_assessments': total
                    },
                    recommendation=f"Review confidence calculation for {category}. May be overconfident.",
                    affected_components=['confidence_gating', 'scoring']
                ))
    
    def _analyze_escalation_patterns(self):
        """
        Analyze risk escalation patterns.
        
        Detects unusual escalation spikes or patterns.
        """
        escalation_freq = self.metrics.get('escalation_frequencies', {})
        
        if not escalation_freq or escalation_freq.get('total_assessments', 0) < 10:
            return
        
        escalation_rate = escalation_freq.get('escalation_rate', 0.0)
        
        # Expected escalation rate (should be relatively low)
        expected_max = 0.15  # 15% max
        
        if escalation_rate > expected_max:
            severity = FindingSeverity.HIGH if escalation_rate > 0.30 else FindingSeverity.MEDIUM
            
            self.findings.append(CalibrationFinding(
                finding_type='high_escalation_rate',
                severity=severity,
                description=f"Risk escalation occurs in {escalation_rate:.1%} of assessments, "
                           f"exceeding expected maximum of {expected_max:.1%}.",
                evidence={
                    'escalation_rate': escalation_rate,
                    'escalation_count': escalation_freq.get('escalation_count', 0),
                    'total_assessments': escalation_freq.get('total_assessments', 0),
                    'reason_patterns': escalation_freq.get('reason_patterns', {})
                },
                recommendation="Review escalation thresholds. May be too aggressive.",
                affected_components=['risk_escalation']
            ))
    
    def _analyze_classification_distribution(self):
        """
        Analyze classification category distribution.
        
        Detects imbalanced distributions that may indicate threshold issues.
        """
        class_dist = self.metrics.get('classification_distribution', {})
        distribution = class_dist.get('distribution', {})
        total = class_dist.get('total_assessments', 0)
        
        if not distribution or total < 20:
            return
        
        # Expected distribution (adjust based on your expectations)
        expected_ranges = {
            'high-potential': (0.10, 0.30),  # 10-30%
            'worth-exploring': (0.20, 0.40),  # 20-40%
            'mixed-signals': (0.15, 0.35),  # 15-35%
            'caution': (0.10, 0.25),  # 10-25%
            'high-risk': (0.05, 0.15)  # 5-15%
        }
        
        percentages = class_dist.get('percentages', {})
        
        for category, percentage in percentages.items():
            expected_min, expected_max = expected_ranges.get(category, (0.0, 1.0))
            
            if percentage < expected_min:
                self.findings.append(CalibrationFinding(
                    finding_type='low_classification_rate',
                    severity=FindingSeverity.LOW,
                    description=f"{category} classification rate is {percentage:.1%}, "
                               f"below expected minimum of {expected_min:.1%}.",
                    evidence={
                        'category': category,
                        'percentage': percentage,
                        'count': distribution.get(category, 0),
                        'expected_min': expected_min
                    },
                    recommendation=f"Monitor {category} classification. May indicate threshold too high.",
                    affected_components=['scoring', 'classification']
                ))
            
            elif percentage > expected_max:
                severity = FindingSeverity.MEDIUM if percentage > expected_max * 1.5 else FindingSeverity.LOW
                
                self.findings.append(CalibrationFinding(
                    finding_type='high_classification_rate',
                    severity=severity,
                    description=f"{category} classification rate is {percentage:.1%}, "
                               f"above expected maximum of {expected_max:.1%}.",
                    evidence={
                        'category': category,
                        'percentage': percentage,
                        'count': distribution.get(category, 0),
                        'expected_max': expected_max
                    },
                    recommendation=f"Review {category} threshold. May be too low.",
                    affected_components=['scoring', 'classification']
                ))
    
    def _analyze_data_sufficiency_patterns(self):
        """
        Analyze data sufficiency patterns.
        
        Detects if too many assessments have insufficient data.
        """
        data_suff = self.metrics.get('data_sufficiency_patterns', {})
        
        if not data_suff or data_suff.get('total_assessments', 0) < 10:
            return
        
        sufficiency_rate = data_suff.get('sufficiency_rate', 1.0)
        insufficient_count = data_suff.get('insufficient_count', 0)
        total = data_suff.get('total_assessments', 0)
        
        # Expected sufficiency rate (should be high)
        expected_min = 0.70  # 70% should have sufficient data
        
        if sufficiency_rate < expected_min:
            severity = FindingSeverity.MEDIUM if sufficiency_rate < 0.50 else FindingSeverity.LOW
            
            self.findings.append(CalibrationFinding(
                finding_type='low_data_sufficiency',
                severity=severity,
                description=f"Only {sufficiency_rate:.1%} of assessments have sufficient data. "
                           f"{insufficient_count} out of {total} assessments flagged as insufficient.",
                evidence={
                    'sufficiency_rate': sufficiency_rate,
                    'insufficient_count': insufficient_count,
                    'total_assessments': total,
                    'expected_min': expected_min
                },
                recommendation="Review data sufficiency thresholds. May be too strict, or users need guidance.",
                affected_components=['confidence_gating', 'data_sufficiency']
            ))
    
    def _generate_report(self) -> Dict[str, Any]:
        """Generate calibration report from findings."""
        # Group findings by severity
        findings_by_severity = {
            'critical': [],
            'high': [],
            'medium': [],
            'low': [],
            'info': []
        }
        
        for finding in self.findings:
            findings_by_severity[finding.severity.value].append({
                'finding_type': finding.finding_type,
                'severity': finding.severity.value,
                'description': finding.description,
                'evidence': finding.evidence,
                'recommendation': finding.recommendation,
                'affected_components': finding.affected_components
            })
        
        # Calculate summary
        total_findings = len(self.findings)
        critical_count = len(findings_by_severity['critical'])
        high_count = len(findings_by_severity['high'])
        medium_count = len(findings_by_severity['medium'])
        
        return {
            'report_timestamp': self.metrics.get('collection_timestamp'),
            'analysis_period_days': self.metrics.get('time_window_days'),
            'summary': {
                'total_findings': total_findings,
                'critical_findings': critical_count,
                'high_findings': high_count,
                'medium_findings': medium_count,
                'requires_attention': critical_count + high_count > 0
            },
            'findings': findings_by_severity,
            'all_findings': [
                {
                    'finding_type': f.finding_type,
                    'severity': f.severity.value,
                    'description': f.description,
                    'evidence': f.evidence,
                    'recommendation': f.recommendation,
                    'affected_components': f.affected_components
                }
                for f in self.findings
            ]
        }
    
    def save_report(self, output_path: Optional[str] = None) -> str:
        """
        Save calibration report to JSON file.
        
        Args:
            output_path: Path to save report. If None, uses default location.
        
        Returns:
            Path where report was saved
        """
        if output_path is None:
            base_dir = Path(__file__).parent.parent.parent
            analytics_dir = base_dir / 'analytics_output'
            analytics_dir.mkdir(exist_ok=True)
            
            from datetime import datetime
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            output_path = str(analytics_dir / f'calibration_report_{timestamp}.json')
        
        report = self.analyze_all()
        
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return output_path


def analyze_calibration(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience function to analyze calibration.
    
    Args:
        metrics: Metrics dictionary from AggregateMetricsCollector
    
    Returns:
        Calibration report dictionary
    """
    analyzer = CalibrationAnalyzer(metrics)
    return analyzer.analyze_all()

