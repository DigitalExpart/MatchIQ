import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { InsightCard } from '../../passport/InsightCard';
import { AlignmentBar } from '../../passport/AlignmentBar';
import { CompatibilityRadar } from '../../passport/CompatibilityRadar';

interface PassportInsightScreenProps {
  partnerName: string;
  onRequestReview: () => void;
  onDecline: () => void;
  onBack: () => void;
}

export function PassportInsightScreen({
  partnerName,
  onRequestReview,
  onDecline,
  onBack,
}: PassportInsightScreenProps) {
  // Mock data for demonstration
  const radarData = [
    { category: 'Values', alignment: 85 },
    { category: 'Communication', alignment: 72 },
    { category: 'Trust', alignment: 90 },
    { category: 'Goals', alignment: 68 },
    { category: 'Lifestyle', alignment: 75 },
    { category: 'Conflict', alignment: 80 },
  ];

  const alignmentBars = [
    { label: 'Decision Style', value: 85, alignment: 'strong' as const },
    { label: 'Communication Preference', value: 72, alignment: 'neutral' as const },
    { label: 'Relationship Orientation', value: 90, alignment: 'strong' as const },
    { label: 'Trust Pacing', value: 65, alignment: 'friction' as const },
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
            <h1 className="text-slate-900 mb-3">Compatibility Passport Overview</h1>
            <p className="text-slate-600">
              Insights from <span className="text-slate-800">{partnerName}'s</span> passport
            </p>
          </div>

          {/* Personality Snapshot */}
          <div className="mb-8">
            <h2 className="text-slate-800 mb-4">Personality Snapshot</h2>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Decision Style</p>
                  <p className="text-slate-800">Thoughtful & Analytical</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Communication</p>
                  <p className="text-slate-800">Direct & Clear</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Relationship Orientation</p>
                  <p className="text-slate-800">Long-term Focused</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Trust Pacing</p>
                  <p className="text-slate-800">Gradual Builder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Vector - Radar */}
          <div className="mb-8">
            <h2 className="text-slate-800 mb-4">Compatibility Vector</h2>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <CompatibilityRadar data={radarData} />
            </div>
          </div>

          {/* Alignment Bars */}
          <div className="mb-8">
            <h2 className="text-slate-800 mb-4">Detailed Alignment</h2>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
              {alignmentBars.map((bar, index) => (
                <AlignmentBar
                  key={index}
                  label={bar.label}
                  value={bar.value}
                  alignment={bar.alignment}
                />
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <InsightCard
            variant="ai"
            content="This individual values intentional connection, emotional intelligence, and consistency over impulse. They tend to communicate openly and prefer partners who appreciate thoughtful decision-making."
            className="mb-8"
          />

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
            <div className="max-w-md mx-auto space-y-3">
              <Button
                onClick={onRequestReview}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Request Compatibility Review
              </Button>
              <Button
                onClick={onDecline}
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-300 text-slate-600"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline Silently
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
