import { motion } from 'motion/react';
import { User, Users, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

interface ScanAccessCardProps {
  type: 'single' | 'dual';
  label: string;
  subtext: string;
  onClick: () => void;
  isEnabled?: boolean;
  insightLevel?: 'standard' | 'enhanced';
  variant?: 'default' | 'compact';
}

export function ScanAccessCard({ 
  type, 
  label, 
  subtext, 
  onClick, 
  isEnabled = true,
  insightLevel,
  variant = 'default'
}: ScanAccessCardProps) {
  const Icon = type === 'single' ? User : Users;
  
  const colorScheme = type === 'single' 
    ? {
        gradient: 'from-teal-500 to-cyan-600',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        hoverShadow: 'hover:shadow-teal-200',
      }
    : insightLevel === 'enhanced'
    ? {
        gradient: 'from-rose-500 to-pink-600',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        hoverShadow: 'hover:shadow-rose-200',
      }
    : {
        gradient: 'from-purple-500 to-indigo-600',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        hoverShadow: 'hover:shadow-purple-200',
      };

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={onClick}
        disabled={!isEnabled}
        whileHover={isEnabled ? { scale: 1.02, y: -4 } : {}}
        whileTap={isEnabled ? { scale: 0.98 } : {}}
        className={`w-full text-left bg-white rounded-2xl p-6 border-2 border-gray-200 transition-all ${
          isEnabled 
            ? `hover:border-gray-300 ${colorScheme.hoverShadow} hover:shadow-xl cursor-pointer` 
            : 'opacity-60 cursor-not-allowed'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${colorScheme.iconBg}`}>
            <Icon className={`w-6 h-6 ${colorScheme.iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg text-gray-900">{label}</h3>
              {insightLevel === 'enhanced' && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full">
                  Enhanced
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{subtext}</p>
          </div>
          {isEnabled && (
            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          )}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all ${
        isEnabled 
          ? 'border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl' 
          : 'border-gray-200 opacity-80'
      }`}
    >
      {/* Enhanced badge for Elite tier dual scan */}
      {insightLevel === 'enhanced' && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 py-1.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-medium">Deep Mutual Insight</span>
          </div>
        </div>
      )}

      <div className={`p-8 ${insightLevel === 'enhanced' ? 'pt-12' : ''}`}>
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl ${colorScheme.iconBg} mb-6`}>
          <Icon className={`w-8 h-8 ${colorScheme.iconColor}`} />
        </div>

        {/* Header */}
        <h3 className="text-2xl text-gray-900 mb-3">{label}</h3>
        <p className="text-gray-600 leading-relaxed mb-8">
          {subtext}
        </p>

        {/* Features based on type */}
        <div className="space-y-3 mb-8">
          {type === 'single' ? (
            <>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Private, personal evaluation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Instant results without sharing</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span>Self-guided compatibility insights</span>
              </div>
            </>
          ) : insightLevel === 'enhanced' ? (
            <>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>Invitation-based mutual assessment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>Enhanced perception alignment analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>Long-term stability patterns</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>Deep compatibility indicators</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>Invitation-based mutual assessment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>Private answers revealed together</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>Standard compatibility insights</span>
              </div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onClick}
          disabled={!isEnabled}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all ${
            isEnabled
              ? `bg-gradient-to-r ${colorScheme.gradient} text-white hover:shadow-lg active:scale-95`
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{type === 'single' ? 'Start Single Scan' : 'Start Dual Scan'}</span>
          {isEnabled && <ArrowRight className="w-5 h-5" />}
        </button>

        {/* No messaging disclaimer */}
        {type === 'dual' && isEnabled && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Structured assessment only · No chat or messaging
          </p>
        )}
      </div>
    </motion.div>
  );
}
