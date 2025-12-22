import { ArrowLeft, XCircle, Clock, ShieldOff, Info, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConnectionClosedScreenProps {
  partnerName: string;
  closedReason: 'expired' | 'revoked-by-you' | 'revoked-by-partner' | 'mutual-agreement';
  closedAt: string;
  onBack: () => void;
  onRequestNewConnection?: () => void;
}

export function ConnectionClosedScreen({
  partnerName,
  closedReason,
  closedAt,
  onBack,
  onRequestNewConnection,
}: ConnectionClosedScreenProps) {
  const { t } = useLanguage();

  const getReasonDisplay = () => {
    switch (closedReason) {
      case 'expired':
        return {
          icon: Clock,
          title: t('connectionClosed.expiredTitle'),
          description: t('connectionClosed.expiredDesc'),
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          iconBg: 'bg-gray-100',
        };
      case 'revoked-by-you':
        return {
          icon: ShieldOff,
          title: t('connectionClosed.revokedByYouTitle'),
          description: t('connectionClosed.revokedByYouDesc'),
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          iconBg: 'bg-gray-100',
        };
      case 'revoked-by-partner':
        return {
          icon: ShieldOff,
          title: t('connectionClosed.revokedByPartnerTitle'),
          description: t('connectionClosed.revokedByPartnerDesc'),
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          iconBg: 'bg-gray-100',
        };
      case 'mutual-agreement':
        return {
          icon: ShieldOff,
          title: t('connectionClosed.mutualTitle'),
          description: t('connectionClosed.mutualDesc'),
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          iconBg: 'bg-gray-100',
        };
    }
  };

  const reasonDisplay = getReasonDisplay();
  const Icon = reasonDisplay.icon;

  const formatClosedDate = () => {
    const date = new Date(closedAt);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 px-6 pt-12 pb-24 relative overflow-hidden">
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
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">{t('connectionClosed.title')}</h1>
            <p className="text-white/80 mb-1">{partnerName}</p>
            <p className="text-sm text-white/60">{t('connectionClosed.closedOn')} {formatClosedDate()}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 relative z-10 space-y-4">
        {/* Reason Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className={`w-16 h-16 ${reasonDisplay.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-8 h-8 ${reasonDisplay.color}`} />
          </div>
          
          <h2 className="text-xl text-gray-900 text-center mb-3">
            {reasonDisplay.title}
          </h2>
          
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {reasonDisplay.description}
          </p>

          <div className={`p-4 ${reasonDisplay.bgColor} rounded-xl`}>
            <p className="text-sm text-gray-700 text-center">
              {t('connectionClosed.mainMessage')}
            </p>
          </div>
        </div>

        {/* What This Means */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-gray-500" />
            {t('connectionClosed.whatThisMeans')}
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{t('connectionClosed.noPassportAccess')}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{t('connectionClosed.noFeatureAccess')}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{t('connectionClosed.dataRemoved')}</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">{t('connectionClosed.cleanState')}</p>
            </div>
          </div>
        </div>

        {/* Reconnection Option */}
        {onRequestNewConnection && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-purple-500" />
              {t('connectionClosed.reconnectTitle')}
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {t('connectionClosed.reconnectMessage')}
            </p>

            <button
              onClick={onRequestNewConnection}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              {t('connectionClosed.sendNewRequest')}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              {t('connectionClosed.requiresMutualConsent')}
            </p>
          </div>
        )}

        {/* Privacy Reminder */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <ShieldOff className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-800 mb-1">
                <span className="font-medium">{t('connectionClosed.privacyTitle')}</span>
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t('connectionClosed.privacyMessage')}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Connections */}
        <button
          onClick={onBack}
          className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
        >
          {t('connectionClosed.backToConnections')}
        </button>
      </div>
    </div>
  );
}
