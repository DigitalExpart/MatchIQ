import { Lock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LockedDualScanCardProps {
  onUpgrade: () => void;
  message: string;
}

export function LockedDualScanCard({ onUpgrade, message }: LockedDualScanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border-2 border-gray-200 overflow-hidden"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative">
        {/* Lock icon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-300 mb-6">
          <Lock className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Premium Feature</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-4 bg-white rounded-2xl border border-gray-300 opacity-60">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl text-gray-900 mb-2 opacity-60">
              Dual Scan · Mutual Evaluation
            </h3>
            <p className="text-gray-600">
              Explore compatibility together through mutual reflection.
            </p>
          </div>
        </div>

        {/* Locked message */}
        <div className="bg-white rounded-2xl p-6 border border-gray-300 mb-6">
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Features preview */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Invitation-based mutual assessment</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Private answers revealed together</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Structured compatibility insights</span>
          </div>
        </div>

        {/* Upgrade CTA */}
        <button
          onClick={onUpgrade}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl group"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>View Plans & Pricing</span>
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Calm reassurance */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Take your time · No pressure · Upgrade when ready
        </p>
      </div>
    </motion.div>
  );
}
