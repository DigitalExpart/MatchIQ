import { Lock, Sparkles, Clock, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface AssessmentCommunityLockedScreenProps {
  onBack: () => void;
  onUpgrade: () => void;
  onStartPreview: () => void;
}

export function AssessmentCommunityLockedScreen({
  onBack,
  onUpgrade,
  onStartPreview
}: AssessmentCommunityLockedScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Lock className="w-12 h-12 text-purple-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-gray-900 mb-3">
          {t('assessmentCommunityLocked.title')}
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-8">
          {t('assessmentCommunityLocked.description')}
        </p>

        {/* Feature Highlights */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 mb-8">
          <div className="space-y-4">
            <FeatureItem
              icon="👥"
              title={t('assessmentCommunityLocked.feature1Title')}
              description={t('assessmentCommunityLocked.feature1Description')}
            />
            <FeatureItem
              icon="💬"
              title={t('assessmentCommunityLocked.feature2Title')}
              description={t('assessmentCommunityLocked.feature2Description')}
            />
            <FeatureItem
              icon="🎯"
              title={t('assessmentCommunityLocked.feature3Title')}
              description={t('assessmentCommunityLocked.feature3Description')}
            />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full py-4 mb-4 hover:shadow-lg transition-all active:scale-98"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t('assessmentCommunityLocked.upgradeCTA')}
          </span>
        </button>

        {/* Secondary CTA - Premier Preview */}
        <button
          onClick={onStartPreview}
          className="w-full bg-white/80 backdrop-blur-sm text-purple-700 rounded-full py-4 border-2 border-purple-200 hover:border-purple-300 hover:bg-white transition-all active:scale-98"
        >
          <span className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            {t('assessmentCommunityLocked.previewCTA')}
          </span>
        </button>

        {/* Info Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('assessmentCommunityLocked.infoText')}
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="flex gap-3">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-gray-900 mb-1">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}
