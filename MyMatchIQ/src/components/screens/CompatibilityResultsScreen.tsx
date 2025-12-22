// Compatibility Results Screen with calm, trust-forward design
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { CompatibilityResultsSummary } from '../compatibility/CompatibilityResultsSummary';
import { CompatibilityResult } from '../../utils/compatibilityEngine';

interface CompatibilityResultsScreenProps {
  result: CompatibilityResult;
  partnerName?: string;
  onBack: () => void;
  onSaveResults?: () => void;
  onShare?: () => void;
  isMutual?: boolean;
}

export function CompatibilityResultsScreen({
  result,
  partnerName = 'this match',
  onBack,
  onSaveResults,
  onShare,
  isMutual = false
}: CompatibilityResultsScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {onSaveResults && (
                <button
                  onClick={onSaveResults}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="Save results"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              )}
              {onShare && !isMutual && (
                <button
                  onClick={onShare}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              {isMutual ? 'Compatibility Assessment' : 'Your Assessment'}
            </h1>
            <p className="text-gray-600">
              {isMutual 
                ? `Results for you and ${partnerName}`
                : `Private assessment for ${partnerName}`
              }
            </p>
          </div>

          {/* Results Summary */}
          <CompatibilityResultsSummary
            result={result}
            partnerName={partnerName}
            onProceed={onBack}
            showActions={true}
          />
        </div>
      </div>
    </div>
  );
}
