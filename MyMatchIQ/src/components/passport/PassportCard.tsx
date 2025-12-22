import { Heart, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface PassportCardProps {
  userName: string;
  isActive?: boolean;
  className?: string;
}

export function PassportCard({ userName, isActive = true, className = '' }: PassportCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-xl ${className}`}
    >
      {/* Heart-shaped brain icon container */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Heart outline */}
          <Heart className="w-24 h-24 text-white fill-white/20" strokeWidth={2} />
          {/* Brain icon centered in heart */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* User name */}
      <div className="text-center mb-4">
        <h3 className="text-white text-2xl mb-2">{userName}</h3>
      </div>

      {/* Status badge */}
      {isActive && (
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <p className="text-white text-sm">Passport Active</p>
          </div>
        </div>
      )}

      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-3xl pointer-events-none" />
    </motion.div>
  );
}
