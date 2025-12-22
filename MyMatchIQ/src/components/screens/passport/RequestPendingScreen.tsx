import { motion } from 'motion/react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/button';

interface RequestPendingScreenProps {
  partnerName: string;
  onBack: () => void;
}

export function RequestPendingScreen({ partnerName, onBack }: RequestPendingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated clock icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-8"
          >
            <Clock className="w-12 h-12 text-purple-600" />
          </motion.div>

          {/* Title */}
          <h1 className="text-slate-900 mb-4">Compatibility Request Sent</h1>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <p className="text-slate-700 leading-relaxed mb-4">
              Waiting for <span className="text-slate-900">{partnerName}</span> to review your Compatibility Passport.
            </p>
            <p className="text-slate-600 text-sm">
              You'll be notified once they respond.
            </p>
          </div>

          {/* Info cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-800 text-sm">
                <span className="font-medium">No messaging.</span> All interactions remain structured and intentional.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-purple-800 text-sm">
                <span className="font-medium">No interaction.</span> You cannot contact them until they respond.
              </p>
            </div>
          </div>

          {/* Pulsing indicator */}
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.4,
              }}
              className="w-2 h-2 rounded-full bg-purple-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
