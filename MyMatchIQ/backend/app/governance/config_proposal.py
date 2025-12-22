"""
Config Proposal Generator

Generates proposed scoring configuration changes based on calibration findings.

Purpose:
- Propose threshold adjustments
- Suggest weight modifications
- Recommend flag threshold changes
- Generate versioned config proposals

Rules:
- Proposals only - no auto-apply
- Include rationale for each change
- Versioned output
- Requires human approval
"""
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
import json
from pathlib import Path
import copy

from app.services.scoring_config import get_scoring_config
from app.analytics.calibration_analyzer import CalibrationFinding, FindingSeverity


@dataclass
class ConfigChange:
    """Represents a single proposed configuration change."""
    path: str  # JSON path to the config value (e.g., "compatibility_thresholds.high_potential.min_score")
    current_value: Any
    proposed_value: Any
    rationale: str
    finding_reference: Optional[str] = None  # Reference to calibration finding
    impact_estimate: str = "unknown"  # "low", "medium", "high"
    affected_components: List[str] = field(default_factory=list)


@dataclass
class ConfigProposal:
    """A complete configuration proposal."""
    proposed_version: str
    base_version: str
    changes: List[ConfigChange]
    summary: str
    rationale: str
    created_at: str
    created_by: Optional[str] = None
    requires_approval: bool = True


class ConfigProposalGenerator:
    """
    Generates configuration proposals based on calibration findings.
    
    All proposals require human approval before activation.
    """
    
    def __init__(self, calibration_report: Dict[str, Any]):
        """
        Initialize proposal generator.
        
        Args:
            calibration_report: Calibration report from CalibrationAnalyzer
        """
        self.calibration_report = calibration_report
        self.current_config = get_scoring_config()
        self.proposed_changes: List[ConfigChange] = []
    
    def generate_proposal(
        self,
        proposed_version: str,
        base_version: Optional[str] = None,
        created_by: Optional[str] = None
    ) -> ConfigProposal:
        """
        Generate a complete configuration proposal.
        
        Args:
            proposed_version: Version string for proposed config (e.g., "1.1.0")
            base_version: Base version to modify (defaults to current)
            created_by: Creator identifier (optional)
        
        Returns:
            ConfigProposal object
        """
        if base_version is None:
            base_version = self.current_config.logic_version
        
        self.proposed_changes = []
        
        # Process findings and generate changes
        findings = self.calibration_report.get('all_findings', [])
        
        for finding in findings:
            self._process_finding(finding)
        
        # Generate summary and rationale
        summary = self._generate_summary()
        rationale = self._generate_rationale()
        
        return ConfigProposal(
            proposed_version=proposed_version,
            base_version=base_version,
            changes=self.proposed_changes,
            summary=summary,
            rationale=rationale,
            created_at=datetime.utcnow().isoformat() + 'Z',
            created_by=created_by,
            requires_approval=True
        )
    
    def _process_finding(self, finding: Dict[str, Any]):
        """Process a calibration finding and generate proposed changes."""
        finding_type = finding.get('finding_type')
        severity = finding.get('severity')
        evidence = finding.get('evidence', {})
        
        # Only process medium, high, and critical findings
        if severity in ['info', 'low']:
            return
        
        if finding_type == 'boundary_crowding':
            self._propose_threshold_adjustment(finding, evidence)
        
        elif finding_type == 'over_triggered_flags':
            self._propose_flag_threshold_increase(finding, evidence)
        
        elif finding_type == 'under_triggered_flags':
            self._propose_flag_threshold_decrease(finding, evidence)
        
        elif finding_type == 'low_confidence_for_category':
            self._propose_confidence_threshold_adjustment(finding, evidence, decrease=True)
        
        elif finding_type == 'high_confidence_for_category':
            self._propose_confidence_threshold_adjustment(finding, evidence, decrease=False)
        
        elif finding_type == 'high_critical_flag_rate':
            self._propose_escalation_threshold_adjustment(finding, evidence)
        
        elif finding_type == 'high_classification_rate':
            self._propose_classification_threshold_increase(finding, evidence)
        
        elif finding_type == 'low_classification_rate':
            self._propose_classification_threshold_decrease(finding, evidence)
    
    def _propose_threshold_adjustment(self, finding: Dict, evidence: Dict):
        """Propose threshold adjustment for boundary crowding."""
        category = evidence.get('category')
        threshold = evidence.get('threshold')
        median_score = evidence.get('median_score')
        
        if not category or threshold is None or median_score is None:
            return
        
        # Adjust threshold based on median
        # If median is below threshold, lower threshold slightly
        # If median is above threshold, raise threshold slightly
        adjustment = (median_score - threshold) * 0.3  # 30% of distance
        proposed_threshold = int(threshold + adjustment)
        
        # Clamp to reasonable range
        proposed_threshold = max(0, min(100, proposed_threshold))
        
        # Map category to config path
        category_map = {
            'high-potential': 'high_potential',
            'worth-exploring': 'worth_exploring',
            'mixed-signals': 'mixed_signals',
            'caution': 'caution',
            'high-risk': 'high_risk'
        }
        
        config_category = category_map.get(category)
        if not config_category:
            return
        
        path = f"compatibility_thresholds.{config_category}.min_score"
        current_value = self._get_config_value(path)
        
        if current_value is not None:
            self.proposed_changes.append(ConfigChange(
                path=path,
                current_value=current_value,
                proposed_value=proposed_threshold,
                rationale=f"Adjust {category} threshold to reduce boundary crowding. "
                         f"Median score ({median_score}) is {abs(median_score - threshold)} points from threshold ({threshold}).",
                finding_reference=finding.get('finding_type'),
                impact_estimate="medium",
                affected_components=['scoring', 'classification']
            ))
    
    def _propose_flag_threshold_increase(self, finding: Dict, evidence: Dict):
        """Propose increasing flag thresholds to reduce over-triggering."""
        flag_rate = evidence.get('flag_rate', 0.0)
        
        # Propose increasing min_occurrences for medium/low severity flags
        # This makes flags less sensitive
        
        changes = [
            {
                'path': 'red_flag_severity_thresholds.medium.min_occurrences',
                'current': 2,
                'proposed': 3,
                'rationale': f"Increase medium flag threshold to reduce over-triggering. Current flag rate: {flag_rate:.1%}"
            },
            {
                'path': 'red_flag_severity_thresholds.low.min_occurrences',
                'current': 3,
                'proposed': 4,
                'rationale': f"Increase low flag threshold to reduce over-triggering. Current flag rate: {flag_rate:.1%}"
            }
        ]
        
        for change in changes:
            current_value = self._get_config_value(change['path'])
            if current_value is not None:
                self.proposed_changes.append(ConfigChange(
                    path=change['path'],
                    current_value=current_value,
                    proposed_value=change['proposed'],
                    rationale=change['rationale'],
                    finding_reference=finding.get('finding_type'),
                    impact_estimate="medium",
                    affected_components=['red_flag_engine']
                ))
    
    def _propose_flag_threshold_decrease(self, finding: Dict, evidence: Dict):
        """Propose decreasing flag thresholds to increase triggering."""
        flag_rate = evidence.get('flag_rate', 0.0)
        
        # Propose decreasing min_occurrences for medium/low severity flags
        changes = [
            {
                'path': 'red_flag_severity_thresholds.medium.min_occurrences',
                'current': 2,
                'proposed': 1,
                'rationale': f"Decrease medium flag threshold to increase detection. Current flag rate: {flag_rate:.1%}"
            }
        ]
        
        for change in changes:
            current_value = self._get_config_value(change['path'])
            if current_value is not None:
                self.proposed_changes.append(ConfigChange(
                    path=change['path'],
                    current_value=current_value,
                    proposed_value=change['proposed'],
                    rationale=change['rationale'],
                    finding_reference=finding.get('finding_type'),
                    impact_estimate="medium",
                    affected_components=['red_flag_engine']
                ))
    
    def _propose_confidence_threshold_adjustment(
        self,
        finding: Dict,
        evidence: Dict,
        decrease: bool
    ):
        """Propose confidence threshold adjustment."""
        category = evidence.get('category')
        avg_confidence = evidence.get('average_confidence')
        
        if not category or avg_confidence is None:
            return
        
        category_map = {
            'high-potential': 'high_potential',
            'worth-exploring': 'worth_exploring',
            'mixed-signals': 'mixed_signals',
            'caution': 'caution'
        }
        
        config_category = category_map.get(category)
        if not config_category:
            return
        
        path = f"compatibility_thresholds.{config_category}.min_confidence"
        current_value = self._get_config_value(path)
        
        if current_value is not None:
            adjustment = 0.05 if decrease else -0.05
            proposed_value = max(0.0, min(1.0, current_value + adjustment))
            
            direction = "decrease" if decrease else "increase"
            self.proposed_changes.append(ConfigChange(
                path=path,
                current_value=current_value,
                proposed_value=round(proposed_value, 2),
                rationale=f"{direction.capitalize()} {category} confidence threshold. "
                         f"Average confidence ({avg_confidence:.2f}) is outside expected range.",
                finding_reference=finding.get('finding_type'),
                impact_estimate="low",
                affected_components=['confidence_gating']
            ))
    
    def _propose_escalation_threshold_adjustment(self, finding: Dict, evidence: Dict):
        """Propose escalation threshold adjustment."""
        # Propose increasing min_occurrences for escalation
        path = 'red_flag_severity_thresholds.critical.min_occurrences'
        current_value = self._get_config_value(path)
        
        if current_value is not None:
            proposed_value = current_value + 1
            
            self.proposed_changes.append(ConfigChange(
                path=path,
                current_value=current_value,
                proposed_value=proposed_value,
                rationale=f"Increase critical flag occurrence threshold to reduce escalation rate.",
                finding_reference=finding.get('finding_type'),
                impact_estimate="medium",
                affected_components=['risk_escalation']
            ))
    
    def _propose_classification_threshold_increase(self, finding: Dict, evidence: Dict):
        """Propose increasing classification threshold."""
        category = evidence.get('category')
        percentage = evidence.get('percentage', 0.0)
        
        category_map = {
            'high-potential': 'high_potential',
            'worth-exploring': 'worth_exploring',
            'mixed-signals': 'mixed_signals',
            'caution': 'caution'
        }
        
        config_category = category_map.get(category)
        if not config_category:
            return
        
        path = f"compatibility_thresholds.{config_category}.min_score"
        current_value = self._get_config_value(path)
        
        if current_value is not None:
            proposed_value = min(100, current_value + 5)  # Increase by 5 points
            
            self.proposed_changes.append(ConfigChange(
                path=path,
                current_value=current_value,
                proposed_value=proposed_value,
                rationale=f"Increase {category} threshold. Classification rate ({percentage:.1%}) is above expected.",
                finding_reference=finding.get('finding_type'),
                impact_estimate="medium",
                affected_components=['scoring', 'classification']
            ))
    
    def _propose_classification_threshold_decrease(self, finding: Dict, evidence: Dict):
        """Propose decreasing classification threshold."""
        category = evidence.get('category')
        percentage = evidence.get('percentage', 0.0)
        
        category_map = {
            'high-potential': 'high_potential',
            'worth-exploring': 'worth_exploring',
            'mixed-signals': 'mixed_signals',
            'caution': 'caution'
        }
        
        config_category = category_map.get(category)
        if not config_category:
            return
        
        path = f"compatibility_thresholds.{config_category}.min_score"
        current_value = self._get_config_value(path)
        
        if current_value is not None:
            proposed_value = max(0, current_value - 5)  # Decrease by 5 points
            
            self.proposed_changes.append(ConfigChange(
                path=path,
                current_value=current_value,
                proposed_value=proposed_value,
                rationale=f"Decrease {category} threshold. Classification rate ({percentage:.1%}) is below expected.",
                finding_reference=finding.get('finding_type'),
                impact_estimate="medium",
                affected_components=['scoring', 'classification']
            ))
    
    def _get_config_value(self, path: str) -> Any:
        """Get current config value by JSON path."""
        # Load current config as dict
        config_dict = self._config_to_dict()
        
        # Navigate path
        keys = path.split('.')
        value = config_dict
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return None
        
        return value
    
    def _config_to_dict(self) -> Dict[str, Any]:
        """Convert current config to dictionary."""
        return {
            'compatibility_thresholds': self.current_config.compatibility_thresholds,
            'red_flag_severity_thresholds': self.current_config.red_flag_severity_thresholds,
            'category_weights': self.current_config.category_weights,
            'deal_breaker_penalties': self.current_config.deal_breaker_penalties,
            'scoring_adjustments': self.current_config.scoring_adjustments
        }
    
    def _generate_summary(self) -> str:
        """Generate proposal summary."""
        if not self.proposed_changes:
            return "No changes proposed based on calibration findings."
        
        change_count = len(self.proposed_changes)
        high_impact = sum(1 for c in self.proposed_changes if c.impact_estimate == 'high')
        medium_impact = sum(1 for c in self.proposed_changes if c.impact_estimate == 'medium')
        
        summary = f"Proposed {change_count} configuration changes: "
        summary += f"{high_impact} high-impact, {medium_impact} medium-impact, "
        summary += f"{change_count - high_impact - medium_impact} low-impact."
        
        return summary
    
    def _generate_rationale(self) -> str:
        """Generate overall proposal rationale."""
        findings_summary = self.calibration_report.get('summary', {})
        critical = findings_summary.get('critical_findings', 0)
        high = findings_summary.get('high_findings', 0)
        
        rationale = f"Configuration proposal based on calibration analysis. "
        rationale += f"Found {critical} critical and {high} high-severity calibration issues. "
        rationale += "Proposed changes address these issues to improve system calibration."
        
        return rationale
    
    def generate_proposed_config(self, proposal: ConfigProposal) -> Dict[str, Any]:
        """
        Generate proposed configuration JSON from proposal.
        
        Args:
            proposal: ConfigProposal object
        
        Returns:
            Proposed configuration dictionary
        """
        # Load base config
        base_config_path = Path(__file__).parent.parent.parent / 'scoring_configs' / f'scoring_config_v{proposal.base_version}.json'
        
        with open(base_config_path, 'r') as f:
            proposed_config = json.load(f)
        
        # Apply changes
        for change in proposal.changes:
            self._apply_change_to_dict(proposed_config, change)
        
        # Update metadata
        proposed_config['logic_version'] = proposal.proposed_version
        proposed_config['version_description'] = f"Proposed configuration based on calibration analysis"
        proposed_config['created_at'] = proposal.created_at
        proposed_config['is_active'] = False  # Never active until approved
        proposed_config['proposal_metadata'] = {
            'base_version': proposal.base_version,
            'summary': proposal.summary,
            'rationale': proposal.rationale,
            'created_by': proposal.created_by,
            'requires_approval': proposal.requires_approval,
            'change_count': len(proposal.changes)
        }
        
        return proposed_config
    
    def _apply_change_to_dict(self, config_dict: Dict, change: ConfigChange):
        """Apply a single change to configuration dictionary."""
        keys = change.path.split('.')
        
        # Navigate to parent
        target = config_dict
        for key in keys[:-1]:
            if key not in target:
                target[key] = {}
            target = target[key]
        
        # Set value
        final_key = keys[-1]
        target[final_key] = change.proposed_value
    
    def save_proposal(
        self,
        proposal: ConfigProposal,
        output_dir: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Save proposal files.
        
        Args:
            proposal: ConfigProposal object
            output_dir: Output directory (defaults to scoring_configs)
        
        Returns:
            Dictionary with paths to saved files
        """
        if output_dir is None:
            base_dir = Path(__file__).parent.parent.parent
            output_dir = str(base_dir / 'scoring_configs')
        
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Generate proposed config
        proposed_config = self.generate_proposed_config(proposal)
        
        # Save proposed config
        config_filename = f'scoring_config_v{proposal.proposed_version}.json'
        config_path = output_path / config_filename
        
        with open(config_path, 'w') as f:
            json.dump(proposed_config, f, indent=2)
        
        # Save change summary
        change_summary = {
            'proposed_version': proposal.proposed_version,
            'base_version': proposal.base_version,
            'created_at': proposal.created_at,
            'created_by': proposal.created_by,
            'summary': proposal.summary,
            'rationale': proposal.rationale,
            'changes': [
                {
                    'path': c.path,
                    'current_value': c.current_value,
                    'proposed_value': c.proposed_value,
                    'rationale': c.rationale,
                    'finding_reference': c.finding_reference,
                    'impact_estimate': c.impact_estimate,
                    'affected_components': c.affected_components
                }
                for c in proposal.changes
            ],
            'requires_approval': proposal.requires_approval
        }
        
        summary_filename = f'change_summary_v{proposal.proposed_version}.json'
        summary_path = output_path / summary_filename
        
        with open(summary_path, 'w') as f:
            json.dump(change_summary, f, indent=2)
        
        return {
            'config_path': str(config_path),
            'summary_path': str(summary_path)
        }


def generate_proposal(
    calibration_report: Dict[str, Any],
    proposed_version: str,
    base_version: Optional[str] = None,
    created_by: Optional[str] = None
) -> ConfigProposal:
    """
    Convenience function to generate a configuration proposal.
    
    Args:
        calibration_report: Calibration report from CalibrationAnalyzer
        proposed_version: Version string for proposed config
        base_version: Base version to modify
        created_by: Creator identifier
    
    Returns:
        ConfigProposal object
    """
    generator = ConfigProposalGenerator(calibration_report)
    return generator.generate_proposal(proposed_version, base_version, created_by)

