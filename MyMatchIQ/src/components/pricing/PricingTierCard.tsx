import { motion } from 'motion/react';
import { Check, Heart, Brain, Layers, ArrowRight } from 'lucide-react';
import { PassportTier } from '../passport/PassportTierBadge';

export interface PricingTier {
  id: PassportTier;
  name: string;
  passport: string;
  questionCount: number;
  price: number | 'free';
  period?: 'month' | 'year';
  description: string;
  features: PricingFeature[];
  color: {
    gradient: string;
    light: string;
    border: string;
    text: string;
    icon: string;
  };
  recommended?: boolean;
}

export interface PricingFeature {
  label: string;
  included: boolean;
  description?: string;
  emphasis?: 'high' | 'medium' | 'low';
}

interface PricingTierCardProps {
  tier: PricingTier;
  selected?: boolean;
  onSelect?: () => void;
  showButton?: boolean;
  variant?: 'default' | 'compact';
}

export function PricingTierCard({ 
  tier, 
  selected = false, 
  onSelect,
  showButton = true,
  variant = 'default'
}: PricingTierCardProps) {
  const IconComponent = tier.id === 'lite' ? Heart : tier.id === 'standard' ? Layers : Brain;
  
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={`relative bg-white rounded-3xl p-6 border-2 transition-all ${
          selected 
            ? `${tier.color.border} shadow-xl`
            : 'border-gray-200 shadow-md hover:shadow-lg'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${tier.color.gradient} bg-opacity-10`}>
            <IconComponent className={`w-6 h-6 ${tier.color.icon}`} />
          </div>
          {tier.recommended && (
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
              Recommended
            </span>
          )}
        </div>

        <h3 className="text-2xl text-gray-900 mb-1">{tier.name}</h3>
        <p className={`text-sm ${tier.color.text} mb-4`}>{tier.passport}</p>

        <div className="mb-6">
          {tier.price === 'free' ? (
            <div className="text-4xl text-gray-900">Free</div>
          ) : (
            <div>
              <span className="text-4xl text-gray-900">${tier.price}</span>
              <span className="text-gray-600 ml-2">/{tier.period}</span>
            </div>
          )}
        </div>

        {showButton && onSelect && (
          <button
            onClick={onSelect}
            className={`w-full py-3 rounded-xl transition-all ${
              selected
                ? `bg-gradient-to-r ${tier.color.gradient} text-white`
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {selected ? 'Current Plan' : tier.price === 'free' ? 'Start Free' : 'Choose Plan'}
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all ${
        tier.recommended 
          ? 'border-purple-300 shadow-2xl scale-105' 
          : selected
          ? `${tier.color.border} shadow-xl`
          : 'border-gray-200 shadow-lg hover:shadow-xl'
      }`}
    >
      {/* Recommended badge */}
      {tier.recommended && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 py-2 text-center">
          <span className="text-white text-sm font-medium">Recommended for Most Users</span>
        </div>
      )}

      <div className={`p-8 ${tier.recommended ? 'pt-12' : ''}`}>
        {/* Icon and header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${tier.color.gradient} bg-opacity-10 border ${tier.color.border}`}>
            <IconComponent className={`w-8 h-8 ${tier.color.icon}`} />
          </div>
        </div>

        <h3 className="text-3xl text-gray-900 mb-2">{tier.name}</h3>
        <p className={`text-base ${tier.color.text} mb-4 font-medium`}>{tier.passport}</p>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{tier.description}</p>

        {/* Pricing */}
        <div className="mb-8">
          {tier.price === 'free' ? (
            <div>
              <span className="text-5xl text-gray-900 font-light">Free</span>
              <p className="text-sm text-gray-500 mt-2">Always free, no credit card</p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl text-gray-900 font-light">${tier.price}</span>
                <span className="text-gray-600">/{tier.period}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {tier.period === 'month' ? 'Billed monthly' : 'Billed annually'}
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${
                !feature.included ? 'opacity-40' : ''
              }`}
            >
              {feature.included ? (
                <Check className={`w-5 h-5 ${tier.color.icon} flex-shrink-0 mt-0.5`} />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                  {feature.label}
                </p>
                {feature.description && (
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {showButton && onSelect && (
          <button
            onClick={onSelect}
            className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              selected
                ? 'bg-gray-100 text-gray-700 cursor-default'
                : tier.price === 'free'
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : `bg-gradient-to-r ${tier.color.gradient} text-white hover:shadow-lg`
            }`}
            disabled={selected}
          >
            {selected ? (
              'Current Plan'
            ) : (
              <>
                {tier.price === 'free' ? 'Start Free' : 'Choose Plan'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}

        {/* Upgrade hint */}
        {!selected && tier.price !== 'free' && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime • No long-term commitment
          </p>
        )}
      </div>
    </motion.div>
  );
}
