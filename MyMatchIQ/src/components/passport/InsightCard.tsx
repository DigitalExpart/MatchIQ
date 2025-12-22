import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface InsightCardProps {
  title?: string;
  content: string;
  variant?: 'default' | 'ai';
  className?: string;
}

export function InsightCard({ title, content, variant = 'default', className = '' }: InsightCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 ${className}`}
    >
      {variant === 'ai' && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-slate-600">AI Insight</span>
        </div>
      )}
      
      {title && (
        <h4 className="text-slate-800 mb-2">{title}</h4>
      )}
      
      <p className="text-slate-600 leading-relaxed">{content}</p>
    </motion.div>
  );
}
