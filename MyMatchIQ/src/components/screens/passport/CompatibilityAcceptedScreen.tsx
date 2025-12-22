import { motion } from 'motion/react';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';

interface CompatibilityAcceptedScreenProps {
  partnerName: string;
  onBeginReflectionWeek: () => void;
}

export function CompatibilityAcceptedScreen({
  partnerName,
  onBeginReflectionWeek,
}: CompatibilityAcceptedScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Animated hearts */}
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
            >
              <Heart className="w-12 h-12 text-white fill-white" />
            </motion.div>

            {/* Sparkles around the heart */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-500" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-pink-500" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-slate-900 mb-4">Compatibility Accepted</h1>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <p className="text-slate-700 leading-relaxed mb-4">
              You and <span className="text-slate-900">{partnerName}</span> have both agreed to explore compatibility further.
            </p>
            <p className="text-slate-600 text-sm">
              The next step is a 7-day Compatibility Reflection Week.
            </p>
          </div>

          {/* What's next */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8">
            <h3 className="text-slate-800 mb-4">What happens next?</h3>
            <ul className="space-y-3 text-left text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-700 text-xs">1</span>
                </div>
                <span>Over 7 days, you'll exchange structured questions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-700 text-xs">2</span>
                </div>
                <span>Each person can ask 1-3 questions per day</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-700 text-xs">3</span>
                </div>
                <span>All responses are multiple choice — no typing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-700 text-xs">4</span>
                </div>
                <span>Compare answers to understand how you both think</span>
              </li>
            </ul>
          </div>

          {/* Important note */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-8">
            <p className="text-blue-800 text-sm">
              <span className="font-medium">Remember:</span> No chat, no messaging. Only structured questions to ensure thoughtful, intentional connection.
            </p>
          </div>

          {/* Begin button */}
          <Button
            onClick={onBeginReflectionWeek}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
          >
            Begin Compatibility Reflection Week
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
