// Single Scan Results - Private, Observational Evaluation (WITH TRANSLATIONS)
import { ArrowLeft, CheckCircle, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { CompatibilityResult, getBandColorScheme } from '../../utils/compatibilityEngine';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';

interface SingleScanResultsScreenProps {
  result: CompatibilityResult;
  partnerName: string;
  onBack: () => void;
  onSaveResults?: () => void;
}

export function SingleScanResultsScreen({
  result,
  partnerName,
  onBack,
  onSaveResults
}: SingleScanResultsScreenProps) {
  const colorScheme = getBandColorScheme(result.band);
  const { t } = useLanguage();

  // Group red flags by severity for display
  const criticalFlags = result.redFlags.filter(f => f.severity === 'critical');
  const highFlags = result.redFlags.filter(f => f.severity === 'high');
  const mediumFlags = result.redFlags.filter(f => f.severity === 'medium');
  const allSignals = [...criticalFlags, ...highFlags, ...mediumFlags];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">{t('common.back')}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-purple-100 rounded-full text-sm text-purple-700 mb-3">
            {t('compatibility.privateAssessment')}
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">
            {t('compatibility.compatibilityAssessment')}
          </h1>
          <p className="text-gray-600">
            {t('compatibility.privateEvalFor').replace('{partner}', partnerName)}
          </p>
        </div>

        {/* Compatibility Band */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${colorScheme.gradient} rounded-3xl p-8 text-white shadow-lg`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl mb-2">{result.bandLabel}</h2>
            <p className="text-white/90 leading-relaxed">
              {result.bandDescription}
            </p>
          </div>
        </motion.div>

        {/* Strong Alignment Areas */}
        {result.strengths.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg text-gray-900">{t('compatibility.strongAlignmentAreas')}</h3>
            </div>
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

        {/* Areas to Be Aware Of */}
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
              <h3 className="text-lg text-gray-900">{t('compatibility.areasToBeAwareOf')}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {t('compatibility.differencesConversation')}
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

        {/* Signals to Consider */}
        {allSignals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg text-gray-900">{t('compatibility.signalsToConsider')}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {t('compatibility.softAwareness')}
            </p>
            <div className="space-y-3">
              {allSignals.map((flag, index) => (
                <div key={index} className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-gray-800 mb-1">{flag.signal}</p>
                  {flag.guidance && (
                    <p className="text-xs text-gray-600 italic mt-2">{flag.guidance}</p>
                  )}
                </div>
              ))}
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
              <h3 className="text-lg text-gray-900 mb-2">{t('compatibility.recommendedNextStep')}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.actionGuidance}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Save Results Button */}
        {onSaveResults && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onSaveResults}
            className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {t('compatibility.saveAssessment')}
          </motion.button>
        )}

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
        >
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {t('compatibility.resultsDisclaimer')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
