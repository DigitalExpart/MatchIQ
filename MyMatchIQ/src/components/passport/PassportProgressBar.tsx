import { motion } from 'motion/react';
import { PassportTier } from './PassportTierBadge';

interface PassportProgressBarProps {
  tier: PassportTier;
  answered: number;
  total: number;
}

const TIER_COLORS = {
  lite: 'bg-blue-500',
  standard: 'bg-purple-500',
  deep: 'bg-pink-500',
};

export function PassportProgressBar({ tier, answered, total }: PassportProgressBarProps) {
  const percentage = (answered / total) * 100;
  const isComplete = answered === total;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          Progress
        </span>
        <span className="text-sm font-medium text-gray-900">
          {answered}/{total} completed
        </span>
      </div>
      
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full ${TIER_COLORS[tier]} rounded-full`}
        />
      </div>

      {isComplete && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-green-600 mt-2 text-center"
        >
          ✓ Passport complete
        </motion.p>
      )}
    </div>
  );
}
