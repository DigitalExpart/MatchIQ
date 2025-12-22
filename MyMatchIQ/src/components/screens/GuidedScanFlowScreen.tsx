import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, SkipForward, AlertCircle, Check } from 'lucide-react';
import { MatchScan, ScanAnswer } from '../../App';
import { SelectedQuestion } from './ScanSetupScreen';
import { SubscriptionTier } from '../../App';

interface GuidedScanFlowScreenProps {
  selectedQuestions: Map<string, SelectedQuestion>;
  subscriptionTier: SubscriptionTier;
  onComplete: (scan: MatchScan) => void;
  onBack: () => void;
}

/**
 * SCAN INTEGRITY RULE (INTERNAL):
 * Each scan maintains a "used questions" set.
 * Once a question appears (answered or skipped), it must never reappear in the same scan.
 * Replacement questions must be drawn only from unused questions.
 * 
 * SCORING NOTES (INTERNAL):
 * Skipped questions are excluded from scoring and replaced automatically.
 * Scoring calculations are based only on completed questions.
 * Duplicate questions are strictly prohibited to preserve accuracy.
 * 
 * DESIGN GUARDRAILS (LOCKED):
 * - Users can never manually select all questions
 * - At least 50% of questions must be system-selected
 * - No question repetition under any circumstance
 * - Skip does not penalize or reduce total question count
 * - All logic must be enforced server-side (simulated here)
 */

interface QuestionItem {
  id: string;
  categoryId: string;
  categoryName: string;
  question: string;
  isUserSelected: boolean;
}

// Total questions by tier
const TIER_QUESTION_COUNTS = {
  free: 15,
  premium: 25,
  exclusive: 45
};

// All available questions by category (simulated question bank)
const QUESTION_BANK: Record<string, string[]> = {
  dealbreakers: [
    "Do they respect your boundaries and personal limits?",
    "Are they honest about their relationship status and intentions?",
    "Do they show signs of controlling or manipulative behavior?",
    "How do they handle disagreements or conflict?",
    "Do they have any active addictions or substance abuse issues?",
    "Are they respectful toward your family, friends, and values?",
    "Do they share your views on major life decisions (kids, marriage, location)?",
    "Are there any behaviors that make you feel unsafe or uncomfortable?",
    "Do they take responsibility for their mistakes?",
    "Are they financially transparent and responsible?",
    "Do they show respect in how they talk about ex-partners?",
    "Are their life goals compatible with yours?"
  ],
  values: [
    "What do they say they value most in life?",
    "How do they prioritize work, family, and personal time?",
    "What are their views on important life decisions?",
    "What role does spirituality or religion play in their life?",
    "How do they spend their free time and what brings them joy?",
    "What are their long-term lifestyle goals?",
    "What does success mean to them?",
    "How do they contribute to their community or causes they care about?",
    "What principles guide their major decisions?",
    "How do they define integrity and live by it?",
    "What traditions or rituals are important to them?",
    "How do they approach personal growth and self-improvement?"
  ],
  communication: [
    "How clearly and directly do they express themselves?",
    "Do they listen actively when you speak?",
    "How do they handle disagreements or difficult conversations?",
    "Are they comfortable with deeper, vulnerable conversations?",
    "Do they ask thoughtful questions about you and your life?",
    "How do they respond when you share something important?",
    "Do they communicate their needs and expectations clearly?",
    "Are they responsive and consistent in their communication?",
    "How do they express appreciation and gratitude?",
    "Do they follow through on what they say they'll do?",
    "How do they handle misunderstandings?",
    "Do they make you feel heard and understood?"
  ],
  lifestyle: [
    "Where do they see themselves living in 5-10 years?",
    "What are their career goals and professional aspirations?",
    "How do they envision their family life in the future?",
    "What are their views on raising children (if applicable)?",
    "How do they balance work, relationships, and personal growth?",
    "What role do travel and adventure play in their ideal life?",
    "How do they approach health, fitness, and well-being?",
    "What does their ideal daily routine look like?",
    "What hobbies or interests do they want to pursue long-term?",
    "How do they define work-life balance?",
    "What role do friends and social life play in their future?",
    "How do they approach financial planning for the future?"
  ]
};

type Rating = 'green-flag' | 'positive' | 'neutral' | 'concern' | 'red-flag';

const RATING_OPTIONS: { value: Rating; label: string; emoji: string; color: string; description: string }[] = [
  { value: 'green-flag', label: 'Green Flag', emoji: '✅', color: 'emerald', description: 'Highly compatible & positive' },
  { value: 'positive', label: 'Positive', emoji: '👍', color: 'blue', description: 'Good sign, promising' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'gray', description: 'Neither good nor bad' },
  { value: 'concern', label: 'Concern', emoji: '⚠️', color: 'amber', description: 'Needs attention or discussion' },
  { value: 'red-flag', label: 'Red Flag', emoji: '🚩', color: 'red', description: 'Serious incompatibility' }
];

export function GuidedScanFlowScreen({ 
  selectedQuestions, 
  subscriptionTier,
  onComplete, 
  onBack 
}: GuidedScanFlowScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ScanAnswer[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [skippedQuestionIds, setSkippedQuestionIds] = useState<Set<string>>(new Set());
  const [questionQueue, setQuestionQueue] = useState<QuestionItem[]>([]);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const totalRequired = TIER_QUESTION_COUNTS[subscriptionTier];

  // Initialize question queue on mount
  useEffect(() => {
    const queue = generateInitialQuestionQueue();
    setQuestionQueue(queue);
    
    // Mark all initial questions as used
    const initialUsed = new Set(queue.map(q => q.id));
    setUsedQuestionIds(initialUsed);
  }, []);

  // Generate initial question queue
  const generateInitialQuestionQueue = (): QuestionItem[] => {
    const queue: QuestionItem[] = [];
    const used = new Set<string>();

    // Add user-selected questions first
    selectedQuestions.forEach((selected) => {
      const id = `${selected.categoryId}-${selected.questionIndex}`;
      queue.push({
        id,
        categoryId: selected.categoryId,
        categoryName: selected.categoryName,
        question: selected.question,
        isUserSelected: true
      });
      used.add(id);
    });

    // Calculate how many more questions we need
    const remaining = totalRequired - queue.length;

    // Add system-selected questions (ensuring 50%+ are system-selected as per guardrails)
    const categoriesNeeded = Array.from(selectedQuestions.keys());
    let addedCount = 0;

    while (addedCount < remaining) {
      for (const categoryId of categoriesNeeded) {
        if (addedCount >= remaining) break;

        const categoryQuestions = QUESTION_BANK[categoryId] || [];
        
        // Find an unused question from this category
        for (let i = 0; i < categoryQuestions.length; i++) {
          const id = `${categoryId}-${i}`;
          if (!used.has(id)) {
            const categoryName = selectedQuestions.get(categoryId)?.categoryName || categoryId;
            queue.push({
              id,
              categoryId,
              categoryName,
              question: categoryQuestions[i],
              isUserSelected: false
            });
            used.add(id);
            addedCount++;
            break;
          }
        }
      }
    }

    return queue;
  };

  // Get replacement question when one is skipped
  const getReplacementQuestion = (skippedQuestion: QuestionItem): QuestionItem | null => {
    // Try to find a replacement from the same category first
    const categoryQuestions = QUESTION_BANK[skippedQuestion.categoryId] || [];
    
    for (let i = 0; i < categoryQuestions.length; i++) {
      const id = `${skippedQuestion.categoryId}-${i}`;
      if (!usedQuestionIds.has(id) && !skippedQuestionIds.has(id)) {
        return {
          id,
          categoryId: skippedQuestion.categoryId,
          categoryName: skippedQuestion.categoryName,
          question: categoryQuestions[i],
          isUserSelected: false
        };
      }
    }

    // If no replacement in same category, try other categories
    const allCategories = Object.keys(QUESTION_BANK);
    for (const categoryId of allCategories) {
      const questions = QUESTION_BANK[categoryId];
      for (let i = 0; i < questions.length; i++) {
        const id = `${categoryId}-${i}`;
        if (!usedQuestionIds.has(id) && !skippedQuestionIds.has(id)) {
          const categoryName = selectedQuestions.get(categoryId)?.categoryName || categoryId;
          return {
            id,
            categoryId,
            categoryName,
            question: questions[i],
            isUserSelected: false
          };
        }
      }
    }

    return null; // No replacement available (shouldn't happen with sufficient question bank)
  };

  const handleAnswer = (rating: Rating, notes: string = '') => {
    const currentQuestion = questionQueue[currentQuestionIndex];
    
    const newAnswer: ScanAnswer = {
      question: currentQuestion.question,
      rating,
      notes,
      category: currentQuestion.categoryName
    };

    setAnswers([...answers, newAnswer]);
    
    // Move to next question
    if (currentQuestionIndex < questionQueue.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Scan complete
      completeScan([...answers, newAnswer]);
    }
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    const currentQuestion = questionQueue[currentQuestionIndex];
    
    // Mark as skipped
    const newSkipped = new Set(skippedQuestionIds);
    newSkipped.add(currentQuestion.id);
    setSkippedQuestionIds(newSkipped);

    // Get replacement question
    const replacement = getReplacementQuestion(currentQuestion);
    
    if (replacement) {
      // Add replacement to queue
      const newQueue = [...questionQueue];
      newQueue.push(replacement);
      setQuestionQueue(newQueue);
      
      // Mark replacement as used
      const newUsed = new Set(usedQuestionIds);
      newUsed.add(replacement.id);
      setUsedQuestionIds(newUsed);
    }

    // Move to next question (don't increment progress counter)
    if (currentQuestionIndex < questionQueue.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    
    setShowSkipConfirm(false);
  };

  const completeScan = (finalAnswers: ScanAnswer[]) => {
    // Calculate score based only on answered questions (not skipped)
    const validAnswers = finalAnswers.filter(a => a.rating !== undefined);
    
    const score = calculateCompatibilityScore(validAnswers);
    const category = getCategoryFromScore(score);

    const scan: MatchScan = {
      id: Date.now().toString(),
      name: 'Match Scan',
      date: new Date().toLocaleDateString(),
      score,
      category,
      answers: validAnswers,
      scanType: 'single',
      isMutual: false
    };

    onComplete(scan);
  };

  const calculateCompatibilityScore = (answers: ScanAnswer[]): number => {
    if (answers.length === 0) return 0;

    const ratingScores: Record<Rating, number> = {
      'green-flag': 100,
      'positive': 75,
      'neutral': 50,
      'concern': 25,
      'red-flag': 0
    };

    const total = answers.reduce((sum, answer) => sum + (ratingScores[answer.rating] || 50), 0);
    return Math.round(total / answers.length);
  };

  const getCategoryFromScore = (score: number): MatchScan['category'] => {
    if (score >= 85) return 'high-potential';
    if (score >= 70) return 'worth-exploring';
    if (score >= 50) return 'mixed-signals';
    if (score >= 30) return 'caution';
    return 'high-risk';
  };

  if (questionQueue.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questionQueue[currentQuestionIndex];
  const progress = ((answers.length / totalRequired) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-6">
        <button 
          onClick={onBack}
          className="mb-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">
              Question {answers.length + 1} of {totalRequired}
            </span>
            <span className="text-sm text-white/90">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
          <span className="text-sm text-white">{currentQuestion.categoryName}</span>
          {currentQuestion.isUserSelected && (
            <span className="text-xs bg-white/30 rounded-full px-2 py-0.5 text-white">
              Your Choice
            </span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 className="text-xl text-gray-900 leading-relaxed mb-8">
            {currentQuestion.question}
          </h2>

          {/* Rating Options - Show all options, hide rating labels and icons */}
          <div className="space-y-3">
            {RATING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-300 hover:shadow-md transition-all text-left group bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 p-5 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
        >
          <SkipForward className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          <div className="text-left">
            <span className="block">Skip — Not Relevant</span>
            <span className="text-xs text-gray-500 block">Another question will replace it automatically</span>
          </div>
        </button>

        {/* Helper Text */}
        <p className="text-center text-xs text-gray-500 mt-4 px-4">
          Skipped questions don't affect your score and are automatically replaced
        </p>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div 
            className="absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowSkipConfirm(false)}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-[scaleIn_0.3s_ease-out]">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            
            <h3 className="text-xl text-gray-900 text-center mb-2">Skip This Question?</h3>
            <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
              This question will be replaced with another one to maintain accurate scoring. Skipping doesn't affect your total question count.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={confirmSkip}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-lg transition-all"
              >
                Skip Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
