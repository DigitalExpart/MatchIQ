// Dual Scan Results - Mutual Insights with Shared Awareness
import { ArrowLeft, Heart, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { CompatibilityResult, getBandColorScheme } from '../../utils/compatibilityEngine';
import { getRedFlagTranslationKey, getRecommendationTranslationKey } from '../../utils/compatibilityTranslations';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';

interface DualScanMutualResultsProps {
  result: CompatibilityResult;
  userAName: string;
  userBName: string;
  onBack: () => void;
  onProceed?: () => void;
}

export function DualScanMutualResults({
  result,
  userAName,
  userBName,
  onBack,
  onProceed
}: DualScanMutualResultsProps) {
  const colorScheme = getBandColorScheme(result.band);
  const language = useLanguage();

  // Group red flags by severity
  const criticalFlags = result.redFlags.filter(f => f.severity === 'critical');
  const highFlags = result.redFlags.filter(f => f.severity === 'high');
  const mediumFlags = result.redFlags.filter(f => f.severity === 'medium');
  const allSignals = [...criticalFlags, ...highFlags, ...mediumFlags];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm text-purple-700 mb-3">
            Mutual Assessment
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">
            Compatibility Results
          </h1>
          <p className="text-gray-600">
            {userAName} & {userBName}
          </p>
        </div>

        {/* Compatibility Band */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-gradient-to-br ${colorScheme.gradient} rounded-3xl p-8 text-white shadow-xl`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl mb-3">{result.bandLabel}</h2>
            <p className="text-white/90 leading-relaxed max-w-md mx-auto">
              {result.bandDescription}
            </p>
          </div>
        </motion.div>

        {/* Shared Strengths */}
        {result.strengths.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg text-gray-900">Shared Strengths</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              These areas show meaningful alignment between you:
            </p>
            <div className="space-y-2">
              {result.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{strength}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shared Areas Requiring Awareness */}
        {result.awarenessAreas.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900">Areas for Mutual Understanding</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              These differences could benefit from open, honest conversation:
            </p>
            <div className="space-y-2">
              {result.awarenessAreas.map((area, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{area}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mutual Awareness Alert (Red Flags) */}
        {allSignals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg text-gray-900">Mutual Awareness Alert</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Some patterns were identified that both of you should be aware of. These signals highlight 
              areas worth exploring together with care and honesty.
            </p>
            <div className="space-y-3">
              {allSignals.map((flag, index) => {
                // Get appropriate copy based on category
                let alertCopy = flag.signal;
                
                if (flag.category === 'consent' || flag.category === 'boundaries') {
                  alertCopy = "One or more responses suggest differences around boundaries or consent. Mutual respect and safety are essential for healthy connection.";
                } else if (flag.category === 'honesty') {
                  alertCopy = "Availability or relationship clarity appears misaligned. Clear intentions help protect emotional well-being.";
                } else if (flag.category === 'trauma' || flag.category === 'emotional') {
                  alertCopy = "Responses suggest unresolved emotional experiences may affect readiness for commitment at this time.";
                } else if (flag.category === 'control') {
                  alertCopy = "Differences in views around decision-making and balance were identified. Mutual respect and shared agency are important in partnerships.";
                } else if (flag.category === 'financial') {
                  alertCopy = "Differences in stability or responsibility may impact long-term compatibility. Alignment in these areas supports shared planning.";
                }

                return (
                  <div key={index} className="bg-white/60 rounded-xl p-4">
                    <p className="text-sm text-gray-800 mb-2">{alertCopy}</p>
                    {flag.guidance && (
                      <p className="text-xs text-gray-600 italic">{flag.guidance}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recommended Next Step */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-gray-900 mb-2">Recommended Next Step</h3>
              
              {/* Get appropriate guidance based on recommendation */}
              {result.recommendedAction === 'proceed' && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  Strong alignment detected. You may choose to continue with confidence and intention.
                </p>
              )}
              
              {result.recommendedAction === 'proceed-with-awareness' && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  There is meaningful potential here, with some areas that may benefit from discussion and mutual understanding.
                </p>
              )}
              
              {result.recommendedAction === 'pause-and-reflect' && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  Important differences were identified. Taking time to reflect before proceeding may support emotional safety and clarity.
                </p>
              )}
            </div>
          </div>

          {onProceed && (
            <button
              onClick={onProceed}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all mt-4"
            >
              Continue
            </button>
          )}
        </motion.div>

        {/* Privacy Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-purple-50 rounded-xl p-4 border border-purple-200"
        >
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            This mutual assessment is private between {userAName} and {userBName}. Results are based on 
            shared responses and provide signals—not predictions. Always trust your judgment and prioritize safety.
          </p>
        </motion.div>
      </div>
    </div>
  );
}