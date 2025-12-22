import { motion } from 'motion/react';
import { User, UserCheck, AlertCircle } from 'lucide-react';

interface ComparisonPanelProps {
  question: string;
  userAnswer: string;
  partnerAnswer: string;
  alignment: 'aligned' | 'different' | 'discuss';
  className?: string;
}

export function ComparisonPanel({
  question,
  userAnswer,
  partnerAnswer,
  alignment,
  className = '',
}: ComparisonPanelProps) {
  const alignmentConfig = {
    aligned: {
      icon: UserCheck,
      label: 'Aligned',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    different: {
      icon: User,
      label: 'Different Perspectives',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    discuss: {
      icon: AlertCircle,
      label: 'Needs Discussion Later',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  };

  const config = alignmentConfig[alignment];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 ${className}`}
    >
      {/* Question */}
      <h4 className="text-slate-800 mb-6">{question}</h4>

      {/* Answers side by side */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* User answer */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">You</span>
          </div>
          <p className="text-slate-700 text-sm">{userAnswer}</p>
        </div>

        {/* Partner answer */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Them</span>
          </div>
          <p className="text-slate-700 text-sm">{partnerAnswer}</p>
        </div>
      </div>

      {/* Alignment indicator */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm ${config.color}`}>{config.label}</span>
      </div>
    </motion.div>
  );
}
