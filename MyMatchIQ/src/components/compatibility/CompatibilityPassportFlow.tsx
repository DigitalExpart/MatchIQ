// Tier-aware Compatibility Passport questionnaire with multiple-choice only
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionTier } from '../../App';
import { 
  CompatibilityQuestion, 
  getQuestionsForTier, 
  getQuestionCountForTier,
  getTierLabel 
} from '../../utils/compatibilityQuestions';
import { CompatibilityAnswer } from '../../utils/compatibilityEngine';

interface CompatibilityPassportFlowProps {
  tier: SubscriptionTier;
  onComplete: (answers: CompatibilityAnswer[]) => void;
  onBack: () => void;
  existingAnswers?: CompatibilityAnswer[];
}

export function CompatibilityPassportFlow({
  tier,
  onComplete,
  onBack,
  existingAnswers = []
}: CompatibilityPassportFlowProps) {
  const questions = getQuestionsForTier(tier);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CompatibilityAnswer[]>(existingAnswers);
  const [showWhyMatters, setShowWhyMatters] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const handleSelectOption = (optionValue: string, weight: number) => {
    const newAnswer: CompatibilityAnswer = {
      questionId: currentQuestion.id,
      value: optionValue,
      weight
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowWhyMatters(false);
    } else {
      // Complete
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowWhyMatters(false);
    } else {
      onBack();
    }
  };

  const canProceed = currentAnswer !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
            <div className="text-sm text-gray-600">
              {currentIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Badge */}
              <div className="inline-block px-4 py-1 bg-white rounded-full border border-gray-200 text-sm text-gray-700 mb-4">
                {currentQuestion.category}
              </div>

              {/* Question */}
              <h2 className="text-2xl text-gray-900 mb-2 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Why This Matters */}
              {currentQuestion.whyMatters && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowWhyMatters(!showWhyMatters)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    <span>Why this matters</span>
                  </button>
                  <AnimatePresence>
                    {showWhyMatters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-600 mt-2 pl-6 italic">
                          {currentQuestion.whyMatters}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3 mt-8">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentAnswer?.value === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelectOption(option.value, option.weight)}
                      className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Tier Info */}
          <p className="text-xs text-gray-500 text-center mt-4">
            {getTierLabel(tier)}
          </p>
        </div>
      </div>
    </div>
  );
}
