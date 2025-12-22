import { ArrowLeft, Share2, Edit, QrCode as QrCodeIcon } from 'lucide-react';
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { PassportTier, PassportTierBadge } from '../passport/PassportTierBadge';
import { PassportAnswers } from './PassportQuestionnaireScreen';

interface PassportCardScreenProps {
  tier: PassportTier;
  answers: PassportAnswers;
  userName?: string;
  onBack: () => void;
  onEdit: () => void;
  onShare: () => void;
}

export function PassportCardScreen({
  tier,
  answers,
  userName = 'Your',
  onBack,
  onEdit,
  onShare,
}: PassportCardScreenProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code
    const passportId = `passport-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const passportData = JSON.stringify({
      id: passportId,
      tier,
      timestamp: Date.now(),
    });

    QRCode.toDataURL(passportData, {
      width: 400,
      margin: 2,
      color: {
        dark: tier === 'lite' ? '#3B82F6' : tier === 'standard' ? '#9333EA' : '#EC4899',
        light: '#FFFFFF',
      },
    }).then(setQrCodeUrl);
  }, [tier]);

  const getTierColor = () => {
    if (tier === 'lite') return 'from-blue-400 to-blue-500';
    if (tier === 'standard') return 'from-purple-400 to-purple-500';
    return 'from-pink-400 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3C2B63] to-[#5A4180] text-white px-6 py-6">
        <button
          onClick={onBack}
          className="mb-4 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl mb-2">Compatibility Passport</h1>
          <p className="text-white/80">Your scannable relationship profile</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Passport Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-gray-100"
        >
          {/* Card Header */}
          <div className={`bg-gradient-to-br ${getTierColor()} p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <PassportTierBadge tier={tier} size="md" />
              <QrCodeIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl mb-1">{userName} Passport</h2>
            <p className="text-white/80 text-sm">Compatibility Intelligence Profile</p>
          </div>

          {/* QR Code */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Heart-shaped frame overlay */}
              <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="Passport QR Code"
                    className="w-full h-full rounded-2xl shadow-lg"
                  />
                )}
                {!qrCodeUrl && (
                  <div className="w-full h-full bg-gray-100 rounded-2xl animate-pulse" />
                )}
              </div>

              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-lg" />
            </motion.div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 mb-2">
                Scan to view compatibility insights
              </p>
              <p className="text-xs text-gray-500">
                Private, consent-based, insight only
              </p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Reflections</span>
              <span className="font-medium text-gray-900">
                {Object.keys(answers).length} answered
              </span>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-4"
        >
          <h3 className="font-medium text-purple-900 mb-2">How It Works</h3>
          <ul className="space-y-2 text-sm text-purple-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Share your QR code with potential matches within MyMatchIQ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>They'll receive AI-generated compatibility insights based on your tier</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>No messaging, no contact - pure compatibility intelligence</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          <button
            onClick={onShare}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Passport
          </button>

          <button
            onClick={onEdit}
            className="w-full px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Edit Responses
          </button>
        </motion.div>

        {/* Upgrade Prompt (if not Deep tier) */}
        {tier !== 'deep' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-4"
          >
            <h3 className="font-medium text-gray-900 mb-2">
              {tier === 'lite' ? 'Unlock Deeper Insights' : 'Unlock Maximum Depth'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {tier === 'lite'
                ? 'Upgrade to Standard (25Q) or Deep (45Q) for more comprehensive compatibility analysis'
                : 'Upgrade to Deep Passport (45Q) for the most reliable compatibility intelligence'}
            </p>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              Explore Premium →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
