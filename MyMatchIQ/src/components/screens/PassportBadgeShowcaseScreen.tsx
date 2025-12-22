import { ArrowLeft } from 'lucide-react';
import { PassportBadgeSystemShowcase } from '../passport/PassportBadgeShowcase';

interface PassportBadgeShowcaseScreenProps {
  onBack: () => void;
}

export function PassportBadgeShowcaseScreen({ onBack }: PassportBadgeShowcaseScreenProps) {
  return (
    <div className="relative">
      {/* Floating back button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <span className="text-gray-900">Back to Dashboard</span>
        </button>
      </div>

      {/* Showcase content */}
      <PassportBadgeSystemShowcase />
    </div>
  );
}
