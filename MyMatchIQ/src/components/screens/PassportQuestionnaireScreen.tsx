import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PassportTier, PassportTierBadge } from '../passport/PassportTierBadge';
import { PassportProgressBar } from '../passport/PassportProgressBar';
import { PassportQuestion, PassportQuestionData } from '../passport/PassportQuestion';
import { getQuestionsForTier, getTotalQuestionsForTier } from '../../data/passportQuestions';

interface PassportQuestionnaireScreenProps {
  tier: PassportTier;
  onComplete: (answers: PassportAnswers) => void;
  onBack: () => void;
  existingAnswers?: PassportAnswers;
}

export interface PassportAnswers {
  [questionId: string]: string | string[];
}

export function PassportQuestionnaireScreen({
  tier,
  onComplete,
  onBack,
  existingAnswers = {},
}: PassportQuestionnaireScreenProps) {
  const questions = getQuestionsForTier(tier);
  const totalQuestions = getTotalQuestionsForTier(tier);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<PassportAnswers>(existingAnswers);
  const [direction, setDirection] = useState(1);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || null;
  const answeredCount = Object.keys(answers).length;
  const canProceed = currentAnswer !== null;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3C2B63] to-[#5A4180] text-white px-6 py-6">
        <button
          onClick={handleBack}
          className="mb-4 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="mb-4">
          <PassportTierBadge tier={tier} size="md" />
        </div>

        <h1 className="text-2xl mb-2">Build Your Compatibility Passport</h1>
        <p className="text-white/80 text-sm mb-4">
          Answer honestly to create meaningful compatibility insights
        </p>

        <PassportProgressBar tier={tier} answered={answeredCount} total={totalQuestions} />
      </div>

      {/* Question Content */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <PassportQuestion
              question={currentQuestion}
              value={currentAnswer}
              onChange={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              canProceed
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? (
              <>
                <Check className="w-5 h-5" />
                Complete Passport
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
