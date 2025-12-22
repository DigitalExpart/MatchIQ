import { useState } from 'react';
import { X, Clock, Shield, Check, Copy, QrCode, AlertCircle, Info, Star, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExpiringShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: SubscriptionTier;
  onGenerateLink: (duration: string) => Promise<string>;
  onRevokeLink?: (linkId: string) => void;
}

type Duration = '24h' | '72h' | '7d' | 'custom';

interface ExpirationOption {
  value: Duration;
  labelKey: string;
  descriptionKey: string;
  eliteOnly?: boolean;
}

const EXPIRATION_OPTIONS: ExpirationOption[] = [
  {
    value: '24h',
    labelKey: 'expiringLink.duration24h',
    descriptionKey: 'expiringLink.duration24hDesc',
  },
  {
    value: '72h',
    labelKey: 'expiringLink.duration72h',
    descriptionKey: 'expiringLink.duration72hDesc',
  },
  {
    value: '7d',
    labelKey: 'expiringLink.duration7d',
    descriptionKey: 'expiringLink.duration7dDesc',
  },
  {
    value: 'custom',
    labelKey: 'expiringLink.durationCustom',
    descriptionKey: 'expiringLink.durationCustomDesc',
    eliteOnly: true,
  },
];

export function ExpiringShareLinkModal({
  isOpen,
  onClose,
  tier,
  onGenerateLink,
  onRevokeLink,
}: ExpiringShareLinkModalProps) {
  const { t } = useLanguage();
  const [selectedDuration, setSelectedDuration] = useState<Duration>('72h');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isOpen) return null;

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Calculate expiration date
      const now = new Date();
      let expiresAt: Date;

      if (selectedDuration === 'custom' && customDate && customTime) {
        expiresAt = new Date(`${customDate}T${customTime}`);
      } else {
        const hours = selectedDuration === '24h' ? 24 : selectedDuration === '72h' ? 72 : 168;
        expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000);
      }

      const link = await onGenerateLink(selectedDuration);
      setGeneratedLink(link);
      setExpirationDate(expiresAt.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }));
    } catch (err) {
      setError(t('expiringLink.errorMessage'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareQR = () => {
    // QR code generation logic would go here
    alert('QR Code sharing would open here');
  };

  const handleReset = () => {
    setGeneratedLink(null);
    setExpirationDate(null);
    setError(null);
    setCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const isEliteTier = tier === 'exclusive';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"
              >
                <Clock className="w-5 h-5 text-purple-600" />
              </motion.div>
              <div>
                <h2 className="text-xl text-gray-900">{t('expiringLink.header')}</h2>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {!generatedLink && !error && (
            <>
              {/* Helper Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-gray-600 leading-relaxed"
              >
                {t('expiringLink.helperText')}
              </motion.p>

              {/* Expiration Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-gray-900">{t('expiringLink.selectDuration')}</label>
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="relative"
                  >
                    <Info className="w-4 h-4 text-gray-400" />
                    <AnimatePresence>
                      {showTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-xl shadow-lg z-20"
                        >
                          {t('expiringLink.tooltip')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {EXPIRATION_OPTIONS.map((option, index) => {
                  const isDisabled = option.eliteOnly && !isEliteTier;

                  return (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      onClick={() => !isDisabled && setSelectedDuration(option.value)}
                      disabled={isDisabled}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        selectedDuration === option.value && !isDisabled
                          ? 'border-purple-500 bg-purple-50'
                          : isDisabled
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <motion.span
                              animate={selectedDuration === option.value && !isDisabled ? { scale: 1.02 } : {}}
                              transition={{ duration: 0.15 }}
                              className="text-gray-900"
                            >
                              {t(option.labelKey)}
                            </motion.span>
                            {option.eliteOnly && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
                              >
                                <Star className="w-3 h-3" />
                                {t('expiringLink.eliteOnly')}
                              </motion.span>
                            )}
                          </div>
                          <AnimatePresence>
                            {(selectedDuration === option.value || !isDisabled) && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-gray-600"
                              >
                                {t(option.descriptionKey)}
                              </motion.p>
                            )}
                          </AnimatePresence>

                          {/* Custom Date/Time Inputs */}
                          {option.value === 'custom' && selectedDuration === 'custom' && isEliteTier && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-2 gap-3 mt-3"
                            >
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  {t('expiringLink.dateLabel')}
                                </label>
                                <input
                                  type="date"
                                  value={customDate}
                                  onChange={(e) => setCustomDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  {t('expiringLink.timeLabel')}
                                </label>
                                <input
                                  type="time"
                                  value={customTime}
                                  onChange={(e) => setCustomTime(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Radio Button Indicator */}
                        <motion.div
                          animate={selectedDuration === option.value && !isDisabled ? { scale: 1.05 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                            selectedDuration === option.value && !isDisabled
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}
                        >
                          <AnimatePresence>
                            {selectedDuration === option.value && !isDisabled && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Elite Tier Badge */}
              {!isEliteTier && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-900">{t('expiringLink.eliteBadge')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Assurance */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl"
              >
                <Shield className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">{t('expiringLink.privacyAssurance')}</p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 pt-2"
              >
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateLink}
                  disabled={
                    isGenerating ||
                    (selectedDuration === 'custom' && (!customDate || !customTime))
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      {t('expiringLink.generating')}
                    </>
                  ) : (
                    t('expiringLink.generateButton')
                  )}
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900 mb-1">{t('expiringLink.errorTitle')}</h3>
                    <p className="text-sm text-gray-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    handleGenerateLink();
                  }}
                  className="w-full py-3 bg-white text-red-700 rounded-2xl hover:bg-gray-50 transition-colors border border-red-200"
                >
                  {t('expiringLink.tryAgain')}
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                {t('expiringLink.goBack')}
              </button>
            </motion.div>
          )}

          {/* Success State */}
          {generatedLink && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="space-y-6"
            >
              {/* Confirmation Message */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start gap-3 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
                  >
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Check className="w-5 h-5 text-green-600" />
                    </motion.div>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900 mb-1">{t('expiringLink.linkReady')}</h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-gray-700"
                    >
                      {t('expiringLink.expiresOn')} <strong>{expirationDate}</strong>.
                    </motion.p>
                  </div>
                </div>

                {/* Generated Link Display */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-3 mb-3 border border-gray-200"
                >
                  <p className="text-sm text-gray-600 break-all font-mono">{generatedLink}</p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyLink}
                    className="py-3 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        {t('expiringLink.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('expiringLink.copyLink')}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShareQR}
                    className="py-3 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    {t('expiringLink.shareQR')}
                  </motion.button>
                </motion.div>
              </div>

              {/* Privacy Reminder */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl"
              >
                <Shield className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  The recipient can view your passport until {expirationDate}. You can revoke access at any time from your sharing settings.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                {t('expiringLink.done')}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Viewer-side Expiration Notice Component
export function ExpiredPassportNotice({ onClose }: { onClose?: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Clock className="w-8 h-8 text-gray-400" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-900 mb-3"
        >
          {t('expiringLink.expired')}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 leading-relaxed mb-6"
        >
          {t('expiringLink.expiredDesc')}
        </motion.p>

        {onClose && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all"
          >
            {t('common.close')}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

// Manual Revoke Confirmation Component
export function RevokeConfirmation({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
    >
      <div className="flex items-start gap-3 mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
        >
          <Shield className="w-5 h-5 text-amber-600" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg text-gray-900 mb-1">{t('expiringLink.revokedTitle')}</h3>
          <p className="text-sm text-gray-700">{t('expiringLink.revokedMessage')}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full py-3 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors border border-amber-200"
      >
        {t('expiringLink.done')}
      </motion.button>
    </motion.div>
  );
}
