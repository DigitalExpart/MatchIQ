"""
Red Flag Engine - Detects safety concerns and deal-breakers.
"""
from typing import List, Dict, Any
from datetime import datetime

from app.models.db_models import Scan, Blueprint, User


class RedFlagEngine:
    """Detects red flags and safety concerns in scans."""
    
    def detect_all(
        self,
        scan: Scan,
        blueprint: Blueprint,
        user_profile: User
    ) -> List[Dict[str, Any]]:
        """Detect all types of red flags."""
        flags = []
        
        # Check for deal-breaker violations
        flags.extend(self._detect_deal_breaker_violations(scan, blueprint))
        
        # Check for safety patterns
        flags.extend(self._detect_safety_patterns(scan))
        
        # Check for inconsistencies
        flags.extend(self._detect_inconsistencies(scan))
        
        # Check profile alignment
        flags.extend(self._detect_profile_mismatches(scan, user_profile))
        
        return flags
    
    def _detect_deal_breaker_violations(
        self,
        scan: Scan,
        blueprint: Blueprint
    ) -> List[Dict[str, Any]]:
        """Check if scan responses violate blueprint deal-breakers."""
        flags = []
        
        if not blueprint.profile_summary:
            return flags
        
        deal_breakers = blueprint.profile_summary.get("deal_breakers", [])
        
        for deal_breaker in deal_breakers:
            category = deal_breaker.get("category")
            question_id = deal_breaker.get("question_id")
            expected_response = deal_breaker.get("response")
            
            # Find matching answer in scan
            for answer in scan.answers:
                if (answer.get("category") == category and 
                    answer.get("question_id") == question_id):
                    
                    rating = answer.get("rating", "")
                    # If rating is yellow-flag or red-flag, it's a violation
                    if rating in ["yellow-flag", "red-flag"]:
                        flags.append({
                            "severity": "high" if rating == "red-flag" else "medium",
                            "category": category,
                            "signal": f"Deal-breaker violation: {expected_response}",
                            "evidence": [question_id],
                            "detected_at": datetime.now().isoformat()
                        })
        
        return flags
    
    def _detect_safety_patterns(self, scan: Scan) -> List[Dict[str, Any]]:
        """Detect safety-related red flags."""
        flags = []
        
        # Count red flags in answers
        red_flag_count = sum(
            1 for answer in scan.answers
            if answer.get("rating") == "red-flag"
        )
        
        # If more than 3 red flags, it's a critical concern
        if red_flag_count >= 3:
            flags.append({
                "severity": "critical",
                "category": "safety",
                "signal": f"Multiple red flags detected ({red_flag_count})",
                "evidence": [
                    answer.get("question_id")
                    for answer in scan.answers
                    if answer.get("rating") == "red-flag"
                ],
                "detected_at": datetime.now().isoformat()
            })
        
        # Check for patterns in specific categories
        category_flags = {}
        for answer in scan.answers:
            if answer.get("rating") in ["yellow-flag", "red-flag"]:
                cat = answer.get("category", "unknown")
                category_flags[cat] = category_flags.get(cat, 0) + 1
        
        # If a category has 2+ flags, it's a concern
        for category, count in category_flags.items():
            if count >= 2:
                flags.append({
                    "severity": "high",
                    "category": category,
                    "signal": f"Multiple concerns in {category} category",
                    "evidence": [
                        answer.get("question_id")
                        for answer in scan.answers
                        if (answer.get("category") == category and
                            answer.get("rating") in ["yellow-flag", "red-flag"])
                    ],
                    "detected_at": datetime.now().isoformat()
                })
        
        return flags
    
    def _detect_inconsistencies(self, scan: Scan) -> List[Dict[str, Any]]:
        """Detect inconsistent responses."""
        inconsistencies = []
        
        # Group answers by category
        category_answers = {}
        for answer in scan.answers:
            cat = answer.get("category", "unknown")
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        # Check for mixed signals within categories
        for category, answers in category_answers.items():
            if len(answers) < 2:
                continue
            
            ratings = [a.get("rating", "") for a in answers]
            has_positive = any(r in ["strong-match", "good"] for r in ratings)
            has_negative = any(r in ["yellow-flag", "red-flag"] for r in ratings)
            
            if has_positive and has_negative:
                inconsistencies.append({
                    "type": "mixed_signals",
                    "description": f"Mixed signals in {category} category",
                    "questions": [a.get("question_id") for a in answers],
                    "severity": "medium"
                })
        
        return inconsistencies
    
    def _detect_profile_mismatches(
        self,
        scan: Scan,
        user_profile: User
    ) -> List[Dict[str, Any]]:
        """Detect mismatches with user profile preferences."""
        mismatches = []
        
        # This is a placeholder - implement based on your profile structure
        # For example, if user profile has dating_goal, check if scan aligns
        
        return mismatches

