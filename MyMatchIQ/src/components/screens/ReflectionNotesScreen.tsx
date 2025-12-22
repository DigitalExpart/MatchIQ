import { useState } from 'react';
import { ArrowLeft, Heart, Frown, Smile, Eye, FileText, ArrowRight } from 'lucide-react';

interface ReflectionNotesScreenProps {
  personName: string;
  onComplete: (notes: ReflectionNotes) => void;
  onBack: () => void;
  existingNotes?: ReflectionNotes;
}

export interface ReflectionNotes {
  goodMoments?: string;
  worstMoments?: string;
  sadMoments?: string;
  vulnerableMoments?: string;
  additionalNotes?: string;
}

export function ReflectionNotesScreen({ personName, onComplete, onBack, existingNotes }: ReflectionNotesScreenProps) {
  const [goodMoments, setGoodMoments] = useState(existingNotes?.goodMoments || '');
  const [worstMoments, setWorstMoments] = useState(existingNotes?.worstMoments || '');
  const [sadMoments, setSadMoments] = useState(existingNotes?.sadMoments || '');
  const [vulnerableMoments, setVulnerableMoments] = useState(existingNotes?.vulnerableMoments || '');
  const [additionalNotes, setAdditionalNotes] = useState(existingNotes?.additionalNotes || '');

  const handleSubmit = () => {
    const notes: ReflectionNotes = {
      goodMoments: goodMoments.trim() || undefined,
      worstMoments: worstMoments.trim() || undefined,
      sadMoments: sadMoments.trim() || undefined,
      vulnerableMoments: vulnerableMoments.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    };
    onComplete(notes);
  };

  const hasAnyContent = goodMoments.trim() || worstMoments.trim() || sadMoments.trim() || vulnerableMoments.trim() || additionalNotes.trim();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
              <h2 className="text-lg text-gray-900">{personName}</h2>
              <p className="text-sm text-gray-500">Share your reflections</p>
            </div>
            <div className="w-6 h-6" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40">
        <div className="w-full max-w-md mx-auto">
          {/* Intro Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">💭</div>
              <h3 className="text-xl text-gray-900 mb-2">Share Your Thoughts</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Take a moment to reflect on your interactions with {personName}. Your honest reflections will help provide a more complete picture.
              </p>
            </div>
          </div>

          {/* Good Moments */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Smile className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-gray-900 font-medium">Good Moments</h4>
            </div>
            <textarea
              value={goodMoments}
              onChange={(e) => setGoodMoments(e.target.value)}
              placeholder="Describe the positive moments, things that made you smile, or experiences that felt good..."
              className="w-full min-h-[100px] p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none resize-none text-sm text-gray-700"
            />
          </div>

          {/* Worst Moments */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Frown className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-gray-900 font-medium">Worst Moments</h4>
            </div>
            <textarea
              value={worstMoments}
              onChange={(e) => setWorstMoments(e.target.value)}
              placeholder="Describe difficult moments, conflicts, or situations that were challenging..."
              className="w-full min-h-[100px] p-4 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:outline-none resize-none text-sm text-gray-700"
            />
          </div>

          {/* Sad Moments */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-gray-900 font-medium">Sad Moments</h4>
            </div>
            <textarea
              value={sadMoments}
              onChange={(e) => setSadMoments(e.target.value)}
              placeholder="Share moments that made you feel sad, disappointed, or hurt..."
              className="w-full min-h-[100px] p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none text-sm text-gray-700"
            />
          </div>

          {/* Vulnerable Moments */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-gray-900 font-medium">Vulnerable Moments</h4>
            </div>
            <textarea
              value={vulnerableMoments}
              onChange={(e) => setVulnerableMoments(e.target.value)}
              placeholder="Describe moments of vulnerability, deep conversations, or times when walls came down..."
              className="w-full min-h-[100px] p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none text-sm text-gray-700"
            />
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="text-gray-900 font-medium">Additional Notes</h4>
            </div>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Anything else you'd like to add? Observations, patterns you noticed, or anything that stands out..."
              className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none resize-none text-sm text-gray-700"
            />
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <p className="text-xs text-blue-800 leading-relaxed">
              💡 <strong>Tip:</strong> All fields are optional. Share as much or as little as feels comfortable. Your reflections are private and will only be used to provide you with better insights.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pb-6 pt-8 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40">
        <div className="w-full max-w-md mx-auto space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 font-medium"
          >
            <span>Continue to Results</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          {!hasAnyContent && (
            <p className="text-center text-xs text-gray-500">
              You can skip this step, but your reflections will help provide better insights
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

