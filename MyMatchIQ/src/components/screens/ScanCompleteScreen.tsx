import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface ScanCompleteScreenProps {
  onViewResults: () => void;
}

export function ScanCompleteScreen({ onViewResults }: ScanCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Success Animation Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-[scaleIn_0.5s_ease-out]">
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-[scaleIn_0.7s_ease-out]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl text-gray-900 mb-4">Scan Complete</h1>
        <p className="text-gray-600 leading-relaxed mb-8 px-4">
          Your results are based on completed questions only.<br />
          Skipped questions were replaced to ensure<br />
          accurate insights.
        </p>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900 mb-1">Scoring Integrity</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your compatibility score reflects only the questions you answered. 
                All scoring is balanced and comparable across all scans.
              </p>
            </div>
          </div>
        </div>

        {/* View Results Button */}
        <button
          onClick={onViewResults}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mb-4"
        >
          <span className="text-lg">View Compatibility Insights</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          Your scan has been saved to your history
        </p>
      </div>
    </div>
  );
}
