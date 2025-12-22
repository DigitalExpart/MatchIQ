import { motion } from 'motion/react';
import { PricingTierCard, PricingTier } from './PricingTierCard';
import { PricingComparisonMatrix } from './PricingComparisonMatrix';
import { PassportTier } from '../passport/PassportTierBadge';
import { Shield, Heart, Brain, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'lite',
    name: 'Free',
    passport: 'Lite Passport · 15Q',
    questionCount: 15,
    price: 'free',
    description: 'Begin your compatibility journey with foundational self-reflection questions.',
    color: {
      gradient: 'from-teal-400 to-cyan-500',
      light: 'bg-teal-50',
      border: 'border-teal-300',
      text: 'text-teal-700',
      icon: 'text-teal-600',
    },
    features: [
      { label: '15 core compatibility questions', included: true, emphasis: 'high' },
      { label: '5 question categories', included: true },
      { label: 'Basic compatibility score', included: true },
      { label: 'QR code passport sharing', included: true },
      { label: 'Surface-level pattern analysis', included: true },
      { label: '1 passport update per year', included: true },
      { label: 'Email support (48hr response)', included: true },
      { label: 'Reflection Week access', included: false },
      { label: 'Red flag detection', included: false },
      { label: 'Passport comparison tools', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Premier',
    passport: 'Standard Passport · 25Q',
    questionCount: 25,
    price: 12,
    period: 'month',
    description: 'Deepen your self-awareness with more questions and enhanced AI insights.',
    recommended: true,
    color: {
      gradient: 'from-purple-400 to-indigo-500',
      light: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-700',
      icon: 'text-purple-600',
    },
    features: [
      { label: '25 thoughtful compatibility questions', included: true, emphasis: 'high' },
      { label: '8 question categories', included: true },
      { label: 'Enhanced compatibility scoring', included: true, emphasis: 'high' },
      { label: 'QR code passport with tier badge', included: true },
      { label: 'Moderate-depth pattern analysis', included: true },
      { label: 'Major red flag detection', included: true, emphasis: 'high' },
      { label: '1 Reflection Week per month', included: true },
      { label: 'Basic passport comparison', included: true },
      { label: 'Quarterly passport updates', included: true },
      { label: 'PDF export of insights', included: true },
      { label: 'Priority support (24hr response)', included: true },
      { label: 'Advanced privacy controls', included: true },
    ],
  },
  {
    id: 'deep',
    name: 'Elite',
    passport: 'Deep Passport · 45Q',
    questionCount: 45,
    price: 24,
    period: 'month',
    description: 'Maximum depth and confidence with comprehensive analysis and unlimited reflection.',
    color: {
      gradient: 'from-rose-400 to-pink-500',
      light: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-700',
      icon: 'text-rose-600',
    },
    features: [
      { label: '45 comprehensive questions', included: true, emphasis: 'high' },
      { label: '12 question categories', included: true },
      { label: 'Maximum AI confidence scoring', included: true, emphasis: 'high' },
      { label: 'Deep pattern & trend analysis', included: true, emphasis: 'high' },
      { label: 'Full-spectrum red flag detection', included: true },
      { label: 'Unlimited Reflection Weeks', included: true, emphasis: 'high' },
      { label: 'Full passport comparison analysis', included: true },
      { label: 'Deal-breaker detection system', included: true },
      { label: 'Personalized growth roadmap', included: true },
      { label: 'Unlimited passport updates', included: true },
      { label: 'Expiring share links', included: true },
      { label: 'PDF + detailed compatibility report', included: true },
      { label: 'VIP support (4hr response)', included: true },
      { label: 'Early access to new features', included: true },
    ],
  },
];

export function PricingShowcase() {
  const [selectedTier, setSelectedTier] = useState<PassportTier>('lite');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-6"
          >
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">Choose Your Depth of Reflection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl text-gray-900 mb-4"
          >
            Clarity Through Depth
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed mb-8"
          >
            More questions mean deeper self-awareness and greater confidence in compatibility. 
            Choose the level of reflection that feels right for you.
          </motion.p>

          {/* View toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <button
              onClick={() => setViewMode('cards')}
              className={`px-6 py-2 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-6 py-2 rounded-lg transition-all ${
                viewMode === 'matrix'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed Comparison
            </button>
          </motion.div>
        </div>

        {/* Cards View */}
        {viewMode === 'cards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <PricingTierCard
                  tier={tier}
                  selected={selectedTier === tier.id}
                  onSelect={() => setSelectedTier(tier.id)}
                  showButton={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Matrix View */}
        {viewMode === 'matrix' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PricingComparisonMatrix
              currentTier={selectedTier}
              onSelectTier={setSelectedTier}
            />
          </motion.div>
        )}

        {/* Value propositions */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Not About Messaging</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              MyMatchIQ focuses on compatibility intelligence, not endless swiping. 
              Understand yourself first, find clarity second.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Depth Over Speed</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              More thoughtful questions lead to deeper insights. Take your time. 
              The clarity you gain is worth the reflection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Safety First</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our AI detects red flags and compatibility concerns early. 
              Higher tiers mean more confident early detection.
            </p>
          </motion.div>
        </div>

        {/* Natural upgrade path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl text-gray-900 mb-6 text-center">
            Finding Your Right Tier
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h4 className="text-gray-900 mb-1">Start with Free</h4>
                <p className="text-sm text-gray-600">
                  Begin your journey with 15 foundational questions. Get a sense of how self-reflection 
                  builds compatibility clarity.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h4 className="text-gray-900 mb-1">Consider Premier</h4>
                <p className="text-sm text-gray-600">
                  If you value red flag detection and want more confidence in your compatibility assessments, 
                  25 questions provide meaningful depth.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-xl border border-rose-100">
              <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h4 className="text-gray-900 mb-1">Explore Elite</h4>
                <p className="text-sm text-gray-600">
                  For maximum clarity and ongoing reflection, 45 questions provide the deepest self-awareness. 
                  Best for those serious about understanding compatibility.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-center">
            <p className="text-sm text-gray-600 italic">
              "The best tier is the one that matches your readiness for self-reflection. 
              You can always upgrade when you want deeper insights."
            </p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl text-gray-900 mb-6">Common Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-gray-900 mb-2">Can I change tiers later?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes. You can upgrade or downgrade at any time. Your existing answers are saved, 
                and you can always add more depth when you're ready.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-gray-900 mb-2">Why do more questions matter?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                More questions mean our AI has more data points to understand your values, preferences, 
                and compatibility needs. This leads to more confident and accurate insights.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-gray-900 mb-2">Is my data private?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Absolutely. Your passport is only shared when you choose to share it via QR code. 
                You control who sees what, and we never sell your data.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-gray-900 mb-2">What are Reflection Weeks?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Periodic prompts that help you revisit and deepen your self-awareness over time. 
                As you grow and change, your passport can evolve with you.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
