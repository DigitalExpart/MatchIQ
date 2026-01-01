import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface SelfAssessmentReminderBannerProps {
  progress: number; // 0-100
  onComplete: () => void;
  onDismiss: () => void;
}

export function SelfAssessmentReminderBanner({ 
  progress, 
  onComplete, 
  onDismiss 
}: SelfAssessmentReminderBannerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const tooltipContent = progress === 0 
    ? {
        title: "Match Blueprint Benefits:",
        features: [
          "Define your relationship values & priorities",
          "Set clear deal-breakers and non-negotiables",
          "Get personalized compatibility scoring",
          "Unlock AI-powered insights and coaching",
          "Compare matches against your ideal partner profile"
        ]
      }
    : {
        title: "Complete Your Blueprint:",
        features: [
          "Unlock full scanning capabilities",
          "Get deeper compatibility analysis",
          "Access advanced red flag detection",
          "Receive personalized AI coaching",
          "Compare multiple potential matches"
        ]
      };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-[#3C2B63] to-[#A79BC8] text-white shadow-lg relative"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform cursor-help"
                >
                  <Info className="w-5 h-5 flex-shrink-0" />
                </button>
                
                {/* Tooltip */}
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-[480px] bg-white text-gray-900 rounded-xl shadow-2xl p-5 z-50 border border-gray-100"
                    >
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                      <h4 className="font-semibold text-sm mb-3 text-[#3C2B63]">
                        {tooltipContent.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {tooltipContent.features.map((feature, index) => (
                          <div key={index} className="text-xs flex items-start gap-2">
                            <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex-1">
                <p className="text-sm">
                  {progress === 0 
                    ? 'Start your Match Blueprint™ to unlock full scanning capabilities'
                    : 'Complete your Match Blueprint™ to unlock full scanning capabilities'
                  }
                </p>
                {progress > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-white h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs whitespace-nowrap">{Math.round(progress)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-white text-[#3C2B63] rounded-lg text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                {progress > 0 ? 'Continue' : 'Start Now'}
              </button>
              <button
                onClick={onDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
