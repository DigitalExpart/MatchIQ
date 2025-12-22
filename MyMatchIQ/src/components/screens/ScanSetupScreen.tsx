import { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, AlertCircle } from 'lucide-react';
import { SubscriptionTier } from '../../App';
import { useLanguage } from '../../contexts/LanguageContext';
import { QuestionPickerModal } from './QuestionPickerModal';

interface ScanSetupScreenProps {
  onContinue: (selectedQuestions: Map<string, SelectedQuestion>) => void;
  onBack: () => void;
  subscriptionTier: SubscriptionTier;
}

export interface SelectedQuestion {
  categoryId: string;
  categoryName: string;
  question: string;
  questionIndex: number;
}

// Tier-aware category configuration
const TIER_CATEGORIES = {
  free: [
    { id: 'dealbreakers', name: 'Deal-Breakers', description: 'Non-negotiable essentials', icon: '🚫', color: 'red' },
    { id: 'values', name: 'Values & Intent', description: 'Core beliefs and relationship goals', icon: '⭐', color: 'amber' }
  ],
  premium: [
    { id: 'dealbreakers', name: 'Deal-Breakers', description: 'Non-negotiable essentials', icon: '🚫', color: 'red' },
    { id: 'values', name: 'Values & Intent', description: 'Core beliefs and relationship goals', icon: '⭐', color: 'amber' },
    { id: 'communication', name: 'Communication Style', description: 'How they express and listen', icon: '💬', color: 'blue' }
  ],
  exclusive: [
    { id: 'dealbreakers', name: 'Deal-Breakers', description: 'Non-negotiable essentials', icon: '🚫', color: 'red' },
    { id: 'values', name: 'Values & Intent', description: 'Core beliefs and relationship goals', icon: '⭐', color: 'amber' },
    { id: 'communication', name: 'Communication Style', description: 'How they express and listen', icon: '💬', color: 'blue' },
    { id: 'lifestyle', name: 'Long-Term & Lifestyle', description: 'Future plans and compatibility', icon: '🏡', color: 'green' }
  ]
};

export function ScanSetupScreen({ onContinue, onBack, subscriptionTier }: ScanSetupScreenProps) {
  const { t } = useLanguage();
  const [selectedQuestions, setSelectedQuestions] = useState<Map<string, SelectedQuestion>>(new Map());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<typeof TIER_CATEGORIES.free[0] | null>(null);

  const requiredCategories = TIER_CATEGORIES[subscriptionTier];
  const allCategoriesSelected = requiredCategories.every(cat => selectedQuestions.has(cat.id));

  const handleCategoryClick = (category: typeof TIER_CATEGORIES.free[0]) => {
    setActiveCategory(category);
    setPickerOpen(true);
  };

  const handleQuestionSelected = (question: SelectedQuestion) => {
    const newSelections = new Map(selectedQuestions);
    newSelections.set(question.categoryId, question);
    setSelectedQuestions(newSelections);
    setPickerOpen(false);
    setActiveCategory(null);
  };

  const handleContinue = () => {
    if (allCategoriesSelected) {
      onContinue(selectedQuestions);
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      red: 'from-red-50 to-rose-50 border-red-100',
      amber: 'from-amber-50 to-yellow-50 border-amber-100',
      blue: 'from-blue-50 to-cyan-50 border-blue-100',
      green: 'from-green-50 to-emerald-50 border-green-100'
    };
    return colors[color as keyof typeof colors] || colors.amber;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <button 
            onClick={onBack}
            className="mb-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="text-left">
            <h1 className="text-2xl text-white mb-2">Set Your Intentional Scan</h1>
            <p className="text-white/90 text-sm leading-relaxed">
              Choose one question per category that matters most to you.<br />
              We'll include the rest to ensure balanced, accurate insights.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 relative z-10">
        {/* Info Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">How It Works</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                You select one key question per category. MyMatchIQ automatically adds the remaining questions to ensure comprehensive, balanced scoring.
              </p>
            </div>
          </div>
        </div>

        {/* Category Selection Cards */}
        <div className="space-y-4 mb-6">
          <h2 className="text-gray-900 px-1">Required Categories</h2>
          
          {requiredCategories.map((category) => {
            const isSelected = selectedQuestions.has(category.id);
            const selectedQuestion = selectedQuestions.get(category.id);

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`w-full bg-gradient-to-br ${getCategoryColor(category.color)} border rounded-3xl p-6 text-left hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${getIconBgColor(category.color)} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {isSelected && selectedQuestion ? (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 leading-relaxed">{selectedQuestion.question}</p>
                        <p className="text-xs text-gray-500 mt-1">Tap to change</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <p className="text-sm text-gray-600 text-center">Tap to Select 1 Question</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Selection Progress</h3>
            <span className="text-sm text-gray-600">
              {selectedQuestions.size} / {requiredCategories.length}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${(selectedQuestions.size / requiredCategories.length) * 100}%` }}
            />
          </div>
          {allCategoriesSelected && (
            <p className="text-sm text-green-600 mt-3 text-center">✓ All categories ready</p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
        <button
          onClick={handleContinue}
          disabled={!allCategoriesSelected}
          className={`w-full py-4 rounded-2xl transition-all ${
            allCategoriesSelected
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {allCategoriesSelected ? 'Continue to Scan' : `Select ${requiredCategories.length - selectedQuestions.size} More`}
        </button>
      </div>

      {/* Question Picker Modal */}
      {pickerOpen && activeCategory && (
        <QuestionPickerModal
          category={activeCategory}
          onSelect={handleQuestionSelected}
          onClose={() => {
            setPickerOpen(false);
            setActiveCategory(null);
          }}
        />
      )}
    </div>
  );
}
