import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  category: string;
  question: string;
  options: string[];
  selectedOption?: string;
  onSelect?: (option: string) => void;
  disabled?: boolean;
  className?: string;
}

export function QuestionCard({
  category,
  question,
  options,
  selectedOption,
  onSelect,
  disabled = false,
  className = '',
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 ${className}`}
    >
      {/* Category badge */}
      <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
        <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {category}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-slate-800 mb-6">{question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          
          return (
            <motion.button
              key={index}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              onClick={() => !disabled && onSelect?.(option)}
              disabled={disabled}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50'
                  : 'border-slate-200 hover:border-purple-300 bg-white'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                  {option}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
