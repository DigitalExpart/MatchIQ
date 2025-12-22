import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { SelectedQuestion } from './ScanSetupScreen';

interface QuestionPickerModalProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  onSelect: (question: SelectedQuestion) => void;
  onClose: () => void;
}

// Sample questions by category ID
const CATEGORY_QUESTIONS: Record<string, string[]> = {
  dealbreakers: [
    "Do they respect your boundaries and personal limits?",
    "Are they honest about their relationship status and intentions?",
    "Do they show signs of controlling or manipulative behavior?",
    "How do they handle disagreements or conflict?",
    "Do they have any active addictions or substance abuse issues?",
    "Are they respectful toward your family, friends, and values?",
    "Do they share your views on major life decisions (kids, marriage, location)?",
    "Are there any behaviors that make you feel unsafe or uncomfortable?"
  ],
  values: [
    "What do they say they value most in life?",
    "How do they prioritize work, family, and personal time?",
    "What are their views on important life decisions?",
    "What role does spirituality or religion play in their life?",
    "How do they spend their free time and what brings them joy?",
    "What are their long-term lifestyle goals?",
    "What does success mean to them?",
    "How do they contribute to their community or causes they care about?"
  ],
  communication: [
    "How clearly and directly do they express themselves?",
    "Do they listen actively when you speak?",
    "How do they handle disagreements or difficult conversations?",
    "Are they comfortable with deeper, vulnerable conversations?",
    "Do they ask thoughtful questions about you and your life?",
    "How do they respond when you share something important?",
    "Do they communicate their needs and expectations clearly?",
    "Are they responsive and consistent in their communication?"
  ],
  lifestyle: [
    "Where do they see themselves living in 5-10 years?",
    "What are their career goals and professional aspirations?",
    "How do they envision their family life in the future?",
    "What are their views on raising children (if applicable)?",
    "How do they balance work, relationships, and personal growth?",
    "What role do travel and adventure play in their ideal life?",
    "How do they approach health, fitness, and well-being?",
    "What does their ideal daily routine look like?"
  ]
};

export function QuestionPickerModal({ category, onSelect, onClose }: QuestionPickerModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const questions = CATEGORY_QUESTIONS[category.id] || [];

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      onSelect({
        categoryId: category.id,
        categoryName: category.name,
        question: questions[selectedIndex],
        questionIndex: selectedIndex
      });
    }
  };

  const getIconBgColor = (color: string) => {
    const colors = {
      red: 'bg-red-100',
      amber: 'bg-amber-100',
      blue: 'bg-blue-100',
      green: 'bg-green-100'
    };
    return colors[color as keyof typeof colors] || colors.amber;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-6 pb-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 ${getIconBgColor(category.color)} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div>
                <h2 className="text-xl text-white mb-1">Select One Question</h2>
                <p className="text-sm text-white/90">{category.name}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-sm text-white/95 leading-relaxed">
              Choose one question you feel is essential. MyMatchIQ will ensure balance by adding the remaining questions.
            </p>
          </div>
        </div>

        {/* Question List - Scrollable */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            {questions.map((question, index) => {
              const isSelected = selectedIndex === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full p-5 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 shadow-md'
                      : 'bg-gray-50 border-2 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-rose-100' : 'bg-gray-200'
                    }`}>
                      {isSelected ? (
                        <Check className="w-5 h-5 text-rose-600" />
                      ) : (
                        <span className="text-sm text-gray-500">{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {question}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIndex === null}
              className={`flex-1 py-4 rounded-2xl transition-all ${
                selectedIndex !== null
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
