// Calm, trust-forward compatibility results display
import { CheckCircle, AlertCircle, TrendingUp, ArrowRight, Info } from 'lucide-react';
import { CompatibilityResult, getBandColorScheme } from '../../utils/compatibilityEngine';
import { AwarenessAlert } from './AwarenessAlert';

interface CompatibilityResultsSummaryProps {
  result: CompatibilityResult;
  partnerName?: string;
  onProceed?: () => void;
  showActions?: boolean;
}

export function CompatibilityResultsSummary({ 
  result, 
  partnerName = 'this match',
  onProceed,
  showActions = true 
}: CompatibilityResultsSummaryProps) {
  const colorScheme = getBandColorScheme(result.band);

  return (
    <div className="space-y-6">
      {/* Overall Band */}
      <div className={`bg-gradient-to-br ${colorScheme.gradient} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl mb-2">{result.bandLabel}</h2>
          <p className="text-white/90 text-lg leading-relaxed max-w-md mx-auto">
            {result.bandDescription}
          </p>
        </div>
      </div>

      {/* Strengths Section */}
      {result.strengths.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg text-gray-900">Strong Alignment Areas</h3>
          </div>
          <div className="space-y-2">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-sm text-gray-800">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awareness Areas */}
      {result.awarenessAreas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg text-gray-900">Areas for Discussion</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These areas show differences that could benefit from open conversation:
          </p>
          <div className="space-y-2">
            {result.awarenessAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-sm text-gray-800">{area}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags / Signals to Consider */}
      {result.redFlags.length > 0 && (
        <AwarenessAlert flags={result.redFlags} variant="detailed" />
      )}

      {/* Recommended Action */}
      {showActions && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <ArrowRight className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-gray-900 mb-2">{result.actionLabel}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.actionGuidance}
              </p>
            </div>
          </div>

          {onProceed && (
            <button
              onClick={onProceed}
              className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          This assessment provides signals based on your responses. It does not predict outcomes, 
          diagnose conditions, or replace professional guidance. Trust your judgment and prioritize your safety.
        </p>
      </div>
    </div>
  );
}
