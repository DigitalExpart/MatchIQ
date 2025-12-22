import { motion } from 'motion/react';
import { ScanAccessCard } from './ScanAccessCard';
import { LockedDualScanCard } from './LockedDualScanCard';
import { getScanAccess } from '../../utils/scanAccess';
import { SubscriptionTier } from '../../App';

interface ScanAccessSectionProps {
  subscriptionTier: SubscriptionTier;
  onStartSingleScan: () => void;
  onStartDualScan: () => void;
  onUpgrade: () => void;
  variant?: 'default' | 'compact';
}

export function ScanAccessSection({
  subscriptionTier,
  onStartSingleScan,
  onStartDualScan,
  onUpgrade,
  variant = 'default',
}: ScanAccessSectionProps) {
  const access = getScanAccess(subscriptionTier);

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {/* Title */}
        <div className="px-1">
          <h2 className="text-lg text-gray-900 mb-1">Assessment Tools</h2>
          <p className="text-sm text-gray-600">
            No messaging, no swiping — just compatibility intelligence
          </p>
        </div>

        {/* Single Scan */}
        <ScanAccessCard
          type="single"
          label={access.singleScanLabel}
          subtext={access.singleScanSubtext}
          onClick={onStartSingleScan}
          isEnabled={access.canAccessSingleScan}
          variant="compact"
        />

        {/* Dual Scan */}
        {access.canAccessDualScan ? (
          <ScanAccessCard
            type="dual"
            label={access.dualScanLabel}
            subtext={access.dualScanSubtext}
            onClick={onStartDualScan}
            isEnabled={true}
            insightLevel={access.dualScanInsightLevel === 'enhanced' ? 'enhanced' : 'standard'}
            variant="compact"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white border border-gray-300 opacity-60">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg text-gray-900 opacity-60">{access.dualScanLabel}</h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-full border border-gray-300">
                    <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-700">Premium</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{access.dualScanSubtext}</p>
                <button
                  onClick={onUpgrade}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Plans →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            MyMatchIQ is a compatibility intelligence platform. There is no chat, messaging, or swiping.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl text-gray-900 mb-2">Choose Your Assessment</h2>
        <p className="text-gray-600">
          Evaluate compatibility through structured questions — no messaging required
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Single Scan - Always available */}
        <ScanAccessCard
          type="single"
          label={access.singleScanLabel}
          subtext={access.singleScanSubtext}
          onClick={onStartSingleScan}
          isEnabled={access.canAccessSingleScan}
        />

        {/* Dual Scan - Conditional on tier */}
        {access.canAccessDualScan ? (
          <ScanAccessCard
            type="dual"
            label={access.dualScanLabel}
            subtext={access.dualScanSubtext}
            onClick={onStartDualScan}
            isEnabled={true}
            insightLevel={access.dualScanInsightLevel === 'enhanced' ? 'enhanced' : 'standard'}
          />
        ) : (
          <LockedDualScanCard
            onUpgrade={onUpgrade}
            message={access.dualScanLockedMessage || ''}
          />
        )}
      </div>

      {/* Platform philosophy */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center border border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-medium">MyMatchIQ focuses on clarity, not connection.</span>
          <br />
          We provide compatibility intelligence without messaging, swiping, or social features.
        </p>
      </div>
    </div>
  );
}
