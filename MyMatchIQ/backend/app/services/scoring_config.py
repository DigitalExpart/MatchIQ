"""
Scoring Configuration Governance System

Centralized, versioned configuration for scoring weights, thresholds, and penalties.
All scoring logic references this configuration to ensure consistency and enable
safe future updates without code rewrites.
"""
import json
import os
from typing import Dict, Optional, Any
from pathlib import Path
from dataclasses import dataclass
from app.config import settings


@dataclass
class ScoringConfig:
    """Scoring configuration container"""
    logic_version: str
    category_weights: Dict[str, float]
    deal_breaker_penalties: Dict[str, int]
    compatibility_thresholds: Dict[str, Dict[str, Any]]
    red_flag_severity_thresholds: Dict[str, Dict[str, Any]]
    scoring_adjustments: Dict[str, Dict[str, Any]]
    metadata: Dict[str, Any]


class ScoringConfigManager:
    """
    Manages loading and accessing versioned scoring configurations.
    
    Configuration is loaded from JSON files in scoring_configs/ directory.
    Each config file is named: scoring_config_v{VERSION}.json
    """
    
    _instance: Optional['ScoringConfigManager'] = None
    _config: Optional[ScoringConfig] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._config is None:
            self._load_config()
    
    def _load_config(self) -> None:
        """
        Load the active scoring configuration.
        
        Priority:
        1. Environment variable SCORING_CONFIG_VERSION (if set)
        2. Default version from settings
        3. Latest version found in configs directory
        """
        # Determine which version to load
        version = os.getenv('SCORING_CONFIG_VERSION', settings.AI_VERSION)
        
        # Get config directory path
        config_dir = Path(__file__).parent.parent.parent / 'scoring_configs'
        config_file = config_dir / f'scoring_config_v{version}.json'
        
        # Fallback: try to find latest version if specified version not found
        if not config_file.exists():
            config_files = sorted(config_dir.glob('scoring_config_v*.json'), reverse=True)
            if config_files:
                config_file = config_files[0]
                version = self._extract_version_from_filename(config_file.name)
            else:
                raise FileNotFoundError(
                    f"No scoring configuration found. Expected: {config_file}"
                )
        
        # Load and parse config
        with open(config_file, 'r') as f:
            config_data = json.load(f)
        
        # Validate required fields
        required_fields = [
            'logic_version', 'category_weights', 'deal_breaker_penalties',
            'compatibility_thresholds', 'red_flag_severity_thresholds',
            'scoring_adjustments'
        ]
        for field in required_fields:
            if field not in config_data:
                raise ValueError(f"Missing required field in config: {field}")
        
        # Create config object
        self._config = ScoringConfig(
            logic_version=config_data['logic_version'],
            category_weights=config_data['category_weights'],
            deal_breaker_penalties=config_data['deal_breaker_penalties'],
            compatibility_thresholds=config_data['compatibility_thresholds'],
            red_flag_severity_thresholds=config_data['red_flag_severity_thresholds'],
            scoring_adjustments=config_data['scoring_adjustments'],
            metadata=config_data.get('metadata', {})
        )
    
    def _extract_version_from_filename(self, filename: str) -> str:
        """Extract version number from config filename."""
        # Format: scoring_config_v1.0.0.json
        parts = filename.replace('scoring_config_v', '').replace('.json', '')
        return parts
    
    def get_config(self) -> ScoringConfig:
        """Get the current active configuration."""
        if self._config is None:
            self._load_config()
        return self._config
    
    def get_logic_version(self) -> str:
        """Get the current logic version identifier."""
        return self.get_config().logic_version
    
    def get_category_weight(self, category: str) -> float:
        """
        Get weight for a specific category.
        Returns default weight if category not found.
        """
        config = self.get_config()
        return config.category_weights.get(category, config.category_weights.get('default', 1.0))
    
    def get_deal_breaker_penalty(self, severity: str) -> int:
        """
        Get penalty score for deal-breaker violation.
        Returns 0 if severity not found (should not happen in production).
        """
        config = self.get_config()
        return config.deal_breaker_penalties.get(severity, 0)
    
    def get_compatibility_threshold(self, category: str) -> Dict[str, Any]:
        """
        Get threshold configuration for a compatibility category.
        Returns empty dict if category not found.
        """
        config = self.get_config()
        return config.compatibility_thresholds.get(category, {})
    
    def get_red_flag_threshold(self, severity: str) -> Dict[str, Any]:
        """
        Get threshold configuration for red flag severity level.
        Returns empty dict if severity not found.
        """
        config = self.get_config()
        return config.red_flag_severity_thresholds.get(severity, {})
    
    def get_scoring_adjustment(self, adjustment_type: str) -> Dict[str, Any]:
        """
        Get configuration for a scoring adjustment type.
        Returns empty dict if type not found.
        """
        config = self.get_config()
        return config.scoring_adjustments.get(adjustment_type, {})
    
    def can_classify_as(self, target_category: str, overall_score: int, 
                        confidence: float, red_flags: List[Dict]) -> tuple[bool, Optional[str]]:
        """
        Check if assessment can be classified as target category based on thresholds.
        
        Returns:
            (can_classify: bool, reason: Optional[str])
        """
        threshold = self.get_compatibility_threshold(target_category)
        if not threshold:
            return False, f"Unknown category: {target_category}"
        
        # Check score threshold
        if overall_score < threshold.get('min_score', 0):
            return False, f"Score {overall_score} below minimum {threshold.get('min_score', 0)}"
        
        # Check confidence threshold
        if confidence < threshold.get('min_confidence', 0.0):
            return False, f"Confidence {confidence:.2f} below minimum {threshold.get('min_confidence', 0.0)}"
        
        # Count red flags by severity
        critical_flags = sum(1 for f in red_flags if f.get('severity') == 'critical')
        high_flags = sum(1 for f in red_flags if f.get('severity') == 'high')
        
        # Check red flag limits
        if critical_flags > threshold.get('max_red_flags_critical', 999):
            return False, f"Critical flags ({critical_flags}) exceed limit ({threshold.get('max_red_flags_critical', 999)})"
        
        if high_flags > threshold.get('max_red_flags_high', 999):
            return False, f"High flags ({high_flags}) exceed limit ({threshold.get('max_red_flags_high', 999)})"
        
        return True, None


# Global singleton instance
config_manager = ScoringConfigManager()


def get_scoring_config() -> ScoringConfig:
    """Convenience function to get current scoring configuration."""
    return config_manager.get_config()


def get_logic_version() -> str:
    """Convenience function to get current logic version."""
    return config_manager.get_logic_version()

