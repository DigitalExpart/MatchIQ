import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ComparisonPanel } from '../../passport/ComparisonPanel';

interface Answer {
  questionId: string;
  question: string;
  userAnswer: string;
  partnerAnswer: string;
  alignment: 'aligned' | 'different' | 'discuss';
}

interface AnswerComparisonScreenProps {
  partnerName: string;
  answers: Answer[];
  onBack: () => void;
}

export function AnswerComparisonScreen({
  partnerName,
  answers,
  onBack,
}: AnswerComparisonScreenProps) {
  const alignedCount = answers.filter((a) => a.alignment === 'aligned').length;
  const differentCount = answers.filter((a) => a.alignment === 'different').length;
  const discussCount = answers.filter((a) => a.alignment === 'discuss').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
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
            <h1 className="text-slate-900 mb-3">Your Reflections</h1>
            <p className="text-slate-600">
              Comparing answers with {partnerName}
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white rounded-xl p-4 border border-green-200 text-center">
              <div className="text-2xl text-green-600 mb-1">{alignedCount}</div>
              <div className="text-xs text-slate-600">Aligned</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-200 text-center">
              <div className="text-2xl text-purple-600 mb-1">{differentCount}</div>
              <div className="text-xs text-slate-600">Different</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-200 text-center">
              <div className="text-2xl text-amber-600 mb-1">{discussCount}</div>
              <div className="text-xs text-slate-600">To Discuss</div>
            </div>
          </div>

          {/* Important note */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-8">
            <p className="text-blue-800 text-sm">
              <span className="font-medium">No comments.</span> No reactions. This is purely for understanding how you both think.
            </p>
          </div>

          {/* Comparison panels */}
          <div className="space-y-6">
            {answers.map((answer) => (
              <ComparisonPanel
                key={answer.questionId}
                question={answer.question}
                userAnswer={answer.userAnswer}
                partnerAnswer={answer.partnerAnswer}
                alignment={answer.alignment}
              />
            ))}
          </div>

          {/* Empty state */}
          {answers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-slate-800 mb-2">No answers to compare yet</h3>
              <p className="text-slate-600 text-sm">
                Once {partnerName} answers your questions, they'll appear here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
