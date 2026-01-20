import { useState } from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

interface AICoachDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function AICoachDisclaimerModal({ isOpen, onAccept, onDecline }: AICoachDisclaimerModalProps) {
  const [hasRead, setHasRead] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-violet-500 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Important Disclaimer</h2>
          </div>
          <button
            onClick={onDecline}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium mb-2">
              ⚠️ AI Coach Limitations
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Amora's responses are generated using AI technology and are not 100% accurate. 
              The AI may make mistakes, misunderstand context, or provide responses that don't 
              fully match your situation.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Please understand:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>
                  <strong>Not a replacement for professional help:</strong> Amora is not a 
                  licensed therapist, counselor, or medical professional. For serious 
                  relationship issues, mental health concerns, or crisis situations, please 
                  seek professional help.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>
                  <strong>Responses may contain errors:</strong> The AI can misunderstand 
                  context, make assumptions, or provide incomplete information. Always use 
                  your own judgment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>
                  <strong>Not medical or legal advice:</strong> Amora does not provide 
                  medical, legal, or financial advice. Consult qualified professionals 
                  for such matters.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>
                  <strong>Privacy:</strong> Your conversations are stored securely, but 
                  please avoid sharing sensitive personal information that you wouldn't 
                  want stored.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-800">
              <strong>By continuing, you acknowledge that you understand these limitations 
              and agree to use Amora responsibly.</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-3xl border-t border-gray-200 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={hasRead}
              onChange={(e) => setHasRead(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              I have read and understand the disclaimer
            </span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={onDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              disabled={!hasRead}
              className={`px-6 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
                hasRead
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
