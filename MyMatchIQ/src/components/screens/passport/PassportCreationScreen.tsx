import { motion } from 'motion/react';
import { PassportCard } from '../../passport/PassportCard';
import { QrCode, ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/button';

interface PassportCreationScreenProps {
  userName: string;
  onGenerateQR: () => void;
  onBack: () => void;
}

export function PassportCreationScreen({ userName, onGenerateQR, onBack }: PassportCreationScreenProps) {
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
            <h1 className="text-slate-900 mb-3">Your Compatibility Passport</h1>
            <p className="text-slate-600 leading-relaxed">
              Your Compatibility Passport summarizes how you think, connect, and align — before conversation begins.
            </p>
          </div>

          {/* Passport Card */}
          <PassportCard userName={userName} isActive={true} className="mb-8" />

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
            <h3 className="text-slate-800 mb-4">What is a Compatibility Passport?</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 flex-shrink-0" />
                <span>A secure way to share your compatibility profile</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 flex-shrink-0" />
                <span>Shows how you think and connect without revealing personal data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 flex-shrink-0" />
                <span>Scannable only within MatchIQ — not by external cameras</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 flex-shrink-0" />
                <span>Does not allow messaging or direct contact</span>
              </li>
            </ul>
          </div>

          {/* Generate QR Button */}
          <Button
            onClick={onGenerateQR}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Generate Secure QR Passport
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
