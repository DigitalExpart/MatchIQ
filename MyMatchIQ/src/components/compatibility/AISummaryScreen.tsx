// AI-Generated Compatibility Summary Screen
import { ArrowLeft, Sparkles, TrendingUp, AlertTriangle, MessageSquare, ArrowRight, Download } from 'lucide-react';
import { CompatibilityResult, getBandColorScheme } from '../../utils/compatibilityEngine';
import { motion } from 'motion/react';

interface AISummaryScreenProps {
  result: CompatibilityResult;
  partnerName: string;
  userName?: string;
  onBack: () => void;
  onSave?: () => void;
  isMutual?: boolean;
}

export function AISummaryScreen({
  result,
  partnerName,
  userName = 'You',
  onBack,
  onSave,
  isMutual = false
}: AISummaryScreenProps) {
  const colorScheme = getBandColorScheme(result.band);
  const hasSafetySignals = result.redFlags.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>

            {onSave && (
              <button
                onClick={onSave}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Save</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm text-purple-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Generated Summary</span>
          </div>
          <h1 className="text-3xl text-gray-900 mb-2">
            Compatibility Intelligence
          </h1>
          <p className="text-gray-600">
            {isMutual ? `${userName} & ${partnerName}` : `Your assessment for ${partnerName}`}
          </p>
        </div>

        {/* 1. Overall Compatibility Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Band Header */}
          <div className={`bg-gradient-to-r ${colorScheme.gradient} p-6 text-white`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl">Overall Compatibility</h2>
                <p className="text-white/80 text-sm">{result.bandLabel}</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              {result.bandDescription}
            </p>
          </div>

          {/* Summary Content */}
          <div className="p-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on the responses provided, this assessment identifies patterns across key relationship areas. 
              The analysis considers compatibility across values, lifestyle, communication, and future goals to 
              provide observational signals that may inform your decision-making process.
            </p>
          </div>
        </motion.div>

        {/* 2. Strong Alignment Areas */}
        {result.strengths.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl text-gray-900">Strong Alignment Areas</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              These categories show notable compatibility and shared understanding:
            </p>

            <div className="space-y-3">
              {result.strengths.map((strength, index) => (
                <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{strength}</p>
                      <p className="text-xs text-gray-600">
                        Alignment in this area supports long-term compatibility and shared vision.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. Areas Requiring Awareness */}
        {result.awarenessAreas.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl text-gray-900">Areas Requiring Awareness</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              These areas show differences that could benefit from open, intentional communication:
            </p>

            <div className="space-y-3">
              {result.awarenessAreas.map((area, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{area}</p>
                      <p className="text-xs text-gray-600">
                        Understanding each other's perspectives in this area may strengthen connection.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. Safety or Integrity Signals (if any) */}
        {hasSafetySignals && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-amber-300 p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl text-gray-900">Safety & Integrity Signals</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Certain response patterns suggest areas that may require careful consideration. These are not 
              judgments—they are signals to help you make informed decisions about your emotional safety.
            </p>

            <div className="space-y-3">
              {result.redFlags.map((flag, index) => {
                // Use exact copy based on category
                let signalTitle = '';
                let signalDescription = '';

                switch (flag.category) {
                  case 'consent':
                  case 'boundaries':
                    signalTitle = 'Consent & Boundary Awareness';
                    signalDescription = 'One or more responses suggest differences around boundaries or consent. Mutual respect and safety are essential for healthy connection.';
                    break;
                  case 'honesty':
                    signalTitle = 'Clarity & Availability';
                    signalDescription = 'Availability or relationship clarity appears misaligned. Clear intentions help protect emotional well-being.';
                    break;
                  case 'trauma':
                    signalTitle = 'Emotional Readiness';
                    signalDescription = 'Responses suggest unresolved emotional experiences may affect readiness for commitment at this time.';
                    break;
                  case 'control':
                    signalTitle = 'Decision-Making Balance';
                    signalDescription = 'Differences in views around decision-making and balance were identified. Mutual respect and shared agency are important in partnerships.';
                    break;
                  case 'emotional':
                    signalTitle = 'Emotional Regulation';
                    signalDescription = 'Some responses indicate challenges with emotional regulation during stress or conflict. Awareness and healthy coping strategies support long-term connection.';
                    break;
                  case 'financial':
                    signalTitle = 'Financial Stability & Communication';
                    signalDescription = 'Differences in stability or responsibility may impact long-term compatibility. Alignment in these areas supports shared planning.';
                    break;
                  case 'safety':
                    signalTitle = 'Safety Considerations';
                    signalDescription = flag.signal;
                    break;
                  default:
                    signalTitle = 'Area of Consideration';
                    signalDescription = flag.signal;
                }

                return (
                  <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <h4 className="text-sm text-gray-900 mb-2">{signalTitle}</h4>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">
                      {signalDescription}
                    </p>
                    {flag.guidance && (
                      <p className="text-xs text-gray-600 italic">
                        {flag.guidance}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 5. Recommended Next Step */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl text-gray-900 mb-2">Recommended Next Step</h3>
              
              {/* Exact copy based on recommendation */}
              {result.recommendedAction === 'proceed' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="text-emerald-600">●</span> Strong alignment detected. You may choose to continue with confidence and intention.
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    While indicators are positive, continuing to communicate openly strengthens connection.
                  </p>
                </div>
              )}
              
              {result.recommendedAction === 'proceed-with-awareness' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="text-blue-600">●</span> There is meaningful potential here, with some areas that may benefit from discussion and mutual understanding.
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    Addressing awareness areas together can deepen trust and clarity.
                  </p>
                </div>
              )}
              
              {result.recommendedAction === 'pause-and-reflect' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="text-amber-600">●</span> Important differences were identified. Taking time to reflect before proceeding may support emotional safety and clarity.
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    Prioritizing your well-being and boundaries is always a healthy choice.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm text-gray-900 mb-2">About This Assessment</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                This AI-generated summary provides observational signals based on your responses. It does not 
                predict outcomes, diagnose conditions, or replace professional guidance. Compatibility is 
                multifaceted—always trust your judgment, prioritize your safety, and consider seeking professional 
                support if needed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
