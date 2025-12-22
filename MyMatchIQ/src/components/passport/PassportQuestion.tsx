import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export interface PassportQuestionOption {
  id: string;
  label: string;
}

export interface PassportQuestionData {
  id: string;
  category: string;
  question: string;
  subtitle?: string;
  options: PassportQuestionOption[];
  multiSelect?: boolean;
  maxSelect?: number;
}

interface PassportQuestionProps {
  question: PassportQuestionData;
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
}

export function PassportQuestion({ question, value, onChange }: PassportQuestionProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleOptionClick = (optionId: string) => {
    if (question.multiSelect) {
      const maxSelect = question.maxSelect || 3;
      
      if (selectedValues.includes(optionId)) {
        // Remove if already selected
        onChange(selectedValues.filter(id => id !== optionId));
      } else if (selectedValues.length < maxSelect) {
        // Add if under limit
        onChange([...selectedValues, optionId]);
      }
    } else {
      // Single select
      onChange(optionId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
        {question.category}
      </div>

      {/* Question Text */}
      <div>
        <h3 className="text-xl text-gray-900 mb-1">
          {question.question}
        </h3>
        {question.subtitle && (
          <p className="text-sm text-gray-600">
            {question.subtitle}
          </p>
        )}
        {question.multiSelect && (
          <p className="text-xs text-purple-600 mt-2">
            Select up to {question.maxSelect || 3}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedValues.includes(option.id);
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleOptionClick(option.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`${isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
