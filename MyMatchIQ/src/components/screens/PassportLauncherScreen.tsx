import { motion } from 'motion/react';
import { ArrowLeft, QrCode, Brain, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import { PassportTier } from '../passport/PassportTierBadge';

interface PassportLauncherScreenProps {
  onStartPassport: (tier: PassportTier) => void;
  onBack: () => void;
  userTier?: 'free' | 'premier' | 'elite';
}

export function PassportLauncherScreen({
  onStartPassport,
  onBack,
  userTier = 'free',
}: PassportLauncherScreenProps) {
  const availableTiers: PassportTier[] = 
    userTier === 'elite' ? ['lite', 'standard', 'deep'] :
    userTier === 'premier' ? ['lite', 'standard'] :
    ['lite'];

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
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-4">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl mb-2">Compatibility Passport</h1>
          <p className="text-white/80">
            Create your scannable relationship profile
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl text-gray-900 mb-3">What is a Compatibility Passport?</h2>
          <p className="text-gray-600 mb-4">
            Your Compatibility Passport is a scannable QR profile that provides AI-generated 
            insights about your relationship patterns, communication style, and emotional awareness. 
            The depth of insights depends on your subscription tier.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">AI Insights</h3>
                <p className="text-xs text-gray-600">Get intelligent compatibility analysis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Privacy First</h3>
                <p className="text-xs text-gray-600">No messaging, consent-based sharing</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Tier-Based Depth</h3>
                <p className="text-xs text-gray-600">More questions = deeper insights</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tier Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Choose Your Passport Depth</h2>

          {/* Lite Passport */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onStartPassport('lite')}
            className="w-full text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-blue-200 hover:border-blue-400"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Lite Passport · 15Q
                </div>
                <h3 className="text-xl text-gray-900 mb-1">Quick Snapshot</h3>
                <p className="text-sm text-gray-600">
                  High-level compatibility overview
                </p>
              </div>
              {userTier === 'free' && (
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  FREE
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Intentions & Relationship Outlook</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Communication Style</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Emotional Awareness</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic">
              Best for introductions and initial assessments
            </div>
          </motion.button>

          {/* Standard Passport */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => availableTiers.includes('standard') ? onStartPassport('standard') : null}
            disabled={!availableTiers.includes('standard')}
            className={`w-full text-left bg-white rounded-2xl shadow-md p-6 border-2 transition-all ${
              availableTiers.includes('standard')
                ? 'border-purple-200 hover:border-purple-400 hover:shadow-xl'
                : 'border-gray-200 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Standard Passport · 25Q
                </div>
                <h3 className="text-xl text-gray-900 mb-1">Intentional Depth</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive compatibility analysis
                </p>
              </div>
              {userTier === 'premier' && (
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  PREMIER
                </div>
              )}
              {userTier === 'free' && (
                <div className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                  LOCKED
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>All Lite categories</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Values & Lifestyle</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Conflict & Boundaries</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic">
              Recommended for serious compatibility evaluation
            </div>
          </motion.button>

          {/* Deep Passport */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => availableTiers.includes('deep') ? onStartPassport('deep') : null}
            disabled={!availableTiers.includes('deep')}
            className={`w-full text-left bg-white rounded-2xl shadow-md p-6 border-2 transition-all ${
              availableTiers.includes('deep')
                ? 'border-pink-200 hover:border-pink-400 hover:shadow-xl'
                : 'border-gray-200 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  Deep Passport · 45Q
                </div>
                <h3 className="text-xl text-gray-900 mb-1">Maximum Insight</h3>
                <p className="text-sm text-gray-600">
                  Highest confidence compatibility intelligence
                </p>
              </div>
              {userTier === 'elite' && (
                <div className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                  ELITE
                </div>
              )}
              {userTier !== 'elite' && (
                <div className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                  LOCKED
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-pink-500" />
                <span>All Standard categories</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-pink-500" />
                <span>Pace & Consistency</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-pink-500" />
                <span>Long-Term Thinking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-pink-500" />
                <span>Trust & Emotional Safety</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 italic">
              Maximum reliability for serious relationship decisions
            </div>
          </motion.button>
        </div>

        {/* Footer Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            You cannot manually downgrade passport depth. To increase depth,<br />
            answer additional questions by creating a higher-tier passport.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
