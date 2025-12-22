import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { learnFromFeedback } from '../../utils/aiService';
import { MatchScan, UserProfile } from '../../App';

interface AIFeedbackButtonProps {
  scan: MatchScan;
  userProfile: UserProfile | null;
}

export function AIFeedbackButton({ scan, userProfile }: AIFeedbackButtonProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (wasAccurate: boolean) => {
    if (!userProfile || feedbackGiven) return;

    setIsSubmitting(true);
    try {
      learnFromFeedback(scan, userProfile, wasAccurate);
      setFeedbackGiven(wasAccurate ? 'positive' : 'negative');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <p className="text-sm text-gray-600 mb-3 text-center">
        Was this AI analysis helpful and accurate?
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleFeedback(true)}
          disabled={isSubmitting || feedbackGiven !== null}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            feedbackGiven === 'positive'
              ? 'bg-emerald-100 text-emerald-700'
              : feedbackGiven === null
              ? 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting && feedbackGiven === null ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ThumbsUp className="w-5 h-5" />
          )}
          <span>Helpful</span>
        </button>
        <button
          onClick={() => handleFeedback(false)}
          disabled={isSubmitting || feedbackGiven !== null}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            feedbackGiven === 'negative'
              ? 'bg-red-100 text-red-700'
              : feedbackGiven === null
              ? 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting && feedbackGiven === null ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ThumbsDown className="w-5 h-5" />
          )}
          <span>Not Helpful</span>
        </button>
      </div>
      {feedbackGiven && (
        <p className="text-xs text-center text-gray-500 mt-3">
          Thank you! Your feedback helps improve our AI analysis.
        </p>
      )}
    </div>
  );
}

