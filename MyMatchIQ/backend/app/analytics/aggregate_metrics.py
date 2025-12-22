"""
Aggregate Metrics Collector

Collects anonymized aggregate metrics from scan results for offline analysis.
NO raw user data is collected. Only aggregate statistics.

Purpose:
- Track score distributions
- Monitor confidence patterns
- Analyze red flag frequencies
- Detect usage patterns

Rules:
- Anonymized (no user IDs, no raw answers)
- Aggregate only (counts, averages, distributions)
- Configurable time window
- No runtime impact
"""
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
import json
import os
from pathlib import Path

from app.models.db_models import ScanResult, Scan


class AggregateMetricsCollector:
    """
    Collects aggregate metrics from scan results.
    
    All metrics are anonymized and aggregated. No individual user data.
    """
    
    def __init__(self, db: Session, time_window_days: int = 30):
        """
        Initialize metrics collector.
        
        Args:
            db: Database session
            time_window_days: Number of days to look back (default: 30)
        """
        self.db = db
        self.time_window_days = time_window_days
        self.cutoff_date = datetime.utcnow() - timedelta(days=time_window_days)
    
    def collect_all_metrics(self) -> Dict[str, Any]:
        """
        Collect all aggregate metrics.
        
        Returns:
            Dictionary containing all collected metrics
        """
        metrics = {
            'collection_timestamp': datetime.utcnow().isoformat() + 'Z',
            'time_window_days': self.time_window_days,
            'cutoff_date': self.cutoff_date.isoformat() + 'Z',
            'score_distributions': self._collect_score_distributions(),
            'confidence_matrix': self._collect_confidence_matrix(),
            'red_flag_frequencies': self._collect_red_flag_frequencies(),
            'escalation_frequencies': self._collect_escalation_frequencies(),
            'tier_usage_counts': self._collect_tier_usage_counts(),
            'category_coverage': self._collect_category_coverage(),
            'classification_distribution': self._collect_classification_distribution(),
            'data_sufficiency_patterns': self._collect_data_sufficiency_patterns(),
            'conflict_density_patterns': self._collect_conflict_density_patterns(),
        }
        
        # Add summary statistics
        metrics['summary'] = self._generate_summary(metrics)
        
        return metrics
    
    def _collect_score_distributions(self) -> Dict[str, Any]:
        """
        Collect score distributions per category.
        
        Returns aggregate statistics only - no individual scores.
        """
        # Query scan results in time window
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'category_distributions': {}
            }
        
        # Aggregate category scores
        category_scores: Dict[str, List[float]] = defaultdict(list)
        overall_scores: List[int] = []
        
        for result in results:
            if result.category_scores:
                for category, score in result.category_scores.items():
                    if isinstance(score, (int, float)):
                        category_scores[category].append(float(score))
            
            if result.overall_score is not None:
                overall_scores.append(result.overall_score)
        
        # Calculate distributions
        distributions = {}
        for category, scores in category_scores.items():
            if scores:
                distributions[category] = {
                    'count': len(scores),
                    'mean': sum(scores) / len(scores),
                    'min': min(scores),
                    'max': max(scores),
                    'percentiles': {
                        'p25': self._percentile(scores, 25),
                        'p50': self._percentile(scores, 50),
                        'p75': self._percentile(scores, 75),
                        'p90': self._percentile(scores, 90),
                        'p95': self._percentile(scores, 95)
                    }
                }
        
        overall_distribution = {}
        if overall_scores:
            overall_distribution = {
                'count': len(overall_scores),
                'mean': sum(overall_scores) / len(overall_scores),
                'min': min(overall_scores),
                'max': max(overall_scores),
                'percentiles': {
                    'p25': self._percentile(overall_scores, 25),
                    'p50': self._percentile(overall_scores, 50),
                    'p75': self._percentile(overall_scores, 75),
                    'p90': self._percentile(overall_scores, 90),
                    'p95': self._percentile(overall_scores, 95)
                }
            }
        
        return {
            'total_assessments': len(results),
            'category_distributions': distributions,
            'overall_distribution': overall_distribution
        }
    
    def _collect_confidence_matrix(self) -> Dict[str, Any]:
        """
        Collect confidence vs classification matrix.
        
        Shows how confidence scores correlate with classifications.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date,
            ScanResult.confidence_score.isnot(None)
        ).all()
        
        if not results:
            return {
                'total_with_confidence': 0,
                'matrix': {}
            }
        
        # Build matrix: classification -> confidence ranges
        matrix: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        
        confidence_ranges = [
            (0.0, 0.3, 'low'),
            (0.3, 0.6, 'medium'),
            (0.6, 0.8, 'high'),
            (0.8, 1.0, 'very_high')
        ]
        
        for result in results:
            category = result.category or 'unknown'
            confidence = result.confidence_score or 0.0
            
            # Find confidence range
            confidence_range = 'unknown'
            for min_conf, max_conf, range_name in confidence_ranges:
                if min_conf <= confidence < max_conf:
                    confidence_range = range_name
                    break
            
            matrix[category][confidence_range] += 1
        
        # Calculate statistics
        matrix_stats = {}
        for category, ranges in matrix.items():
            total = sum(ranges.values())
            matrix_stats[category] = {
                'total': total,
                'confidence_distribution': dict(ranges),
                'average_confidence': self._calculate_avg_confidence_for_category(category)
            }
        
        return {
            'total_with_confidence': len(results),
            'matrix': matrix_stats
        }
    
    def _calculate_avg_confidence_for_category(self, category: str) -> Optional[float]:
        """Calculate average confidence for a specific category."""
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date,
            ScanResult.category == category,
            ScanResult.confidence_score.isnot(None)
        ).all()
        
        if not results:
            return None
        
        confidences = [r.confidence_score for r in results if r.confidence_score is not None]
        return sum(confidences) / len(confidences) if confidences else None
    
    def _collect_red_flag_frequencies(self) -> Dict[str, Any]:
        """
        Collect red flag frequencies by type and severity.
        
        Only counts and types - no raw signals or evidence.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'flag_frequencies': {}
            }
        
        # Aggregate flag counts
        flag_counts: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        severity_counts: Dict[str, int] = defaultdict(int)
        category_counts: Dict[str, int] = defaultdict(int)
        
        total_flags = 0
        assessments_with_flags = 0
        
        for result in results:
            if result.red_flags:
                flags = result.red_flags if isinstance(result.red_flags, list) else []
                if flags:
                    assessments_with_flags += 1
                
                for flag in flags:
                    total_flags += 1
                    flag_type = flag.get('type', 'unknown')
                    severity = flag.get('severity', 'unknown')
                    category = flag.get('category', 'unknown')
                    
                    flag_counts[flag_type][severity] += 1
                    severity_counts[severity] += 1
                    category_counts[category] += 1
        
        return {
            'total_assessments': len(results),
            'assessments_with_flags': assessments_with_flags,
            'total_flags': total_flags,
            'flag_rate': assessments_with_flags / len(results) if results else 0.0,
            'flags_per_assessment': total_flags / len(results) if results else 0.0,
            'flag_type_distribution': dict(flag_counts),
            'severity_distribution': dict(severity_counts),
            'category_distribution': dict(category_counts)
        }
    
    def _collect_escalation_frequencies(self) -> Dict[str, Any]:
        """
        Collect escalation frequency statistics.
        
        Tracks how often risk escalation occurs.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date,
            ScanResult.escalation_reason.isnot(None)
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'escalation_count': 0,
                'escalation_rate': 0.0
            }
        
        total_results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).count()
        
        escalation_count = len(results)
        
        # Count escalation reasons (anonymized patterns only)
        reason_patterns = Counter()
        for result in results:
            if result.escalation_reason:
                # Extract pattern (not full text)
                reason = result.escalation_reason.lower()
                if 'recurrence' in reason:
                    reason_patterns['recurrence'] += 1
                if 'critical' in reason:
                    reason_patterns['critical_signal'] += 1
                if 'pattern' in reason:
                    reason_patterns['pattern'] += 1
                else:
                    reason_patterns['other'] += 1
        
        return {
            'total_assessments': total_results,
            'escalation_count': escalation_count,
            'escalation_rate': escalation_count / total_results if total_results > 0 else 0.0,
            'reason_patterns': dict(reason_patterns)
        }
    
    def _collect_tier_usage_counts(self) -> Dict[str, Any]:
        """
        Collect tier-based usage counts.
        
        Only counts - no user identification.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'tier_distribution': {}
            }
        
        tier_counts: Dict[str, int] = defaultdict(int)
        
        for result in results:
            # Get tier from result (if stored) or default to 'free'
            tier = getattr(result, 'tier', None) or 'free'
            tier_counts[tier] += 1
        
        return {
            'total_assessments': len(results),
            'tier_distribution': dict(tier_counts),
            'tier_percentages': {
                tier: count / len(results)
                for tier, count in tier_counts.items()
            }
        }
    
    def _collect_category_coverage(self) -> Dict[str, Any]:
        """
        Collect category coverage statistics.
        
        Tracks which categories are most commonly assessed.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'category_coverage': {}
            }
        
        category_presence: Dict[str, int] = defaultdict(int)
        
        for result in results:
            if result.category_scores:
                for category in result.category_scores.keys():
                    category_presence[category] += 1
        
        return {
            'total_assessments': len(results),
            'category_coverage': dict(category_presence),
            'coverage_percentages': {
                cat: count / len(results)
                for cat, count in category_presence.items()
            }
        }
    
    def _collect_classification_distribution(self) -> Dict[str, Any]:
        """
        Collect classification category distribution.
        
        Shows how assessments are distributed across compatibility categories.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'distribution': {}
            }
        
        category_counts = Counter()
        for result in results:
            category = result.category or 'unknown'
            category_counts[category] += 1
        
        return {
            'total_assessments': len(results),
            'distribution': dict(category_counts),
            'percentages': {
                cat: count / len(results)
                for cat, count in category_counts.items()
            }
        }
    
    def _collect_data_sufficiency_patterns(self) -> Dict[str, Any]:
        """
        Collect data sufficiency patterns.
        
        Tracks how often data sufficiency issues occur.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'sufficiency_stats': {}
            }
        
        sufficient_count = 0
        insufficient_count = 0
        
        for result in results:
            if result.data_sufficiency:
                if isinstance(result.data_sufficiency, dict):
                    is_sufficient = result.data_sufficiency.get('is_sufficient', True)
                    if is_sufficient:
                        sufficient_count += 1
                    else:
                        insufficient_count += 1
        
        return {
            'total_assessments': len(results),
            'sufficient_count': sufficient_count,
            'insufficient_count': insufficient_count,
            'sufficiency_rate': sufficient_count / len(results) if results else 0.0
        }
    
    def _collect_conflict_density_patterns(self) -> Dict[str, Any]:
        """
        Collect conflict density patterns.
        
        Tracks how often conflicts are detected.
        """
        results = self.db.query(ScanResult).filter(
            ScanResult.created_at >= self.cutoff_date
        ).all()
        
        if not results:
            return {
                'total_assessments': 0,
                'conflict_stats': {}
            }
        
        conflict_scores: List[float] = []
        has_conflicts_count = 0
        
        for result in results:
            if result.conflict_density:
                if isinstance(result.conflict_density, dict):
                    score = result.conflict_density.get('score', 0.0)
                    if isinstance(score, (int, float)):
                        conflict_scores.append(float(score))
                        if score > 0.2:  # Threshold for "has conflicts"
                            has_conflicts_count += 1
        
        conflict_stats = {}
        if conflict_scores:
            conflict_stats = {
                'mean': sum(conflict_scores) / len(conflict_scores),
                'max': max(conflict_scores),
                'min': min(conflict_scores),
                'assessments_with_conflicts': has_conflicts_count,
                'conflict_rate': has_conflicts_count / len(results) if results else 0.0
            }
        
        return {
            'total_assessments': len(results),
            'conflict_stats': conflict_stats
        }
    
    def _generate_summary(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate summary statistics from collected metrics."""
        return {
            'total_assessments': metrics.get('score_distributions', {}).get('total_assessments', 0),
            'collection_period_days': self.time_window_days,
            'key_insights': {
                'most_common_classification': self._get_most_common_classification(metrics),
                'average_confidence': self._get_average_confidence(metrics),
                'flag_rate': metrics.get('red_flag_frequencies', {}).get('flag_rate', 0.0),
                'escalation_rate': metrics.get('escalation_frequencies', {}).get('escalation_rate', 0.0)
            }
        }
    
    def _get_most_common_classification(self, metrics: Dict[str, Any]) -> Optional[str]:
        """Get most common classification category."""
        dist = metrics.get('classification_distribution', {}).get('distribution', {})
        if dist:
            return max(dist.items(), key=lambda x: x[1])[0]
        return None
    
    def _get_average_confidence(self, metrics: Dict[str, Any]) -> Optional[float]:
        """Get average confidence across all assessments."""
        matrix = metrics.get('confidence_matrix', {}).get('matrix', {})
        if not matrix:
            return None
        
        total_confidence = 0.0
        total_count = 0
        
        for category_data in matrix.values():
            avg_conf = category_data.get('average_confidence')
            count = category_data.get('total', 0)
            if avg_conf is not None:
                total_confidence += avg_conf * count
                total_count += count
        
        return total_confidence / total_count if total_count > 0 else None
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile of a list of numbers."""
        if not data:
            return 0.0
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]
    
    def save_metrics(self, output_path: Optional[str] = None) -> str:
        """
        Save collected metrics to JSON file.
        
        Args:
            output_path: Path to save metrics. If None, uses default location.
        
        Returns:
            Path where metrics were saved
        """
        if output_path is None:
            # Default to analytics directory
            base_dir = Path(__file__).parent.parent.parent
            analytics_dir = base_dir / 'analytics_output'
            analytics_dir.mkdir(exist_ok=True)
            
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            output_path = str(analytics_dir / f'metrics_snapshot_{timestamp}.json')
        
        metrics = self.collect_all_metrics()
        
        with open(output_path, 'w') as f:
            json.dump(metrics, f, indent=2)
        
        return output_path


def collect_metrics(db: Session, time_window_days: int = 30) -> Dict[str, Any]:
    """
    Convenience function to collect all metrics.
    
    Args:
        db: Database session
        time_window_days: Number of days to look back
    
    Returns:
        Dictionary containing all metrics
    """
    collector = AggregateMetricsCollector(db, time_window_days)
    return collector.collect_all_metrics()

