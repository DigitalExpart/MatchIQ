import { motion } from 'motion/react';
import { Heart, UserCheck, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';

interface GraduationScreenProps {
  partnerName: string;
  onContinueToOne2One: () => void;
  onEndRespectfully: () => void;
}

export function GraduationScreen({
  partnerName,
  onContinueToOne2One,
  onEndRespectfully,
}: GraduationScreenProps) {
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
          {/* Icon */}
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
            >
              <Heart className="w-12 h-12 text-white fill-white" />
            </motion.div>

            {/* Sparkles */}
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
              <Sparkles className="absolute -top-2 left-0 w-6 h-6 text-purple-400" />
              <Sparkles className="absolute top-0 -right-2 w-5 h-5 text-pink-400" />
              <Sparkles className="absolute -bottom-2 right-0 w-6 h-6 text-purple-400" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-slate-900 mb-4">Ready to Continue?</h1>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <p className="text-slate-700 leading-relaxed mb-4">
              You've completed your Compatibility Reflection Week with {partnerName}.
            </p>
            <p className="text-slate-600 text-sm">
              Both of you can now decide if you'd like to continue exploring your connection.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {/* Continue option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 cursor-pointer"
              onClick={onContinueToOne2One}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-slate-900 mb-2">Continue in One2One Love</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Get a 7-day full access trial to deepen your connection with enhanced features
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Unlimited structured conversations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Advanced compatibility insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Relationship progress tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Button className="w-full mt-4 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl">
                Continue to One2One Love
              </Button>
            </motion.div>

            {/* End option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
              onClick={onEndRespectfully}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-slate-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-slate-900 mb-2">End Here Respectfully</h3>
                  <p className="text-slate-600 text-sm">
                    Part ways thoughtfully with mutual respect and clarity
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 h-12 rounded-xl border-slate-300"
              >
                End Respectfully
              </Button>
            </motion.div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-800 text-sm">
              <span className="font-medium">No forced transition.</span> Both people must agree to continue to One2One Love.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
