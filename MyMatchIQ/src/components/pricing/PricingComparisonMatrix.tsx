import { motion } from 'motion/react';
import { Check, X, Info } from 'lucide-react';
import { PassportTier, PassportTierBadge } from '../passport/PassportTierBadge';
import { useState } from 'react';

interface FeatureCategory {
  name: string;
  description?: string;
  features: ComparisonFeature[];
}

interface ComparisonFeature {
  name: string;
  description?: string;
  lite: boolean | string;
  premier: boolean | string;
  elite: boolean | string;
  tooltip?: string;
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    name: 'Question Depth',
    description: 'How many thoughtful questions shape your compatibility passport',
    features: [
      {
        name: 'Core Questions',
        lite: '15 questions',
        premier: '25 questions',
        elite: '45 questions',
        description: 'Carefully designed questions across multiple compatibility dimensions',
      },
      {
        name: 'Question Categories',
        lite: '5 categories',
        premier: '8 categories',
        elite: '12 categories',
        description: 'Values, lifestyle, communication, emotional maturity, and more',
      },
      {
        name: 'Reflection Weeks',
        lite: false,
        premier: '1 per month',
        elite: 'Unlimited',
        description: 'Ongoing reflection prompts to deepen your self-awareness',
      },
    ],
  },
  {
    name: 'AI Insight Confidence',
    description: 'The depth and accuracy of compatibility analysis',
    features: [
      {
        name: 'Compatibility Score Accuracy',
        lite: 'Basic',
        premier: 'Enhanced',
        elite: 'Maximum',
        description: 'More questions = more confident compatibility assessment',
      },
      {
        name: 'Pattern Recognition',
        lite: 'Surface-level',
        premier: 'Moderate depth',
        elite: 'Deep analysis',
        description: 'Identifies compatibility patterns and potential challenges',
      },
      {
        name: 'Red Flag Detection',
        lite: false,
        premier: 'Major flags only',
        elite: 'Full spectrum',
        description: 'Early warning system for compatibility concerns',
      },
      {
        name: 'Personalized Insights',
        lite: 'General guidance',
        premier: 'Tailored advice',
        elite: 'Deep personalization',
        description: 'Recommendations based on your unique compatibility profile',
      },
    ],
  },
  {
    name: 'Sharing & Privacy',
    description: 'How you share your compatibility passport with others',
    features: [
      {
        name: 'QR Code Passport',
        lite: true,
        premier: true,
        elite: true,
        description: 'Share your compatibility passport via secure QR code',
      },
      {
        name: 'Tier Badge Display',
        lite: 'Lite badge',
        premier: 'Standard badge',
        elite: 'Deep badge',
        description: 'Shows the depth of reflection you\'ve completed',
      },
      {
        name: 'Privacy Controls',
        lite: 'Basic',
        premier: 'Advanced',
        elite: 'Maximum',
        description: 'Control who sees what parts of your compatibility profile',
      },
      {
        name: 'Expiring Shares',
        lite: false,
        premier: false,
        elite: true,
        description: 'Set time limits on how long others can view your passport',
      },
    ],
  },
  {
    name: 'Comparison Tools',
    description: 'Understand compatibility with potential matches',
    features: [
      {
        name: 'Passport Comparison',
        lite: false,
        premier: 'Basic alignment',
        elite: 'Full analysis',
        description: 'See how your passport aligns with another person\'s',
      },
      {
        name: 'Alignment Scoring',
        lite: false,
        premier: 'Overall score',
        elite: 'Category breakdown',
        description: 'Detailed compatibility scores across all dimensions',
      },
      {
        name: 'Deal-breaker Detection',
        lite: false,
        premier: false,
        elite: true,
        description: 'Identifies fundamental incompatibilities early',
      },
      {
        name: 'Growth Suggestions',
        lite: false,
        premier: 'Basic tips',
        elite: 'Personalized roadmap',
        description: 'Guidance on building stronger compatibility',
      },
    ],
  },
  {
    name: 'Support & Access',
    description: 'Help and guidance throughout your journey',
    features: [
      {
        name: 'Customer Support',
        lite: 'Email (48hr)',
        premier: 'Priority (24hr)',
        elite: 'VIP (4hr)',
        description: 'Response time for support inquiries',
      },
      {
        name: 'Passport Updates',
        lite: '1 per year',
        premier: '1 per quarter',
        elite: 'Unlimited',
        description: 'How often you can refresh your compatibility passport',
      },
      {
        name: 'Export Options',
        lite: false,
        premier: 'PDF export',
        elite: 'PDF + detailed report',
        description: 'Download and save your compatibility insights',
      },
      {
        name: 'Early Feature Access',
        lite: false,
        premier: false,
        elite: true,
        description: 'Be the first to try new compatibility tools',
      },
    ],
  },
];

export function PricingComparisonMatrix({ 
  currentTier,
  onSelectTier 
}: { 
  currentTier?: PassportTier;
  onSelectTier?: (tier: PassportTier) => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const renderFeatureValue = (value: boolean | string, tierColor: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`w-5 h-5 ${tierColor} mx-auto`} />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return (
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    );
  };

  const tierColors = {
    lite: 'text-teal-600',
    premier: 'text-purple-600',
    elite: 'text-rose-600',
  };

  return (
    <div className="w-full">
      {/* Sticky header with tier badges */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-200 pb-4 mb-8">
        <div className="grid grid-cols-4 gap-4 items-end">
          <div className="text-sm text-gray-600">
            Feature Categories
          </div>
          
          {/* Lite */}
          <div className="flex flex-col items-center gap-3">
            <PassportTierBadge tier="lite" size="md" variant="card" />
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">Free</div>
              <div className="text-xs text-gray-500">Always free</div>
            </div>
            {onSelectTier && (
              <button
                onClick={() => onSelectTier('lite')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  currentTier === 'lite'
                    ? 'bg-gray-100 text-gray-700 cursor-default'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
                disabled={currentTier === 'lite'}
              >
                {currentTier === 'lite' ? 'Current' : 'Select'}
              </button>
            )}
          </div>

          {/* Premier */}
          <div className="flex flex-col items-center gap-3">
            <PassportTierBadge tier="standard" size="md" variant="card" />
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">$12</div>
              <div className="text-xs text-gray-500">/month</div>
            </div>
            {onSelectTier && (
              <button
                onClick={() => onSelectTier('standard')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  currentTier === 'standard'
                    ? 'bg-gray-100 text-gray-700 cursor-default'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
                disabled={currentTier === 'standard'}
              >
                {currentTier === 'standard' ? 'Current' : 'Select'}
              </button>
            )}
          </div>

          {/* Elite */}
          <div className="flex flex-col items-center gap-3">
            <PassportTierBadge tier="deep" size="md" variant="card" />
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">$24</div>
              <div className="text-xs text-gray-500">/month</div>
            </div>
            {onSelectTier && (
              <button
                onClick={() => onSelectTier('deep')}
                className={`px-4 py-2 rounded-xl text-sm transition-all ${
                  currentTier === 'deep'
                    ? 'bg-gray-100 text-gray-700 cursor-default'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
                disabled={currentTier === 'deep'}
              >
                {currentTier === 'deep' ? 'Current' : 'Select'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature categories */}
      <div className="space-y-8">
        {FEATURE_CATEGORIES.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Category header */}
            <div 
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 cursor-pointer hover:from-gray-100 hover:to-gray-50 transition-all"
              onClick={() => setExpandedCategory(
                expandedCategory === category.name ? null : category.name
              )}
            >
              <h3 className="text-lg text-gray-900 mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>

            {/* Features */}
            <div className="divide-y divide-gray-100">
              {category.features.map((feature, featureIndex) => (
                <div 
                  key={featureIndex}
                  className="grid grid-cols-4 gap-4 items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Feature name */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{feature.name}</span>
                        {feature.tooltip && (
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredTooltip(`${category.name}-${featureIndex}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                          >
                            <Info className="w-4 h-4 text-gray-400" />
                            {hoveredTooltip === `${category.name}-${featureIndex}` && (
                              <div className="absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-20">
                                {feature.tooltip}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {feature.description && (
                        <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Lite */}
                  <div className="text-center">
                    {renderFeatureValue(feature.lite, tierColors.lite)}
                  </div>

                  {/* Premier */}
                  <div className="text-center">
                    {renderFeatureValue(feature.premier, tierColors.premier)}
                  </div>

                  {/* Elite */}
                  <div className="text-center">
                    {renderFeatureValue(feature.elite, tierColors.elite)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upgrade messaging */}
      <div className="mt-12 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-8 text-center">
        <h3 className="text-2xl text-gray-900 mb-3">
          Deepen Your Self-Awareness
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          More questions lead to greater clarity about who you are and what you need in a relationship. 
          Choose the depth that feels right for your journey.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span>No pressure, no commitments</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span>Change plans anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span>Privacy protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
