import { motion } from 'motion/react';
import { Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface One2OneLoveHandoffScreenProps {
  partnerName: string;
  onOpenOne2OneLove: () => void;
}

export function One2OneLoveHandoffScreen({
  partnerName,
  onOpenOne2OneLove,
}: One2OneLoveHandoffScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Animated icon */}
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl"
            >
              <Heart className="w-16 h-16 text-white fill-white" />
            </motion.div>

            {/* Orbiting sparkles */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 text-purple-400" />
              <Sparkles className="absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 text-pink-400" />
              <Sparkles className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 text-red-400" />
              <Sparkles className="absolute top-1/2 -left-4 -translate-y-1/2 w-6 h-6 text-purple-400" />
            </motion.div>
          </div>

          {/* Congratulations */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-6"
          >
            <p className="text-white text-sm">🎉 Both agreed to continue!</p>
          </motion.div>

          {/* Title */}
          <h1 className="text-slate-900 mb-4">Welcome to One2One Love</h1>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <p className="text-slate-700 leading-relaxed mb-4">
              You and <span className="text-slate-900">{partnerName}</span> are now entering the next phase of your connection.
            </p>
            <p className="text-slate-600 text-sm">
              Your 7-day full access trial begins now.
            </p>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8">
            <h3 className="text-slate-800 mb-4">What's included in One2One Love</h3>
            <div className="space-y-3 text-left text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-slate-800">Unlimited Structured Conversations</p>
                  <p className="text-slate-500 text-xs">Go deeper with unlimited daily questions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-slate-800">Advanced Compatibility Insights</p>
                  <p className="text-slate-500 text-xs">Real-time analysis of your connection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-slate-800">Relationship Progress Tracking</p>
                  <p className="text-slate-500 text-xs">See how your bond evolves over time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-slate-800">Guided Conversation Prompts</p>
                  <p className="text-slate-500 text-xs">AI-powered suggestions for meaningful dialogue</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-slate-800">Conflict Resolution Tools</p>
                  <p className="text-slate-500 text-xs">Navigate challenges with expert guidance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trial info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-8">
            <p className="text-blue-800 text-sm">
              Your 7-day trial is completely free. Cancel anytime, no strings attached.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onOpenOne2OneLove}
            className="w-full h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-xl shadow-2xl"
          >
            <span className="text-lg">Open One2One Love</span>
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>

          {/* Footer note */}
          <p className="text-xs text-slate-500 mt-6">
            Still no chat, no DMs — just deeper, more meaningful structured connection
          </p>
        </motion.div>
      </div>
    </div>
  );
}
