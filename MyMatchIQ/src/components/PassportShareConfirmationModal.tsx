import { Shield, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PassportShareConfirmationModalProps {
  recipientName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
}

export function PassportShareConfirmationModal({
  recipientName,
  onConfirm,
  onCancel,
  isOpen,
  onClose,
  senderName,
}: PassportShareConfirmationModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-8 pb-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="relative text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl text-white">
              {t('passportShareConfirmation.title')}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('passportShareConfirmation.body')}
            </p>
            <p className="text-sm text-gray-600">
              {t('passportShareConfirmation.revokeNotice')}
            </p>
          </div>

          {/* Visual Feature List */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  {t('passportShareConfirmation.feature1')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  {t('passportShareConfirmation.feature2')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  {t('passportShareConfirmation.feature3')}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-700 leading-relaxed">
              <span className="font-medium">{t('passportShareConfirmation.privacyTitle')}</span> {t('passportShareConfirmation.privacyBody')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {t('passportShareConfirmation.confirmButton')}
            </button>
            <button
              onClick={handleCancel}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
            >
              {t('passportShareConfirmation.cancelButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}