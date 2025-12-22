import { useState } from 'react';
import { ArrowLeft, Check, Crown, Sparkles, Zap, Lock, ChevronRight, ChevronDown, Shield, Heart, Users } from 'lucide-react';
import { SubscriptionTier } from '../../App';
import { ConfirmationModal } from '../ConfirmationModal';
import { useLanguage } from '../../contexts/LanguageContext';

interface SubscriptionScreenProps {
  currentTier: SubscriptionTier;
  onBack: () => void;
  onSelectTier: (tier: SubscriptionTier) => void;
}

const FEATURES = {
  free: [
    '15 foundational compatibility questions',
    '5 foundational question categories',
    'Basic compatibility score',
    'QR Compatibility Passport (private sharing)',
    'Single Scan (private evaluation only)',
    'Red flag awareness (surface-level)',
    'Reflection Week access (limited)',
    'Basic safety indicators',
    'Email support (48-hour response)',
  ],
  premium: [
    '25 thoughtful compatibility questions',
    '8 expanded question categories',
    'Enhanced compatibility scoring',
    'QR Compatibility Passport with tier badge',
    'Single + Dual Scan (mutual consent required)',
    'Assessment Community access',
    'Send & receive Passport requests',
    'AI Coach (guided interpretation & prompts)',
    'Major red flag detection',
    'Passport comparison tools (basic)',
    '1 Reflection Week per month',
    '48-hour request window (+24h extension)',
    'Quarterly passport updates',
    'PDF export of insights',
    'Priority support (24-hour response)',
  ],
  exclusive: [
    '45 comprehensive compatibility questions',
    '12 in-depth question categories',
    'Maximum insight confidence scoring',
    'Deep pattern & trend analysis',
    'Full-spectrum red flag detection',
    'Deal-breaker detection system',
    'Assessment Community (priority & enhanced)',
    'AI Coach (unlimited reflective guidance)',
    'Connection-context insights (after mutual acceptance)',
    'Pause & resume connection controls',
    'Unlimited Reflection Weeks',
    'Full passport comparison analysis',
    '48-hour request window (+24h extension)',
    'Unlimited passport updates',
    'Expiring share links',
    'PDF + detailed compatibility report',
    'VIP support (4-hour response)',
    'Early access to new features',
  ],
};

const COMPARISON_DATA = [
  {
    category: 'Question Depth',
    free: '15 questions',
    premium: '25 questions',
    exclusive: '45 questions',
  },
  {
    category: 'Question Categories',
    free: '5 categories',
    premium: '8 categories',
    exclusive: '12 categories',
  },
  {
    category: 'Scan Access',
    free: 'Single Scan only',
    premium: 'Single + Dual Scan',
    exclusive: 'All scan types + ongoing insights',
  },
  {
    category: 'Assessment Community',
    free: '❌ Not available',
    premium: '✓ Full access',
    exclusive: '✓ Priority & enhanced',
  },
  {
    category: 'AI Coach',
    free: '❌ Not available',
    premium: 'Guided interpretation',
    exclusive: 'Unlimited reflective guidance',
  },
  {
    category: 'Insight Confidence',
    free: 'Basic',
    premium: 'Enhanced',
    exclusive: 'Maximum',
  },
  {
    category: 'Pattern Awareness',
    free: 'Surface-level',
    premium: 'Moderate depth',
    exclusive: 'Deep analysis with trend tracking',
  },
  {
    category: 'Red Flag Detection',
    free: 'Surface-level',
    premium: 'Major flags',
    exclusive: 'Full-spectrum + deal-breakers',
  },
  {
    category: 'Reflection Weeks',
    free: 'Limited access',
    premium: '1 per month',
    exclusive: 'Unlimited',
  },
  {
    category: 'Passport Updates',
    free: '1 per year',
    premium: 'Quarterly',
    exclusive: 'Unlimited',
  },
  {
    category: 'Connection Controls',
    free: '—',
    premium: 'Request + revoke',
    exclusive: 'Request, pause, resume, revoke',
  },
  {
    category: 'Support Level',
    free: 'Email (48hr)',
    premium: 'Priority (24hr)',
    exclusive: 'VIP (4hr)',
  },
];

export function SubscriptionScreen({ currentTier, onBack, onSelectTier }: SubscriptionScreenProps) {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processingTier, setProcessingTier] = useState<SubscriptionTier | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTier, setPendingTier] = useState<SubscriptionTier | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const { t } = useLanguage();

  const isUpgrade = (tier: SubscriptionTier) => {
    const tierOrder = { free: 0, premium: 1, exclusive: 2 };
    return tierOrder[tier] > tierOrder[currentTier];
  };

  const getConfirmationContent = () => {
    if (!pendingTier) return { title: '', message: '', variant: 'info' as const };

    const isUpgrading = isUpgrade(pendingTier);

    if (isUpgrading) {
      // Upgrade confirmations
      if (pendingTier === 'premium') {
        return {
          title: 'Upgrade to Premier?',
          message: `Unlock 25 compatibility questions, Dual Scan mode, enhanced insights, and quarterly passport updates for just ${getPriceDisplay('premium').price}${getPriceDisplay('premium').period}. You'll be charged immediately and can cancel anytime.`,
          variant: 'info' as const,
        };
      } else if (pendingTier === 'exclusive') {
        return {
          title: 'Upgrade to Elite?',
          message: `Get 45 questions, maximum insight confidence, unlimited Reflection Weeks, deal-breaker detection, and VIP support for ${getPriceDisplay('exclusive').price}${getPriceDisplay('exclusive').period}. You'll be charged immediately and can cancel anytime.`,
          variant: 'info' as const,
        };
      }
    } else {
      // Downgrade confirmations
      if (pendingTier === 'free') {
        const features = currentTier === 'premium' 
          ? 'Dual Scan access, enhanced insights, quarterly passport updates, and priority support'
          : 'Dual Scan access, unlimited Reflection Weeks, deal-breaker detection, VIP support, and all premium features';
        return {
          title: 'Downgrade to Lite?',
          message: `You will lose access to ${features}. Your current plan will remain active until the end of your billing period.`,
          variant: 'warning' as const,
        };
      } else if (pendingTier === 'premium') {
        return {
          title: 'Downgrade to Premier?',
          message: 'You will lose access to 45 questions, unlimited Reflection Weeks, deal-breaker detection, trend tracking, and VIP support. Your current plan will remain active until the end of your billing period.',
          variant: 'warning' as const,
        };
      }
    }

    return { title: '', message: '', variant: 'info' as const };
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    if (tier === currentTier) return;
    
    setPendingTier(tier);
    setShowConfirmModal(true);
  };

  const handleConfirmTierChange = () => {
    if (!pendingTier) return;

    setShowConfirmModal(false);
    setProcessingTier(pendingTier);

    // Simulate payment flow
    setTimeout(() => {
      onSelectTier(pendingTier);
      setProcessingTier(null);
      setPendingTier(null);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    }, 1500);
  };

  const handleCancelTierChange = () => {
    setShowConfirmModal(false);
    setPendingTier(null);
  };

  const getPriceDisplay = (tier: 'premium' | 'exclusive') => {
    const prices = {
      premium: { monthly: 12, yearly: 120 },
      exclusive: { monthly: 24, yearly: 240 },
    };

    const price = prices[tier][selectedBilling];
    const perMonth = selectedBilling === 'yearly' ? (price / 12).toFixed(2) : price;

    return {
      price: selectedBilling === 'monthly' ? `$${price}` : `$${price}`,
      period: selectedBilling === 'monthly' ? '/month' : '/year',
      save: selectedBilling === 'yearly' ? 'Save 17%' : null,
      perMonth: selectedBilling === 'yearly' ? `$${perMonth}/mo` : null,
    };
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-sm text-white">
                Current: {currentTier === 'free' ? 'Lite' : currentTier === 'premium' ? 'Premier' : 'Elite'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl text-white mb-2">Choose Your Plan</h1>
            <p className="text-white/90">Find the perfect match with the right tools</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showConfirmation && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>Subscription updated successfully!</span>
          </div>
        </div>
      )}

      <div className="px-6 -mt-12 relative z-10 space-y-6">
        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedBilling === 'monthly'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedBilling('yearly')}
              className={`px-6 py-3 rounded-xl transition-all relative ${
                selectedBilling === 'yearly'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Free Tier - Lite Passport */}
        <div className={`bg-white rounded-3xl shadow-lg border-2 transition-all ${
          currentTier === 'free' ? 'border-rose-300' : 'border-gray-200'
        }`}>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl text-gray-900 mb-1">Lite Passport</h3>
                <p className="text-gray-600">15Q · Foundation for awareness</p>
              </div>
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>

            <div className="mb-6">
              <div className="text-4xl text-gray-900 mb-1">$0</div>
              <div className="text-gray-600">Forever free</div>
            </div>

            <ul className="space-y-3 mb-6">
              {FEATURES.free.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Locked Features Note */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                <Lock className="w-3 h-3 inline mr-1" />
                <strong>Not included:</strong> Assessment Community, AI Coach, Dual Scan, and interactive compatibility features require Premier or Elite.
              </p>
            </div>

            <button
              onClick={() => handleSelectTier('free')}
              disabled={currentTier === 'free'}
              className={`w-full py-4 rounded-2xl transition-all ${
                currentTier === 'free'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
              }`}
            >
              {currentTier === 'free' ? 'Current Plan' : 'Downgrade to Lite'}
            </button>
            
            {/* Premier Preview Footnote */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                {t('premierPreview.footnote')}
              </p>
            </div>
          </div>
        </div>

        {/* Premium Tier - Standard Passport */}
        <div className={`bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl shadow-2xl border-2 transform transition-all ${
          currentTier === 'premium' ? 'border-yellow-400 scale-[1.02]' : 'border-transparent hover:scale-[1.02]'
        }`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl m-1 p-6">
            {currentTier === 'premium' && (
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 mb-4">
                <Crown className="w-3 h-3" />
                Current Plan
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl text-gray-900">Standard Passport</h3>
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-lg text-xs">
                    Recommended
                  </span>
                </div>
                <p className="text-gray-600">25Q · For most users</p>
              </div>
              <Crown className="w-8 h-8 text-rose-500" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl text-gray-900">{getPriceDisplay('premium').price}</div>
                <div className="text-gray-600">{getPriceDisplay('premium').period}</div>
              </div>
              {getPriceDisplay('premium').perMonth && (
                <div className="text-sm text-gray-500">{getPriceDisplay('premium').perMonth} billed annually</div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {FEATURES.premium.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectTier('premium')}
              disabled={currentTier === 'premium' || processingTier === 'premium'}
              className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                currentTier === 'premium'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : processingTier === 'premium'
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg'
              }`}
            >
              {processingTier === 'premium' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : currentTier === 'premium' ? (
                'Current Plan'
              ) : currentTier === 'exclusive' ? (
                'Downgrade to Premier'
              ) : (
                'Upgrade to Premier'
              )}
            </button>
          </div>
        </div>

        {/* Exclusive Tier - Deep Passport */}
        <div className={`bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-3xl shadow-2xl border-2 transform transition-all ${
          currentTier === 'exclusive' ? 'border-yellow-400 scale-[1.02]' : 'border-transparent hover:scale-[1.02]'
        }`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl m-1 p-6">
            {currentTier === 'exclusive' && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 mb-4">
                <Zap className="w-3 h-3" />
                Current Plan
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl text-gray-900">Deep Passport</h3>
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-lg text-xs">
                    Maximum Insight
                  </span>
                </div>
                <p className="text-gray-600">45Q · Deep compatibility intelligence</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl text-gray-900">{getPriceDisplay('exclusive').price}</div>
                <div className="text-gray-600">{getPriceDisplay('exclusive').period}</div>
              </div>
              {getPriceDisplay('exclusive').perMonth && (
                <div className="text-sm text-gray-500">{getPriceDisplay('exclusive').perMonth} billed annually</div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {FEATURES.exclusive.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectTier('exclusive')}
              disabled={currentTier === 'exclusive' || processingTier === 'exclusive'}
              className={`w-full py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                currentTier === 'exclusive'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : processingTier === 'exclusive'
                  ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              {processingTier === 'exclusive' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : currentTier === 'exclusive' ? (
                'Current Plan'
              ) : (
                'Upgrade to Elite'
              )}
            </button>
          </div>
        </div>

        {/* Detailed Feature Comparison */}
        <button 
          onClick={() => setShowComparison(!showComparison)}
          className="w-full bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between hover:shadow-xl transition-all"
        >
          <span className="text-gray-900">Detailed Feature Comparison</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
        </button>

        {showComparison && (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Complete Feature Breakdown</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600"></th>
                      <th className="text-center py-3 px-4">
                        <div className="flex flex-col items-center gap-1">
                          <Sparkles className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-900">Lite</span>
                          <span className="text-xs text-gray-500">15Q</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex flex-col items-center gap-1">
                          <Crown className="w-5 h-5 text-rose-500" />
                          <span className="text-sm text-gray-900">Premier</span>
                          <span className="text-xs text-gray-500">25Q</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex flex-col items-center gap-1">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <span className="text-sm text-gray-900">Elite</span>
                          <span className="text-xs text-gray-500">45Q</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_DATA.map((row, idx) => (
                      <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                        <td className="py-3 px-4 text-sm text-gray-900">{row.category}</td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">{row.free}</td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">{row.premium}</td>
                        <td className="py-3 px-4 text-center text-sm text-purple-900">{row.exclusive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg text-gray-900 mb-4">Why upgrade?</h3>
          
          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
            <Heart className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <div>
              <h4 className="text-gray-900 mb-1">Deeper Compatibility Insights</h4>
              <p className="text-sm text-gray-600">
                More questions reveal patterns you can't see with surface-level assessment
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
            <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="text-gray-900 mb-1">Dual Scan with Consent</h4>
              <p className="text-sm text-gray-600">
                Premier and Elite unlock mutual assessment—only when both of you choose to share
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl">
            <Shield className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <h4 className="text-gray-900 mb-1">Safety-First Analysis</h4>
              <p className="text-sm text-gray-600">
                Advanced tiers detect deal-breakers and compatibility risks with higher confidence
              </p>
            </div>
          </div>
        </div>

        {/* Money-back Guarantee */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <p className="text-center text-sm text-gray-600">
            <strong className="text-gray-900">7-day money-back guarantee</strong><br />
            Try risk-free. Cancel within 7 days for a full refund.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          title={getConfirmationContent().title}
          message={getConfirmationContent().message}
          variant={getConfirmationContent().variant}
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          onConfirm={handleConfirmTierChange}
          onCancel={handleCancelTierChange}
        />
      )}
    </div>
  );
}