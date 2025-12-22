import { useState } from 'react';
import { ArrowLeft, Star, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SubscriptionTier } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { PassportShareConfirmationModal } from '../PassportShareConfirmationModal';

interface PassportRequestReviewScreenProps {
  onBack: () => void;
  subscriptionTier: SubscriptionTier;
  onAccept: () => void;
  onDecline: () => void;
}

interface PassportCategory {
  id: string;
  name: string;
  score: number; // 1-5 rating
  hasRedFlag?: boolean;
  highlight?: string;
}

interface PassportRequest {
  id: string;
  senderName: string;
  senderAge: number;
  senderLocation: string;
  senderPhoto: string;
  passportTier: 'lite' | 'standard' | 'deep';
  overallScore: number; // 0-100
  categories: PassportCategory[];
  redFlags: string[];
  highlights: string[];
  questionsAnswered: number;
  hoursRemaining: number;
}

// Mock passport request data
const MOCK_REQUEST: PassportRequest = {
  id: '1',
  senderName: 'Sarah',
  senderAge: 28,
  senderLocation: 'Austin, TX',
  senderPhoto: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  passportTier: 'standard',
  overallScore: 78,
  questionsAnswered: 25,
  hoursRemaining: 36,
  categories: [
    { id: 'emotional', name: 'Emotional Maturity', score: 4, highlight: 'Handles conflict with calm communication' },
    { id: 'communication', name: 'Communication Style', score: 5, highlight: 'Direct and honest communicator' },
    { id: 'values', name: 'Values & Lifestyle', score: 4 },
    { id: 'finance', name: 'Finance & Money', score: 3 },
    { id: 'relationship', name: 'Relationship Outlook', score: 5, highlight: 'Seeks long-term committed partnership' },
    { id: 'intimacy', name: 'Intimacy & Affection', score: 4 },
    { id: 'family', name: 'Family & Background', score: 3 },
    { id: 'ambition', name: 'Ambition & Goals', score: 4, highlight: 'Career-driven but values work-life balance' },
    { id: 'safety', name: 'Safety & Red Flags', score: 5 },
    { id: 'chemistry', name: 'Chemistry & Vibe', score: 4 },
  ],
  redFlags: [],
  highlights: [
    'Handles conflict with calm communication',
    'Direct and honest communicator',
    'Seeks long-term committed partnership',
    'Career-driven but values work-life balance',
  ],
};

export function PassportRequestReviewScreen({
  onBack,
  subscriptionTier,
  onAccept,
  onDecline,
}: PassportRequestReviewScreenProps) {
  const { t } = useLanguage();
  const [request] = useState<PassportRequest>(MOCK_REQUEST);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getTierBadge = (tier: 'lite' | 'standard' | 'deep') => {
    switch (tier) {
      case 'lite':
        return {
          label: t('passportRequest.litePassport'),
          color: 'from-gray-400 to-gray-500',
          questions: '15Q',
        };
      case 'standard':
        return {
          label: t('passportRequest.standardPassport'),
          color: 'from-rose-400 to-pink-500',
          questions: '25Q',
        };
      case 'deep':
        return {
          label: t('passportRequest.deepPassport'),
          color: 'from-purple-500 to-indigo-600',
          questions: '45Q',
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 4) return 'bg-green-100 border-green-200';
    if (score >= 3) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const tierBadge = getTierBadge(request.passportTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-8"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="text-center">
            <Shield className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl text-white mb-2">{t('passportRequest.title')}</h1>
            <p className="text-white/90">{t('passportRequest.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10 pb-6">
        {/* Sender Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Photo */}
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-100">
              <ImageWithFallback
                src={request.senderPhoto}
                alt={request.senderName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{t('passportRequest.from')}</p>
              <h2 className="text-2xl text-gray-900 mb-1">{request.senderName}, {request.senderAge}</h2>
              <p className="text-sm text-gray-600">{request.senderLocation}</p>
            </div>
          </div>

          {/* Tier Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className={`bg-gradient-to-r ${tierBadge.color} px-4 py-2 rounded-xl inline-flex items-center gap-2`}>
              <Star className="w-4 h-4 text-white" />
              <span className="text-white">{tierBadge.label}</span>
              <span className="text-white/90 text-sm">· {tierBadge.questions}</span>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{t('passportRequest.expiresIn').replace('{{hours}}', request.hoursRemaining.toString())}</span>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">{t('passportRequest.overallScore')}</p>
            <div className="flex items-center gap-3">
              <div className="text-4xl text-gray-900">{request.overallScore}<span className="text-xl text-gray-500">/100</span></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${request.overallScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="text-lg text-gray-900 mb-4">{t('passportRequest.categories')}</h3>
          <div className="space-y-3">
            {request.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{category.name}</p>
                  {category.highlight && (
                    <p className="text-xs text-gray-600 mt-1">{category.highlight}</p>
                  )}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${getScoreBgColor(category.score)}`}>
                  {[...Array(category.score)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${getScoreColor(category.score)} fill-current`} />
                  ))}
                  {category.hasRedFlag && (
                    <AlertTriangle className="w-3 h-3 text-red-600 ml-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            {t('passportRequest.questionsAnswered').replace('{{count}}', request.questionsAnswered.toString())}
          </p>
        </div>

        {/* Highlights */}
        {request.highlights.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg text-gray-900">{t('passportRequest.compatibilityHighlights')}</h3>
            </div>
            <div className="space-y-2">
              {request.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 flex-1">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Red Flags */}
        {request.redFlags.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg text-gray-900">{t('passportRequest.redFlags')}</h3>
            </div>
            <div className="space-y-2">
              {request.redFlags.map((flag, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 flex-1">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg text-gray-900">{t('passportRequest.redFlags')}</h3>
            </div>
            <p className="text-sm text-gray-600">{t('passportRequest.noRedFlags')}</p>
          </div>
        )}

        {/* Restriction Notice */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
          <p className="text-xs text-center text-gray-600 leading-relaxed">
            {t('passportRequest.restriction')}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-2xl">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {t('passportRequest.accept')}
          </button>
          <button
            onClick={onDecline}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
          >
            {t('passportRequest.decline')}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <PassportShareConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={onAccept}
          onCancel={() => setShowConfirmModal(false)}
          recipientName={request.senderName}
          senderName={request.senderName}
        />
      )}
    </div>
  );
}