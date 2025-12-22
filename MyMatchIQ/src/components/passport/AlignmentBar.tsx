import { motion } from 'motion/react';

interface AlignmentBarProps {
  label: string;
  value: number; // 0-100
  alignment: 'strong' | 'neutral' | 'friction';
  className?: string;
}

export function AlignmentBar({ label, value, alignment, className = '' }: AlignmentBarProps) {
  const colors = {
    strong: 'from-green-500 to-emerald-500',
    neutral: 'from-purple-500 to-pink-500',
    friction: 'from-amber-500 to-orange-500',
  };

  const textColors = {
    strong: 'text-green-600',
    neutral: 'text-purple-600',
    friction: 'text-amber-600',
  };

  const labels = {
    strong: 'Strong Alignment',
    neutral: 'Neutral Alignment',
    friction: 'Potential Friction',
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-700 text-sm">{label}</span>
        <span className={`text-xs ${textColors[alignment]}`}>
          {labels[alignment]}
        </span>
      </div>
      
      <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colors[alignment]} rounded-full`}
        />
      </div>
    </div>
  );
}
