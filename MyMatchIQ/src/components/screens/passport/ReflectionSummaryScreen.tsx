import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Scale, Activity, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { InsightCard } from '../../passport/InsightCard';
import { AlignmentBar } from '../../passport/AlignmentBar';

interface ReflectionSummaryScreenProps {
  partnerName: string;
  onContinue: () => void;
  onBack: () => void;
}

export function ReflectionSummaryScreen({
  partnerName,
  onContinue,
  onBack,
}: ReflectionSummaryScreenProps) {
  // Mock data for demonstration
  const alignmentStrengths = [
    { label: 'Core Values', value: 92, alignment: 'strong' as const },
    { label: 'Communication Style', value: 88, alignment: 'strong' as const },
    { label: 'Life Goals', value: 85, alignment: 'strong' as const },
  ];

  const consistentDifferences = [
    { label: 'Social Energy', value: 45, alignment: 'friction' as const },
    { label: 'Decision Speed', value: 52, alignment: 'friction' as const },
  ];

  const stability = [
    { label: 'Answer Consistency', value: 94, alignment: 'strong' as const },
    { label: 'Response Thoughtfulness', value: 89, alignment: 'strong' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-slate-900 mb-3">Compatibility Reflection Summary</h1>
            <p className="text-slate-600">
              Your 7-day reflection week with {partnerName} is complete
            </p>
          </div>

          {/* Completion badge */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8 text-center">
            <p className="text-slate-700">
              You've completed <span className="text-purple-700">21 structured questions</span> together
            </p>
          </div>

          {/* Alignment Strengths */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-slate-800">Alignment Strengths</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
              {alignmentStrengths.map((item, index) => (
                <AlignmentBar
                  key={index}
                  label={item.label}
                  value={item.value}
                  alignment={item.alignment}
                />
              ))}
            </div>
          </div>

          {/* Consistent Differences */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-slate-800">Consistent Differences</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
              {consistentDifferences.map((item, index) => (
                <AlignmentBar
                  key={index}
                  label={item.label}
                  value={item.value}
                  alignment={item.alignment}
                />
              ))}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-4">
                <p className="text-amber-800 text-sm">
                  These differences are consistent and may benefit from further discussion if you continue.
                </p>
              </div>
            </div>
          </div>

          {/* Stability Over Time */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-slate-800">Stability Over Time</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
              {stability.map((item, index) => (
                <AlignmentBar
                  key={index}
                  label={item.label}
                  value={item.value}
                  alignment={item.alignment}
                />
              ))}
            </div>
          </div>

          {/* AI Guidance */}
          <InsightCard
            variant="ai"
            content="Your answers show consistency in values and communication style over time. Both of you demonstrated thoughtful responses and appear to prioritize intentional connection. The differences you've identified are manageable with open communication."
            className="mb-8"
          />

          {/* What's Next */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <h3 className="text-slate-800 mb-4">What's Next?</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              You've completed the Compatibility Reflection Week. If you'd both like to continue exploring your connection, you can graduate to One2One Love for a 7-day full access trial.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              No pressure — you can also choose to end here respectfully.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Fixed continue button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={onContinue}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
          >
            See Your Options
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
