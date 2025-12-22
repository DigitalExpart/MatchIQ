import { SubscriptionTier } from '../App';

export interface ScanAccessConfig {
  canAccessSingleScan: boolean;
  canAccessDualScan: boolean;
  dualScanInsightLevel: 'none' | 'standard' | 'enhanced';
  singleScanLabel: string;
  dualScanLabel: string;
  singleScanSubtext: string;
  dualScanSubtext: string;
  dualScanLockedMessage?: string;
}

/**
 * Centralized scan access logic based on subscription tier
 * Enforces tier-based feature access for Single Scan and Dual Scan
 */
export function getScanAccess(tier: SubscriptionTier): ScanAccessConfig {
  switch (tier) {
    case 'free':
      return {
        canAccessSingleScan: true,
        canAccessDualScan: false,
        dualScanInsightLevel: 'none',
        singleScanLabel: 'Single Scan · Private Evaluation',
        dualScanLabel: 'Dual Scan · Mutual Evaluation',
        singleScanSubtext: 'Evaluate someone privately based on your own observations.',
        dualScanSubtext: 'Explore compatibility together through mutual reflection.',
        dualScanLockedMessage: 'Dual Scan is available on Premier and Elite plans. Upgrade to explore compatibility together.',
      };
    
    case 'premium':
      return {
        canAccessSingleScan: true,
        canAccessDualScan: true,
        dualScanInsightLevel: 'standard',
        singleScanLabel: 'Single Scan · Private Evaluation',
        dualScanLabel: 'Dual Scan · Mutual Evaluation',
        singleScanSubtext: 'Evaluate someone privately based on your own observations.',
        dualScanSubtext: 'Invite someone to explore compatibility together.',
      };
    
    case 'exclusive':
      return {
        canAccessSingleScan: true,
        canAccessDualScan: true,
        dualScanInsightLevel: 'enhanced',
        singleScanLabel: 'Single Scan · Private Evaluation',
        dualScanLabel: 'Dual Scan · Deep Mutual Insight',
        singleScanSubtext: 'Evaluate someone privately based on your own observations.',
        dualScanSubtext: 'Invite someone to explore deep compatibility analysis together.',
      };
  }
}

/**
 * Check if user can access Single Scan
 * Single Scan is available to ALL tiers
 */
export function canAccessSingleScan(tier: SubscriptionTier): boolean {
  return true; // Always available
}

/**
 * Check if user can access Dual Scan
 * Dual Scan requires Premium or Exclusive tier
 */
export function canAccessDualScan(tier: SubscriptionTier): boolean {
  return tier === 'premium' || tier === 'exclusive';
}

/**
 * Get Dual Scan insight level based on tier
 */
export function getDualScanInsightLevel(tier: SubscriptionTier): 'none' | 'standard' | 'enhanced' {
  if (tier === 'exclusive') return 'enhanced';
  if (tier === 'premium') return 'standard';
  return 'none';
}

/**
 * Get upgrade messaging for locked features
 */
export function getUpgradeMessage(tier: SubscriptionTier): string {
  if (tier === 'free') {
    return 'Dual Scan is available on Premier and Elite plans. Upgrade to explore compatibility together.';
  }
  return '';
}
