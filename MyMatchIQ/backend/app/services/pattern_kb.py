"""
Pattern Knowledge Base - Stores anonymized patterns for learning
"""
from typing import Dict, List, Optional
from datetime import datetime
from uuid import UUID
import hashlib
import json


class PatternKnowledgeBase:
    """
    Stores and retrieves anonymized patterns for aggregate analysis.
    """
    
    def __init__(self, db_session=None):
        self.db = db_session
    
    def generate_pattern_hash(
        self,
        answers: List[Dict],
        category_scores: Dict[str, float]
    ) -> str:
        """
        Generate hash for a pattern (anonymized, no PII).
        """
        # Extract pattern signature
        pattern_data = {
            'rating_sequence': [a.get('rating') for a in answers],
            'category_distribution': {
                cat: len([a for a in answers if a.get('category') == cat])
                for cat in set(a.get('category') for a in answers)
            },
            'score_range': [
                min(category_scores.values()) if category_scores else 0,
                max(category_scores.values()) if category_scores else 0
            ]
        }
        
        # Create hash
        pattern_str = json.dumps(pattern_data, sort_keys=True)
        return hashlib.sha256(pattern_str.encode()).hexdigest()
    
    def store_pattern(
        self,
        pattern_hash: str,
        pattern_data: Dict,
        outcome: Optional[str] = None,
        score: Optional[float] = None,
        flag_count: int = 0,
        confidence: float = 0.5
    ):
        """
        Store or update pattern in knowledge base.
        """
        if not self.db:
            # If no DB, just return (for testing)
            return
        
        # Check if pattern exists
        from app.models.db_models import PatternKnowledgeBase as PKB
        existing = self.db.query(PKB).filter(
            PKB.pattern_hash == pattern_hash
        ).first()
        
        if existing:
            # Update existing pattern
            existing.occurrence_count += 1
            existing.last_seen_at = datetime.utcnow()
            
            # Update statistics
            if score is not None:
                # Update average score (running average)
                n = existing.occurrence_count
                existing.avg_score = ((existing.avg_score * (n - 1)) + score) / n
            
            if confidence is not None:
                n = existing.occurrence_count
                existing.avg_confidence = ((existing.avg_confidence * (n - 1)) + confidence) / n
            
            if flag_count > 0:
                # Update flag rate
                total_flags = (existing.flag_rate * (n - 1)) + flag_count
                existing.flag_rate = total_flags / n
            
            if outcome:
                # Update outcome distribution
                if not existing.outcome_distribution:
                    existing.outcome_distribution = {}
                existing.outcome_distribution[outcome] = \
                    existing.outcome_distribution.get(outcome, 0) + 1
            
            self.db.commit()
        else:
            # Create new pattern
            from app.models.db_models import PatternKnowledgeBase as PKB
            new_pattern = PKB(
                pattern_hash=pattern_hash,
                pattern_type='response_pattern',
                pattern_data=pattern_data,
                occurrence_count=1,
                avg_score=score,
                flag_rate=flag_count / 1.0 if flag_count > 0 else 0.0,
                avg_confidence=confidence,
                outcome_distribution={outcome: 1} if outcome else {},
                first_seen_at=datetime.utcnow(),
                last_seen_at=datetime.utcnow()
            )
            self.db.add(new_pattern)
            self.db.commit()
    
    def get_relevant_patterns(
        self,
        query_pattern: Dict,
        limit: int = 5
    ) -> List[Dict]:
        """
        Find similar patterns in knowledge base.
        Returns patterns sorted by similarity.
        """
        if not self.db:
            return []
        
        # Simple implementation: get patterns with similar score ranges
        # In production, use more sophisticated similarity matching
        
        query_score_range = query_pattern.get('score_range', [0, 100])
        query_min, query_max = query_score_range
        
        from app.models.db_models import PatternKnowledgeBase as PKB
        patterns = self.db.query(PKB).filter(
            PKB.is_active == True,
            PKB.occurrence_count >= 3
        ).all()
        
        # Filter by score range similarity
        relevant = []
        for pattern in patterns:
            pattern_scores = pattern.pattern_data.get('score_range', [0, 100])
            pattern_min, pattern_max = pattern_scores
            
            # Check overlap
            if not (query_max < pattern_min or query_min > pattern_max):
                relevant.append({
                    'pattern_hash': pattern.pattern_hash,
                    'occurrence_count': pattern.occurrence_count,
                    'avg_score': pattern.avg_score,
                    'flag_rate': pattern.flag_rate,
                    'outcome_distribution': pattern.outcome_distribution,
                    'accuracy': self._calculate_accuracy(pattern)
                })
        
        # Sort by occurrence count and accuracy
        relevant.sort(key=lambda x: (x['occurrence_count'], x['accuracy']), reverse=True)
        
        return relevant[:limit]
    
    def _calculate_accuracy(self, pattern) -> float:
        """
        Calculate pattern accuracy based on outcome distribution.
        """
        if not pattern.outcome_distribution:
            return 0.5
        
        # If pattern has consistent outcomes, higher accuracy
        total = sum(pattern.outcome_distribution.values())
        if total == 0:
            return 0.5
        
        # Calculate entropy (lower = more consistent = higher accuracy)
        from math import log2
        entropy = 0
        for count in pattern.outcome_distribution.values():
            prob = count / total
            if prob > 0:
                entropy -= prob * log2(prob)
        
        # Convert entropy to accuracy (0-1 scale)
        max_entropy = log2(len(pattern.outcome_distribution))
        if max_entropy == 0:
            return 1.0
        
        accuracy = 1.0 - (entropy / max_entropy)
        return max(0.0, min(1.0, accuracy))
    
    def get_pattern_statistics(self, pattern_hash: str) -> Optional[Dict]:
        """
        Get aggregate statistics for a pattern.
        """
        if not self.db:
            return None
        
        from app.models.db_models import PatternKnowledgeBase as PKB
        pattern = self.db.query(PKB).filter(
            PKB.pattern_hash == pattern_hash
        ).first()
        
        if not pattern:
            return None
        
        return {
            'occurrence_count': pattern.occurrence_count,
            'avg_score': pattern.avg_score,
            'score_std_dev': pattern.score_std_dev,
            'flag_rate': pattern.flag_rate,
            'avg_confidence': pattern.avg_confidence,
            'outcome_distribution': pattern.outcome_distribution,
            'first_seen_at': pattern.first_seen_at.isoformat() if pattern.first_seen_at else None,
            'last_seen_at': pattern.last_seen_at.isoformat() if pattern.last_seen_at else None
        }

