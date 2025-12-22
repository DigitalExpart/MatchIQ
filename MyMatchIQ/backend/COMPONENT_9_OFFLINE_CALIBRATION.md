# Component 9: Offline Learning & Calibration Infrastructure

## Overview

This component implements an **offline learning and calibration system** that improves accuracy over time **without changing runtime behavior**. All learning happens offline, all changes require human approval, and all updates are versioned and auditable.

## What "Learning" Means Here

**Learning** in this system means:
- **Collecting aggregate metrics** from assessments (anonymized, no raw data)
- **Analyzing calibration issues** (boundary crowding, flag triggering, confidence alignment)
- **Proposing configuration changes** (thresholds, weights, flags)
- **Requiring human approval** before any changes
- **Releasing versioned updates** safely

**Learning does NOT mean:**
- ❌ Live learning during assessments
- ❌ Auto-updating scoring logic
- ❌ Modifying runtime behavior automatically
- ❌ Using raw user text or answers
- ❌ Changing existing logic paths
- ❌ Self-modifying AI behavior

## Architecture

### Components

1. **Aggregate Metrics Collector** (`app/analytics/aggregate_metrics.py`)
   - Collects anonymized aggregate statistics
   - No raw user data
   - Configurable time windows
   - Outputs: `metrics_snapshot.json`

2. **Calibration Analyzer** (`app/analytics/calibration_analyzer.py`)
   - Detects calibration issues
   - Severity-tagged findings
   - No decisions, no changes
   - Outputs: `calibration_report.json`

3. **Config Proposal Generator** (`app/governance/config_proposal.py`)
   - Generates proposed config changes
   - Includes rationale
   - Versioned output
   - Outputs: `scoring_config_vX.Y.Z.json`, `change_summary.json`

4. **Human Approval Gate** (Extended `version_registry.py`)
   - Approval metadata tracking
   - Blocks activation without approval
   - Approval workflow enforcement

## What Is Forbidden

### Runtime Changes
- ❌ **NO** modification of scoring during assessments
- ❌ **NO** live learning or adaptation
- ❌ **NO** auto-updates to configuration
- ❌ **NO** changes to existing logic paths

### Data Collection
- ❌ **NO** raw user text collection
- ❌ **NO** individual answer storage for learning
- ❌ **NO** user identification in metrics
- ❌ **NO** PII in analytics

### Automatic Actions
- ❌ **NO** automatic config updates
- ❌ **NO** automatic threshold adjustments
- ❌ **NO** automatic weight modifications
- ❌ **NO** self-modifying behavior

## Calibration Lifecycle

### Phase 1: Metrics Collection
1. **Run Metrics Collector**
   ```python
   from app.analytics.aggregate_metrics import AggregateMetricsCollector
   
   collector = AggregateMetricsCollector(db, time_window_days=30)
   metrics = collector.collect_all_metrics()
   collector.save_metrics()
   ```

2. **Output**: `metrics_snapshot_YYYYMMDD_HHMMSS.json`
   - Score distributions
   - Confidence matrix
   - Red flag frequencies
   - Escalation frequencies
   - Tier usage counts

### Phase 2: Calibration Analysis
1. **Run Calibration Analyzer**
   ```python
   from app.analytics.calibration_analyzer import CalibrationAnalyzer
   
   analyzer = CalibrationAnalyzer(metrics)
   report = analyzer.analyze_all()
   analyzer.save_report()
   ```

2. **Output**: `calibration_report_YYYYMMDD_HHMMSS.json`
   - Severity-tagged findings
   - Boundary crowding detection
   - Flag triggering analysis
   - Confidence alignment issues
   - Escalation pattern analysis

### Phase 3: Proposal Generation
1. **Generate Config Proposal**
   ```python
   from app.governance.config_proposal import ConfigProposalGenerator
   
   generator = ConfigProposalGenerator(calibration_report)
   proposal = generator.generate_proposal(
       proposed_version="1.1.0",
       base_version="1.0.0",
       created_by="analytics_system"
   )
   generator.save_proposal(proposal)
   ```

2. **Output**: 
   - `scoring_config_v1.1.0.json` (proposed config)
   - `change_summary_v1.1.0.json` (change details)

### Phase 4: Human Review
1. **Review Proposal**
   - Examine `change_summary_v1.1.0.json`
   - Review rationale for each change
   - Assess impact estimates
   - Validate against calibration findings

2. **Approve or Reject**
   - If approved: Register version and approve
   - If rejected: Document rejection reason

### Phase 5: Approval & Activation
1. **Register Version**
   ```python
   from app.services.version_registry import get_version_registry, VersionChange
   
   registry = get_version_registry()
   registry.register_version(
       version="1.1.0",
       description="Calibration improvements based on 30-day analysis",
       changes=[...],
       requires_approval=True
   )
   ```

2. **Approve Version**
   ```python
   registry.approve_version(
       version="1.1.0",
       approved_by="senior_engineer@matchiq.com",
       approval_reason="Calibration improvements validated"
   )
   ```

3. **Activate Version** (after approval)
   ```python
   registry.activate_version("1.1.0")
   ```

## Approval Workflow

### Step 1: Proposal Creation
- System generates proposal based on calibration findings
- Proposal includes:
  - Proposed version number
  - List of changes with rationale
  - Impact estimates
  - Affected components

### Step 2: Human Review
- Human reviewer examines proposal
- Reviews:
  - Calibration findings
  - Proposed changes
  - Rationale
  - Impact estimates

### Step 3: Approval Decision
- **Approve**: Version can be activated
- **Reject**: Version remains inactive, rejection reason documented

### Step 4: Activation
- Only approved versions can be activated
- Activation deactivates previous versions
- System uses new version for future assessments

## Rollback Strategy

### Automatic Rollback
- If new version causes issues, previous version can be reactivated
- Version registry tracks all versions
- Backward compatibility checked before activation

### Manual Rollback
1. **Identify Issue**
   - Monitor metrics for anomalies
   - Review user feedback
   - Check error rates

2. **Deactivate Current Version**
   ```python
   registry.deprecate_version("1.1.0")
   ```

3. **Reactivate Previous Version**
   ```python
   registry.activate_version("1.0.0")
   ```

4. **Document Rollback**
   - Record reason for rollback
   - Update version registry
   - Generate rollback report

## Safety Guarantees

### Data Privacy
✅ **Anonymized Metrics**: No user IDs, no raw answers  
✅ **Aggregate Only**: Counts, averages, distributions  
✅ **No PII**: No personal information in analytics  

### Change Control
✅ **Human Approval Required**: All changes require approval  
✅ **Versioned Updates**: All changes are versioned  
✅ **Audit Trail**: Full history of all changes  

### Runtime Safety
✅ **No Runtime Changes**: Scoring logic unchanged during assessments  
✅ **No Auto-Updates**: All updates require manual activation  
✅ **Backward Compatible**: Compatibility checked before activation  

## Usage Examples

### Complete Workflow

```python
from sqlalchemy.orm import Session
from app.analytics.aggregate_metrics import AggregateMetricsCollector
from app.analytics.calibration_analyzer import CalibrationAnalyzer
from app.governance.config_proposal import ConfigProposalGenerator
from app.services.version_registry import get_version_registry, VersionChange

# 1. Collect metrics
collector = AggregateMetricsCollector(db, time_window_days=30)
metrics = collector.collect_all_metrics()
metrics_path = collector.save_metrics()

# 2. Analyze calibration
analyzer = CalibrationAnalyzer(metrics)
report = analyzer.analyze_all()
report_path = analyzer.save_report()

# 3. Generate proposal
generator = ConfigProposalGenerator(report)
proposal = generator.generate_proposal(
    proposed_version="1.1.0",
    base_version="1.0.0",
    created_by="analytics_system"
)
files = generator.save_proposal(proposal)

# 4. Human review (manual step)
# Review files['summary_path'] and files['config_path']

# 5. Register and approve (after human review)
registry = get_version_registry()
registry.register_version(
    version="1.1.0",
    description="Calibration improvements",
    changes=[
        VersionChange(
            description="Adjusted high-potential threshold",
            date="2024-02-01",
            impact="non-breaking",
            affected_components=["scoring", "classification"]
        )
    ],
    requires_approval=True
)

# 6. Approve
registry.approve_version(
    version="1.1.0",
    approved_by="senior_engineer@matchiq.com",
    approval_reason="Validated calibration improvements"
)

# 7. Activate
registry.activate_version("1.1.0")
```

## Output Files

### Metrics Snapshot
- **Location**: `analytics_output/metrics_snapshot_YYYYMMDD_HHMMSS.json`
- **Contents**: Aggregate metrics from assessments
- **Privacy**: Fully anonymized, no user data

### Calibration Report
- **Location**: `analytics_output/calibration_report_YYYYMMDD_HHMMSS.json`
- **Contents**: Calibration findings with severity tags
- **Purpose**: Identify issues requiring attention

### Proposed Config
- **Location**: `scoring_configs/scoring_config_vX.Y.Z.json`
- **Contents**: Proposed configuration changes
- **Status**: Inactive until approved

### Change Summary
- **Location**: `scoring_configs/change_summary_vX.Y.Z.json`
- **Contents**: Detailed change list with rationale
- **Purpose**: Human review document

## Integration Points

### Metrics Collection
- Reads from `ScanResult` table
- Aggregates data only
- No individual record access

### Calibration Analysis
- Uses metrics from collector
- References current config
- Generates findings only

### Proposal Generation
- Uses calibration report
- References current config
- Generates proposals only

### Approval System
- Extends version registry
- Tracks approvals
- Enforces activation gates

## Benefits

1. **Improves Accuracy**: System learns from aggregate patterns
2. **Maintains Safety**: All changes require human approval
3. **Preserves Privacy**: No raw user data collected
4. **Versioned Updates**: Full audit trail
5. **Rollback Capable**: Can revert to previous versions
6. **No Runtime Impact**: Learning happens offline

## Next Steps

The offline learning system is now complete. The system can:
1. ✅ Collect aggregate metrics
2. ✅ Analyze calibration issues
3. ✅ Generate config proposals
4. ✅ Require human approval
5. ✅ Release versioned updates safely

All learning happens offline, all changes require approval, and runtime behavior is never modified automatically.

