"""
Dual Scan Engine - Calculates mutual alignment for dual scans.
Privacy-preserving algorithm.
"""
from typing import Dict, List, Any
from app.models.db_models import Scan, ScanResult


class DualScanEngine:
    """Calculates mutual alignment for dual scans."""
    
    def calculate_mutual_alignment(
        self,
        scan_a: Scan,
        scan_b: Scan,
        result_a: ScanResult,
        result_b: ScanResult
    ) -> Dict[str, Any]:
        """Calculate mutual alignment without exposing raw answers."""
        # Calculate geometric mean of scores
        score_a = result_a.overall_score
        score_b = result_b.overall_score
        mutual_score = (score_a * score_b) ** 0.5
        
        # Calculate category alignment
        category_alignment = {}
        for category in result_a.category_scores.keys():
            if category in result_b.category_scores:
                score_a_cat = result_a.category_scores[category]
                score_b_cat = result_b.category_scores[category]
                category_alignment[category] = (score_a_cat * score_b_cat) ** 0.5
        
        # Detect mutual deal-breakers
        mutual_deal_breakers = self._detect_mutual_deal_breakers(
            result_a, result_b
        )
        
        # Identify complementary areas
        complementary_areas = self._find_complementary_areas(
            result_a, result_b
        )
        
        return {
            "mutual_score": int(mutual_score),
            "category_alignment": category_alignment,
            "mutual_deal_breakers": mutual_deal_breakers,
            "complementary_areas": complementary_areas,
            "individual_scores": {
                "user_a": score_a,
                "user_b": score_b
            }
        }
    
    def _detect_mutual_deal_breakers(
        self,
        result_a: ScanResult,
        result_b: ScanResult
    ) -> List[Dict[str, Any]]:
        """Detect deal-breakers that appear in both scans."""
        flags_a = {f.get("category"): f for f in result_a.red_flags}
        flags_b = {f.get("category"): f for f in result_b.red_flags}
        
        mutual = []
        for category in flags_a.keys():
            if category in flags_b:
                mutual.append({
                    "category": category,
                    "severity": "high",
                    "description": f"Both users flagged concerns in {category}"
                })
        
        return mutual
    
    def _find_complementary_areas(
        self,
        result_a: ScanResult,
        result_b: ScanResult
    ) -> List[str]:
        """Find areas where one user is strong and the other needs support."""
        complementary = []
        
        for category in result_a.category_scores.keys():
            if category in result_b.category_scores:
                score_a = result_a.category_scores[category]
                score_b = result_b.category_scores[category]
                
                # If one is strong (>=70) and other is moderate (<70), it's complementary
                if (score_a >= 70 and score_b < 70) or (score_b >= 70 and score_a < 70):
                    complementary.append(category)
        
        return complementary

