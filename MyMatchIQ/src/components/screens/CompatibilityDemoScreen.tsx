// Comprehensive Demo for Compatibility Passport System
import { useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { SubscriptionTier } from '../../App';
import { CompatibilityPassportFlow } from '../compatibility/CompatibilityPassportFlow';
import { SingleScanResultsScreen } from '../compatibility/SingleScanResultsScreen';
import { DualScanConsentGate } from '../compatibility/DualScanConsentGate';
import { DualScanMutualResults } from '../compatibility/DualScanMutualResults';
import { AISummaryScreen } from '../compatibility/AISummaryScreen';
import { CompatibilityAnswer, calculateCompatibilityScore } from '../../utils/compatibilityEngine';

type DemoStep = 
  | 'menu'
  | 'questionnaire'
  | 'single-results'
  | 'consent-gate'
  | 'dual-results'
  | 'ai-summary';

interface CompatibilityDemoScreenProps {
  onBack: () => void;
  tier: SubscriptionTier;
}

export function CompatibilityDemoScreen({ onBack, tier }: CompatibilityDemoScreenProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>('menu');
  const [answers, setAnswers] = useState<CompatibilityAnswer[]>([]);

  // Demo data
  const demoAnswers: CompatibilityAnswer[] = [
    { questionId: 'relationship-status', value: 'single', weight: 100 },
    { questionId: 'relationship-intent', value: 'long-term', weight: 100 },
    { questionId: 'communication-frequency', value: 'few-times-week', weight: 90 },
    { questionId: 'core-values', value: 'honesty', weight: 100 },
    { questionId: 'lifestyle-match', value: 'mix-both', weight: 90 },
    { questionId: 'conflict-style', value: 'calm-discuss', weight: 100 },
    { questionId: 'past-relationships', value: 'learned-grew', weight: 100 },
    { questionId: 'emotional-availability', value: 'very-comfortable', weight: 100 },
  ];

  const result = calculateCompatibilityScore(answers.length > 0 ? answers : demoAnswers);

  const renderStep = () => {
    switch (currentStep) {
      case 'menu':
        return (
          <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm">Back to Dashboard</span>
                </button>

                <h1 className="text-3xl text-gray-900 mb-3">
                  Compatibility Passport Demo
                </h1>
                <p className="text-gray-600 mb-8">
                  Explore the complete compatibility assessment system with all screens.
                </p>

                <div className="space-y-3">
                  <DemoButton
                    title="1. Compatibility Questionnaire"
                    description="Tier-aware question flow with progress tracking"
                    onClick={() => setCurrentStep('questionnaire')}
                  />
                  <DemoButton
                    title="2. Single Scan Results"
                    description="Private assessment with observational signals"
                    onClick={() => setCurrentStep('single-results')}
                  />
                  <DemoButton
                    title="3. Dual Scan Consent Gate"
                    description="Explicit consent before revealing shared results"
                    onClick={() => setCurrentStep('consent-gate')}
                  />
                  <DemoButton
                    title="4. Dual Scan Mutual Results"
                    description="Shared insights with mutual awareness alerts"
                    onClick={() => setCurrentStep('dual-results')}
                  />
                  <DemoButton
                    title="5. AI-Generated Summary"
                    description="Comprehensive compatibility intelligence report"
                    onClick={() => setCurrentStep('ai-summary')}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'questionnaire':
        return (
          <CompatibilityPassportFlow
            tier={tier}
            onBack={() => setCurrentStep('menu')}
            onComplete={(completedAnswers) => {
              setAnswers(completedAnswers);
              setCurrentStep('single-results');
            }}
            existingAnswers={answers}
          />
        );

      case 'single-results':
        return (
          <SingleScanResultsScreen
            result={result}
            partnerName="Alex"
            onBack={() => setCurrentStep('menu')}
            onSaveResults={() => alert('Results saved!')}
          />
        );

      case 'consent-gate':
        return (
          <DualScanConsentGate
            partnerName="Alex"
            hasHardRedFlags={result.redFlags.some(f => f.severity === 'critical')}
            hardRedFlags={result.redFlags.filter(f => f.severity === 'critical')}
            onConsent={() => setCurrentStep('dual-results')}
            onDecline={() => setCurrentStep('menu')}
          />
        );

      case 'dual-results':
        return (
          <DualScanMutualResults
            result={result}
            userAName="You"
            userBName="Alex"
            onBack={() => setCurrentStep('menu')}
            onProceed={() => setCurrentStep('menu')}
          />
        );

      case 'ai-summary':
        return (
          <AISummaryScreen
            result={result}
            partnerName="Alex"
            userName="You"
            onBack={() => setCurrentStep('menu')}
            onSave={() => alert('Summary saved!')}
            isMutual={false}
          />
        );

      default:
        return null;
    }
  };

  return renderStep();
}

// Helper component for demo menu buttons
function DemoButton({ 
  title, 
  description, 
  onClick 
}: { 
  title: string; 
  description: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl hover:border-rose-300 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
