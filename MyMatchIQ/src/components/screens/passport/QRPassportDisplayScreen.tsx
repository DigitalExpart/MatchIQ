import { motion } from 'motion/react';
import { HeartQRFrame } from '../../passport/HeartQRFrame';
import { Share2, RotateCw, XCircle, ArrowLeft, Shield, MessageCircle } from 'lucide-react';
import { Button } from '../../ui/button';

interface QRPassportDisplayScreenProps {
  qrValue: string;
  onShare: () => void;
  onRegenerate: () => void;
  onRevoke: () => void;
  onBack: () => void;
}

export function QRPassportDisplayScreen({
  qrValue,
  onShare,
  onRegenerate,
  onRevoke,
  onBack,
}: QRPassportDisplayScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-slate-900 mb-3">Your QR Compatibility Passport</h1>
            <p className="text-slate-600">Share this with someone to explore compatibility</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <HeartQRFrame value={qrValue} size={280} />
          </div>

          {/* Scannable notice */}
          <div className="text-center mb-8">
            <p className="text-sm text-slate-500">Scannable only with the MatchIQ app</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            {/* What this shares */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-slate-800 mb-2">What this QR shares</h4>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Your compatibility profile snapshot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Decision style and communication preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Relationship orientation and trust pacing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* What this does NOT allow */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-slate-800 mb-2">What it does NOT allow</h4>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>No messaging or chat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>No access to contact information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span>No direct communication of any kind</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onShare}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Passport
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onRegenerate}
                variant="outline"
                className="h-12 rounded-xl border-slate-300"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={onRevoke}
                variant="outline"
                className="h-12 rounded-xl border-red-300 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Revoke QR
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
