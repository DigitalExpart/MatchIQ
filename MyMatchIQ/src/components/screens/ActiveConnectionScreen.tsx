import { useState } from 'react';
import { ArrowLeft, Shield, Clock, CheckCircle, X, Pause, AlertCircle, MessageSquare, Camera, Sparkles, Brain, FileText, Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SubscriptionTier } from '../../App';

interface ActiveConnectionScreenProps {
  connectionId: string;
  partnerName: string;
  partnerTier: 'lite' | 'standard' | 'deep';
  connectedAt: string;
  expiresAt: string;
  onBack: () => void;
  onPauseConnection: () => void;
  onRevokeConnection: () => void;
  onStartMatchScan: () => void;
  onStartAICoach: () => void;
  onViewReflectionPrompts: () => void;
  subscriptionTier: SubscriptionTier;
}

export function ActiveConnectionScreen({
  connectionId,
  partnerName,
  partnerTier,
  connectedAt,
  expiresAt,
  onBack,
  onPauseConnection,
  onRevokeConnection,
  onStartMatchScan,
  onStartAICoach,
  onViewReflectionPrompts,
  subscriptionTier,
}: ActiveConnectionScreenProps) {
  const { t } = useLanguage();
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return t('activeConnection.expired');
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return t('activeConnection.expiresInDays').replace('{{days}}', days.toString());
    } else if (hours > 0) {
      return t('activeConnection.expiresInHours').replace('{{hours}}', hours.toString());
    } else {
      return t('activeConnection.expiresInMinutes').replace('{{minutes}}', minutes.toString());
    }
  };

  const getTierBadge = (tier: 'lite' | 'standard' | 'deep') => {
    const badges = {
      lite: {
        label: t('activeConnection.litePassport'),
        gradient: 'from-blue-500 to-cyan-500',
        icon: '🔷'
      },
      standard: {
        label: t('activeConnection.standardPassport'),
        gradient: 'from-purple-500 to-pink-500',
        icon: '💎'
      },
      deep: {
        label: t('activeConnection.deepPassport'),
        gradient: 'from-amber-500 to-orange-600',
        icon: '👑'
      }
    };
    return badges[tier];
  };

  const badge = getTierBadge(partnerTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 px-6 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <button
            onClick={onBack}
            className="mb-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">{t('activeConnection.title')}</h1>
            <p className="text-white/90 mb-4">{partnerName}</p>
            
            {/* Tier Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${badge.gradient} rounded-full`}>
              <span className="text-xl">{badge.icon}</span>
              <span className="text-sm text-white">{badge.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-10 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600">{t('activeConnection.statusActive')}</span>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 mb-1">
                {getTimeRemaining()}
              </p>
              <p className="text-xs text-gray-600">
                {t('activeConnection.expirationNotice')}
              </p>
            </div>
          </div>
        </div>

        {/* Unlocked Features */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            {t('activeConnection.unlockedFeatures')}
          </h2>

          <div className="space-y-3">
            {/* Question-based interactions */}
            <button
              onClick={onStartMatchScan}
              className="w-full flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{t('activeConnection.questionInteractions')}</h3>
                <p className="text-sm text-gray-600">{t('activeConnection.questionInteractionsDesc')}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-2" />
            </button>

            {/* Match Scan Access */}
            <button
              onClick={onStartMatchScan}
              className="w-full flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{t('activeConnection.matchScanAccess')}</h3>
                <p className="text-sm text-gray-600">{t('activeConnection.matchScanAccessDesc')}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-2" />
            </button>

            {/* AI Coach */}
            <button
              onClick={onStartAICoach}
              className="w-full flex items-start gap-3 p-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{t('activeConnection.aiCoach')}</h3>
                <p className="text-sm text-gray-600">
                  {subscriptionTier === 'free' 
                    ? t('activeConnection.aiCoachLocked')
                    : t('activeConnection.aiCoachDesc')
                  }
                </p>
              </div>
              {subscriptionTier !== 'free' ? (
                <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-2" />
              ) : (
                <div className="px-2 py-1 bg-gray-200 rounded text-xs text-gray-600 flex-shrink-0 mt-2">
                  {t('activeConnection.premierOnly')}
                </div>
              )}
            </button>

            {/* Reflection Prompts */}
            <button
              onClick={onViewReflectionPrompts}
              className="w-full flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{t('activeConnection.reflectionPrompts')}</h3>
                <p className="text-sm text-gray-600">{t('activeConnection.reflectionPromptsDesc')}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-2" />
            </button>
          </div>
        </div>

        {/* Restrictions */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-gray-500" />
            {t('activeConnection.restrictions')}
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
              <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-gray-700 mb-1">{t('activeConnection.noFreeText')}</h3>
                <p className="text-sm text-gray-600">{t('activeConnection.noFreeTextDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
              <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-gray-700 mb-1">{t('activeConnection.noMediaSharing')}</h3>
                <p className="text-sm text-gray-600">{t('activeConnection.noMediaSharingDesc')}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-medium">{t('activeConnection.platformNote')}</span> {t('activeConnection.platformNoteDesc')}
            </p>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl text-gray-900 mb-4">{t('activeConnection.connectionControls')}</h2>

          <div className="space-y-3">
            <button
              onClick={() => setShowPauseModal(true)}
              className="w-full py-4 bg-amber-100 text-amber-700 rounded-2xl hover:bg-amber-200 transition-all flex items-center justify-center gap-2"
            >
              <Pause className="w-5 h-5" />
              {t('activeConnection.pauseConnection')}
            </button>

            <button
              onClick={() => setShowRevokeModal(true)}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {t('activeConnection.revokeAccess')}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            {t('activeConnection.controlsNotice')}
          </p>
        </div>
      </div>

      {/* Pause Confirmation Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Pause className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">{t('activeConnection.pauseModalTitle')}</h2>
              <p className="text-gray-600">{t('activeConnection.pauseModalBody')}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onPauseConnection();
                  setShowPauseModal(false);
                }}
                className="w-full py-4 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition-all"
              >
                {t('activeConnection.confirmPause')}
              </button>
              <button
                onClick={() => setShowPauseModal(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">{t('activeConnection.revokeModalTitle')}</h2>
              <p className="text-gray-600">{t('activeConnection.revokeModalBody')}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onRevokeConnection();
                  setShowRevokeModal(false);
                }}
                className="w-full py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all"
              >
                {t('activeConnection.confirmRevoke')}
              </button>
              <button
                onClick={() => setShowRevokeModal(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
