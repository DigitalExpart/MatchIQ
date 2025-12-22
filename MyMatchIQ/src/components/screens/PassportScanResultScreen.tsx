import { ArrowLeft, User } from 'lucide-react';
import { motion } from 'motion/react';
import { PassportTier, PassportTierBadge } from '../passport/PassportTierBadge';
import { PassportAIInsights } from '../passport/PassportAIInsights';
import { PassportInsights } from '../../utils/passportAI';

interface PassportScanResultScreenProps {
  tier: PassportTier;
  insights: PassportInsights;
  userName?: string;
  onBack: () => void;
}

export function PassportScanResultScreen({
  tier,
  insights,
  userName = 'This person',
  onBack,
}: PassportScanResultScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3C2B63] to-[#5A4180] text-white px-6 py-6">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl mb-1">{userName}'s Profile</h1>
            <PassportTierBadge tier={tier} size="sm" />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <PassportAIInsights tier={tier} insights={insights} />

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            🔒 Privacy & Consent
          </h3>
          <p className="text-xs text-blue-700 leading-relaxed">
            This passport was shared with you voluntarily. These insights are based on self-reported 
            reflections and represent patterns, not guarantees. Use this information thoughtfully 
            as one factor in your compatibility assessment.
          </p>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            Done
          </button>
        </motion.div>
      </div>
    </div>
  );
}
