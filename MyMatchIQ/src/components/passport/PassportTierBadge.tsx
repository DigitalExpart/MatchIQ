import { motion } from 'motion/react';
import { Heart, Brain, Layers } from 'lucide-react';

export type PassportTier = 'lite' | 'standard' | 'deep';

interface PassportTierBadgeProps {
  tier: PassportTier;
  size?: 'sm' | 'md' | 'lg';
  showQuestionCount?: boolean;
  variant?: 'default' | 'minimal' | 'card';
}

const TIER_CONFIG = {
  lite: {
    label: 'Lite Passport',
    questions: 15,
    // Calm teal/blue palette
    gradient: 'from-teal-50 to-cyan-50',
    borderColor: 'border-teal-200/60',
    textColor: 'text-teal-800',
    iconColor: 'text-teal-600',
    dotColor: 'bg-teal-400',
    glowColor: 'shadow-teal-100/50',
    icon: Heart,
  },
  standard: {
    label: 'Standard Passport',
    questions: 25,
    // Calm purple/lavender palette
    gradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200/60',
    textColor: 'text-purple-800',
    iconColor: 'text-purple-600',
    dotColor: 'bg-purple-400',
    glowColor: 'shadow-purple-100/50',
    icon: Layers,
  },
  deep: {
    label: 'Deep Passport',
    questions: 45,
    // Calm rose/mauve palette
    gradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200/60',
    textColor: 'text-rose-800',
    iconColor: 'text-rose-600',
    dotColor: 'bg-rose-400',
    glowColor: 'shadow-rose-100/50',
    icon: Brain,
  },
};

export function PassportTierBadge({ 
  tier, 
  size = 'md',
  showQuestionCount = true,
  variant = 'default'
}: PassportTierBadgeProps) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: {
      container: 'px-3 py-1.5 gap-2',
      text: 'text-xs',
      icon: 'w-3 h-3',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      container: 'px-4 py-2 gap-2.5',
      text: 'text-sm',
      icon: 'w-3.5 h-3.5',
      dot: 'w-2 h-2',
    },
    lg: {
      container: 'px-5 py-2.5 gap-3',
      text: 'text-base',
      icon: 'w-4 h-4',
      dot: 'w-2.5 h-2.5',
    },
  };

  const classes = sizeClasses[size];

  // Minimal variant (for compact spaces)
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`inline-flex items-center ${classes.container} bg-white/80 backdrop-blur-sm border ${config.borderColor} rounded-full shadow-sm`}
      >
        <div className={`${classes.dot} rounded-full ${config.dotColor}`} />
        <span className={`${classes.text} ${config.textColor}`}>
          {config.questions}Q
        </span>
      </motion.div>
    );
  }

  // Card variant (for larger displays)
  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`flex items-center gap-3 px-5 py-4 bg-gradient-to-br ${config.gradient} border-2 ${config.borderColor} rounded-2xl shadow-md ${config.glowColor}`}
      >
        <div className={`p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border ${config.borderColor}`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div>
          <div className={`font-medium ${config.textColor}`}>
            {config.label}
          </div>
          {showQuestionCount && (
            <div className={`text-xs ${config.textColor} opacity-75`}>
              {config.questions} thoughtful questions
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center ${classes.container} bg-gradient-to-r ${config.gradient} border ${config.borderColor} rounded-full shadow-sm backdrop-blur-sm`}
    >
      <Icon className={`${classes.icon} ${config.iconColor}`} />
      <span className={`${classes.text} ${config.textColor} font-medium`}>
        {config.label}
        {showQuestionCount && ` · ${config.questions}Q`}
      </span>
    </motion.div>
  );
}

// Export helper function to get tier info
export function getTierInfo(tier: PassportTier) {
  return TIER_CONFIG[tier];
}

// Export helper component for just the depth indicator
export function PassportDepthIndicator({ 
  tier, 
  size = 'md' 
}: { 
  tier: PassportTier; 
  size?: 'sm' | 'md' | 'lg' 
}) {
  const config = TIER_CONFIG[tier];
  
  const sizeMap = {
    sm: { container: 'w-8 h-8', dots: 'gap-0.5', dot: 'w-1 h-1' },
    md: { container: 'w-10 h-10', dots: 'gap-0.5', dot: 'w-1.5 h-1.5' },
    lg: { container: 'w-12 h-12', dots: 'gap-1', dot: 'w-2 h-2' },
  };
  
  const classes = sizeMap[size];
  const dotCount = tier === 'lite' ? 1 : tier === 'standard' ? 2 : 3;

  return (
    <div 
      className={`${classes.container} bg-gradient-to-br ${config.gradient} border ${config.borderColor} rounded-full flex items-center justify-center shadow-sm`}
      title={`${config.label} - ${config.questions} questions`}
    >
      <div className={`flex ${classes.dots}`}>
        {Array.from({ length: dotCount }).map((_, i) => (
          <div 
            key={i} 
            className={`${classes.dot} rounded-full ${config.dotColor}`}
          />
        ))}
      </div>
    </div>
  );
}
