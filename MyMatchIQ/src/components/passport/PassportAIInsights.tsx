import { motion } from 'motion/react';
import { PassportTier } from './PassportTierBadge';
import { Brain, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface PassportAIInsightsProps {
  tier: PassportTier;
  insights: {
    greenFlags?: string[];
    yellowFlags?: string[];
    redFlags?: string[];
    patterns?: string[];
  };
}

const TIER_AI_CONFIG = {
  lite: {
    header: 'Compatibility Snapshot',
    summary: 'This Compatibility Passport provides an early snapshot of how this person approaches connection, communication, and emotional awareness. The insights below reflect general tendencies based on limited responses.',
    transparency: 'This passport is based on a limited number of reflections and is best used as an introduction, not a decision-making profile.',
    depthCue: 'Deeper insight becomes available as more reflections are completed.',
  },
  standard: {
    header: 'Compatibility Overview',
    summary: 'This Compatibility Passport reflects intentional thought patterns across communication, emotional intelligence, values, and boundaries. The insights below indicate emerging consistency in how this person approaches relationships.',
    transparency: null,
    confidence: 'This profile provides meaningful insight for deciding whether to explore compatibility further.',
  },
  deep: {
    header: 'Deep Compatibility Profile',
    summary: 'This Compatibility Passport reflects a high level of self-awareness and consistency across emotional, relational, and long-term thinking dimensions. Patterns observed here are stable and reliable indicators of how this person approaches connection over time.',
    transparency: null,
    ethical: 'No profile guarantees outcomes. This passport reflects patterns, not predictions.',
  },
};

export function PassportAIInsights({ tier, insights }: PassportAIInsightsProps) {
  const config = TIER_AI_CONFIG[tier];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl text-gray-900 mb-2">{config.header}</h2>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          {config.summary}
        </p>
      </motion.div>

      {/* Insights Grid */}
      <div className="space-y-4">
        {/* Green Flags */}
        {insights.greenFlags && insights.greenFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-900 mb-2">
                  {tier === 'deep' ? 'Green Flag Indicators' : 'Positive Tendencies'}
                </h3>
                <ul className="space-y-1.5">
                  {insights.greenFlags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Yellow Flags (Standard & Deep only) */}
        {tier !== 'lite' && insights.yellowFlags && insights.yellowFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-900 mb-2">
                  Areas to Explore Further
                </h3>
                <ul className="space-y-1.5">
                  {insights.yellowFlags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Red Flags (Deep only) */}
        {tier === 'deep' && insights.redFlags && insights.redFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-900 mb-2">
                  Potential Concerns
                </h3>
                <ul className="space-y-1.5">
                  {insights.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Patterns */}
        {insights.patterns && insights.patterns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-purple-50 border border-purple-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-purple-900 mb-2">
                  {tier === 'deep' ? 'Consistency Patterns' : 'Key Observations'}
                </h3>
                <ul className="space-y-1.5">
                  {insights.patterns.map((pattern, idx) => (
                    <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{pattern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Transparency / Confidence Messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
      >
        {config.transparency && (
          <p className="text-xs text-gray-600 italic">
            {config.transparency}
          </p>
        )}
        
        {tier === 'lite' && config.depthCue && (
          <p className="text-xs text-purple-600 font-medium">
            {config.depthCue}
          </p>
        )}
        
        {tier === 'standard' && config.confidence && (
          <p className="text-xs text-purple-600 font-medium">
            ✓ {config.confidence}
          </p>
        )}
        
        {tier === 'deep' && config.ethical && (
          <p className="text-xs text-gray-700 font-medium">
            ⚖️ {config.ethical}
          </p>
        )}
      </motion.div>

      {/* Universal Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pt-4 border-t border-gray-200"
      >
        <p className="text-xs text-gray-500 leading-relaxed">
          Compatibility Passports are private, consent-based, and scannable only within MyMatchIQ.<br />
          No messaging. No contact. Insight only.
        </p>
      </motion.div>
    </div>
  );
}
