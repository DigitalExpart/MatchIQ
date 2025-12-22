import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { ProgressTracker } from '../../passport/ProgressTracker';

interface ReflectionWeekDashboardProps {
  partnerName: string;
  currentDay: number;
  questionsAskedToday: number;
  questionsReceivedToday: number;
  maxQuestionsPerDay: number;
  onSelectQuestions: () => void;
  onViewAnswers: () => void;
  onBack: () => void;
}

export function ReflectionWeekDashboard({
  partnerName,
  currentDay,
  questionsAskedToday,
  questionsReceivedToday,
  maxQuestionsPerDay,
  onSelectQuestions,
  onViewAnswers,
  onBack,
}: ReflectionWeekDashboardProps) {
  const canAskMore = questionsAskedToday < maxQuestionsPerDay;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
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
            <h1 className="text-slate-900 mb-3">Compatibility Reflection Week</h1>
            <p className="text-slate-600">
              Exploring compatibility with <span className="text-slate-800">{partnerName}</span>
            </p>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-8">
            <p className="text-slate-700 leading-relaxed">
              Over the next 7 days, exchange structured questions to better understand how you both think.
            </p>
          </div>

          {/* Progress */}
          <ProgressTracker currentDay={currentDay} totalDays={7} className="mb-8" />

          {/* Rules Display */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-8">
            <h3 className="text-slate-800 mb-4">Ground Rules</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <span>No chat or messaging</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xs">✗</span>
                </div>
                <span>No typing or free text</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span>Multiple choice only</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span>1-3 questions per person per day</span>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="space-y-4 mb-8">
            <h3 className="text-slate-800">Today's Activity</h3>

            {/* Questions asked */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-slate-800 text-sm">Questions Asked</p>
                    <p className="text-xs text-slate-500">To {partnerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-slate-900">{questionsAskedToday}</p>
                  <p className="text-xs text-slate-500">of {maxQuestionsPerDay}</p>
                </div>
              </div>
              {canAskMore ? (
                <Button
                  onClick={onSelectQuestions}
                  className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm"
                >
                  Select Today's Questions
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Daily limit reached</span>
                </div>
              )}
            </div>

            {/* Questions received */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-slate-800 text-sm">Questions Received</p>
                    <p className="text-xs text-slate-500">From {partnerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-slate-900">{questionsReceivedToday}</p>
                  <p className="text-xs text-slate-500">today</p>
                </div>
              </div>
              {questionsReceivedToday > 0 && (
                <Button
                  onClick={onViewAnswers}
                  variant="outline"
                  className="w-full h-10 rounded-lg border-slate-300 text-sm"
                >
                  View & Compare Answers
                </Button>
              )}
            </div>
          </div>

          {/* Next steps */}
          {!canAskMore && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-800 text-sm text-center">
                Come back tomorrow to ask more questions
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
