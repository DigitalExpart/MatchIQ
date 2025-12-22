// Dual Scan Consent Gate - Explicit consent before revealing shared results
import { Shield, Check, AlertCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { RedFlag } from '../../utils/compatibilityEngine';

interface DualScanConsentGateProps {
  partnerName: string;
  hasHardRedFlags: boolean;
  hardRedFlags?: RedFlag[];
  onConsent: () => void;
  onDecline: () => void;
}

export function DualScanConsentGate({
  partnerName,
  hasHardRedFlags,
  hardRedFlags = [],
  onConsent,
  onDecline
}: DualScanConsentGateProps) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [acknowledgedFlags, setAcknowledgedFlags] = useState(false);

  const canProceed = consentGiven && (!hasHardRedFlags || acknowledgedFlags);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl text-center text-gray-900 mb-4">
            Ready to Share Results?
          </h2>

          {/* Description */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              You and {partnerName} are about to view mutual compatibility insights.
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">Shared strengths and alignment areas</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">Areas that may benefit from discussion</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">Compatibility band and recommended next steps</p>
              </div>
            </div>
          </div>

          {/* Hard Red Flags Warning (if present) */}
          {hasHardRedFlags && hardRedFlags.length > 0 && (
            <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm text-orange-900 mb-2">Important Considerations Detected</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    The assessment identified areas that may require careful attention before proceeding. 
                    Please review these signals thoughtfully.
                  </p>
                </div>
              </div>

              {/* List critical flags */}
              <div className="mt-3 space-y-2">
                {hardRedFlags.map((flag, index) => (
                  <div key={index} className="bg-white/50 rounded-xl p-3">
                    <p className="text-xs text-gray-800">{flag.signal}</p>
                  </div>
                ))}
              </div>

              {/* Acknowledgment checkbox */}
              <button
                onClick={() => setAcknowledgedFlags(!acknowledgedFlags)}
                className="flex items-center gap-3 mt-4 w-full p-3 bg-white/70 rounded-xl hover:bg-white transition-colors"
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  acknowledgedFlags 
                    ? 'bg-orange-600 border-orange-600' 
                    : 'border-gray-300'
                }`}>
                  {acknowledgedFlags && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-gray-800">
                  I acknowledge these areas and choose to proceed
                </span>
              </button>
            </div>
          )}

          {/* Privacy Reassurance */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700 leading-relaxed">
                You maintain full control. Results are shared only with explicit consent and remain private 
                between you and {partnerName}. No data is stored or shared externally.
              </p>
            </div>
          </div>

          {/* Consent Checkbox */}
          <button
            onClick={() => setConsentGiven(!consentGiven)}
            className="flex items-start gap-3 w-full p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors mb-6 border-2 border-transparent hover:border-purple-200"
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              consentGiven 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-600' 
                : 'border-gray-300'
            }`}>
              {consentGiven && <Check className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm text-gray-900 mb-1">I consent to viewing shared results</p>
              <p className="text-xs text-gray-600">
                I understand what will be shared and choose to proceed
              </p>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConsent}
              disabled={!canProceed}
              className={`w-full py-4 rounded-2xl transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              View Results Together
            </button>

            <button
              onClick={onDecline}
              className="w-full py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Not right now
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-gray-600 text-center mt-6 leading-relaxed">
          Taking time to reflect is always okay. Consent can be given at any time.
        </p>
      </div>
    </div>
  );
}
