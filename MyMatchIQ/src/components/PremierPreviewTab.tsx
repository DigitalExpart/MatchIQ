import { Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface PremierPreviewTabProps {
  show: boolean;
  onActivate: () => void;
}

export function PremierPreviewTab({ show, onActivate }: PremierPreviewTabProps) {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  if (!show) return null;

  const handleActivate = () => {
    // Simulate payment
    alert('Premier Preview activated! (Demo - real payment would be processed)');
    onActivate();
    setShowModal(false);
  };

  return (
    <>
      {/* Premier Preview Access Tab */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-br from-gray-50/80 to-gray-100/60 backdrop-blur-sm border border-amber-200/40 rounded-2xl px-4 py-3 hover:shadow-md transition-all group animate-[fadeIn_0.3s_ease-out]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm text-gray-800">{t('premierPreview.tabLabel')}</div>
            <div className="text-xs text-gray-600">{t('premierPreview.subtext')}</div>
          </div>
        </div>
      </button>

      {/* Premier Preview Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-[slideUp_0.3s_ease-out]">
              {/* Header with Icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-700" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">{t('premierPreview.title')}</h2>
              </div>

              {/* Body */}
              <div className="space-y-4 mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {t('premierPreview.body')}
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleActivate}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-2xl hover:shadow-lg transition-all"
                >
                  {t('premierPreview.unlock')}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('premierPreview.notNow')}
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Access expires automatically. No subscription.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
