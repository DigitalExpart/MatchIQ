import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { SelectedQuestion } from './ScanSetupScreen';

interface ScanConfirmationScreenProps {
  selectedQuestions: Map<string, SelectedQuestion>;
  totalQuestions: number;
  onStartScan: () => void;
}

export function ScanConfirmationScreen({ 
  selectedQuestions, 
  totalQuestions,
  onStartScan 
}: ScanConfirmationScreenProps) {
  const selectedCount = selectedQuestions.size;
  const systemSelectedCount = totalQuestions - selectedCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Success Animation Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-[scaleIn_0.5s_ease-out]">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-[scaleIn_0.7s_ease-out]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-gray-900 mb-3">Scan Ready</h1>
          <p className="text-gray-600 leading-relaxed">
            You chose the questions that matter most.<br />
            MyMatchIQ added additional questions to ensure<br />
            clarity, balance, and scoring accuracy.
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Your Selections */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👤</span>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Your Selections</h3>
                <p className="text-sm text-gray-600">{selectedCount} essential questions you chose</p>
              </div>
              <div className="text-2xl text-rose-600">{selectedCount}</div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* System Selections */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">MyMatchIQ Added</h3>
                <p className="text-sm text-gray-600">For balanced, accurate insights</p>
              </div>
              <div className="text-2xl text-purple-600">{systemSelectedCount}</div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Total */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Total Questions</h3>
                <p className="text-sm text-gray-600">Comprehensive evaluation</p>
              </div>
              <div className="text-2xl bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                {totalQuestions}
              </div>
            </div>
          </div>
        </div>

        {/* Your Chosen Questions Preview */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-5 mb-8">
          <h3 className="text-gray-900 mb-3 text-sm">Your Essential Questions:</h3>
          <div className="space-y-2">
            {Array.from(selectedQuestions.values()).map((selected, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-purple-600 mb-0.5">{selected.categoryName}</p>
                    <p className="text-sm text-gray-900 leading-relaxed">{selected.question}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Scan Button */}
        <button
          onClick={onStartScan}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          <span className="text-lg">Start Scan</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Helper Text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          You can skip questions during the scan if they don't apply
        </p>
      </div>
    </div>
  );
}
