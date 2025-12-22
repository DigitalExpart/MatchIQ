"""
Component 8: Logic Versioning & Release Safety

Implements:
- Version registry
- Change log tracking
- Backward compatibility
- Version propagation
"""
from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass, field
import json
import os


@dataclass
class VersionChange:
    """Represents a single change in a version."""
    description: str
    date: str
    impact: str  # 'breaking', 'non-breaking', 'enhancement'
    affected_components: List[str] = field(default_factory=list)
    migration_notes: Optional[str] = None


@dataclass
class ApprovalMetadata:
    """Metadata for version approval."""
    approved: bool = False
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    approval_reason: Optional[str] = None
    requires_approval: bool = True


@dataclass
class LogicVersion:
    """Represents a logic version with metadata."""
    version: str
    description: str
    created_at: str
    is_active: bool
    is_deprecated: bool = False
    deprecation_date: Optional[str] = None
    changes: List[VersionChange] = field(default_factory=list)
    backward_compatible_with: List[str] = field(default_factory=list)
    breaking_changes: List[str] = field(default_factory=list)
    approval: ApprovalMetadata = field(default_factory=lambda: ApprovalMetadata())


class VersionRegistry:
    """
    Registry for tracking logic versions and changes.
    """
    
    def __init__(self, registry_file: Optional[str] = None):
        """
        Initialize version registry.
        
        Args:
            registry_file: Path to version registry JSON file. If None, uses default.
        """
        if registry_file is None:
            # Default to registry file in scoring_configs directory
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            registry_file = os.path.join(base_dir, 'scoring_configs', 'version_registry.json')
        
        self.registry_file = registry_file
        self._versions: Dict[str, LogicVersion] = {}
        self._load_registry()
    
    def _load_registry(self):
        """Load version registry from file."""
        if os.path.exists(self.registry_file):
            try:
                with open(self.registry_file, 'r') as f:
                    data = json.load(f)
                    self._versions = {
                        v['version']: self._load_version_from_dict(v)
                        for v in data.get('versions', [])
                    }
            except Exception as e:
                print(f"Warning: Failed to load version registry: {e}")
                self._versions = {}
        else:
            # Initialize with default version if registry doesn't exist
            self._initialize_default_registry()
    
    def _initialize_default_registry(self):
        """Initialize registry with default version."""
        default_version = LogicVersion(
            version="1.0.0",
            description="Initial production configuration",
            created_at="2024-01-01T00:00:00Z",
            is_active=True,
            is_deprecated=False,
            changes=[
                VersionChange(
                    description="Initial production configuration",
                    date="2024-01-01",
                    impact="non-breaking",
                    affected_components=["scoring", "red_flags", "confidence_gating"]
                )
            ],
            approval=ApprovalMetadata(
                approved=True,  # Initial version pre-approved
                approved_by="System",
                approved_at="2024-01-01T00:00:00Z",
                requires_approval=False
            )
        )
        self._versions["1.0.0"] = default_version
        self._save_registry()
    
    def _save_registry(self):
        """Save version registry to file."""
        try:
            os.makedirs(os.path.dirname(self.registry_file), exist_ok=True)
            data = {
                'versions': [
                    {
                        'version': v.version,
                        'description': v.description,
                        'created_at': v.created_at,
                        'is_active': v.is_active,
                        'is_deprecated': v.is_deprecated,
                        'deprecation_date': v.deprecation_date,
                        'changes': [
                            {
                                'description': c.description,
                                'date': c.date,
                                'impact': c.impact,
                                'affected_components': c.affected_components,
                                'migration_notes': c.migration_notes
                            }
                            for c in v.changes
                        ],
                        'backward_compatible_with': v.backward_compatible_with,
                        'breaking_changes': v.breaking_changes,
                        'approval': {
                            'approved': v.approval.approved,
                            'approved_by': v.approval.approved_by,
                            'approved_at': v.approval.approved_at,
                            'approval_reason': v.approval.approval_reason,
                            'requires_approval': v.approval.requires_approval
                        }
                    }
                    for v in self._versions.values()
                ]
            }
            with open(self.registry_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Warning: Failed to save version registry: {e}")
    
    def register_version(
        self,
        version: str,
        description: str,
        changes: List[VersionChange],
        backward_compatible_with: Optional[List[str]] = None,
        breaking_changes: Optional[List[str]] = None,
        requires_approval: bool = True
    ):
        """
        Register a new logic version.
        
        Args:
            version: Version string (e.g., "1.1.0")
            description: Description of the version
            changes: List of changes in this version
            backward_compatible_with: List of versions this is compatible with
            breaking_changes: List of breaking changes (if any)
            requires_approval: Whether this version requires approval before activation
        """
        logic_version = LogicVersion(
            version=version,
            description=description,
            created_at=datetime.utcnow().isoformat() + 'Z',
            is_active=False,  # Never active until approved and activated
            is_deprecated=False,
            changes=changes,
            backward_compatible_with=backward_compatible_with or [],
            breaking_changes=breaking_changes or [],
            approval=ApprovalMetadata(requires_approval=requires_approval)
        )
        
        self._versions[version] = logic_version
        
        # Mark previous versions as inactive if this is a new major version
        if self._is_major_version(version):
            self._deactivate_previous_versions(version)
        
        self._save_registry()
    
    def _is_major_version(self, version: str) -> bool:
        """Check if version is a major version (e.g., 2.0.0)."""
        try:
            parts = version.split('.')
            return len(parts) >= 1 and parts[0] != '1'
        except:
            return False
    
    def _deactivate_previous_versions(self, new_version: str):
        """Deactivate previous versions when a new major version is released."""
        new_major = new_version.split('.')[0]
        for version, logic_version in self._versions.items():
            if version.split('.')[0] < new_major and logic_version.is_active:
                logic_version.is_active = False
    
    def get_version(self, version: str) -> Optional[LogicVersion]:
        """Get version information by version string."""
        return self._versions.get(version)
    
    def get_active_version(self) -> Optional[LogicVersion]:
        """Get the currently active version."""
        for version in sorted(self._versions.keys(), reverse=True):
            logic_version = self._versions[version]
            if logic_version.is_active and not logic_version.is_deprecated:
                # Only return if approved (or doesn't require approval)
                if logic_version.approval.approved or not logic_version.approval.requires_approval:
                    return logic_version
        return None
    
    def approve_version(
        self,
        version: str,
        approved_by: str,
        approval_reason: Optional[str] = None
    ) -> bool:
        """
        Approve a version for activation.
        
        Args:
            version: Version to approve
            approved_by: Identifier of approver
            approval_reason: Reason for approval
        
        Returns:
            True if approved successfully, False otherwise
        """
        logic_version = self.get_version(version)
        if not logic_version:
            return False
        
        # Check if already approved
        if logic_version.approval.approved:
            return True
        
        # Approve
        logic_version.approval.approved = True
        logic_version.approval.approved_by = approved_by
        logic_version.approval.approved_at = datetime.utcnow().isoformat() + 'Z'
        logic_version.approval.approval_reason = approval_reason
        
        # Version can now be activated (but doesn't auto-activate)
        self._save_registry()
        return True
    
    def activate_version(self, version: str) -> bool:
        """
        Activate a version (must be approved first).
        
        Args:
            version: Version to activate
        
        Returns:
            True if activated successfully, False otherwise
        """
        logic_version = self.get_version(version)
        if not logic_version:
            return False
        
        # Check approval
        if logic_version.approval.requires_approval and not logic_version.approval.approved:
            return False  # Cannot activate without approval
        
        # Deactivate other versions
        for v in self._versions.values():
            if v.version != version:
                v.is_active = False
        
        # Activate this version
        logic_version.is_active = True
        self._save_registry()
        return True
    
    def can_activate_version(self, version: str) -> tuple[bool, Optional[str]]:
        """
        Check if a version can be activated.
        
        Args:
            version: Version to check
        
        Returns:
            (can_activate: bool, reason: Optional[str])
        """
        logic_version = self.get_version(version)
        if not logic_version:
            return False, f"Version {version} not found"
        
        if logic_version.is_deprecated:
            return False, f"Version {version} is deprecated"
        
        if logic_version.approval.requires_approval and not logic_version.approval.approved:
            return False, f"Version {version} requires approval before activation"
        
        return True, None
    
    def get_all_versions(self) -> List[LogicVersion]:
        """Get all registered versions."""
        return list(self._versions.values())
    
    def get_version_history(self, limit: int = 10) -> List[LogicVersion]:
        """Get version history (most recent first)."""
        versions = sorted(self._versions.keys(), reverse=True)
        return [self._versions[v] for v in versions[:limit]]
    
    def is_backward_compatible(self, from_version: str, to_version: str) -> bool:
        """
        Check if two versions are backward compatible.
        
        Args:
            from_version: Source version
            to_version: Target version
        
        Returns:
            True if versions are compatible
        """
        to_logic_version = self.get_version(to_version)
        if not to_logic_version:
            return False
        
        # Check explicit compatibility list
        if from_version in to_logic_version.backward_compatible_with:
            return True
        
        # Check if target version has breaking changes
        if to_logic_version.breaking_changes:
            return False
        
        # Same major version is generally compatible
        from_major = from_version.split('.')[0]
        to_major = to_version.split('.')[0]
        return from_major == to_major
    
    def get_change_log(self, from_version: Optional[str] = None, to_version: Optional[str] = None) -> List[VersionChange]:
        """
        Get change log between two versions.
        
        Args:
            from_version: Starting version (None = all versions)
            to_version: Ending version (None = current version)
        
        Returns:
            List of changes
        """
        if to_version is None:
            active = self.get_active_version()
            to_version = active.version if active else None
        
        if to_version is None:
            return []
        
        changes = []
        versions = sorted(self._versions.keys())
        
        start_idx = 0
        if from_version:
            try:
                start_idx = versions.index(from_version) + 1
            except ValueError:
                pass
        
        end_idx = len(versions)
        if to_version:
            try:
                end_idx = versions.index(to_version) + 1
            except ValueError:
                pass
        
        for version in versions[start_idx:end_idx]:
            logic_version = self._versions[version]
            changes.extend(logic_version.changes)
        
        return changes
    
    def deprecate_version(self, version: str, deprecation_date: Optional[str] = None):
        """
        Mark a version as deprecated.
        
        Args:
            version: Version to deprecate
            deprecation_date: Deprecation date (defaults to now)
        """
        logic_version = self.get_version(version)
        if logic_version:
            logic_version.is_deprecated = True
            logic_version.deprecation_date = deprecation_date or datetime.utcnow().isoformat() + 'Z'
            logic_version.is_active = False
            self._save_registry()


# Singleton instance
_registry_instance: Optional[VersionRegistry] = None


def get_version_registry() -> VersionRegistry:
    """Get singleton version registry instance."""
    global _registry_instance
    if _registry_instance is None:
        _registry_instance = VersionRegistry()
    return _registry_instance


def get_version_info(version: str) -> Optional[Dict[str, Any]]:
    """
    Get version information as dictionary.
    
    Args:
        version: Version string
    
    Returns:
        Version information dictionary or None
    """
    registry = get_version_registry()
    logic_version = registry.get_version(version)
    
    if not logic_version:
        return None
    
    return {
        'version': logic_version.version,
        'description': logic_version.description,
        'created_at': logic_version.created_at,
        'is_active': logic_version.is_active,
        'is_deprecated': logic_version.is_deprecated,
        'deprecation_date': logic_version.deprecation_date,
        'changes': [
            {
                'description': c.description,
                'date': c.date,
                'impact': c.impact,
                'affected_components': c.affected_components,
                'migration_notes': c.migration_notes
            }
            for c in logic_version.changes
        ],
        'backward_compatible_with': logic_version.backward_compatible_with,
        'breaking_changes': logic_version.breaking_changes,
        'approval': {
            'approved': logic_version.approval.approved,
            'approved_by': logic_version.approval.approved_by,
            'approved_at': logic_version.approval.approved_at,
            'approval_reason': logic_version.approval.approval_reason,
            'requires_approval': logic_version.approval.requires_approval
        }
    }


def get_active_version_info() -> Optional[Dict[str, Any]]:
    """Get active version information."""
    registry = get_version_registry()
    active = registry.get_active_version()
    if active:
        return get_version_info(active.version)
    return None


def get_change_log_since(version: str) -> List[Dict[str, Any]]:
    """
    Get change log since a specific version.
    
    Args:
        version: Starting version
    
    Returns:
        List of change dictionaries
    """
    registry = get_version_registry()
    changes = registry.get_change_log(from_version=version)
    
    return [
        {
            'description': c.description,
            'date': c.date,
            'impact': c.impact,
            'affected_components': c.affected_components,
            'migration_notes': c.migration_notes
        }
        for c in changes
    ]

