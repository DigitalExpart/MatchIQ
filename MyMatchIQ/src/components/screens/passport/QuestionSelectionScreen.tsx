import { motion } from 'motion/react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../ui/button';
import { useState } from 'react';

interface Question {
  id: string;
  category: string;
  question: string;
  preview: string;
}

interface QuestionSelectionScreenProps {
  partnerName: string;
  questionsRemaining: number;
  onSendQuestions: (questionIds: string[]) => void;
  onBack: () => void;
}

const QUESTION_CATEGORIES = [
  { id: 'intentions', name: 'Intentions', color: 'from-purple-500 to-purple-600' },
  { id: 'communication', name: 'Communication', color: 'from-blue-500 to-blue-600' },
  { id: 'boundaries', name: 'Boundaries', color: 'from-green-500 to-green-600' },
  { id: 'values', name: 'Values', color: 'from-pink-500 to-pink-600' },
  { id: 'lifestyle', name: 'Lifestyle', color: 'from-amber-500 to-amber-600' },
  { id: 'conflict', name: 'Conflict Style', color: 'from-red-500 to-red-600' },
];

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'intentions',
    question: 'What are you primarily looking for right now?',
    preview: 'Long-term relationship / Casual dating / Friendship first / ...',
  },
  {
    id: 'q2',
    category: 'communication',
    question: 'How do you prefer to handle disagreements?',
    preview: 'Talk immediately / Take time to think / Write it out / ...',
  },
  {
    id: 'q3',
    category: 'boundaries',
    question: 'How important is personal space to you?',
    preview: 'Very important / Somewhat important / Flexible / ...',
  },
  {
    id: 'q4',
    category: 'values',
    question: 'What matters most to you in a partner?',
    preview: 'Honesty / Ambition / Kindness / Humor / ...',
  },
  {
    id: 'q5',
    category: 'lifestyle',
    question: 'How do you prefer to spend your free time?',
    preview: 'Social activities / Quiet time / Mix of both / ...',
  },
  {
    id: 'q6',
    category: 'conflict',
    question: 'When stressed, how do you typically respond?',
    preview: 'Seek support / Need alone time / Stay busy / ...',
  },
];

export function QuestionSelectionScreen({
  partnerName,
  questionsRemaining,
  onSendQuestions,
  onBack,
}: QuestionSelectionScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const filteredQuestions = selectedCategory
    ? SAMPLE_QUESTIONS.filter((q) => q.category === selectedCategory)
    : SAMPLE_QUESTIONS;

  const toggleQuestion = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      if (selectedQuestions.length < questionsRemaining) {
        setSelectedQuestions([...selectedQuestions, questionId]);
      }
    }
  };

  const handleSend = () => {
    if (selectedQuestions.length > 0) {
      onSendQuestions(selectedQuestions);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="text-sm text-slate-600">
              {selectedQuestions.length} / {questionsRemaining} selected
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-slate-900 mb-3">Choose Today's Questions</h1>
            <p className="text-slate-600">
              Select up to {questionsRemaining} questions for {partnerName}
            </p>
          </div>

          {/* Category filters */}
          <div className="mb-8">
            <h3 className="text-slate-800 text-sm mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
                }`}
              >
                All
              </button>
              {QUESTION_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 mb-8">
            {filteredQuestions.map((question) => {
              const isSelected = selectedQuestions.includes(question.id);
              const category = QUESTION_CATEGORIES.find((c) => c.id === question.category);

              return (
                <motion.button
                  key={question.id}
                  onClick={() => toggleQuestion(question.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left bg-white rounded-2xl p-5 border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 shadow-md'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {/* Category badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-3">
                    <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {category?.name}
                    </span>
                  </div>

                  {/* Question */}
                  <h4 className="text-slate-800 mb-2">{question.question}</h4>

                  {/* Preview */}
                  <p className="text-sm text-slate-500">{question.preview}</p>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-2 text-purple-600 text-sm">
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span>Selected</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Max questions notice */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-8">
            <p className="text-blue-800 text-sm text-center">
              You can select up to {questionsRemaining} questions per day. Cannot send new questions until tomorrow.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Fixed send button */}
      {selectedQuestions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleSend}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Send {selectedQuestions.length} Question{selectedQuestions.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
